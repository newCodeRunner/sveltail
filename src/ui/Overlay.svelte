<script>
  import { fade, fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

  // Global
  const dispatch = createEventDispatcher();
  const slide = $$props.slide === undefined ? fade : fly;
  const reverse = $$props.reverse === undefined ? false : $$props.reverse;
  const backdropColor = $$props.backdropColor === undefined ? 'gray-300' : $$props.backdropColor;
  const noBackdrop = $$props.noBackdrop === undefined ? false : $$props.noBackdrop;

  const props = $$props;
</script>

<div class='relative z-30 h-screen w-screen {props.class}'>
  {#if noBackdrop === false}
    <div class="fixed inset-0 bg-{backdropColor} opacity-75" on:click={() => dispatch('bgClicked')} />
  {/if}
  <div
    in:slide={{ x: reverse ? -100 : 100, duration: 250 }}
    class="fixed h-full w-full overflow-y-auto {props.classInner}"
  >
    <slot />
  </div>
</div>
