<script>
	import Navbar from '$lib/components/navbar.svelte';
	import '../app.css';
	const { children } = $props();
</script>

<svelte:head>
	<title>Salabridge</title>
</svelte:head>

<Navbar />

{#if children}
	{@render children()}
{/if}

<footer class="flex justify-center items-center p-2">&copy; 2023 "Salabridges"</footer>
