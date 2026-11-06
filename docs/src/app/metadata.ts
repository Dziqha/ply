import type { Metadata } from "next";

export const defaultMetadata: Metadata = {
  title: {
    default: "Ply - Go web framework built on fasthttp",
    template: "%s | Ply Docs",
  },
  description:
    "Documentation for Ply, a fast and lightweight Go web framework built on fasthttp.",
  keywords: [
    "Golang",
    "Ply",
    "fasthttp",
    "Go framework",
    "documentation",
    "API",
    "web",
    "backend",
    "microservices",
    "middleware",
    "security headers",
    "metrics",
    "sessions",
  ],
  authors: [{ name: "Ply", url: "https://ply.web.id" }],
  creator: "Dziqha",
  publisher: "Ply",
  category: "technology",
  metadataBase: new URL("https://ply.web.id"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "DzfDMtvAVr0wAel1ZJXnabbOJIrOAXpew_2C1SCPPn4",
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Ply - Go web framework built on fasthttp",
    description:
      "Documentation for Ply, a fast and lightweight Go web framework built on fasthttp.",
    url: "https://ply.web.id",
    siteName: "Ply",
    images: [
      {
        url: "/images/og-ply.png",
        width: 1200,
        height: 630,
        alt: "Ply Go web framework logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Ply - Go web framework built on fasthttp",
    description:
      "Documentation for Ply, a fast and lightweight Go web framework built on fasthttp.",
    site: "@Dziqha",
    creator: "@Dziqha",
    images: ["/images/og-ply.png"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/images/ply-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/ply-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },

  manifest: "/manifest.json",
};
