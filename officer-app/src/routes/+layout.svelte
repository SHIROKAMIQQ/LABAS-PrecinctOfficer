<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from "$app/state";
  	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from "flowbite-svelte";

	let activeUrl = $derived(page.url.pathname);	

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div id="main" class="flex items-center justify-center min-h-screen">
	<Navbar class="absolute top-0 left-0 border-b-1">
		<NavBrand href="/">
			<span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">L.A.B.A.S.</span>
		</NavBrand>
		<NavHamburger />
		<NavUl {activeUrl}>
			<NavLi href="/" class="text-xl">Dashboard</NavLi>
		</NavUl>
	</Navbar>
	
	<div class="flex justify-center w-full mx-auto mt-10 p-10">
		{@render children()}
	</div>
</div>
