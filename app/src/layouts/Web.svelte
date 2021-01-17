<script>
  import { setContext } from 'svelte';
  import { LayoutWeb, Bar, Drawer, RouterView, Alerter, Notifier, Loader, LocalStorage, Image } from 'sveltail';

  let leftDrawer;
  let rightDrawer;
  
  // Make a Global Context for all Svelte Components
  const app = {
    // This will be automatically updated by utilities you load, just pass it as a prop in context
  };

  $: setContext('$$app', app);
</script>

<LayoutWeb fixedHeader>
  <div slot="loader">
    <Loader context={app}>
      <Image class='mx-auto h-16 w-16 animate-bounce bg-loader' img="assets/logo.png" />
    </Loader>
  </div>

  <div slot="utilities">
    <Alerter context={app} />
    <Notifier context={app} />
  </div>

  <div slot="header">
    <Bar
      img="logo.png"
      title="Sveltail Cross Platform App"
      leftMenu
      rightMenu
      dense
      on:leftMenuClicked={() => leftDrawer.toggle()}
      on:rightMenuClicked={() => rightDrawer.toggle()}
    />
  </div>

  <div slot="drawer">
    <Drawer bind:this={leftDrawer} fullScreen />
    <Drawer bind:this={rightDrawer} right fullScreen />
  </div>

  <RouterView context={app} />

  <div slot="footer" />
</LayoutWeb>