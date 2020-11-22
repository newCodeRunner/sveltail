<script>
  // eslint-disable-next-line object-curly-newline
  import { afterUpdate, getContext, createEventDispatcher, onMount } from 'svelte';

  // Globals
  const dispatch = createEventDispatcher();
  const { loader } = getContext('$$app');
  let Route = null;
  let currPath = null;
  let ready = false;
  let page;
  
  const beforeRouteUpdate = async (ctx, next) => {
    loader.show();

    if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(async () => {
          const result = await $$props.onBefore();
          if (result) next();
          else loader.hide();
        });
      });
    }

    if (process.env.platform === 'ns-android' || process.env.platform === 'ns-ios') {
      const result = await $$props.onBefore();
      if (result) next();
      else loader.hide();
    }
  };

  const updateRoute = (ctx, next) => {
    const { path } = ctx;
    const routeIndex = $$props.routes.findIndex((i) => i.path === path);
    const { name } = $$props.routes[routeIndex > -1 ? routeIndex : $$props.routes.length - 1];
    import(`../../src/pages/${name}.svelte`).then((module) => {
      Route = module.default;
      currPath = path;
      next();
    });
  };

  const afterRouteUpdate = () => {
    $$props.onAfter();
  };

  const navigateTo = (path) => {
    if (path !== currPath) {
      if ($$props.routes.findIndex((i) => i.path === path) > -1) page.redirect(path);
      else navigateTo('/*');
    }
  };

  if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
    import('page').then((module) => {
      page = module.default;
      $$props.routes.forEach((navRoute) => {
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

  onMount(() => {
    dispatch('ready', {
      router: {
        routes: $$props.routes,
        navigateTo,
      },
    });
  });

  afterUpdate(() => {
    loader.hide();
  });
</script>

{#if ready}
  {#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
    {#if Route}<Route />{/if}
  {/if}

  {#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
    <svelte:component this={Route} />
  {/if}
{/if}