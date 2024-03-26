<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { Editor } from '@tiptap/core'
  import StarterKit from '@tiptap/starter-kit'
  import { StepsNode, Steps } from './extension'

  let element: HTMLDivElement;
  let editor: Editor;
  let html: string;

  $: console.info(html);

  // On mount, get everything setup
  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [
        StarterKit,
        Steps,
        // Fuc
      ],
      content: `<h1>Boobs</h1>\n<p>Hello World! 🌍️ </p>
                <steps>
                  <steps-node-sv>Hi Jim</steps-node-sv>
                  <steps-node-sv>Penis</steps-node-sv>
                  <steps-node-sv>Boobies</steps-node-sv>
                </steps>
                `,
      onTransaction: () => {
        // force re-render so `editor.isActive` works as expected
        editor = editor
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
  <button on:click={() => editor.chain().focus().toggleStepNode().run()}
    class:active={editor.isActive('steps-node')}>
    Steps
  </button>
  <button
    on:click={() => editor.chain().focus().toggleHeading({ level: 1}).run()}
    class:active={editor.isActive('heading', { level: 1 })}
  >
    H1
  </button>
  <button
    on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
    class:active={editor.isActive('heading', { level: 2 })}
  >
    H2
  </button>
  <button on:click={() => editor.chain().focus().setParagraph().run()} class:active={editor.isActive('paragraph')}>
    P
  </button>
  <button on:click={() => {
    console.info(editor.getHTML(), editor.getText());
  }}>
    Save
  </button>
{/if}

<div bind:this={element} />

<div>
  this is raw HTML
  {@html html}
</div>

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