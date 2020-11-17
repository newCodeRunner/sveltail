<script>
import Overlay from './Overlay.svelte';

// Internal
let drawerOpen = false;
const position = $$props.position === undefined || ['left', 'right'].find((i) => i === $$props.position) < 0 ? 'left' : $$props.position;
const toggleOverflow = () => {
  const html = document.querySelector('html');
  if (drawerOpen) html.classList.add('overflow-hidden');
  else html.classList.remove('overflow-hidden');
};
$: toggleOverflow(drawerOpen);

export const show = () => {
  drawerOpen = true;
};
export const hide = () => {
  drawerOpen = false;
};
</script>

{#if drawerOpen}
  <Overlay
    slide
    reverse={position === 'left'}
    classInner="h-full w-64 inset-y-0 {position}-0 body-copy"
    on:bgClicked={() => { drawerOpen = false; }}
  >
    <div class='h-full w-full'>
      <slot />
    </div>
  </Overlay>
{/if}