<script>
  import { createEventDispatcher } from 'svelte';

  import Button from './Button.svelte';
  import Menu from './Menu.svelte';

  // Globals
  const dispatch = createEventDispatcher();
  const _buttonProps = $$props;

  const onClick = () => {
    dispatch('click');
  };
</script>

<Menu>
  <Button
    {..._buttonProps}
    on:click={onClick}
  />
  <div slot="items">
    <slot />
  </div>
</Menu>