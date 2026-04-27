<script lang="ts">
    import { getVotes, getData } from "$lib/ballot_data"
    import { Button, Card } from "flowbite-svelte"
    import { MapPinAltOutline } from "flowbite-svelte-icons";
    import { goto } from '$app/navigation';

    console.log(encodeURIComponent("City of Las Piñas"));
    function selectCity(city: string, isNCR: boolean = true) {
        if (isNCR) {
            goto(`/local/Metro%20Manila/${encodeURIComponent(city)}`);
        } else {
            goto(`/local/${encodeURIComponent(city)}/${encodeURIComponent(city)}`);
        }
    }

    function selectProvince(province: string) {
        goto(`/local/${encodeURIComponent(province)}`);
    }

    const metro_manila_cities = ["City of Caloocan", "City of Las Piñas", "City of Makati",
                                "City of Malabon", "City of Mandaluyong", "City of Marikina", 
                                "City of Muntinlupa", "City of Navotas", "City of Parañaque",
                                "City of Pasig", "City of San Juan", "City of Taguig",
                                "City of Valenzuela", "City of Manila", "City of Pasay",
                                "City of Pateros ", "City of Quezon"];

    const independent_cities = ["City of Angeles", "City of Bacolod", "City of Baguio", "City of Butuan", 
                                "City of Cagayan de Oro", "City of Cebu", "City of Cotabato", "City of Dagupan",
                                "City of Davao", "City of General Santos", "City of Illigan", "City of Iloilo", 
                                "City of Lapu-Lapu", "City of Naga", "City of Olongapo", "City of Puerto Princesa",
                                "City of Santiago", "City of Tacloban", "City of Zamboanga", "City of Ormoc"];
    const provinces = [ "Abra", "Agusan del Norte", "Agusan del Sur", "Aklan", "Albay",
                        "Antique", "Apayao", "Aurora", "Basilan", "Bataan",
                        "Batanes", "Batangas", "Benguet", "Biliran", "Bohol",
                        "Bukidnon", "Bulacan", "Cagayan", "Camarines Norte", "Camarines Sur",
                        "Camiguin", "Capiz", "Catanduanes", "Cavite", "Cebu",
                        "Cotabato", "Davao de Oro", "Davao del Norte", "Davao del Sur", "Davao Occidental",
                        "Davao Oriental", "Dinagat Islands", "Eastern Samar", "Guimaras", "Ifugao",
                        "Ilocos Norte", "Ilocos Sur", "Iloilo", "Isabela", "Kalinga",
                        "La Union", "Laguna", "Lanao del Norte", "Lanao del Sur", "Leyte",
                        "Maguindanao del Norte", "Maguindanao del Sur", "Marinduque", "Masbate", "Misamis Occidental",
                        "Misamis Oriental", "Mountain Province", "Negros Occidental", "Negros Oriental", "Northern Samar",
                        "Nueva Ecija", "Nueva Vizcaya", "Occidental Mindoro", "Oriental Mindoro", "Palawan",
                        "Pampanga", "Pangasinan", "Quezon", "Quirino", "Rizal",
                        "Romblon", "Samar", "Sarangani", "Siquijor", "Sorsogon",
                        "South Cotabato", "Southern Leyte", "Sultan Kudarat", "Sulu", "Surigao del Norte",
                        "Surigao del Sur", "Tarlac", "Tawi-Tawi", "Zambales", "Zamboanga del Norte",
                        "Zamboanga del Sur", "Zamboanga Sibugay"
                        ];
</script>

<section>
    <div>
        <h2 class="p-2 mb-2 text-2xl font-bold">Local Elections</h2>
    </div>

    <Card class="max-w-full p-4 my-5">
        <div id="Metro Manila" class="m-4">
            <h2 class="p-2 mb-3 text-xl font-bold border-b-2 border-gray-400 text-center">Metro Manila</h2>
            <div class="grid grid-cols-4 gap-4">
                {#each metro_manila_cities as city}
                    <Button onclick={() => selectCity(city)} color="light" size="lg"><MapPinAltOutline class="mr-2" />{city}</Button>
                {/each}
            </div>
        </div>
    </Card>

    <Card class="max-w-full p-4 my-5">
        <div id="Metro Manila" class="m-4">
            <h2 class="p-2 mb-3 text-xl font-bold border-b-2 border-gray-400 text-center">Independent Cities</h2>
            <div class="grid grid-cols-4 gap-4">
                {#each independent_cities as city}
                    <Button onclick={() => selectCity(city, false)} color="light" size="lg"><MapPinAltOutline class="mr-2" />{city}</Button>
                {/each}
            </div>
        </div>
    </Card>

    <Card class="max-w-full p-4 my-5">
        <div id="Metro Manila" class="m-4">
            <h2 class="p-2 mb-3 text-xl font-bold border-b-2 border-gray-400 text-center">Provinces</h2>
            <div class="grid grid-cols-4 gap-4">
                {#each provinces as province}
                    <Button onclick={() => selectProvince(province)} color="light" size="lg"><MapPinAltOutline class="mr-2" />{province}</Button>
                {/each}
            </div>
        </div>
    </Card>
</section>