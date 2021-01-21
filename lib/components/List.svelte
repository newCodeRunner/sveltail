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

<ul class="bg-light text-dark dark:bg-dark dark:text-light {_class}" on:click={onClick}>
  <slot />
</ul>
