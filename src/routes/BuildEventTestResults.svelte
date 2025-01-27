<script lang="ts">
  import { BuildEventModel } from '$lib/build-event-model';
  import { humanizeDuration, protoDurationToSeconds, protoTimestampDate } from '$lib/date-helpers';
  import { build_event_stream } from '$lib/generated/build_event_stream_proto';
  import { SvelteSet } from 'svelte/reactivity';

  let { model }: { model: BuildEventModel } = $props();

  let expandedRows = $state(new SvelteSet<number>());

  function toggleRow(index: number): void {
    if (expandedRows.has(index)) {
      expandedRows.delete(index);
    } else {
      expandedRows.add(index);
    }
  }

  function testStatusToBadgeColor(status: build_event_stream.TestStatus): string {
    switch (status) {
      case build_event_stream.TestStatus.NO_STATUS:
        return 'bg-secondary';
      case build_event_stream.TestStatus.PASSED:
        return 'bg-success';
      case build_event_stream.TestStatus.FLAKY:
        return 'bg-warning';
      case build_event_stream.TestStatus.TIMEOUT:
        return 'bg-danger';
      case build_event_stream.TestStatus.FAILED:
        return 'bg-danger';
      case build_event_stream.TestStatus.INCOMPLETE:
        return 'bg-info';
      case build_event_stream.TestStatus.REMOTE_FAILURE:
        return 'bg-danger';
      case build_event_stream.TestStatus.FAILED_TO_BUILD:
        return 'bg-danger';
      case build_event_stream.TestStatus.TOOL_HALTED_BEFORE_TESTING:
        return 'bg-info';
    }
  }
</script>

<div class="card border-0">
  <div class="card-body">
    {#if model.testSummaries.size > 0}
      <table class="table-hover table">
        <thead class="table-light">
          <tr>
            <th>Test Name</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Attempts</th>
          </tr>
        </thead>
        <tbody>
          {#each [...model.testSummaries] as [label, summary], index}
            <tr onclick={() => toggleRow(index)} class="cursor-pointer">
              <td>{label}</td>
              <td>
                <span class="badge {testStatusToBadgeColor(summary.overallStatus)}">
                  {build_event_stream.TestStatus[summary.overallStatus]}
                </span>
              </td>
              <td>{humanizeDuration(protoDurationToSeconds(summary.totalRunDuration))}</td>
              <td>{summary.attemptCount}</td>
            </tr>
            <!-- Collapsible Details Row -->
            {#if expandedRows.has(index)}
              <tr style="pointer-events: none;">
                <td class="p-3">
                  {#if (model.testResults.get(label) ?? []).length > 0}
                    <table class="table">
                      <thead class="table-light">
                        <tr>
                          <th>Date</th>
                          <th>Run</th>
                          <th>Status</th>
                          <th>Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each model.testResults.get(label) ?? [] as result, resultIndex}
                          <tr>
                            <td>{protoTimestampDate(result.testAttemptStart).toLocaleString()}</td>
                            <td>{resultIndex + 1}</td>
                            <td>
                              <span class="badge {testStatusToBadgeColor(result.status)}">
                                {build_event_stream.TestStatus[result.status]}
                              </span>
                            </td>
                            <td>
                              {humanizeDuration(protoDurationToSeconds(result.testAttemptDuration))}
                            </td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  {:else}
                    <div class="text-muted">No individual test runs available.</div>
                  {/if}
                </td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    {:else}
      <!-- No Tests Available -->
      <div class="p-5 text-center">
        <h5>No Tests Found</h5>
        <p class="text-muted">
          This build did not include any tests or the results are unavailable.
        </p>
      </div>
    {/if}
  </div>
</div>
