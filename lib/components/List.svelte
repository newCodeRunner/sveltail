<script>
  import { createEventDispatcher } from 'svelte';
  import { getString } from '../js/helpers';

  // Globals
  const dispatch = createEventDispatcher();
  const onClick = () => {
    dispatch('click');
  };

  let _class;
  $: _class = getString($$props.class);
</script>

<ul class="bg-white text-black dark:bg-black dark:text-white {_class}" on:click={onClick}>
  <slot />
</ul>
