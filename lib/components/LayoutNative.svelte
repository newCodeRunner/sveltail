<script>
  import { onMount, setContext } from 'svelte';

  import languages from '~/src/i18n/index';
  import hooks from '~/src/router/hooks';
  import routes from '~/src/router/routes';

  import helpers from '../js/helpers';

  import Loader from './Loader.svelte';
  import RouterView from './RouterView.svelte';

  // Include Store and Utilities
  let app = {
    languages,
    helpers: helpers(),
  };
  const updateAppContext = ({ detail }) => {
    app = Object.assign(app, detail);
  };
  $: setContext('$$app', app);

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
        <RouterView onBefore={hooks.onBefore} onAfter={hooks.onAfter} routes={routes} on:ready={updateAppContext} />
      </stackLayout>
    {/if}
    <Loader on:ready={updateAppContext} />
  </absoluteLayout>
</page>