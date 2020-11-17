<script>
  import { setContext, onMount } from 'svelte';
  import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

  import languages from '../../src/i18n/index';
  import appUtilities from '../../src/framework/utilities';
  import hooks from '../../src/router/hooks';
  import routes from '../../src/router/routes';
  import state from '../../src/store/state';

  import Loader from '../utilities/Loader.svelte';
  import Router from '../utilities/Router.svelte';

  import Header from '../../src/components/Header.svelte';
  import Footer from '../../src/components/Footer.svelte';
  import Drawer from '../../src/components/Drawer.svelte';

  import helpers from '../js/helpers';

  // i18n
  languages.forEach((lang) => {
    register(lang, () => import(`../../src/i18n/languages/${lang}.js`));
  });
  init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator(),
  });

  // Include Store and Utilities
  let app = {
    state,
    languages,
    helpers,
  };
  const updateAppContext = ({ detail }) => {
    app = Object.assign(app, detail);
  };
  $: setContext('$$app', app);

  // App Ready
  const utilities = [];
  let isReady = false;
  onMount(() => {
    isReady = true;
    appUtilities.forEach((utility) => {
      import(`../utilities/${utility}.svelte`).then((module) => {
        utilities.push(module.default);
      });
    });

    // Load Fonts
    import('@fortawesome/fontawesome-free/sprites/brands.svg');
    import('@fortawesome/fontawesome-free/sprites/regular.svg');
    import('@fortawesome/fontawesome-free/sprites/solid.svg');
  });
</script>

<section class="relative z-10">
  <Loader on:ready={updateAppContext} />
  {#each utilities as util}
    <svelte:component this={util} on:ready={updateAppContext} />
  {/each}
</section>

{#if isReady}
  <section class="safe-area">
    <header class="bg-brand safe-area-top"><Header /></header>
    <div class="h-16" />
    <aside><Drawer /></aside>
    <main class="relative z-0">
      <Router onBefore={hooks.onBefore} onAfter={hooks.onAfter} routes={routes} on:ready={updateAppContext}  />
    </main>
    <footer><Footer /></footer>
  </section>
{/if}

<style>
  @import "tailwindcss/base";
  @import "tailwindcss/components";
  @import "tailwindcss/utilities";

  .safe-area {
    padding-right: env(safe-area-inset-right, 20px);
    padding-bottom: env(safe-area-inset-bottom, 20px);
    padding-left: env(safe-area-inset-left, 20px);
  }
  .safe-area-top {
    padding-top: env(safe-area-inset-top, 20px);
  }
</style>