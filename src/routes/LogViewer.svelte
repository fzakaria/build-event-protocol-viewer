<script lang="ts">
  import { AnsiUp } from 'ansi_up';

  let { logs }: { logs: string } = $props();

  let lines = logs.split('\n');
  const ansi_up = new AnsiUp();
  var spans = lines.map((l) => ansi_up.ansi_to_html(l));
</script>

<div class="card border-0 shadow-sm">
  <div class="card-body bg-dark text-light font-monospace overflow-auto rounded">
    {#each spans as span}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html span}
      <br />
    {/each}
  </div>
</div>
