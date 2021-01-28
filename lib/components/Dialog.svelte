<script>
  import { createEventDispatcher  } from "svelte";
  import { getString, getBoolean } from '../js/helpers';

  const dispatch = createEventDispatcher();

  let _class, _fullScreen, _persistant;
  $:  _class = getString($$props.class);
  $: _fullScreen = getBoolean($$props.fullScreen);
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

  let fade;
  if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
    import("svelte/transition").then((module) => {
      fade = module.fade;
    });
  }
</script>

{#if visible}
  {#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
    <div class='absolute z-20 h-screen w-screen top-0 left-0 cordova safe-area flex items-center'>
      <div class="fixed bg-dark dark:bg-light inset-0 opacity-50" on:click={_persistant ? null : hide} />
      <div
        in:fade="{{ duration: 200 }}"
        out:fade="{{ duration: 150 }}"
        class="relative safe-area-top bg-light dark:bg-dark {_fullScreen ? 'h-full w-full' : 'm-auto'} {_class}"
      >
        <slot />
      </div>
    </div>
  {/if}
{/if}