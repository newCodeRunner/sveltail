<script>
  import { onMount } from 'svelte';
  import List from './List.svelte';
  import { getArray, getNumber } from '../js/helpers';

  // Globals
  let _width;
  $: _width = getNumber($$props.width, null);

  let _el;
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

  onMount(() => {
    const outsideClick = (evt) => {
      if (!_el.contains(evt.target) && !evt.defaultPrevented) {
        hide();
      }
    };

    document.addEventListener('click', outsideClick);

    return () => {
      document.removeEventListener('click', outsideClick);
    };
  });
</script>

<div bind:this={_el} class="relative focus:outline-none">
  <div bind:clientHeight={height} on:click={toggle}>
    <slot />
  </div>
  {#if visible}
    <div class="fixed md:hidden z-10 bg-dark dark:bg-light inset-0 opacity-50" on:click={hide} />
    <div
      class="fixed top-0 left-0 z-10 border border-1 border-black dark:border-white md:absolute md:h-auto"
      style={`transform: translateY(${height}px); width: ${_width ? `${_width}px`: '100%'};`}
    >
      <List class="p-10 h-full overflow-auto md:p-0 md:h-auto md:overflow-none" on:click={hide}>
        <div class="h-full">
          <slot name="items" />
        </div>
      </List>
    </div>
  {/if}
</div>