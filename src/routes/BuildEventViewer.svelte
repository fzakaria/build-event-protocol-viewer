<script lang="ts">
  import { Message } from 'protobufjs';
  import BuildEventSummary from './BuildEventSummary.svelte';

  let { events = [] }: { events: Message<object>[] | null } = $props();

  // State for the active tab
  let activeTab: 'Overview' | 'Raw' = $state('Overview');

  function setTab(tab: 'Overview' | 'Raw') {
    activeTab = tab;
  }
</script>

<BuildEventSummary />

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
                <div class="col">
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <p>It is currently empty.</p>
                </div>
            </div>
        </div>
    </div>
  {:else if activeTab === 'Raw'}
    <div class="tab-pane show active">
      <andypf-json-viewer expanded="2" data={events} show-toolbar="true"> </andypf-json-viewer>
    </div>
  {/if}
</div>
