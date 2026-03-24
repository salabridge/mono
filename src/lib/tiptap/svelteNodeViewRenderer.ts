import {
	NodeView,
	type NodeViewProps,
	type NodeViewRenderer,
	type NodeViewRendererOptions,
	type NodeViewRendererProps
} from '@tiptap/core';
import type { Component, SvelteComponent } from 'svelte/compiler';
import type { ComponentType } from 'svelte';
import type { NodeView as ProseMirrorNodeView } from '@tiptap/pm/view';
import { SvelteRenderer } from './svelteRenderer';
import { Editor } from './editor';

export interface SvelteNodeViewRenderOptions extends NodeViewRendererOptions {
	as?: string;
}

export class SvelteNodeView extends NodeView<SvelteComponent, Editor, SvelteNodeViewRenderOptions> {
	renderer!: SvelteRenderer;
	contentDomElement!: HTMLElement | null;
	mount(): void {
		const props: NodeViewProps = {
			editor: this.editor,
			node: this.node,
			decorations: this.decorations,
			selected: false,
			extension: this.extension,
			getPos: () => this.getPos(),
			updateAttributes: (attributes = {}) => this.updateAttributes(attributes),
			deleteNode: () => this.deleteNode()
		};

		console.info('JIM',this.component);

		// this.component.displayName =
		// 	this.extension.name.slice(0, 1).toUpperCase() + this.extension.name.slice(1);

		this.renderer = new SvelteRenderer(this.component as any, {
			...props,
		});
	}

	get dom() {
		if (
			this.renderer.element.firstElementChild &&
			!this.renderer.element.firstElementChild?.hasAttribute('data-node-view-wrapper')
		) {
			throw new Error('Please use the NodeViewWrapper component for your node code');
		}
		return this.renderer.element as HTMLElement;
	}

	get contentDOM() {
		if (this.node.isLeaf) {
			return null;
		}
		return this.contentDomElement;
	}
	destroy() {
		// this.editor.off('selectionUpdate', this.han);
		this.contentDomElement = null;
	}
}

export function SvelteNodeViewRenderer(
	component: ComponentType<SvelteComponent<unknown, unknown>>,
	options: Partial<SvelteNodeViewRenderOptions>
): NodeViewRenderer {
	return (props) => {
		console.info('testing');
		if (!(props.editor as Editor).contentComponent) {
			console.info('double checking');
			return {};
		}
		return new SvelteNodeView(component, props, options) as unknown as ProseMirrorNodeView;
	};
}
