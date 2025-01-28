<script lang="ts">
  import { BuildEventModel } from '$lib/build-event-model';
  import { SvelteSet } from 'svelte/reactivity';

  let { model }: { model: BuildEventModel } = $props();

  let expandedRows = $state(new SvelteSet<string>());

  function toggleRow(label: string): void {
    if (expandedRows.has(label)) {
      expandedRows.delete(label);
    } else {
      expandedRows.add(label);
    }
  }
</script>

<div class="card border-0">
  <div class="card-body">
    {#if model.targetsConfigured.size > 0}
      <table class="table-hover table">
        <thead class="table-light">
          <tr>
            <th></th>
            <th>Label</th>
            <th>Kind</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {#each [...model.targetsConfigured] as [label, configured]}
            <tr class="cursor-pointer" onclick={() => toggleRow(label)}>
              <td>
                <i
                  class={expandedRows.has(label)
                    ? 'bi bi-chevron-contract'
                    : 'bi bi-chevron-expand'}
                ></i>
              </td>
              <td>{label}</td>
              <td>{configured.targetKind.replace(/rule/g, '').trim()}</td>
              <td>
                {#if model.targetsCompleted.get(label)?.success}
                  <span class="badge bg-success">Success</span>
                {:else}
                  <span class="badge bg-danger">Failed</span>
                {/if}
              </td>
            </tr>
            <!-- Expandable Row -->
            {#if expandedRows.has(label)}
              <tr style="pointer-events: none;">
                <td></td>
                <td class="p-3">
                  {#if (model.targetsCompleted.get(label)?.importantOutput?.length ?? 0) > 0}
                    <table class="table">
                      <thead class="table-light">
                        <tr>
                          <th>Output Files</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each model.targetsCompleted.get(label)!.importantOutput as file}
                          <tr>
                            <td>{file.name}</td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  {:else}
                    <div class="text-muted">No output files available.</div>
                  {/if}
                </td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    {:else}
      <!-- No Targets Available -->
      <div class="p-5 text-center">
        <h5>No Targets Found</h5>
        <p class="text-muted">
          This build did not include any targets or the results are unavailable.
        </p>
      </div>
    {/if}
  </div>
</div>
