<script>
  import Overlay from './Overlay.svelte';

  // State
  let dialogOpen = false;
  const fullscreen = $$props.fullscreen === undefined ? false : $$props.fullscreen;
  const toggleOverflow = () => {
    const html = document.querySelector('html');
    if (dialogOpen) html.classList.add('overflow-hidden');
    else html.classList.remove('overflow-hidden');
  };
  $: toggleOverflow(dialogOpen);
  export const show = () => {
    dialogOpen = true;
  };
  export const hide = () => {
    dialogOpen = false;
  };
</script>

{#if dialogOpen}
  <Overlay class="{fullscreen ? '' : 'pd-10'}" classInner="body-copy {fullscreen ? 'top-0 h-full w-full' : 'border rounded-lg'}">
    <div class='h-full w-full'><slot /></div>
  </Overlay>
{/if}