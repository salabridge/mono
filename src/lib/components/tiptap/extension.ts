import { SvelteNodeViewRenderer } from '$lib/tiptap/svelteNodeViewRenderer';
import { Extension, Node } from '@tiptap/core';
import StepsComponent from '$lib/components/steps/steps.svelte';

/**
 * @description Custom tiptap extensions
 */
export const Steps = Extension.create({
  name: 'Steps',
  addExtensions() {
      return [StepsNode]
  },
});

export const StepsNode = Node.create({
  name: 'steps-node-sv',
  group: 'block',
  content: 'block+',
  defining: true,

  parseHTML() {
    return [
      { tag: 'steps-node-sv' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    console.info('hi jim');
    return ['steps-node-sv', HTMLAttributes, 0];
  },

  addNodeView() {
    console.info('hi')
    return SvelteNodeViewRenderer(StepsComponent, {});
  },

  addCommands() {
    return {
      toggleStepNode: () => ({ commands }) => {
        return commands.toggleWrap(this.name);
      }
    }
  },
});

export const Step = Node.create({
  name: 'step-node',
  group: 'block',
  content: 'block+',
  defining: true,

  parseHTML() {
    return [
      { tag: 'step' }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['step', HTMLAttributes, 0];
  }
});


declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    'steps-node': {
      toggleStepNode: () => ReturnType,
    },
  }
}