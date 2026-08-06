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
      src={`/icons/${name}.svg`}
      alt={alt}
      width={size}
      height={size}
      className={`shrink-0 object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

interface MascotImageProps {
  src: string;
  alt?: string;
  width: number;
  height?: number;
  className?: string;
}

export function MascotImage({
  src,
  alt = "",
  width,
  height,
  className = "",
}: MascotImageProps) {
  const h = height ?? width;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={h}
      className={`object-contain ${className}`}
      style={{ width, height: h }}
    />
  );
}
