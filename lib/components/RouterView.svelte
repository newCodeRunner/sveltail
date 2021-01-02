<script>
  // eslint-disable-next-line object-curly-newline
  import { afterUpdate } from 'svelte';

  import hooks from '~/src/router/hooks';
  import routes from '~/src/router/routes';

  import { setRouter, loader } from '../js/utilities';
  import { isFunction } from '../js/helpers';

  // Globals
  let Route = null;
  let currPath = null;
  let ready = false;
  let page;
  
  const beforeRouteUpdate = async (ctx, next) => {
    $loader.show();

    if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(async () => {
          const result = await isFunction(hooks.onBefore) ? hooks.onBefore() : true;
          if (result) next();
          else $loader.hide();
        });
      });
    }

    if (process.env.platform === 'ns-android' || process.env.platform === 'ns-ios') {
      const result = await isFunction(hooks.onBefore) ? hooks.onBefore() : true;
      if (result) next();
      else $loader.hide();
    }
  };

  const updateRoute = (ctx, next) => {
    const { path } = ctx;
    const routeIndex = routes.findIndex((i) => i.path === path);
    const { name } = routes[routeIndex > -1 ? routeIndex : routes.length - 1];
    import(`~/src/pages/${name}.svelte`).then((module) => {
      Route = module.default;
      currPath = path;
      next();
    });
  };

  const afterRouteUpdate = () => {
    isFunction(hooks.onAfter) ? hooks.onAfter() : true;;
  };

  const navigateTo = (path) => {
    if (path !== currPath) {
      if (routes.findIndex((i) => i.path === path) > -1) page.redirect(path);
      else navigateTo('/*');
    }
  };

  if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
    import('page').then((module) => {
      page = module.default;
      routes.forEach((navRoute) => {
        page(navRoute.path, beforeRouteUpdate, updateRoute, afterRouteUpdate);
      });

      page.base('/#');
      page();
      ready = true;
    });
  }

  if (process.env.platform === 'ns-android' || process.env.platform === 'ns-ios') {
    page = {
      redirect: async (path) => {
        Route = null;
        await beforeRouteUpdate(
          null,
          () => { updateRoute({ path }, afterRouteUpdate); },
        );
      },
    };
    ready = true;

    navigateTo('/');
  }

  const updateRouter = (path) => {
    $setRouter({
      currentPath: path,
      routes,
      navigateTo,
    });
  }

  $: updateRouter(currPath);

  afterUpdate(() => {
    $loader.hide();
  });
</script>

{#if ready}
  <svelte:component this={Route} />
{/if}