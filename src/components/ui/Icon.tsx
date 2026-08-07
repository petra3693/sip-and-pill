import type { MascotAsset } from "@/lib/assets";
import { assetUrl } from "@/lib/assets";

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  alt?: string;
}

export function Icon({
  name,
  size = 24,
  className = "",
  alt = "",
}: IconProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={assetUrl(`/icons/${name}.svg`)}
      alt={alt}
      width={size}
      height={size}
      className={`shrink-0 bg-transparent object-contain ${className}`}
      style={{ width: size, height: size, background: "transparent" }}
    />
  );
}

interface MascotImageProps {
  src: MascotAsset | string;
  alt?: string;
  /** Max display width in CSS pixels; height scales with intrinsic aspect. */
  maxWidth?: number;
  /** @deprecated Use maxWidth — kept for call-site migration. */
  width?: number;
  /** Ignored; height always follows intrinsic aspect. */
  height?: number;
  className?: string;
  /**
   * `multiply` knocks out residual light studio fills on cream/white cards.
   * Use `normal` on purple / dark surfaces.
   */
  blend?: "multiply" | "normal";
}

function resolveAsset(src: MascotAsset | string): MascotAsset {
  if (typeof src === "string") {
    return { png: src, width: 2000, height: 2000 };
  }
  return src;
}

/** High-res PNG mascot with responsive, non-stretching layout. */
export function MascotImage({
  src,
  alt = "",
  maxWidth,
  width,
  className = "",
  blend = "multiply",
}: MascotImageProps) {
  const asset = resolveAsset(src);
  const displayMax = maxWidth ?? width ?? 200;
  const blendMode = blend === "multiply" ? "multiply" : "normal";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={assetUrl(asset.png)}
      alt={alt}
      width={asset.width}
      height={asset.height}
      decoding="async"
      className={[
        "block shrink-0 bg-transparent object-contain",
        blend === "multiply" ? "mix-blend-multiply" : "mix-blend-normal",
        className,
      ].join(" ")}
      style={{
        width: "100%",
        maxWidth: displayMax,
        height: "auto",
        backgroundColor: "transparent",
        mixBlendMode: blendMode,
      }}
    />
  );
}
