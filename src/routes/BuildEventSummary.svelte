<script lang="ts">
  import { BuildEventModel } from '$lib/build-event-model';
  import { humanizeDuration } from '$lib/date-helpers';

  function constructDetails(summary: BuildEventModel) {
    return [
      {
        icon: summary.isSuccess() ? 'bi-check-circle-fill' : 'bi-x-circle-fill',
        text: summary.isSuccess() ? 'Passed' : 'Failed',
        className: summary.isSuccess() ? 'text-success' : 'text-danger'
      },
      {
        icon: 'bi-clock',
        text: humanizeDuration(summary.duration),
        tooltip: 'Duration'
      },
      { icon: 'bi-person-fill', text: summary.user, tooltip: 'User' },
      { icon: 'bi-server', text: summary.buildHost, tooltip: 'Hostname' },
      { icon: 'bi-grid', text: summary.command, tooltip: 'Command' },
      { icon: 'bi-cpu-fill', text: summary.cpu, tooltip: 'CPU' },
      {
        icon: 'bi-sliders',
        // Don't use buildMetrics as it's deprecated for targets
        text: `${summary.targetsConfigured.size} targets`,
        tooltip: 'Number of configured targets'
      },
      {
        icon: 'bi-box',
        text: `${summary.buildMetrics?.packageMetrics?.packagesLoaded || 0} packages`,
        tooltip: 'Number of packages'
      },
      {
        icon: 'bi-bar-chart-steps',
        text: `${summary.buildMetrics?.actionSummary?.actionsExecuted || 0} actions`,
        tooltip: 'Number of actions'
      },
      {
        icon: summary.hasRemoteExecution() ? 'bi-cloud-fill' : 'bi-cloud-slash-fill',
        text: `Remote execution ${summary.hasRemoteExecution() ? 'on' : 'off'}`
      },
      {
        icon: summary.hasCaching() ? 'bi-cloud-fill' : 'bi-cloud-slash-fill',
        text: summary.hasCaching() ? 'Caching on' : 'Caching off'
      }
    ];
  }

  let { model }: { model: BuildEventModel } = $props();
  let details = $derived(constructDetails(model));
</script>

<div class="card">
  <div class="card-body">
    <div class="container">
      <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-1">
        <!-- eslint-disable-next-line svelte/require-each-key -->
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
