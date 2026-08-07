/** Light screen surface (home, settings, onboarding). */
export const CHROME_PEACH = "#fff8f6";
/** Full-bleed dark/purple surface (splash). */
export const CHROME_PURPLE = "#5c4d9a";

export type ScreenSurface = "light" | "dark";

export type ScreenChromeOptions = {
  /** Visual surface under the translucent / system status bar. */
  surface: ScreenSurface;
};

function paintSolid(el: HTMLElement, background: string): void {
  el.style.backgroundColor = background;
  el.style.backgroundImage = "none";
  el.style.background = background;
}

function removeLegacyTints(): void {
  document.getElementById("sip-safari-tint-top")?.remove();
  document.getElementById("sip-safari-tint-bottom")?.remove();
}

/**
 * Apply status-bar / document chrome for the *currently visible* screen.
 * Call from that screen only — never from a root navigator with a shared color.
 *
 * - light → peach under status bar; `color-scheme: light` (dark glyphs when supported)
 * - dark  → purple under status bar; `color-scheme: dark` (light glyphs)
 *
 * Both use `black-translucent` so the screen surface can paint edge-to-edge.
 */
export function applyScreenChrome({ surface }: ScreenChromeOptions): void {
  if (typeof document === "undefined") return;

  const background = surface === "dark" ? CHROME_PURPLE : CHROME_PEACH;

  document.documentElement.dataset.screenSurface = surface;
  document.documentElement.style.colorScheme =
    surface === "dark" ? "dark" : "light";
  document.documentElement.style.setProperty("--app-chrome", background);
  paintSolid(document.documentElement, background);
  if (document.body) paintSolid(document.body, background);
  removeLegacyTints();

  const metas = document.querySelectorAll('meta[name="theme-color"]');
  if (metas.length === 0) {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    meta.setAttribute("content", background);
    document.head.appendChild(meta);
  } else {
    metas.forEach((meta) => meta.setAttribute("content", background));
  }

  let statusMeta = document.querySelector(
    'meta[name="apple-mobile-web-app-status-bar-style"]',
  );
  if (!statusMeta) {
    statusMeta = document.createElement("meta");
    statusMeta.setAttribute("name", "apple-mobile-web-app-status-bar-style");
    document.head.appendChild(statusMeta);
  }
  statusMeta.setAttribute("content", "black-translucent");
}

/** @deprecated Use applyScreenChrome — kept for any lingering imports. */
export function setAppChrome(background: string): void {
  applyScreenChrome({
    surface: background === CHROME_PURPLE ? "dark" : "light",
  });
}
