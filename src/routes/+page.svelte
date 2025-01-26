<script lang="ts">
  import { state } from './store.svelte';
  import { base } from '$app/paths';
  import { decodeAll } from '$lib/proto-helpers';
  import BuildEventViewer from './BuildEventViewer.svelte';
  import 'bootstrap/dist/js/bootstrap.min.js';
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
  <div class="alert alert-warning alert-dismissible fade show" role="alert">
    Please select a file to view.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
  <button class="btn btn-primary mt-3" onclick={loadSampleFile}> Load Sample File </button>
  <div class="card mt-3">
    <div class="card-body">
      <p>
        You can easily generated a <a class="link-primary" href="https://bazel.build/remote/bep"
          >build event protocol file (BEP)</a
        >
        by adding
        <code>--build_event_binary_file=/path/to/file</code> to your invocation or add the following
        to your <code>.bazelrc</code>
      </p>
      <!-- TODO: Fix using grid style instead -->
      <div class="card rounded-0 m-2" style="display: inline-block; max-width: 100%;">
        <div class="card-body bg-light p-2">
          <code> common --build_event_binary_file=/path/to/file </code>
        </div>
      </div>
      <p>
        The file generated will contain serialized protocol buffer messages that you can upload <i
          >here</i
        >.
      </p>
    </div>
  </div>
{/if}
