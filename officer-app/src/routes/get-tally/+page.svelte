<script lang="ts">
    import { Button, Card } from 'flowbite-svelte';
    import { MapPinAltOutline } from 'flowbite-svelte-icons';
    import Tally from '$lib/components/ranking.svelte';
    import { goto } from '$app/navigation';
    import type { GetTallyResult } from '$lib/types';

    async function selectCity(city: string, isNCR: boolean = true) {
        await goto(`/get-tally?city=${encodeURIComponent(city)}`); 
        // SIDNEY TODO: Remove this if not really needed anymore
        // if (isNCR) {
        //     await goto(`/get-tally?province=${encodeURIComponent('Metropolitan Manila Second District')}&city=${encodeURIComponent(city)}`);
        // } else {
        //     await goto(`/get-tally?province=${encodeURIComponent(city)}&city=${encodeURIComponent(city)}`);
        // }
    }

    async function selectProvince(province: string) {
        await goto(`/get-tally?province=${encodeURIComponent(province)}`);
    }

    function groupByPosition(tallyResult: GetTallyResult) {
        const positions: Record<number, {
            position_id: number;
            title: string;
            scope: string;
            candidates: { name: string; vote: number }[];
        }> = {};

        for (const candidate of tallyResult) {
            // Create position entry if not yet existing
            if (!positions[candidate.position_id]) {
                positions[candidate.position_id] = {
                    position_id: candidate.position_id,
                    title: candidate.position_name,
                    scope: candidate.scope_name,
                    candidates: [],
                }
            }

            positions[candidate.position_id].candidates.push({
                name: `${candidate.last_name}, ${candidate.first_name} ${candidate.middle_name}`.trim(),
                vote: candidate.votecount,
            });
        }

        return Object.values(positions);
    }

    let { data } = $props();
    let positions = $derived(data.tallyData ? groupByPosition(data.tallyData) : []);
    // let tally_json = $derived(data.tallyData);

    // TODO: Ideally, this would not be hardcoded and would be read off the database or an endpoint
    const metro_manila_cities = [
        'City of Caloocan',
        'City of Las Piñas',
        'City of Makati',
        'City of Malabon',
        'City of Mandaluyong',
        'City of Marikina',
        'City of Muntinlupa',
        'City of Navotas',
        'City of Parañaque',
        'City of Pasig',
        'City of San Juan',
        'City of Taguig',
        'City of Valenzuela',
        'City of Manila',
        'Pasay City',
        'Pateros',
        'Quezon City',
    ];

    const independent_cities = [
        'Angeles City',
        'City of Bacolod',
        'City of Baguio',
        'City of Butuan',
        'City of Cagayan de Oro',
        'City of Cebu',
        'City of Cotabato',
        'City of Dagupan',
        'City of Davao',
        'City of General Santos',
        'City of Illigan',
        'City of Iloilo',
        'City of Lapu-Lapu',
        'City of Naga',
        'City of Olongapo',
        'City of Puerto Princesa',
        'City of Santiago',
        'City of Tacloban',
        'City of Zamboanga',
        'City of Ormoc',
    ];
    const provinces = [
        'Abra',
        'Agusan del Norte',
        'Agusan del Sur',
        'Aklan',
        'Albay',
        'Antique',
        'Apayao',
        'Aurora',
        'Basilan',
        'Bataan',
        'Batanes',
        'Batangas',
        'Benguet',
        'Biliran',
        'Bohol',
        'Bukidnon',
        'Bulacan',
        'Cagayan',
        'Camarines Norte',
        'Camarines Sur',
        'Camiguin',
        'Capiz',
        'Catanduanes',
        'Cavite',
        'Cebu',
        'Cotabato',
        'Davao de Oro',
        'Davao del Norte',
        'Davao del Sur',
        'Davao Occidental',
        'Davao Oriental',
        'Dinagat Islands',
        'Eastern Samar',
        'Guimaras',
        'Ifugao',
        'Ilocos Norte',
        'Ilocos Sur',
        'Iloilo',
        'Isabela',
        'Kalinga',
        'La Union',
        'Laguna',
        'Lanao del Norte',
        'Lanao del Sur',
        'Leyte',
        'Maguindanao del Norte',
        'Maguindanao del Sur',
        'Marinduque',
        'Masbate',
        'Misamis Occidental',
        'Misamis Oriental',
        'Mountain Province',
        'Negros Occidental',
        'Negros Oriental',
        'Northern Samar',
        'Nueva Ecija',
        'Nueva Vizcaya',
        'Occidental Mindoro',
        'Oriental Mindoro',
        'Palawan',
        'Pampanga',
        'Pangasinan',
        'Quezon',
        'Quirino',
        'Rizal',
        'Romblon',
        'Samar',
        'Sarangani',
        'Siquijor',
        'Sorsogon',
        'South Cotabato',
        'Southern Leyte',
        'Sultan Kudarat',
        'Sulu',
        'Surigao del Norte',
        'Surigao del Sur',
        'Tarlac',
        'Tawi-Tawi',
        'Zambales',
        'Zamboanga del Norte',
        'Zamboanga del Sur',
        'Zamboanga Sibugay',
    ];
</script>

{#if positions.length > 0}
    <section class="mx-4">
        <!-- #key is necessary to force the chart to update when clicking new city/province -->
        {#key data.tallyData}
            {#each positions as position (position.position_id)}
                <Tally 
                    title={`${position.title} (${position.scope})`}
                    candidates={position.candidates}
                />
            {/each}
        {/key}
    </section>
{:else}
    <p class="mt-4 text-red-500">Failed to load tally data.</p>
{/if}

<section>
    <Card class="my-5 max-w-full p-4">
        <div id="Metro Manila" class="m-4">
            <h2 class="mb-3 border-b-2 border-gray-400 p-2 text-center text-xl font-bold">
                Metro Manila
            </h2>
            <div class="grid grid-cols-4 gap-4">
                {#each metro_manila_cities as city}
                    <Button onclick={() => selectCity(city)} color="light" size="lg"
                        ><MapPinAltOutline class="mr-2" />{city}</Button
                    >
                {/each}
            </div>
        </div>
    </Card>

    <Card class="my-5 max-w-full p-4">
        <div id="Metro Manila" class="m-4">
            <h2 class="mb-3 border-b-2 border-gray-400 p-2 text-center text-xl font-bold">
                Independent Cities
            </h2>
            <div class="grid grid-cols-4 gap-4">
                {#each independent_cities as city}
                    <Button onclick={() => selectCity(city, false)} color="light" size="lg"
                        ><MapPinAltOutline class="mr-2" />{city}</Button
                    >
                {/each}
            </div>
        </div>
    </Card>

    <Card class="my-5 max-w-full p-4">
        <div id="Metro Manila" class="m-4">
            <h2 class="mb-3 border-b-2 border-gray-400 p-2 text-center text-xl font-bold">
                Provinces
            </h2>
            <div class="grid grid-cols-4 gap-4">
                {#each provinces as province}
                    <Button onclick={() => selectProvince(province)} color="light" size="lg"
                        ><MapPinAltOutline class="mr-2" />{province}</Button
                    >
                {/each}
            </div>
        </div>
    </Card>
</section>

<!-- SIDNEY: I commented out the parts below because I transferred the contents of tally/local/+page.svelte to tally/+page.svelte -->
<!-- <section>
    <div>
        <h1 class="mb-2 p-2 text-3xl font-bold">{tally_json.election.title}</h1>
    </div>

    <div>
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
    <!-- {#each tally_json.positions as position (position.position_id)}
        {#if position.scope === 'National'}
            <Tally title={position.title} candidates={getVotes(position.candidates)} />
        {/if}
    {/each}
</section> -->

<!-- 
national - president, vp, senators HoR (party list)
provincial - governor, vice gov, board members
city - mayor, vice mayor, councilors
district - HoR (district), congressional candidates
 -->
