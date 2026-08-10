/**
 * Volume display helpers — store everything in ml internally;
 * round for UI so users never see float noise.
 */

export type VolumeUnit = "ml" | "fl_oz";

const ML_PER_FL_OZ = 29.5735;

export function mlToFlOz(ml: number): number {
  return ml / ML_PER_FL_OZ;
}

export function flOzToMl(flOz: number): number {
  return flOz * ML_PER_FL_OZ;
}

/** Round milliliters to a clean integer for display / storage. */
export function roundMl(ml: number): number {
  return Math.round(ml);
}

/** Round fluid ounces to one decimal for display. */
export function roundFlOz(flOz: number): number {
  return Math.round(flOz * 10) / 10;
}

export function formatVolume(
  ml: number,
  unit: VolumeUnit,
  locale = "en",
): string {
  if (unit === "fl_oz") {
    const oz = roundFlOz(mlToFlOz(ml));
    return `${oz.toLocaleString(locale, {
      maximumFractionDigits: 1,
      minimumFractionDigits: oz % 1 === 0 ? 0 : 1,
    })} fl oz`;
  }
  return `${roundMl(ml).toLocaleString(locale)} ml`;
}

export function formatLiters(ml: number, locale = "en"): string {
  const liters = roundMl(ml) / 1000;
  if (Number.isInteger(liters)) return String(liters);
  return liters.toLocaleString(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  });
}
