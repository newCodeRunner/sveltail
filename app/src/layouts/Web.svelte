<script>
  import { LayoutWeb, Bar, Drawer, RouterView } from 'sveltail';

  import hooks from '../router/hooks';
  import routes from '../router/routes';

  import { router } from '../store/state.js';
  
  const updateRouter = (val) => {
    router.set(val);
  };

  let leftDrawer;
  let rightDrawer;
</script>

<LayoutWeb fixedHeader>
  <RouterView onBefore={hooks.onBefore} onAfter={hooks.onAfter} routes={routes} on:ready={updateRouter}  />
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