<script>
	import Header from '$lib/components/header/header.svelte';

  import { User } from 'lucide-svelte';
  import Button from '$lib/components/button/button.svelte';
</script>

{#snippet headerActions()}
	<button>I am a button</button>
	<button>me too</button>
{/snippet}

<div class="container mx-auto">
	<Header tag="h1" actions={headerActions}>Testing</Header>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
</div>
