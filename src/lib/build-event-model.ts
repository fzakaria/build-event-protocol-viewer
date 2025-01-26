import moment from 'moment';
import { build_event_stream, command_line } from '$lib/generated/build_event_stream_proto';

/**
 * This is a very large model for the build event stream.
 * It will quickly give access to the relevant protobuf events from the stream.
 * A good source of inspiration for this model is from BuildBuddy.
 * https://github.com/buildbuddy-io/buildbuddy/blob/4b33e094783642ac9a2b3b1183822829069d03db/app/invocation/invocation_model.tsx
 */
export class BuildEventModel {
  started?: build_event_stream.BuildStarted;
  finished?: build_event_stream.BuildFinished;

  // We hold onto the original proto, but the access
  // should be done thrugh workspaceStatusMap
  workspaceStatus?: build_event_stream.WorkspaceStatus;
  workspaceStatusMap: Map<string, string> = new Map();

  configuration?: build_event_stream.Configuration;

  structuredCommandLines: command_line.CommandLine[] = [];
  unstructuredCommandLine?: build_event_stream.UnstructuredCommandLine;

  fetches: build_event_stream.Fetch[] = [];

  targetsConfigured: build_event_stream.TargetConfigured[] = [];
  buildMetrics?: build_event_stream.BuildMetrics;

  private constructor() {}

  hasRemoteExecution(): boolean {
    return (
      this.unstructuredCommandLine?.args.some((str) => {
        str.includes('remote_executor');
      }) || false
    );
  }

  hasCaching(): boolean {
    return (
      this.unstructuredCommandLine?.args.some((str) => {
        str.includes('remote_cache');
      }) || false
    );
  }

  get cpu(): string {
    return this.configuration?.cpu || 'Unknown Cpu';
  }

  get user(): string {
    return (
      this.workspaceStatusMap.get('USER') ||
      this.workspaceStatusMap.get('BUILD_USER') ||
      'Unknown User'
    );
  }

  /**
   * The build was successful if the exitCode in the event has a 0.
   */
  isSuccess(): boolean {
    return this.exitCode == 0;
  }

  get exitCode(): number {
    return this.finished?.exitCode?.code || 1;
  }

  get buildStatus(): string {
    return this.finished?.exitCode?.name || 'Unknown Status';
  }

  get startTime(): Date {
    // TODO: If we need to consider needing to use startTimeMillis
    // although it's marked as deprecated in the proto
    const seconds = this.started?.startTime?.seconds || 0;
    return new Date(Number(seconds) * 1e3);
  }

  get endTime(): Date {
    // TODO: If we need to consider needing to use startTimeMillis
    // although it's marked as deprecated in the proto
    const seconds = this.finished?.finishTime?.seconds || 0;
    return new Date(Number(seconds) * 1e3);
  }

  get command(): string {
    return this.started?.command || 'Unknown Command';
  }

  get buildHost(): string {
    return this.workspaceStatusMap.get('BUILD_HOST') || 'Unknown Host';
  }

  /**
   * Returns the duration in seconds.
   */
  get duration(): number {
    const diffMs = moment(this.endTime).diff(moment(this.startTime));
    return moment.duration(diffMs).asSeconds();
  }

  static fromEvents(events: build_event_stream.BuildEvent[]): BuildEventModel {
    const model = new BuildEventModel();

    // Extract the relevant events.
    for (const event of events) {
      if (event.started) {
        model.started = event.started as build_event_stream.BuildStarted;
      }
      if (event.finished) {
        model.finished = event.finished as build_event_stream.BuildFinished;
      }
      if (event.workspaceStatus) {
        model.workspaceStatus = event.workspaceStatus as build_event_stream.WorkspaceStatus;
      }
      if (event.configuration) {
        model.configuration = event.configuration as build_event_stream.Configuration;
      }
      if (event.unstructuredCommandLine) {
        model.unstructuredCommandLine =
          event.unstructuredCommandLine as build_event_stream.UnstructuredCommandLine;
      }
      if (event.structuredCommandLine) {
        model.structuredCommandLines.push(event.structuredCommandLine as command_line.CommandLine);
      }

      for (const item of model.workspaceStatus?.item || []) {
        if (item.key == null) {
          continue;
        }
        const value = item?.value || '';
        model.workspaceStatusMap.set(item.key, value);
      }

      if (event.fetch) {
        model.fetches.push(event.fetch as build_event_stream.Fetch);
      }

      if (event.configured) {
        model.targetsConfigured.push(event.configured as build_event_stream.TargetConfigured);
      }
    }

    return model;
  }
}
