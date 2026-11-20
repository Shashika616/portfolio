import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** True after hydration on the client, false during SSR. No effect + setState round-trip. */
export function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/** Read a query-string flag on the client (false during SSR). */
export function useQueryFlag(name: string, value: string) {
  return useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).get(name) === value,
    () => false
  );
}
