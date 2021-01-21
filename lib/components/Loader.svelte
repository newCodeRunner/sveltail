<script>
  import { readable } from 'svelte/store';

  import Image from './Image.svelte';
  import { isObject, getString } from '../js/helpers';

  // Globals
  let render = true;
  let show;
  let hide;

  let _class;
  $: _class = getString($$props.class);

  // Native
  if (process.env.platform === 'ns-android' || process.env.platform === 'ns-ios') {
    show = () => {
      render = true;
    };
    hide = () => {
      render = false;
    };
  }

  // Web / Hybrid
  if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
    show = () => {
      const html = document.querySelector('html');
      html.classList.add('overflow-hidden');
      render = true;
    };
    hide = () => {
      const html = document.querySelector('html');
      html.classList.remove('overflow-hidden');
      render = false;
    };
  }
  export const loader = {
    show,
    hide,
  };
  if (isObject($$props.context)) {
    $$props.context.loader = readable(loader);
  }
</script>

{#if render}
  {#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
    <gridLayout  width="100%" height="100%">
      <Image img="assets/logo.png" />
    </gridLayout>
  {/if}

  {#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
    <div class='relative z-30 h-screen w-screen'>
      <div class="fixed inset-0 opacity-75" />
      <div class="fixed h-full w-full overflow-none">
        <div class="w-full h-full flex items-center justify-center {_class}">
          <slot />            
        </div>
      </div>
    </div>
  {/if}
{/if}