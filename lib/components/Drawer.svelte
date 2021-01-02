<script>
  import { createEventDispatcher  } from "svelte";
  import { getString, getBoolean } from '../js/helpers';

  const dispatch = createEventDispatcher();

  let _class, _right;

  $:  _class = getString($$props.class);
  $:  _right = getBoolean($$props.right);

  const emitEvent = (vis) => {
    if (vis) dispatch('show'); 
    else dispatch('hide');
  }

  let visible = false;
  $: emitEvent(visible)

  export const show = () => {
    visible = true;
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
    <div class='absolute z-20 h-screen w-screen top-0 left-0 cordova safe-area'>
      <div class="fixed bg-black dark:bg-white inset-0 opacity-50" on:click={hide} />
      <aside
        in:fly="{{ x: _right ? 200 : -200, duration: 200 }}"
        out:fly="{{ x: _right ? 200 : -200, duration: 150 }}"
        class="fixed safe-area-top w-80 h-full bg-white text-black dark:bg-black dark:text-white {_right ? 'right-0' : ''}"
      >
        <div class="h-full w-full p-5 {_class}">
          <slot />
        </div>
      </aside>
    </div>
  {/if}
{/if}