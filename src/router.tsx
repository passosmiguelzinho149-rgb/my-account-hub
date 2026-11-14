import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

/**
 * Methods the route hot-update code expects on the router in development.
 * A browser holding an old cached copy of the router library can miss them,
 * which blanked the page on every edit; these fallbacks mirror the library.
 */
interface HotRouteChunk {
  lazyFn?: unknown;
  _lazy?: unknown;
}
interface HotRouterMethods {
  _replaceRouteChunk?: (route: HotRouteChunk, lazyFn?: unknown) => void;
  _refreshRoute?: () => Promise<void>;
}

function ensureHotUpdateMethods(router: { invalidate: () => Promise<void> }): void {
  if (!import.meta.hot) return;
  const hot = router as unknown as HotRouterMethods;
  if (typeof hot._replaceRouteChunk !== "function") {
    hot._replaceRouteChunk = (route, lazyFn) => {
      route.lazyFn = lazyFn ?? route.lazyFn;
      route._lazy = undefined;
    };
  }
  if (typeof hot._refreshRoute !== "function") {
    hot._refreshRoute = () => router.invalidate();
  }
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  ensureHotUpdateMethods(router);
  return router;
};
