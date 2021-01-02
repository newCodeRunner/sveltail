<script>
  import { onMount } from 'svelte';

  import Loader from './Loader.svelte';
  import RouterView from './RouterView.svelte';

  // App Ready
  let isReady = false;
  onMount(() => {
    isReady = true;

    // Load Fonts
    import('../js/fonts');
  });
</script>

<page>
  <slot name="header" />
  <absoluteLayout>
    {#if isReady}
      <stackLayout>
        <RouterView />
      </stackLayout>
    {/if}
    <Loader />
  </absoluteLayout>
</page>