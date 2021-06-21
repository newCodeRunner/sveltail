// eslint-disable-next-line object-curly-newline
import page from 'page';

import { isFunction } from './helpers';

export default (routes, beforeNavigation, onNavigation) => {
  const router = {
    getCurrentPath: () => window.location.href.split('/#').pop(),
    getRouteObject: (path) => router.routes.filter((i) => i.path === path)[0],
    routes: routes.map((i) => ({ path: String(i.path), name: String(i.name) })),
    navigateTo(path) {
      if (routes.findIndex((i) => i.path === path) > -1) page(path);
      else throw new Error('The path has not been registered while initiating router.');
    },
  };

  page.base('/#');

  routes.forEach(({ path }) => {
    if (path) page(
      path,
      (ctx, next) => {
        if (isFunction(beforeNavigation)) beforeNavigation(Object.assign(router, ctx), next);
        else next();
      },
      (ctx, next) => {
        if (isFunction(onNavigation)) onNavigation(Object.assign(router, ctx), next);
        else next();
      });
  });

  page();

  return router;
};
