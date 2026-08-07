/** Bump whenever public mascot assets are replaced. */
export const ASSET_VERSION = "20260807f";

/** Append a cache-busting query to a public asset path. */
export function assetUrl(path: string): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}v=${ASSET_VERSION}`;
}

export type MascotAsset = {
  png: string;
  width: number;
  height: number;
};

function mascot(file: string, width = 2000, height = 2000): MascotAsset {
  return {
    png: `/mascots/${file}.png`,
    width,
    height,
  };
}

/** Canonical high-res mascot assets (2000×2000 transparent PNGs). */
export const MASCOTS = {
  splash: mascot("splash-characters"),
  bothDancing: mascot("both-dancing"),
  bothReading: mascot("both-reading-together"),
  bothWavingHello: mascot("both-waving-hello-1"),
  bothWavingCard: mascot("both-waving-hello"),
  bothHighFive: mascot("both-high-five"),
  dropThumbsUp: mascot("drop-thumbs-up"),
  dropFlexing: mascot("drop-flexing"),
  dropCelebrating: mascot("drop-celebrating"),
  pillWink: mascot("pill-confident-wink"),
  pillSuperhero: mascot("pill-superhero"),
  pillHeart: mascot("pill-holding-heart"),
} as const;
