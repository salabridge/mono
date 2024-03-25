import { Editor } from '@tiptap/core';
import type { SvelteComponent, ComponentType } from 'svelte';
import { Editor as ExtendedEditor } from './editor';

export interface SvelteRendererOptions<P extends Record<string, any>> {
  editor: Editor;
  props?: P;
  attrs?: Record<string, string>;
}

export class SvelteRenderer<P extends Record<string, any> = Record<string, any>, E extends Record<string, any> = Record<string, any>, S extends Record<string, any> = Record<string, any>> {
  id: string;
  editor: ExtendedEditor;
  props: P;
  element: Element;
  svelteComponent: SvelteComponent<P, E, S>;

  constructor(component: SvelteComponent<P, E, S>, {
    editor,
    props = {} as P,
    attrs = {},
  }: SvelteRendererOptions<P>) {
    this.id = Math.floor(Math.random() * 0xFFFFFFFF).toString();
    this.editor = editor as ExtendedEditor;
    this.props = props;
    this.element = document.createElement('div');
    this.element.classList.add('svelte-renderer');
    this.svelteComponent = component;

    if(attrs) {
      Object.keys(attrs)
        .forEach(key => this.element.setAttribute(key, attrs[key]));
    }
    console.info('getting here?');
    this.render();
  }

  render() {
    const Bob = this.svelteComponent as unknown as ComponentType<SvelteComponent<P, E, S>>;
    const bb = new Bob({
      target: this.element,
      props: this.props
    });
    console.info('hi you', bb);
    this.svelteComponent = bb;
    this.editor?.contentComponent?.setRenderer(this.id, this);
  }

  updateprops(props: Record<string, any> = {}): void {
    this.props = {
      ...this.props,
      ...props,
    };
    this.render();
  }
  destroy(): void {
    this.editor?.contentComponent?.removeRenderer(this.id);
  }
}