<script>
  import { getContext } from 'svelte';
  import List from './List.svelte';

  // Globals
  const { getArray, getNumber } = getContext('$$app').helpers;
  let _items, _width;

  $: _items = getArray($$props.items);
  $: _width = getNumber($$props.width, null);

  let visible = false;
  let height;
  const toggle = () => {
    visible = !visible;
  };

  export const show = () => {
    visible = true;
  };
  export const hide = () => {
    visible = false;
  };
</script>

<div class="relative focus:outline-none" on:blur={hide} tabindex="0">
  <div bind:clientHeight={height} on:click={toggle}>
    <slot />
  </div>
  {#if visible}
    <div class="fixed md:hidden z-10 bg-black dark:bg-white inset-0 opacity-50" on:click={hide} />
    <div
      class="fixed top-0 left-0 z-10 border border-1 border-black dark:border-white md:absolute md:h-auto"
      style={`transform: translateY(${height}px); width: ${_width ? `${_width}px`: '100%'};`}
    >
      <List items={_items} class="p-10 h-full overflow-auto md:p-0 md:h-auto md:overflow-none" on:itemClicked={hide} />
    </div>
  {/if}
</div>