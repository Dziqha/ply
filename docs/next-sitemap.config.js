/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://ply.dev",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ["/api/*", "/admin/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
    ],
    additionalSitemaps: ["https://ply.dev/sitemap.xml"],
  },
};
