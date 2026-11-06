import type { Metadata } from "next";

export const defaultMetadata: Metadata = {
  title: {
    default: "Ply Documentation",
    template: "%s | Ply Docs",
  },
  description:
    "Official documentation for Ply – a blazing fast Go framework for building high-performance web applications and APIs.",
  keywords: [
    "Golang",
    "Ply",
    "framework",
    "documentation",
    "API",
    "web",
    "Go framework",
    "fast",
    "performance",
    "backend",
    "microservices",
  ],
  authors: [{ name: "Ply", url: "https://ply.dev" }],
  creator: "Dziqha",
  publisher: "Ply",
  category: "technology",
  metadataBase: new URL("https://ply.dev"),
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
    canonical: "https://ply.dev",
    languages: {
      "en-US": "https://ply.dev",
      "id-ID": "https://ply.dev/id",
    },
  },

  openGraph: {
    title: "Ply Documentation",
    description:
      "Official documentation for Ply – a blazing fast Go framework for building high-performance web applications and APIs.",
    url: "https://ply.dev/docs",
    siteName: "Ply Docs",
    images: [
      {
        url: "/images/og-ply.png",
        width: 1200,
        height: 630,
        alt: "Ply Framework - Blazing Fast Go Framework",
      },
    ],
    locale: "en_US",
    alternateLocale: ["id_ID"],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Ply Documentation",
    description:
      "Official documentation for Ply – a blazing fast Go framework for building high-performance web applications and APIs.",
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
