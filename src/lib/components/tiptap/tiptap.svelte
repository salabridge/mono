<script lang="ts">
 = $state()  import  = $state(){ onMount, onDestroy } from 'svelte'
  import { Editor } from '@tiptap/core'
  import StarterKit from '@tiptap/starter-kit'
  import { StepsNode, Steps } from './extension'

  let element: HTMLDivElement;
  let editor: Editor;
  let html: string;

  interface Props { editable?: boolean }

  let { editable = true }: Props = $props();


  // On mount, get everything setup
  onMount(() => {
    editor = new Editor({
      element: element,
      editable,
      extensions: [
        StarterKit,
        StepsNode,
        // Fuc
      ],
      content: `<p>Hello World! 🌍️ </p>
                <steps-node-sv>Hi Jim</steps-node-sv>
                `,
      onTransaction: () => {
        // force re-render so `editor.isActive` works as expected
        editor = editor
        console.info(editor.getHTML());
        html = editor.getHTML();
      },
    })
  });

  // On Destroy, clear the editor
  onDestroy(() => {
    if (editor) {
      editor.destroy()
    }
  });
</script>

{#if editor}
  <button onclick={() => editor.chain().focus().toggleStepNode().run()}
    class:active={editor.isActive('steps-node')}>
    Steps
  </button>
  <button
    onclick={() => editor.chain().focus().toggleHeading({ level: 1}).run()}
    class:active={editor.isActive('heading', { level: 1 })}
  >
    H1
  </button>
  <button
    onclick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
    class:active={editor.isActive('heading', { level: 2 })}
  >
    H2
  </button>
  <button onclick={() => editor.chain().focus().setParagraph().run()} class:active={editor.isActive('paragraph')}>
    P
  </button>
  <button onclick={() => {
    console.info(editor.getHTML(), editor.getText());
  }}>
    Save
  </button>
{/if}

<div bind:this={element} />

<style>
  button.active {
    background: black;
    color: white;
  }
  :global(.tiptap.ProseMirror) {
    border: 1px solid theme('borderColor.DEFAULT');
    padding: theme('spacing.2');
    border-radius: theme('borderRadius.lg');
  }
  :global(.tiptap h1) {
    font-size: 3em;
  }
</style>