<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import List from './List.svelte';

  // Globals
  const dispatch = createEventDispatcher();

  let _el;
  let visible = false;
  let _width;

  const toggle = () => {
    visible = !visible;
  };

  $: dispatch('toggle', visible);

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

<div class="relative">
  <div on:click={toggle} bind:this={_el} bind:clientWidth={_width}>
    <slot />
  </div>

  {#if visible}
    <div class="fixed z-10 h-screen w-screen top-0 left-0 md:hidden bg-dark dark:bg-light opacity-50" on:click={hide} />
    <div
      role="menu"
      class="fixed md:absolute z-10 left-0 top-0 md:top-auto p-10 md:p-0 h-screen md:h-auto w-screen md:w-auto"
      style="min-width: {_width ? `${_width}px` : '100%'};"
      on:click={hide}
    >
      <List
        class="
          h-full md:h-auto
          min-w-full
          p-5 md:p-0
          overflow-auto md:overflow-none
          border border-1 border-dark dark:border-light
          bg-light dark:bg-dark
        "
      >
        <slot name="items" />
      </List>
    </div>
  {/if}
</div>