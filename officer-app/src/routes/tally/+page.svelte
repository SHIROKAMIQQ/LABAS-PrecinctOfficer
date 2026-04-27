<script lang="ts">
    //@ts-nocheck
    // import { tally_json } from "$lib/raw_json"
    import { getVotes } from "$lib/ballot_data"
    import { Button, Dropdown, DropdownItem } from "flowbite-svelte"
    import { ChevronDownOutline } from "flowbite-svelte-icons";
    import Tally from "$lib/components/ranking.svelte"

    let { data } = $props();
    let tally_json = $state(data.data);
</script>

<section>
    <div>
        <h1 class="p-2 mb-2 text-3xl font-bold">{tally_json.election.title}</h1>
        <!-- <p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p> -->
    </div>
    
    <!-- <div>
        <Button class="px-3 py-2 w-32 bg-(--color-custom-green)!">
            {selected}<ChevronDownOutline class="ms-1.5 h-2.5 w-2.5" />
         </Button>
        <Dropdown simple class="w-48 overflow-y-auto max-h-60">
            {#each seriesDropdown as name}
            <DropdownItem  onclick={() => handleSelect(name)}>
                {name}
            </DropdownItem>
            {/each}
      </Dropdown>
    </div> -->

    <!-- Bar chart for each position -->
    {#each tally_json.positions as position (position.position_id)}
        {#if position.scope === "National"}
            <Tally title={position.title} candidates={getVotes(position.candidates)} />
        {/if}
    {/each}


</section>

<!-- 
national - president, vp, senators HoR (party list)
provincial - governor, vice gov, board members
city - mayor, vice mayor, councilors
district - HoR (district), congressional candidates
-->