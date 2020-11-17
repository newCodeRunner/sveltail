<script>
  import { onMount, setContext } from 'svelte';

  import hooks from '../../src/router/hooks';
  import routes from '../../src/router/routes';
  import state from '../../src/store/state';

  import Loader from '../utilities/Loader.svelte';
  import Router from '../utilities/Router.svelte';

  import Header from '../../src/components/Header.svelte';

  import helpers from '../js/helpers';

  import '../../src-nativescript/node_modules/@nativescript/theme/css/core.css';
  import '../../src-nativescript/node_modules/@nativescript/theme/css/default.css';

  // Include Store and Utilities
  let app = {
    state,
    helpers,
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
    import('@fortawesome/fontawesome-free/webfonts/fa-brands-400.ttf');
    import('@fortawesome/fontawesome-free/webfonts/fa-regular-400.ttf');
    import('@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf');
  });
</script>

<page>
  <Header />
  <absoluteLayout>
    {#if isReady}
      <stackLayout>
        <Router onBefore={hooks.onBefore} onAfter={hooks.onAfter} routes={routes} on:ready={updateAppContext} />
      </stackLayout>
    {/if}
    <Loader on:ready={updateAppContext} />
  </absoluteLayout>
</page>

<style>
  :global(.fab) {
    font-family: "Font Awesome 5 Brands", "fa-brands-400";
    font-weight: 400;
  }
  :global(.far) {
    font-family: "Font Awesome 5 Free", "fa-regular-400";
    font-weight: 400;
  }
  :global(.fas) {
    font-family: "Font Awesome 5 Free", "fa-solid-900";
    font-weight: 900;
  }
</style>