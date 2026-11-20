/**
 * In-memory flag for "go straight to the dial" on client-side navigation
 * (e.g. Menu → The Dial). Being in memory, it is gone on any reload, so a
 * refresh always starts from the intro. Nothing about it lives in the URL.
 */
export const introGate = { skipNext: false };

export function goToDial(push: (href: string) => void) {
  introGate.skipNext = true;
  push("/");
}

/**
 * Runs inline in <head> before first paint:
 * - a reload of any page other than "/" restarts the experience at "/";
 * - leftover query strings on "/" (old ?view=dial links) are dropped;
 * - the browser does not restore the previous scroll position.
 * Direct visits to a shared /profile link are unaffected (not a reload).
 */
export const RESTART_ON_RELOAD_SCRIPT = `(function(){try{
  if('scrollRestoration' in history) history.scrollRestoration='manual';
  var n=performance.getEntriesByType('navigation')[0];
  var reload=n&&n.type==='reload';
  if(reload&&location.pathname!=='/'){location.replace('/');return;}
  if(location.pathname==='/'&&location.search){history.replaceState(null,'','/');}
  window.scrollTo(0,0);
}catch(e){}})();`;

/** In-memory hand-off between /gallery and /profile (client navigation only). */
export const viewGate: { galleryMode: "collage" | "grid" | null; scrollToWork: boolean } = {
  galleryMode: null,
  scrollToWork: false,
};

export function handOffGalleryMode(mode: "collage" | "grid") { viewGate.galleryMode = mode; }
export function takeGalleryMode(): "collage" | "grid" | null { const m = viewGate.galleryMode; viewGate.galleryMode = null; return m; }
export function requestScrollToWork() { viewGate.scrollToWork = true; }
export function takeScrollToWork(): boolean { const v = viewGate.scrollToWork; viewGate.scrollToWork = false; return v; }
export function clearIntroSkip() { introGate.skipNext = false; }
