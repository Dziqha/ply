/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://ply.web.id",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ["/api/*", "/admin/*"],
  transform: async (config, path) => {
    const isHome = path === "/";
    const isDocs = path === "/docs" || path.startsWith("/docs/");
    return {
      loc: path,
      changefreq: isHome ? "weekly" : "monthly",
      priority: isHome ? 1 : isDocs ? 0.8 : 0.6,
      lastmod: new Date().toISOString(),
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
};
