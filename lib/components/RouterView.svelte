<script>
  // eslint-disable-next-line object-curly-newline
  import { afterUpdate } from 'svelte';
  import { writable } from 'svelte/store';

  import hooks from '~/src/router/hooks';
  import routes from '~/src/router/routes';
  
  import { isFunction, isObject } from '../js/helpers';

  // Globals
  let Route = null;
  let currPath = null;
  let page;

  const { loader } = $$props.context;
  
  const beforeRouteUpdate = async (ctx, next) => {
    if (isFunction($loader.show)) $loader.show();

    if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(async () => {
          const result = await isFunction(hooks.onBefore) ? hooks.onBefore() : true;
          if (result) next();
          else if (isFunction($loader.hide)) $loader.hide();
        });
      });
    }

    if (process.env.platform === 'ns-android' || process.env.platform === 'ns-ios') {
      const result = await isFunction(hooks.onBefore) ? hooks.onBefore() : true;
      if (result) next();
      else if (isFunction($loader.hide)) $loader.hide();
    }
  };

  const updateRoute = (ctx, next) => {
    const { path } = ctx;
    const routeIndex = routes.findIndex((i) => i.path === path);
    const { name } = routes[routeIndex > -1 ? routeIndex : routes.length - 1];
    Route = null;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        import(`~/src/pages/${name}.svelte`).then((module) => {
          Route = module.default;
          currPath = path;
          next();
        });
      });
    });
  };

  const afterRouteUpdate = () => {
    isFunction(hooks.onAfter) ? hooks.onAfter() : true;;
  };

  export const navigateTo = (path, afterNavigation) => {
    if (path !== currPath) {
      if (routes.findIndex((i) => i.path === path) > -1) {
        page.redirect(path);
        if (isFunction(afterNavigation)) afterNavigation();
      } else navigateTo('/*');
    }
  };

  if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
    import('page').then((module) => {
      page = module.default;
      routes.forEach((navRoute) => {
        page(navRoute.path, beforeRouteUpdate, updateRoute, afterRouteUpdate);
      });

      page.base('/#');
      window.location.href = window.location.href.split('/#')[0] + '/#';
      page();
    });
  }

  if (process.env.platform === 'ns-android' || process.env.platform === 'ns-ios') {
    page = {
      redirect: async (path) => {
        await beforeRouteUpdate(
          null,
          () => { updateRoute({ path }, afterRouteUpdate); },
        );
      },
    };
    navigateTo('/');
  }

  const createRouter = () => {
		const store = writable({
      currentPath: currPath,
      routes,
      navigateTo,
    });
		
		const set = (newPath) => {
      store.set({
        currentPath: newPath,
        routes,
        navigateTo,
      });
		};
		
		const update = (updateFunc) => {
      set(updateFunc(currPath))
    };
		
		return { ...store, set, update };
  };
  
  export const router = createRouter();

  $: router.set(currPath);
  $: if (isObject($$props.context)) $$props.context.router = router;

  afterUpdate(() => {
    if (isFunction($loader.hide)) $loader.hide();
  });
</script>

<svelte:component this={Route} />
