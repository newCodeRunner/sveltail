<script>
  import { createEventDispatcher } from 'svelte';

  import Button from './Button.svelte';
  import Menu from './Menu.svelte';

  // Globals
  const dispatch = createEventDispatcher();

  const onClick = () => {
    dispatch('click');
  };
</script>

<Menu>
  <div slot="items">
    <slot />
  </div>
  <Button label={$$props.label} size={$$props.size} on:click={onClick} />
</Menu>