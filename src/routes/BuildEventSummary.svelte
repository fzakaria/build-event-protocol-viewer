<script lang="ts">
  import { Message } from 'protobufjs';
  import { BuildEventSummaryProps } from '$lib/build-event-summary';
  import { humanizeDuration } from '$lib/date-helpers';
  
  function constructDetails(summary: BuildEventSummaryProps) {
    return [
      {
        icon: summary.success ? 'bi-check-circle-fill' : 'bi-x-circle-fill',
        text: summary.success ? 'Passed' : 'Failed',
        className: summary.success ? 'text-success' : 'text-danger'
      },
      {
        icon: 'bi-clock',
        text: humanizeDuration(summary.duration),
        tooltip: 'Duration'
      },
      { icon: 'bi-person-fill', text: summary.user, tooltip: 'User' },
      { icon: 'bi-server', text: summary.hostname, tooltip: 'Hostname' },
      { icon: 'bi-grid', text: summary.command, tooltip: 'Command' },
      { icon: 'bi-cpu-fill', text: summary.cpu, tooltip: 'CPU' },
      {
        icon: 'bi-sliders',
        text: `${summary.numTargets} targets`,
        tooltip: 'Number of configured targets'
      },
      {
        icon: 'bi-box',
        text: `${summary.numPackages} packages`,
        tooltip: 'Number of packages'
      },
      {
        icon: 'bi-arrow-down-circle',
        text: `${summary.numFetches} fetches`,
        tooltip: 'Number of fetches',
        isActive: summary.numFetches > 0
      },
      {
        icon: summary.remoteExecution ? 'bi-cloud-fill' : 'bi-cloud-slash-fill',
        text: `Remote execution ${summary.remoteExecution ? 'on' : 'off'}`
      },
      {
        icon: summary.caching ? 'bi-cloud-fill' : 'bi-cloud-slash-fill',
        text: summary.caching ? 'Caching on' : 'Caching off',
        isActive: summary.caching
      }
    ];
  }

  function getBuildEventSummary(events: Message<object>[]): BuildEventSummaryProps {
    const now = Date.now();

    return new BuildEventSummaryProps(
      true,
      new Date(now - 13 * 6000),
      new Date(),
      'fmzakari',
      'k8s',
      'nyx',
      'build //...',
      3,
      33,
      5,
      true,
      false
    );
  }

  let { events = [] }: { events: Message<object>[] } = $props();

  let summary = $derived(getBuildEventSummary(events));
  let details = $derived(summary ? constructDetails(summary) : []);
</script>

<div class="card">
  <div class="card-body">
    <div class="container">
      <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-1">
        {#each details as detail}
          <div class="col">
            <div class="d-flex align-items-center">
              <i class={`bi ${detail.icon} me-2 ${detail.className || ''}`}></i>
              <span title={detail.tooltip || ''}>{detail.text}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
