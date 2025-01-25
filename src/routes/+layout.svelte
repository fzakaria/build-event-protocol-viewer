<script lang="ts">
  // Import bootstrap
  // https://stackoverflow.com/a/75272446
  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'bootstrap/dist/js/bootstrap.min.js';
  import '../app.css';

  import { state } from './store.svelte';

  let { children } = $props();
</script>

<div class="container">
  <header class="d-flex justify-content-center border-bottom mb-4 flex-wrap py-3">
    <a
      href="/"
      class="d-flex align-items-center mb-md-0 me-md-auto link-body-emphasis text-decoration-none mb-3"
    >
      <img class="bi me-2" width="40" height="32" src="/bazel.svg" alt="" />
      <span class="fs-4">Bazel Build Event Protocol</span>
    </a>

    <div class="mb-3">
      <input bind:files={state.files} class="form-control" type="file" id="formFile" />
    </div>
  </header>
</div>

<div class="container">
  {@render children()}
</div>
