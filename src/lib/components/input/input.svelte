<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { HTMLInputAttributes } from 'svelte/elements';
	let inputProps = cva('', {
		variants: {
			size: {
				lg: ''
			}
		},
		defaultVariants: {
			size: 'lg'
		}
	});

	type InputProps = VariantProps<typeof inputProps> & HTMLInputAttributes;

	let { class: className, size, ...rest } = $props<InputProps>();

	let classes = $derived(inputProps({ size, class: className }));
</script>

<input class={classes} {...rest} />
