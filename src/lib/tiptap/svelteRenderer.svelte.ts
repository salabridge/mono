/* eslint-disable @typescript-eslint/no-explicit-any */
import { unmount } from 'svelte';
import type { NodeViewProps } from '@tiptap/core';

interface RendererOptions {
  element: HTMLElement;
}

class SvelteRenderer {
  component: Record<string, any>;

  dom: HTMLElement;

  constructor(component: Record<string, any>, { element }: RendererOptions) {
    this.component = component;
    this.dom = element;

    this.dom.classList.add('svelte-renderer');
  }

  updateProps(props: Partial<NodeViewProps>): void {
    this.component.$set(props);
  }

  destroy(): void {
    unmount(this.component);
  }
}

export default SvelteRenderer;