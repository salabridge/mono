import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type HeaderTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeaderProps extends HTMLAttributes<HTMLHeadingElement> {
	tag?: HeaderTags;
	children: Snippet<void>;
	actions?: Snippet<void>;
}
