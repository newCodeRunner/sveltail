<script>
  // eslint-disable-next-line object-curly-newline
  import { createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';

  import hooks from '~/src/router/hooks';
  import routes from '~/src/router/routes';
  
  import { isFunction, isObject } from '../js/helpers';

  if (process.env.platform === 'Electron') {
    const onLoad = () => {
      navigateTo('/');
      window.removeEventListener('load', onLoad);
    };
    window.addEventListener('load', onLoad);
  }

  // Globals
  const dispatch = createEventDispatcher();

  let Route = null;
  let currPath = null;
  let page;

  let navigateResolve = null;
  let navigateReject = null;
  let navigateCallback = null;

  const { loader } = $$props.context;

  const reset = () => {
    navigateResolve = null;
    navigateReject = null;
    navigateCallback = null;
  };
  
  const beforeRouteUpdate = (ctx, next) => {
    if (isFunction($loader.show)) $loader.show();

    if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(async () => {
          const result = isFunction(hooks.onBefore) ? hooks.onBefore() : true;
          if (result) next();
          else {
            navigateReject();
            reset();
            if (isFunction($loader.hide)) $loader.hide();
          }
        });
      });
    }

    if (process.env.platform === 'ns-android' || process.env.platform === 'ns-ios') {
      const result = isFunction(hooks.onBefore) ? hooks.onBefore() : true;
      if (result) next();
      else {
        navigateReject();
        reset();
        if (isFunction($loader.hide)) $loader.hide();
      }
    }
  };

  const updateRoute = (ctx, next) => {
    const { path } = ctx;
    const routeIndex = routes.findIndex((i) => i.path === path);
    const { name } = routes[routeIndex > -1 ? routeIndex : routes.length - 1];
    Route = null;

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        import(`~/src/pages/${name}.svelte`)
          .then((module) => {
            Route = module.default;
            currPath = path;
            next();
          })
          .catch((err) => {
            navigateReject(new Error('Unable to load page.'));
            reset();
            if (isFunction($loader.hide)) $loader.hide();
          });
      });
    });
  };

  const afterRouteUpdate = () => {
    if (isFunction(hooks.onAfter)) hooks.onAfter();
    if (isFunction(navigateCallback)) navigateCallback();

    if (navigateResolve) navigateResolve();
    reset();
    if (isFunction($loader.hide)) $loader.hide();

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        dispatch("updated", currPath);
      });
    });
  };

  export const navigateTo = (path, afterNavigation) => new Promise((resolve, reject) => {
    if (!navigateResolve && !navigateReject && !navigateCallback) {
      if (path !== currPath) {
        const foundIndex = routes.findIndex((i) => i.path === path);

        navigateResolve = resolve;
        navigateReject = reject;
        if (isFunction(afterNavigation)) navigateCallback = afterNavigation;

        if (foundIndex > -1) page.redirect(path);
        else page.redirect('/*');
      } else {
        console.warn('Router can not redirect to same path.');
        reject();
      }
    } else reject(new Error('Router busy.'));
  });

  if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
    import('page').then((module) => {
      page = module.default;
      
      page.base('/#');
      
      routes.forEach((navRoute) => {
        if (navRoute.path) page(navRoute.path, beforeRouteUpdate, updateRoute, afterRouteUpdate);
      });
      
      page();
    });
  }

  if (process.env.platform === 'ns-android' || process.env.platform === 'ns-ios') {
    page = {
      redirect: (path) => new Promise((resolve, reject) => {
        navigateResolve = resolve;
        navigateReject = reject;
        beforeRouteUpdate(
          null,
          () => { updateRoute({ path }, afterRouteUpdate); },
        );
      }),
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
</script>

<svelte:component this={Route} />
