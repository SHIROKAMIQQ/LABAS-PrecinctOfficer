<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';
    import { page } from '$app/state';
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';

    let activeUrl = page.url.pathname;
    let showTally = $derived(page.url.pathname.startsWith('/get-tally') ? true : false);

    let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div id="main" class="flex min-h-screen items-center justify-center">
    <Navbar class="absolute top-0 left-0 border-b-1">
        <NavBrand href="/">
            <span class="m-6 self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
                >L.A.B.A.S.</span
            >
        </NavBrand>
        <NavHamburger />
        <NavUl {activeUrl}>
            <NavLi href="/" class="text-xl">Home</NavLi>
            <!-- {#if showTally}
                <NavLi href="/get-tally" class="text-xl">National/Local</NavLi>
            {/if} -->
        </NavUl>
    </Navbar>

    <div class="mx-auto mt-20 w-full justify-center p-10">
        {@render children()}
    </div>
</div>
