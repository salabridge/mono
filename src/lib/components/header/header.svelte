<script lang="ts">
	import type { HeaderProps, HeaderTags } from './types.ts';
	import { cva, type VariantProps } from 'class-variance-authority';
  
	const classes = cva('', {
    variants: {
			tag: {
				h1: 'h1',
				h2: 'h2',
				h3: 'h3',
				h4: 'h4',
				h5: 'h5',
				h6: 'h6'
			},
			color: {
        primary: 'text-primary-500',
				secondary: 'text-secondary-500',
				custom: ''
			}
		},
		defaultVariants: {
      tag: 'h1',
			color: 'primary'
		}
	});

  type Bob = VariantProps<typeof classes>;
  
  let { children, tag = 'h1', actions, class: className, color } = $props<HeaderProps & Bob>();
	const bob = classes({ tag: tag as HeaderTags, className, color });
</script>

<div class="header flex gap-2 justify-between items-baseline">
	{#if children}
		<svelte:element this={tag} class={bob}>
			{@render children()}
		</svelte:element>
	{/if}
	{#if actions}
		<div class="flex gap-2">
			{@render actions()}
		</div>
	{/if}
</div>
