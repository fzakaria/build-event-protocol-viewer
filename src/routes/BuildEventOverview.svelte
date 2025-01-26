<script lang="ts">
  import moment from 'moment';
  import { BuildEventModel } from '$lib/build-event-model';
  let { model }: { model: BuildEventModel } = $props();
</script>

<div class="card border-0">
  <div class="card-body">
    <dl class="row mb-0">
      <!-- Status -->
      <dt class="col-sm-4">Status</dt>
      <dd class="col-sm-8">
        <span class="badge {model.isSuccess() ? 'bg-success' : 'bg-danger'}">
          {model.buildStatus}
        </span>
      </dd>

      <!-- Command -->
      <dt class="col-sm-4">Command</dt>
      <dd class="col-sm-8"><code>{model.command}</code></dd>

      <!-- Start Time -->
      <dt class="col-sm-4">Start Time</dt>
      <dd class="col-sm-8">{model.startTime.toLocaleString()}</dd>

      <!-- End Time -->
      <dt class="col-sm-4">End Time</dt>
      <dd class="col-sm-8">{model.endTime.toLocaleString()}</dd>

      <!-- Duration -->
      <dt class="col-sm-4">Duration</dt>
      <dd class="col-sm-8">{moment.duration(model.duration, 'seconds').humanize()}</dd>

      <!-- User -->
      <dt class="col-sm-4">User</dt>
      <dd class="col-sm-8">{model.user}</dd>

      <!-- Host -->
      <dt class="col-sm-4">Host</dt>
      <dd class="col-sm-8">{model.buildHost}</dd>

      <!-- CPU -->
      <dt class="col-sm-4">CPU</dt>
      <dd class="col-sm-8">{model.cpu}</dd>

      <!-- Remote Execution -->
      <dt class="col-sm-4">Remote Execution</dt>
      <dd class="col-sm-8">
        <span class="badge {model.hasRemoteExecution() ? 'bg-info' : 'bg-secondary'}">
          {model.hasRemoteExecution() ? 'Enabled' : 'Disabled'}
        </span>
      </dd>

      <!-- Caching -->
      <dt class="col-sm-4">Caching</dt>
      <dd class="col-sm-8">
        <span class="badge {model.hasCaching() ? 'bg-info' : 'bg-secondary'}">
          {model.hasCaching() ? 'Enabled' : 'Disabled'}
        </span>
      </dd>

      <!-- Command Line -->
      <dt class="col-sm-4">Command Line</dt>
      <dd class="col-sm-8">
        <details>
          <summary class="font-monospace"
            >{model.unstructuredCommandLine?.args[0] || 'Unknown'}</summary
          >
          <pre>
{model.unstructuredCommandLine?.args.slice(1).join('\n') || 'Unknown'}
        </pre>
        </details>
      </dd>
    </dl>
  </div>
</div>
