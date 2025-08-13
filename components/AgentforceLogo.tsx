import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface AgentforceLogoProps {
  size?: "small" | "medium" | "large" | "header";
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

const sizeConfig = {
  small: { width: 40, height: 40, className: "w-10 h-10" },
  medium: { width: 48, height: 48, className: "w-12 h-12" },
  large: { width: 64, height: 64, className: "w-16 h-16" },
  header: { width: 80, height: 24, className: "h-6" },
};

export default function AgentforceLogo({
  size = "small",
  width,
  height,
  className = "",
  alt = "Agentforce AI Assistant",
}: AgentforceLogoProps) {
  const config = sizeConfig[size];
  const finalWidth = width ?? config.width;
  const finalHeight = height ?? config.height;
  // Only use size className if custom width/height aren't provided
  const sizeClassName = (width || height) ? "" : config.className;
  const finalClassName = twMerge("object-contain", sizeClassName, className);

  return (
    <Image
      src="/images/agentforce.svg"
      alt={alt}
      width={finalWidth}
      height={finalHeight}
      className={finalClassName}
    />
  );
} 