<script lang="ts">
  import { Message } from 'protobufjs';

  class BuildEventSummaryProps {
    success: boolean;
    start: Date;
    finish: Date;
    user: string;
    cpu: string;
    hostname: string;
    command: string;
    numTargets: number;
    numPackages: number;
    numFetches: number;
    remoteExecution: boolean;
    caching: boolean;

    constructor(
      success: boolean,
      start: Date,
      finish: Date,
      user: string,
      cpu: string,
      hostname: string,
      command: string,
      numTargets: number,
      numPackages: number,
      numFetches: number,
      remoteExecution: boolean,
      caching: boolean
    ) {
      this.success = success;
      this.start = start;
      this.finish = finish;
      this.user = user;
      this.cpu = cpu;
      this.hostname = hostname;
      this.command = command;
      this.numTargets = numTargets;
      this.numPackages = numPackages;
      this.numFetches = numFetches;
      this.remoteExecution = remoteExecution;
      this.caching = caching;
    }

    get duration(): number {
      return (this.finish.getTime() - this.start.getTime()) / 1000;
    }

    get details() {
      return [
        {
          icon: this.success ? 'bi-check-circle-fill' : 'bi-x-circle-fill',
          text: this.success ? 'Passed' : 'Failed',
          className: this.success ? 'text-success' : 'text-danger'
        },
        {
          icon: 'bi-clock',
          text: `${Math.floor(this.duration / 60)}m ${Math.floor(this.duration % 60)}s`,
          tooltip: 'Duration'
        },
        { icon: 'bi-person-fill', text: this.user, tooltip: 'User' },
        { icon: 'bi-server', text: this.hostname, tooltip: 'Hostname' },
        { icon: 'bi-grid', text: this.command, tooltip: 'Command' },
        { icon: 'bi-cpu-fill', text: this.cpu, tooltip: 'CPU' },
        {
          icon: 'bi-sliders',
          text: `${this.numTargets} targets`,
          tooltip: 'Number of configured targets'
        },
        {
          icon: 'bi-box',
          text: `${this.numPackages} packages`,
          tooltip: 'Number of packages'
        },
        {
          icon: 'bi-arrow-down-circle',
          text: `${this.numFetches} fetches`,
          tooltip: 'Number of fetches',
          isActive: this.numFetches > 0
        },
        {
          icon: this.remoteExecution ? 'bi-cloud-fill' : 'bi-cloud-slash-fill',
          text: `Remote execution ${this.remoteExecution ? 'on' : 'off'}`
        },
        {
          icon: this.caching ? 'bi-cloud-fill' : 'bi-cloud-slash-fill',
          text: this.caching ? 'Caching on' : 'Caching off',
          isActive: this.caching
        }
      ];
    }
  }

  function getBuildEventSummary(events: Message<object>[] | null): BuildEventSummaryProps | null {
    if (!events) {
      return null;
    }

    const now = Date.now();

    return new BuildEventSummaryProps(
      true,
      new Date(now - 3 * 6000),
      new Date(),
      'fmzakari',
      'k8s',
      'nyx',
      'build //...',
      3,
      33,
      5,
      true,
      false
    );
  }

  let { events = [] }: { events: Message<object>[] | null } = $props();

  let summary = $derived(getBuildEventSummary(events));
  let details = $derived(summary ? summary.details : []);
</script>

<div class="card">
  <div class="card-body">
    <div class="container">
      <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-1">
        {#each details as detail}
          <div class="col">
            <div class="d-flex align-items-center">
              <i class={`bi ${detail.icon} me-2 ${detail.className || ''}`}></i>
              <span title={detail.tooltip || ''}>{detail.text}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
