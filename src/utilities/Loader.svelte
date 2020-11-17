<script>
  import { createEventDispatcher, onMount } from 'svelte';

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
  let Overlay;
  let Image;
  if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
    import('../ui/Overlay.svelte').then((module) => {
      Overlay = module.default;
    });
    import('../ui/Image.svelte').then((module) => {
      Image = module.default;
    });

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
      <image src="" />
    </gridLayout>
  {/if}

  {#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
    <svelte:component this={Overlay}>
      <div class="w-full h-full flex items-center justify-center">
        <svelte:component this={Image} class='mx-auto h-16 w-16 animate-bounce bg-loader' img="assets/logo.png" />
      </div>
    </svelte:component>
  {/if}
{/if}