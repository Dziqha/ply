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
                "A blazing fast Go framework for building high-performance web applications and APIs",
              url: "https://ply.dev",
              author: {
                "@type": "Person",
                name: "Dziqha",
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5",
                ratingCount: "100",
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
              url: "https://ply.dev",
              logo: "https://ply.dev/images/icon.png",
              sameAs: ["https://twitter.com/ply_dev"],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Developer Support",
                url: "https://ply.dev",
              },
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
              url: "https://ply.dev",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://ply.dev/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
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
