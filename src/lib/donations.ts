/** Fixed “buy me a coffee” tip. */
export const COFFEE_EUR = 4;

export const MIN_DONATION_EUR = 1;
export const MAX_DONATION_EUR = 250;

export const DONATION_PRESETS_EUR = [2, 5, 10, 20] as const;

export function clampDonationEur(value: number): number {
  if (!Number.isFinite(value)) return MIN_DONATION_EUR;
  return Math.min(
    MAX_DONATION_EUR,
    Math.max(MIN_DONATION_EUR, Math.round(value)),
  );
}

export function formatEuro(amount: number): string {
  return `€${amount}`;
}
