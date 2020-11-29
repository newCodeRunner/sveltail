<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import { get, set, getAll, setAll } from 'store2';

  const dispatch = createEventDispatcher();

  onMount(() => {
    dispatch('ready', {
      localStorage: {
        get,
        set,
        getAll,
        setAll,
      },
    });
  });
</script>

<div />