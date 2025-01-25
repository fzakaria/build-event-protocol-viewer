<script lang="ts">
  import { state } from './store.svelte';
  import { base } from '$app/paths';
  import { decodeAll } from '$lib/proto-helpers';
  import BuildEventViewer from './BuildEventViewer.svelte';
  import '@andypf/json-viewer';

  let file = $derived(state.files?.[0]);
  let error: string | null = null;
  let events = $derived(decodeAll(file));

  async function loadSampleFile() {
    const response = await fetch(`${base}/samples/demo.pb`);
    if (!response.ok) {
      throw new Error(`Failed to load the sample file: ${response.statusText}`);
    }
    const blob = await response.blob();
    const file = new File([blob], 'demo.pb', { type: blob.type });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    state.files = dataTransfer.files;
  }
</script>

<!-- This pattern is copied from https://github.com/sveltejs/svelte/issues/13722#issuecomment-2425182224 -->
{#if file}
  {#await events}
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  {:then items}
    <BuildEventViewer events={items} />
  {:catch reason}
    <div class="alert alert-danger" role="alert">{reason}</div>
  {/await}
{:else if error}
  <div class="alert alert-danger" role="alert">{error}</div>
{:else}
  <div class="alert alert-warning" role="alert">Please select a file to view.</div>
  <button class="btn btn-primary mt-3" onclick={loadSampleFile}> Load Sample File </button>
{/if}
