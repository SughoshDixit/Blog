import { getAllBlogPosts } from "../../Lib/Data";
import { generateSlug } from "../../Lib/utils";
import { SITE_URL } from "../../Lib/siteConfig";

export default function handler(req, res) {
  const posts = getAllBlogPosts()
    .filter((p) => p?.data?.isPublished)
    .sort((a, b) => {
      const da = Date.parse(a?.data?.Date);
      const db = Date.parse(b?.data?.Date);
      if (!Number.isNaN(da) && !Number.isNaN(db)) return db - da;
      return 0;
    });

  const staticPages = [
    { loc: "/", priority: "1.0" },
    { loc: "/about", priority: "0.8" },
    { loc: "/learning-path", priority: "0.8" },
    { loc: "/ai-gallery", priority: "0.6" },
    { loc: "/dashboard", priority: "0.5" },
    { loc: "/key", priority: "0.5" },
  ];

  const postEntries = posts.map((p) => {
    const slug = generateSlug(p.data.Title);
    const dateRaw = Date.parse(p.data.Date);
    const lastmod = !Number.isNaN(dateRaw)
      ? new Date(dateRaw).toISOString().split("T")[0]
      : undefined;
    return { loc: `/blogs/${slug}`, lastmod, priority: "0.7" };
  });

  const urls = [...staticPages, ...postEntries]
    .map(
      ({ loc, lastmod, priority }) =>
        `  <url>
    <loc>${SITE_URL}${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
    <priority>${priority}</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate");
  res.status(200).send(xml);
}
