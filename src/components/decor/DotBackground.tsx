import React from "react";
import { cn } from "@/lib/utils";

export interface DotBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  /** Adds a soft radial fade mask from the center. Default: true */
  fade?: boolean;
}

/**
 * Reusable dot-pattern background wrapper.
 * Usage:
 * <DotBackground className="relative h-96 w-full">
 *   <YourContent />
 * </DotBackground>
 */
export function DotBackground({ className, children, fade = true }: DotBackgroundProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Dot grid pattern layer */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />

      {/* Optional radial fade mask for subtle vignette */}
      {fade && (
        <div className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />
      )}

      {/* Content layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default DotBackground;

