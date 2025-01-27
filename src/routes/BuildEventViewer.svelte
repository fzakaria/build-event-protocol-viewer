<script lang="ts">
  import BuildEventSummary from './BuildEventSummary.svelte';
  import { build_event_stream } from '$lib/generated/build_event_stream_proto';
  import LogViewer from './LogViewer.svelte';
  import { BuildEventModel } from '$lib/build-event-model';
  import BuildEventOverview from './BuildEventOverview.svelte';
  import BuildEventTestResults from './BuildEventTestResults.svelte';
  import BuildEventTargets from './BuildEventTargets.svelte';

  let { events = [] }: { events: build_event_stream.BuildEvent[] } = $props();
  let model = $derived(BuildEventModel.fromEvents(events));

  // State for the active tab
  let activeTab: 'Overview' | 'Targets' | 'Tests' | 'Logs' | 'Raw' = $state('Overview');

  function setTab(tab: 'Overview' | 'Targets' | 'Tests' | 'Logs' | 'Raw') {
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
      href="#targets"
      class="nav-link {activeTab === 'Targets' ? 'active' : ''}"
      onclick={() => setTab('Targets')}>Targets</a
    >
  </li>
  <li class="nav-item">
    <a
      href="#tests"
      class="nav-link {activeTab === 'Tests' ? 'active' : ''}"
      onclick={() => setTab('Tests')}>Tests</a
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
        <BuildEventOverview {model} />
      </div>
    </div>
  {:else if activeTab === 'Targets'}
    <div class="container pt-2">
      <BuildEventTargets {model} />
    </div>
  {:else if activeTab === 'Tests'}
    <div class="container pt-2">
      <BuildEventTestResults {model} />
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
