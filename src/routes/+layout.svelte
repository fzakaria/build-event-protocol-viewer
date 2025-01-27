<script lang="ts">
  // Import bootstrap
  // https://stackoverflow.com/a/75272446
  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'bootstrap/dist/js/bootstrap.min.js';
  import 'bootstrap-icons/font/bootstrap-icons.min.css';
  import icons from 'bootstrap-icons/bootstrap-icons.svg';
  import { base } from '$app/paths';
  import { version } from '$app/environment';

  import '../app.css';

  import { state } from './store.svelte';

  let { children } = $props();
</script>

<div class="container">
  <header class="d-flex justify-content-center border-bottom mb-4 flex-wrap py-3">
    <!-- https://svelte.dev/docs/kit/link-options#data-sveltekit-reload -->
    <a
      data-sveltekit-reload
      href="{base}/"
      class="d-flex align-items-center mb-md-0 me-md-auto link-body-emphasis text-decoration-none mb-3"
    >
      <img class="bi me-2" width="40" height="32" src={`${base}/magnifying-glass.svg`} alt="" />
      <span class="fs-4">Build Event Protocol Viewer</span>
    </a>

    <div class="mb-3">
      <input bind:files={state.files} class="form-control" type="file" id="formFile" />
    </div>
  </header>
</div>

<div class="container">
  {@render children()}
</div>

<div class="container">
  <footer class="d-flex justify-content-between align-items-center border-top my-4 flex-wrap py-3">
    <div class="col-md-4 d-flex align-items-center">
      <span class="text-muted">© 2025 Farid Zakaria</span>
    </div>

    <div class="col-md-4 d-flex justify-content-center">
      <p class="text-muted"><i>Not affiliated with Google or Bazel</i></p>
    </div>

    <ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
      <li class="ms-3">
        <a
          class="font-monospace text-muted"
          href="https://github.com/fzakaria/bazel-build-event-viewer/commit/{version}"
        >
          {version.substring(0, 7)}
        </a>
      </li>
      <li class="ms-3">
        <a
          class="text-muted"
          href="https://github.com/fzakaria/bazel-build-event-viewer"
          aria-label="GitHub repository"
          target="_blank"
          rel="noopener noreferrer"
          ><svg class="bi" width="24" height="24"><use xlink:href="{icons}#github"></use></svg></a
        >
      </li>
    </ul>
  </footer>
</div>
