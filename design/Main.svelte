<script>
  import { setContext } from 'svelte';

  import Loader from '../lib/components/Alerter.svelte';
  import Alerter from '../lib/components/Alerter.svelte';
  import Notifier from '../lib/components/Notifier.svelte';
  import Bar from '../lib/components/Bar.svelte';
  import Drawer from '../lib/components/Drawer.svelte';

  import 'tailwindcss/tailwind.css';

  import '../lib/css/helpers.css';
  import '../lib/css/effects.css';
  import '../lib/css/base.css';

  import '../lib/css/bulma.css';

  let _headerHeight = 0;
  let leftDrawer;

  // Make a Global Context for all Svelte Components
  const app = {
    // This will be automatically updated by utilities you load, just pass it as a prop in context
  };

  $: setContext('$$app', app);  
</script>

<section class="relative z-10">
  <Loader context={app}>
    <div class="mx-auto">
      <div class="text-dark dark:text-light">Loading...</div>
    </div>
  </Loader>
  <Alerter context={app} />
  <Notifier context={app} />
</section>

<section class="relative z-0 safe-area bg-light text-dark dark:bg-dark dark:text-light">
  <header bind:clientHeight={_headerHeight} class="bg-primary safe-area-top w-screen">
    <Bar
      class="bg-brand text-light"
      title="Sveltail Designer"
      leftMenu
      on:leftMenuClicked={() => leftDrawer.toggle()}
    />
  </header>
  <Drawer bind:this={leftDrawer} fullScreen class="p-5">
    Hello World
  </Drawer>
  <section class="w-screen overflow-auto" style="height: calc(100vh - {_headerHeight}px);">
    <main class="w-full flex-wrap overflow-x-hidden p-4">
      <div class="block">
        <button class="button is-large is-primary">Button</button>
      </div>
      <div class="block">
        <a class="button">Anchor</a>
        <button class="button">Button</button>
        <input class="button" type="submit" value="Submit input">
        <input class="button" type="reset" value="Reset input">
      </div>
      <div class="block">
        <button class="button is-white">White</button>
        <button class="button is-light">Light</button>
        <button class="button is-dark">Dark</button>
        <button class="button is-black">Black</button>
        <button class="button is-text">Text</button>
        <button class="button is-ghost">Ghost</button>
      </div>
      <div class="block">
        <div class="buttons">
          <button class="button is-primary">Primary</button>
          <button class="button is-link">Link</button>
        </div>
        
        <div class="buttons">
          <button class="button is-info">Info</button>
          <button class="button is-success">Success</button>
          <button class="button is-warning">Warning</button>
          <button class="button is-danger">Danger</button>
        </div>

        <div class="buttons">
          <button class="button is-primary is-light">Primary</button>
          <button class="button is-link is-light">Link</button>
        </div>
        
        <div class="buttons">
          <button class="button is-info is-light">Info</button>
          <button class="button is-success is-light">Success</button>
          <button class="button is-warning is-light">Warning</button>
          <button class="button is-danger is-light">Danger</button>
        </div>
      </div>
      <div class="block">
        <button class="button is-small">Small</button>
        <button class="button">Default</button>
        <button class="button is-normal">Normal</button>
        <button class="button is-medium">Medium</button>
        <button class="button is-large">Large</button>
      </div>
      <div class="buttons are-medium">
        <button class="button">All</button>
        <button class="button">Medium</button>
        <button class="button">Size</button>
      </div>
      <div class="buttons are-small">
        <button class="button">Small</button>
        <button class="button">Small</button>
        <button class="button">Small</button>
        <button class="button is-normal">Normal</button>
        <button class="button">Small</button>
      </div>
      <div class="block">
        <button class="button is-small is-fullwidth">Small</button>
        <button class="button is-fullwidth">Normal</button>
        <button class="button is-medium is-fullwidth">Medium</button>
        <button class="button is-large is-fullwidth">Large</button>
      </div>
      <div class="block">
        <button class="button is-loading">Loading</button>
        <button class="button is-primary is-loading">Loading</button>
        <button class="button is-link is-loading">Loading</button>
        <button class="button is-info is-loading">Loading</button>
        <button class="button is-success is-loading">Loading</button>
        <button class="button is-warning is-loading">Loading</button>
        <button class="button is-danger is-loading">Loading</button>
      </div>
    </main>
  </section>
  <footer>
  </footer>
</section>
