<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import Image from './Image.svelte';

  // Globals
  const dispatch = createEventDispatcher();
  let render = true;
  let show;
  let hide;

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

  onMount(() => {
    dispatch('ready', {
      loader: {
        show,
        hide,
      },
    });
  });
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
      <div class="fixed h-full w-full overflow-y-auto">
        <div class="w-full h-full flex items-center justify-center">
          <Image class='mx-auto h-16 w-16 animate-bounce bg-loader' img="assets/logo.png" />
        </div>
      </div>
    </div>
  {/if}
{/if}