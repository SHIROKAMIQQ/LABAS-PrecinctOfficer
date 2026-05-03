<!-- src/routes/+page.svelte -->
<script lang="ts">

  const panels = [
    {
      title: "Vote",
      label: "Ballot",
      description: "Verify voter identity and vote at the precinct",
      href: "/voting-process",
      bg: "bg-[#0038A8]",        // blue
      hoverBg: "hover:bg-[#002a80]",
      cta: "Verify and Vote",
      darkText: false,
    },
    {
      title: "View",
      label: "Tally Board",
      description: "Live results and turnout for the current precinct",
      href: "/tally",
      bg: "bg-[#FCD116]",        // yellow
      hoverBg: "hover:bg-[#d9b210]",
      cta: "Open Dashboard",
      darkText: true,
    },
  ] as const;
</script>

<div class="flex flex-col lg:flex-row min-h-[calc(100vh-65px)]">
  {#each panels as panel}
    
    <a
      href={panel.href}
      class="group relative flex-1 flex flex-col justify-between p-10 lg:p-12 transition-colors duration-200 {panel.bg} {panel.hoverBg} {panel.darkText ? 'text-gray-900' : 'text-white'}"
    >
      <!-- title and description -->
      <div class="flex flex-col gap-3 max-w-md">
        <h2 class="text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
          {panel.title}<br />
          {panel.label}
        </h2>
        <p class="text-base lg:text-lg opacity-90 mt-2">
          {panel.description}
        </p>
        <span
          class="inline-block mt-6 px-5 py-2 border-2 text-sm font-semibold uppercase tracking-wider transition-all w-fit {panel.darkText ? 'border-gray-900 group-hover:bg-gray-900 group-hover:text-yellow-400' : 'border-white group-hover:bg-white group-hover:text-gray-900'}"
        >
          {panel.cta} →
        </span>
      </div>

      <!-- icons -->
      <div class="flex justify-end mt-12 lg:mt-0">
        {#if panel.title === "Vote"}
          <svg class="w-32 h-32 lg:w-48 lg:h-48 opacity-30 group-hover:opacity-50 transition-opacity" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="12" y="8" width="40" height="48" rx="2" />
            <circle cx="24" cy="22" r="5" />
            <line x1="34" y1="20" x2="48" y2="20" />
            <line x1="34" y1="26" x2="44" y2="26" />
            <line x1="16" y1="38" x2="48" y2="38" />
            <line x1="16" y1="44" x2="48" y2="44" />
            <line x1="16" y1="50" x2="38" y2="50" />
          </svg>

        {:else}
          <svg class="w-32 h-32 lg:w-48 lg:h-48 opacity-40 group-hover:opacity-60 transition-opacity" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="56" x2="56" y2="56" stroke-linecap="round" />
            <rect x="14" y="36" width="8" height="20" />
            <rect x="28" y="22" width="8" height="34" />
            <rect x="42" y="14" width="8" height="42" />
          </svg>
        {/if}
      </div>
    </a>
  {/each}
</div>