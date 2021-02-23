<script>
  import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

  import languages from '~/src/i18n/index';
  import { getBoolean, getString, getColor } from '../js/helpers';

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
  let _fixedHeader, _mainClass, _headerColor;
  $: _fixedHeader = getBoolean($$props.fixedHeader);
  $: _mainClass = getString($$props.mainClass);
  $: _headerColor = getColor($$props.headerColor, 'transparent');
  
  let _headerHeight = 0;
</script>

<section id="st-notifier" class="relative z-10">
  <slot name="loader" />
  <slot name="utilities" />
</section>

<section class="{platform === 'Cordova' ? 'cordova' : ''} relative z-0 safe-area bg-light text-dark dark:bg-dark dark:text-light">
  {#if _fixedHeader}
    <header bind:clientHeight={_headerHeight} class="bg-{_headerColor} safe-area-top w-screen">
      <slot name="header" />
    </header>
  {/if}
  <slot name="drawer" />
  <section class="w-screen overflow-auto" style="height: calc(100vh - {_headerHeight}px);">
    {#if !_fixedHeader}
      <header class="bg-{_headerColor} safe-area-top w-full">
        <slot name="header" />
      </header>
    {/if}
    <main class="w-full flex-wrap overflow-x-hidden {_mainClass}">
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
  @import "../css/helpers.css";

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