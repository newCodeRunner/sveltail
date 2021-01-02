<script>
    import { onMount } from 'svelte';
    import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

    import languages from '~/src/i18n/index';
    import Image from './Image.svelte';
    import Loader from './Loader.svelte';

    import { getBoolean } from '../js/helpers';
  
    // i18n
    languages.forEach((lang) => {
      register(lang, () => import(`~/src/i18n/languages/${lang}.js`));
    });
    init({
      fallbackLocale: 'en',
      initialLocale: getLocaleFromNavigator(),
    });

    // Globals
    const platform = process.env.platform;
    let _fixedHeader;
    $: _fixedHeader = getBoolean($$props.fixedHeader);
    
    let headerHeight = 0;

    // Load Fonts
    onMount(() => {
      import('../js/fonts');
    });
  </script>
  
  <section id="st-notifier" class="relative z-10">
    <Loader>
      <slot name="loader">
        <Image class='mx-auto h-16 w-16 animate-bounce bg-loader' img="assets/logo.png" />
      </slot>
    </Loader>
    <slot name="utilities" />
  </section>
  
  <section class="{platform === 'Cordova' ? 'cordova' : ''} relative z-0 safe-area dark:bg-black dark:text-white">
    {#if _fixedHeader}
      <header bind:clientHeight={headerHeight} class="{platform === 'Cordova' ? 'bg-brand' : ''} safe-area-top w-screen">
        <slot name="header" />
      </header>
    {/if}
    <slot name="drawer" />
    <section class="w-screen overflow-auto" style="height: calc(100vh - {headerHeight}px);">
      {#if !_fixedHeader}
        <header class="{platform === 'Cordova' ? 'bg-brand' : ''} safe-area-top w-full">
          <slot name="header" />
        </header>
      {/if}
      <main class="w-full flex-wrap overflow-x-hidden">
        <slot />
      </main>
    </section>
    <footer>
      <slot name="footer" />
    </footer>
  </section>
  
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