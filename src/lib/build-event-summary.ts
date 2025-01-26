import moment from 'moment';
import { Message } from 'protobufjs';
import { build_event_stream } from '$lib/generated/build_event_stream_proto';

export class BuildEventSummaryProps {
  started?: build_event_stream.BuildStarted;

  success: boolean;
  start: Date;
  finish: Date;
  user: string;
  cpu: string;
  hostname: string;
  command: string;
  numTargets: number;
  numPackages: number;
  numFetches: number;
  remoteExecution: boolean;
  caching: boolean;

  constructor(
    success: boolean,
    start: Date,
    finish: Date,
    user: string,
    cpu: string,
    hostname: string,
    command: string,
    numTargets: number,
    numPackages: number,
    numFetches: number,
    remoteExecution: boolean,
    caching: boolean
  ) {
    this.success = success;
    this.start = start;
    this.finish = finish;
    this.user = user;
    this.cpu = cpu;
    this.hostname = hostname;
    this.command = command;
    this.numTargets = numTargets;
    this.numPackages = numPackages;
    this.numFetches = numFetches;
    this.remoteExecution = remoteExecution;
    this.caching = caching;
  }

  /**
   * Returns the duration in seconds.
   */
  get duration(): number {
    const diffMs = moment(this.finish).diff(moment(this.start));
    return moment.duration(diffMs).asSeconds();
  }

  static fromEvents(events: Message<object>[]): BuildEventSummaryProps {
    // Extract the relevant events.
    for (const event of events) {
    }

    return new BuildEventSummaryProps(
      true,
      new Date(),
      new Date(),
      'user',
      'cpu',
      'hostname',
      'command',
      0,
      0,
      0,
      false,
      false
    );
  }
}
