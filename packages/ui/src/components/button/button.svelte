<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cva, type VariantProps } from 'class-variance-authority';

	const buttonClasses = cva('', {
		variants: {
			variety: {
				button: 'btn',
				'icon-button': 'btn-icon'
			},
			size: {
				sm: 'btn-sm',
				md: '',
				lg: 'btn-lg',
				xl: 'btn-xl'
			},
			color: {
				primary: 'bg-primary-500',
				custom: ''
			}
		},
		defaultVariants: {
			variety: 'button',
			size: 'md',
			color: 'primary'
		}
	});

	type ButtonVariantProps = VariantProps<typeof buttonClasses>;
	type ButtonProps = ButtonVariantProps & HTMLButtonAttributes;

	const { children, class: className, size, color, variety, ...rest } = $props<ButtonProps>();
	let classes = $derived(buttonClasses({ size, color, variety, class: className }));
</script>

<button class={classes} {...rest}>
	{#if children}
		{@render children()}
	{/if}
</button>
