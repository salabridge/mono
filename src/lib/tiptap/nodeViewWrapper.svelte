<script lang="ts">
  impor = $state()t { getContext, onMount, tick } from 'svelte';

  import { TIPTAP_NODE_VIEW } from './context';
  import type { TiptapNodeViewContext } from './types';

  const { onDragStart } = getContext<TiptapNodeViewContext>(TIPTAP_NODE_VIEW);
  let element: HTMLElement;
  interface Props { [key: string]: any }

  let { as = 'div', children, ...rest }: Props = $props();

  onMount(async () => {
    await tick();
    element.style.whiteSpace = 'normal';
  });
</script>

<svelte:element
  this={as}
  bind:this={element}
  data-node-view-wrapper=""
  ondragstart={onDragStart}
  role="none"
  {...rest}
>
  {@render children?.()}
</svelte:element>