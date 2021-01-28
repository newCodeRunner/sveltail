<script>
  import { createEventDispatcher  } from "svelte";
  import { getString, getBoolean } from '../js/helpers';

  const dispatch = createEventDispatcher();

  let _class, _right, _fullScreen, _noBackdrop, _persistant;

  $:  _class = getString($$props.class);
  $:  _right = getBoolean($$props.right);
  $: _fullScreen = getBoolean($$props.fullScreen);
  $: _noBackdrop = getBoolean($$props.noBackdrop);
  $: _persistant = getBoolean($$props.persistant);

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
    <div class='absolute z-20 top-0 left-0 {_fullScreen ? 'h-screen w-screen cordova safe-area' : 'h-full w-full'}'>
      {#if !_noBackdrop}
        <div class="absolute bg-dark dark:bg-light h-full w-full opacity-50" on:click={_persistant ? null : hide} />
      {/if}
      <aside
        in:fly="{{ x: _right ? 200 : -200, duration: 200 }}"
        out:fly="{{ x: _right ? 200 : -200, duration: 150 }}"
        class="absolute -w-12 sm:w-96 h-full bg-light dark:bg-dark {_right ? 'right-0' : ''} {_fullScreen ? 'safe-area-top' : ''}"
      >
        <div class="h-full w-full {_class}">
          <slot />
        </div>
      </aside>
    </div>
  {/if}
{/if}