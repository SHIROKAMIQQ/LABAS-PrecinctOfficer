<script lang="ts">
    import { Button } from "flowbite-svelte";

    let name = $state("Full Name");
    let address = $state("Address");
    let image = $state("");

    function alertBox(){
        alert("Your pressed the button!")
    }
</script>

<div id="container" class="flex flex-col border w-250 h-150 p-10">
    <div class="flex flex-row">
        <!-- display voter image -->
        {#if image === ""}
            <div class="flex w-100 h-100 bg-gray-300 rounded-sm items-center justify-center m-2">
                <span>Display Image</span>
            </div>
        {:else}
            <img src={image} alt="Preview" style="max-width: 400px; max-height: 400px" />
        {/if}

        <!-- display voter information -->
        <div class="flex flex-col m-2 mt-6 p-4 gap-2">
            <h1 class="text-xl text-bold">Full Name: {name}</h1>
            <h1 class="text-xl text-bold">Location: {address}</h1>
        </div>
    </div>

    <!-- generate button -->
    <div class="flex items-center justify-center p-4 my-auto">
        <Button color="light" onclick={alertBox}>Generate and Print Ballot</Button>
    </div>
</div>