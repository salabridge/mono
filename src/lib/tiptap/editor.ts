import type { SvelteComponent } from 'svelte';
import { Editor as CoreEditor, type EditorOptions } from '@tiptap/core';
import type { SvelteRenderer } from './svelteRenderer';

export class Editor extends CoreEditor {
  constructor(options: Partial<EditorOptions>) {
    super(options);
  }
  contentComponent: SvelteComponent & {
    setRenderer(id: string, renderer: SvelteRenderer): void;
    removeRenderer(id: string): void;
  } | null = null;
}
