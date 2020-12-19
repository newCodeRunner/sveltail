<script>
  import { createEventDispatcher, getContext,  } from "svelte";

  const dispatch = createEventDispatcher();
  const { helpers } = getContext('$$app');
  const props = {
    class: helpers.isString($$props.class) ? $$props.class : '',
    right: helpers.getBoolean($$props.right),
  };
  const emitEvent = (vis) => {
    if (vis) dispatch('show'); 
    else dispatch('hide');
  }

  let visible = false;
  $: emitEvent(visible)

  export const show = () => {
    visible = true;
    dispatch('show');
  };
  export const hide = () => {
    visible = false;
  };
  export const toggle = () => {
    visible = !visible;
  };

  let fly;
  if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
    import("svelte/transition").then((module) => {
      fly = module.fly;
    });
  }
</script>

{#if visible}
  {#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
    <div class='absolute z-20 h-screen w-screen top-0 left-0'>
      <div class="fixed bg-black dark:bg-white inset-0 opacity-50" on:click={hide} />
      <aside
        in:fly="{{ x: props.right ? 200 : -200, duration: 200 }}"
        out:fly="{{ x: props.right ? 200 : -200, duration: 150 }}"
        class="fixed w-80 h-full bg-white text-black dark:bg-black dark:text-white {props.right ? 'right-0' : ''}"
      >
        <div class="h-full w-full p-5 {props.class}">
          Hello World
        </div>
      </aside>
    </div>
  {/if}
{/if}