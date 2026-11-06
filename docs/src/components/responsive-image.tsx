"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ResponsiveImageProps {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  className?: string;
}

export function ResponsiveImage({
  lightSrc,
  darkSrc,
  alt,
  className = "",
}: ResponsiveImageProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fallback ke light mode saat loading
  if (!mounted) {
    return <Image src={lightSrc} alt={alt} className={className} />;
  }

  return (
    <Image
      src={resolvedTheme === "dark" ? darkSrc : lightSrc}
      alt={alt}
      className={className}
    />
  );
}
