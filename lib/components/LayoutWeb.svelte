<script>
    import { setContext, onMount } from 'svelte';
    import { register, init, getLocaleFromNavigator } from 'svelte-i18n';
  
    import languages from '~/src/i18n/index';
    import hooks from '~/src/router/hooks';
    import routes from '~/src/router/routes';
    import state from '~/src/store/state';

    import helpers from '../js/helpers';
  
    import Loader from './Loader.svelte';
    import RouterView from './RouterView.svelte';
  
    // i18n
    languages.forEach((lang) => {
      register(lang, () => import(`~/src/i18n/languages/${lang}.js`));
    });
    init({
      fallbackLocale: 'en',
      initialLocale: getLocaleFromNavigator(),
    });
  
    // Include Store and Utilities
    let app = {
      mode: process.env.PROD ? 'prod' : 'dev',
      platform: process.env.platform,
      state,
      languages,
      helpers: helpers(),
    };
    const updateAppContext = ({ detail }) => {
      app = Object.assign(app, detail);
    };
    $: setContext('$$app', app);

    // Globals
    const props = {
      fixedHeader: app.helpers.getBoolean($$props.fixedHeader), 
    };
  
    // App Ready
    let isReady = false;
    let headerHeight = 0;
    onMount(() => {
      isReady = true;

      // Load Fonts
      import('../js/fonts');
    });
  </script>
  
  <section class="relative z-10">
    <Loader on:ready={updateAppContext} />
  </section>
  
  {#if isReady}
    <section class="{app.platform === 'Cordova' ? 'cordova' : ''} safe-area dark:bg-black dark:text-white">
      {#if props.fixedHeader}
        <header bind:clientHeight={headerHeight} class="{app.platform === 'Cordova' ? 'bg-brand' : ''} safe-area-top w-screen">
          <slot name="header" />
        </header>
      {/if}
      <aside>
        <slot name="right-drawer" />
        <slot name="left-drawer" />
      </aside>
      <section class="relative z-0 w-screen overflow-auto" style="height: calc(100vh - {headerHeight}px);">
        {#if !props.fixedHeader}
          <header class="{app.platform === 'Cordova' ? 'bg-brand' : ''} safe-area-top w-full">
            <slot name="header" />
          </header>
        {/if}
        <main>
          <RouterView onBefore={hooks.onBefore} onAfter={hooks.onAfter} routes={routes} on:ready={updateAppContext}  />
        </main>
      </section>
      <footer>
        <slot name="footer" />
      </footer>
    </section>
  {/if}
  
  <style>
    @import "tailwindcss/base";
    @import "tailwindcss/components";
    @import "tailwindcss/utilities";

    @import "../css/effects.css";
  
    .cordova.safe-area {
      padding-right: env(safe-area-inset-right, 20px);
      padding-bottom: env(safe-area-inset-bottom, 20px);
      padding-left: env(safe-area-inset-left, 20px);
    }
    .cordova .safe-area-top {
      padding-top: env(safe-area-inset-top, 20px);
    }

    :global(html) {
      overflow: hidden;
    }
  </style>