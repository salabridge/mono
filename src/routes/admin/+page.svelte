<script lang="ts">
	import TipTap from '$lib/components/tiptap/tiptap.svelte';
	interface Props { data: any }

	let { data }: Props = $props();
</script>

<div class="container mx-auto">
	<TipTap />
</div>
