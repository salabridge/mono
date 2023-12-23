<script>
  import Navbar from '$lib/components/navbar.svelte';
  import '../app.css';
  const { children } = $props();
</script>

<svelte:head>
  <title>
    Salabridge
  </title>
</svelte:head>

<Navbar />

{#if children}
  {@render children()}
{/if}