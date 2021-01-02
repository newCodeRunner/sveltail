<script>
  import { LayoutWeb, Bar, Drawer, RouterView, Alerter, Notifier} from 'sveltail';

  let leftDrawer;
  let rightDrawer;
</script>

<LayoutWeb fixedHeader>
  <RouterView />
  <div slot="utilities">
    <Alerter />
    <Notifier />
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
    <Drawer bind:this={leftDrawer} />
    <Drawer bind:this={rightDrawer} right />
  </div>
</LayoutWeb>