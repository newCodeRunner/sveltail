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
    <main class="w-full flex-wrap overflow-x-hidden">
      Hello World
    </main>
  </section>
  <footer>
  </footer>
</section>
