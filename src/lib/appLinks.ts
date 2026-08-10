/** Marketing site — live production landing (confirmed reachable). */
export const WEBSITE_URL = "https://www.sip-and-pill.app/";

/** Public share URL used from Settings. */
export const APP_SHARE_URL = WEBSITE_URL;

/**
 * Hosted Privacy Policy URL (App Store Connect + in-app external link).
 * Override with NEXT_PUBLIC_PRIVACY_URL when a dedicated page is live.
 */
export const PRIVACY_POLICY_URL =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_PRIVACY_URL?.trim()) ||
  `${WEBSITE_URL}#privacy`;

/**
 * Hosted Terms of Service URL.
 * Override with NEXT_PUBLIC_TERMS_URL when a dedicated page is live.
 */
export const TERMS_OF_SERVICE_URL =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_TERMS_URL?.trim()) ||
  `${WEBSITE_URL}#terms`;

/**
 * Support inbox used when composing mail from the in-app form.
 * Do not render this string prominently in the UI.
 */
export const SUPPORT_EMAIL = "raving.pascal@gmail.com";

/** Data controller / developer (GDPR Art. 13 / DSGVO). */
export const LEGAL_CONTROLLER_NAME = "Petra Szakacs";

/** Optional trade name shown next to the controller. */
export const LEGAL_CONTROLLER_TRADE = "Lumen Studio";

/** Governing law / seat of the controller. */
export const LEGAL_JURISDICTION = "Germany";

/** Postal address for Impressum / GDPR controller identity (Germany). */
export const LEGAL_POSTAL_ADDRESS = "Einbecker Straße 64A, 10315 Berlin, Germany";

/**
 * Numeric Apple App Store ID from App Store Connect.
 * Leave empty until the listing exists — in-app review still works via StoreKit.
 */
// TODO: set after App Store Connect approval — required for in-app review prompts to deep-link correctly
export const APP_STORE_ID = "";

/**
 * Full Google Play store listing URL.
 * Leave empty until the listing is live.
 */
export const PLAY_STORE_URL = "";

export function appStoreWriteReviewUrl(): string | null {
  if (!APP_STORE_ID.trim()) return null;
  return `https://apps.apple.com/app/id${APP_STORE_ID.trim()}?action=write-review`;
}

export function playStoreListingUrl(): string | null {
  const url = PLAY_STORE_URL.trim();
  return url ? url : null;
}
