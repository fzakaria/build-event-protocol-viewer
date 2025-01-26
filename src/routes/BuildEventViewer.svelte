<script lang="ts">
  import BuildEventSummary from './BuildEventSummary.svelte';
  import { build_event_stream } from '$lib/generated/build_event_stream_proto';
  import LogViewer from './LogViewer.svelte';
  import { BuildEventModel } from '$lib/build-event-model';

  let { events = [] }: { events: build_event_stream.BuildEvent[] } = $props();
  let model = $derived(BuildEventModel.fromEvents(events));

  // State for the active tab
  let activeTab: 'Overview' | 'Logs' | 'Raw' = $state('Overview');

  function setTab(tab: 'Overview' | 'Logs' | 'Raw') {
    activeTab = tab;
  }
</script>

<BuildEventSummary {model} />

<ul class="nav nav-tabs pt-3">
  <li class="nav-item">
    <a
      href="#overview"
      class="nav-link {activeTab === 'Overview' ? 'active' : ''}"
      onclick={() => setTab('Overview')}>Overview</a
    >
  </li>
  <li class="nav-item">
    <a
      href="#logs"
      class="nav-link {activeTab === 'Logs' ? 'active' : ''}"
      onclick={() => setTab('Logs')}>Logs</a
    >
  </li>
  <li class="nav-item">
    <a
      href="#raw"
      class="nav-link {activeTab === 'Raw' ? 'active' : ''}"
      onclick={() => setTab('Raw')}>Raw</a
    >
  </li>
</ul>

<div class="tab-content">
  {#if activeTab === 'Overview'}
    <div class="tab-pane show active">
      <div class="container pt-3">
        <div class="row">
          <div class="col"></div>
        </div>
        <div class="row">
          <div class="col">
            <p>It is currently empty.</p>
          </div>
        </div>
      </div>
    </div>
  {:else if activeTab === 'Logs'}
    <div class="container pt-2">
      <LogViewer logs={model.getLogs()} />
    </div>
  {:else if activeTab === 'Raw'}
    <!-- FIXME: This might not be the best performance; we should consider hidden css as this reloads it. -->
    <div class="tab-pane show active">
      <andypf-json-viewer expanded="2" data={events} show-toolbar="true"> </andypf-json-viewer>
    </div>
  {/if}
</div>
