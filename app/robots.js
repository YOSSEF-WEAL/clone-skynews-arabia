import { buildAbsoluteUrl } from "./_utils/siteUrl";

export default function robots() {
  const sitemapUrl = buildAbsoluteUrl("/sitemap.xml");
  const hostUrl = buildAbsoluteUrl("/").replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
    sitemap: sitemapUrl,
    host: hostUrl,
  };
}
