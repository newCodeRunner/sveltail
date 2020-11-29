<script>
  import { getContext } from 'svelte';
  import List from './List.svelte';

  // Globals
  const { helpers } = getContext('$$app');
  const props = {
    items: helpers.getArray($$props.items), 
    width: helpers.isNumber($$props.width) ? $$props.width : null,
  };
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
    <div
      class="fixed top-0 left-0 z-10 mt-1 h-2/3 border border-0 border-white dark:border-white md:absolute md:border-1 md:h-auto"
      style={`transform: translateY(${height}px); width: ${props.width ? `${props.width}px`: '100%'};`}
    >
      <List items={props.items} class="p-10 h-full overflow-auto md:p-0 md:h-auto md:overflow-none" on:itemClicked={hide} />
    </div>
  {/if}
</div>