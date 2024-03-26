<script lang="ts">
	import type { Snippet } from 'svelte';
	type OnOrOff = 'on' | 'off';
	type ToggleProps = {
		selected?: OnOrOff;
		on?: Snippet;
		off?: Snippet;
		onchange?: (currentState: OnOrOff) => unknown;
	};
	const { selected: selectedProp = 'off', on, off, onchange } = $props<ToggleProps>();
	let selected = $state(selectedProp);

	function change(v: OnOrOff) {
		selected = v;
		onchange?.(v);
	}
</script>

<div
	tabindex="0"
	role="checkbox"
	aria-checked={selected ? 'true' : 'false'}
	onkeypress={(e) =>
		e.key === 'Enter' && e.target === e.currentTarget && change(selected === 'on' ? 'off' : 'on')}
	class="toggle p-1 rounded-lg border bg-slate-200 flex gap-2"
	onclick={() => change(selected === 'on' ? 'off' : 'on')}
>
	<div
		role="button"
		tabindex="0"
		class="cursor-pointer off p-2 rounded-lg"
		class:bg-zinc-50={selected === 'off'}
	>
		{#if off}
			{@render off()}
		{:else}
			Off
		{/if}
	</div>
	<div
		role="button"
		tabindex="0"
		class="cursor-pointer on p-2 rounded-lg"
		class:bg-primary-500={selected === 'on'}
		class:text-zinc-50={selected === 'on'}
	>
		{#if on}
			{@render on()}
		{:else}
			On
		{/if}
	</div>
</div>
