import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { defaultMetadata } from "./metadata";

export const metadata = defaultMetadata;

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Ply",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Cross-platform",
              description:
                "A fast and lightweight Go web framework built on fasthttp.",
              url: "https://ply.web.id",
              codeRepository: "https://github.com/Dziqha/ply",
              programmingLanguage: "Go",
              license: "https://opensource.org/licenses/MIT",
              downloadUrl: "https://pkg.go.dev/github.com/Dziqha/ply",
              author: {
                "@type": "Person",
                name: "Dziqha",
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Ply",
              url: "https://ply.web.id",
              logo: "https://ply.web.id/images/ply-icon-512.png",
              sameAs: ["https://github.com/Dziqha/ply"],
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Ply Documentation",
              url: "https://ply.web.id",
              inLanguage: "en",
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Ply documentation",
              itemListElement: [
                {
                  "@type": "SiteNavigationElement",
                  position: 1,
                  name: "Documentation",
                  url: "https://ply.web.id/docs",
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 2,
                  name: "Getting Started",
                  url: "https://ply.web.id/docs/getting-started",
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 3,
                  name: "Features",
                  url: "https://ply.web.id/docs/features",
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 4,
                  name: "Middleware",
                  url: "https://ply.web.id/docs/middleware",
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 5,
                  name: "Routing",
                  url: "https://ply.web.id/docs/routing",
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 6,
                  name: "Deployment",
                  url: "https://ply.web.id/docs/deployment",
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 7,
                  name: "Benchmarks",
                  url: "https://ply.web.id/docs/benchmarks",
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 8,
                  name: "Comparison",
                  url: "https://ply.web.id/docs/comparison",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
