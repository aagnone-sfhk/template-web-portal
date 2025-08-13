import Image from "next/image";

interface HerokuIconProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

export default function HerokuIcon({
  width = 64,
  height = 64,
  className = "",
  alt = "Heroku",
}: HerokuIconProps) {
  return (
    <Image
      src="/images/heroku-icon.svg"
      alt={alt}
      width={width}
      height={height}
      className={`object-contain ${className}`.trim()}
    />
  );
} 