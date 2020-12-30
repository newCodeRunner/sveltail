<script>
    import { setContext, onMount } from 'svelte';
    import { register, init, getLocaleFromNavigator } from 'svelte-i18n';
  
    import languages from '~/src/i18n/index';
    import hooks from '~/src/router/hooks';
    import routes from '~/src/router/routes';

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
      mode: JSON.parse(process.env.PROD) ? 'prod' : 'dev',
      platform: process.env.platform,
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
    
    // Utilities
    let Alerter;
    let Notifier;
    let Toaster;
    let LocalStorage;

    onMount(() => {
      isReady = true;

      // Load Fonts
      import('../js/fonts');

      // Load Utilities
      const utilities = process.APP_ENV.utilities;
      import('../js/utilities').then((module) => {
        if (utilities.findIndex((i) => i === 'Alerter') > -1) Alerter = module.Alerter;
        if (utilities.findIndex((i) => i === 'Notifier') > -1) Notifier = module.Notifier;
        if (utilities.findIndex((i) => i === 'Toaster') > -1) Toaster = module.Toaster;
        if (utilities.findIndex((i) => i === 'LocalStorage') > -1) LocalStorage = module.LocalStorage;
      });
    });
  </script>
  
  <section id="st-notifier" class="relative z-10">
    <Loader on:ready={updateAppContext} />

    <svelte:component this={Alerter} on:ready={updateAppContext} />
    <svelte:component this={Notifier} on:ready={updateAppContext} />
    <svelte:component this={Toaster} on:ready={updateAppContext} />
    <svelte:component this={LocalStorage} on:ready={updateAppContext} />
  </section>
  
  {#if isReady}
    <section class="{app.platform === 'Cordova' ? 'cordova' : ''} relative z-0 safe-area dark:bg-black dark:text-white">
      {#if props.fixedHeader}
        <header bind:clientHeight={headerHeight} class="{app.platform === 'Cordova' ? 'bg-brand' : ''} safe-area-top w-screen">
          <slot name="header" />
        </header>
      {/if}
      <slot name="drawer" />
      <section class="w-screen overflow-auto" style="height: calc(100vh - {headerHeight}px);">
        {#if !props.fixedHeader}
          <header class="{app.platform === 'Cordova' ? 'bg-brand' : ''} safe-area-top w-full">
            <slot name="header" />
          </header>
        {/if}
        <main class="w-full flex-wrap overflow-x-hidden">
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
  
    :global(.cordova.safe-area) {
      padding-right: env(safe-area-inset-right, 20px);
      padding-bottom: env(safe-area-inset-bottom, 20px);
      padding-left: env(safe-area-inset-left, 20px);
    }
    :global(.cordova .safe-area-top) {
      padding-top: env(safe-area-inset-top, 20px);
    }

    :global(html) {
      overflow: hidden;
    }
  </style>