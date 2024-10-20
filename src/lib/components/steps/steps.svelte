<script lang="ts">
	import NodeViewWrapper from "$lib/tiptap/nodeViewWrapper.svelte";
	import { onMount } from "svelte";
	import type { Editor } from "svelte-tiptap";
  interface Props { editor: Editor }

  let { editor }: Props = $props();
  onMount(() => {
    console.info(editor);
  })
</script>

<NodeViewWrapper>
  Hello jim
</NodeViewWrapper>