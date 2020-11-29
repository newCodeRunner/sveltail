<script>
  import { onMount } from 'svelte'
  import { get, set, getAll, setAll } from 'store2';

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