/** Light screen surface (home, settings, onboarding). */
export const CHROME_PEACH = "#fff8f6";
/** Full-bleed purple surface (splash). */
export const CHROME_PURPLE = "#5c4d9a";
/** App dark mode surface — matches sip-and-pill.app navy. */
export const CHROME_NIGHT = "#0b1020";

/** Marketing-site dark atmosphere (glow + navy gradient). */
export const CHROME_NIGHT_GRADIENT = [
  "radial-gradient(ellipse 70% 60% at 72% 40%, #ff7e7038, #5c4d9a47 40%, transparent 70%)",
  "radial-gradient(ellipse 90% 70% at 50% -10%, #50468c59, transparent 55%)",
  "linear-gradient(180deg, #0b1020, #12182b 55%, #0b1020)",
].join(", ");

export type ScreenSurface = "light" | "purple" | "night";

export type ScreenChromeOptions = {
  /** Visual surface under the translucent / system status bar. */
  surface: ScreenSurface;
};

function paintSolid(el: HTMLElement, background: string): void {
  el.style.backgroundImage = "none";
  el.style.backgroundColor = background;
  el.style.background = background;
}

function paintNight(el: HTMLElement): void {
  el.style.background = "none";
  el.style.backgroundColor = CHROME_NIGHT;
  el.style.backgroundImage = CHROME_NIGHT_GRADIENT;
}

function removeLegacyTints(): void {
  document.getElementById("sip-safari-tint-top")?.remove();
  document.getElementById("sip-safari-tint-bottom")?.remove();
}

function backgroundFor(surface: ScreenSurface): string {
  if (surface === "purple") return CHROME_PURPLE;
  if (surface === "night") return CHROME_NIGHT;
  return CHROME_PEACH;
}

/**
 * Apply status-bar / document chrome for the *currently visible* screen.
 * Call from that screen only — never from a root navigator with a shared color.
 *
 * - light  → peach; light status glyphs
 * - purple → splash purple; light glyphs
 * - night  → marketing-site dark atmosphere; light glyphs
 */
export function applyScreenChrome({ surface }: ScreenChromeOptions): void {
  if (typeof document === "undefined") return;

  const background = backgroundFor(surface);
  const darkScheme = surface === "purple" || surface === "night";

  document.documentElement.dataset.screenSurface = surface;
  document.documentElement.style.colorScheme = darkScheme ? "dark" : "light";
  document.documentElement.style.setProperty("--app-chrome", background);

  if (surface === "night") {
    paintNight(document.documentElement);
    if (document.body) paintNight(document.body);
  } else {
    paintSolid(document.documentElement, background);
    if (document.body) paintSolid(document.body, background);
  }
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
    surface:
      background === CHROME_PURPLE
        ? "purple"
        : background === CHROME_NIGHT
          ? "night"
          : "light",
  });
}
