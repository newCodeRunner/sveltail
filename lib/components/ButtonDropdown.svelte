<script>
  import { createEventDispatcher } from 'svelte';

  import Button from './Button.svelte';
  import Menu from './Menu.svelte';

  // Globals
  const dispatch = createEventDispatcher();
  const buttonProps = $$props;
  const { items } = $$props;
  let menuEL;

  delete buttonProps.items;
  const onClick = () => {
    dispatch('click');
  };
</script>

<Menu bind:this={menuEL} items={items}>
  <Button
    {...buttonProps}
    on:click={onClick}
  />
</Menu>