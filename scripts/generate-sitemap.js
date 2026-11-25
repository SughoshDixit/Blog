const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://sughoshdixit.com").replace(/\/$/, "");
const CONTENT_DIR = path.join(process.cwd(), "_content");
const OUT_FILE = path.join(process.cwd(), "public", "sitemap.xml");

function generateSlug(title) {
  return String(title || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, (ch) => (ch === "'" ? "'" : ""))
    .split(/\s+/)
    .filter(Boolean)
    .join("-");
}

function main() {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const posts = [];
  const topics = new Set();

  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data } = matter(raw);
    if (!data?.isPublished || data?.unlisted === true) continue;

    posts.push(data);
    if (data.prominentShelf !== false && data.Topic && typeof data.Topic === "string" && data.Topic.trim()) {
      topics.add(data.Topic.trim());
    }
  }

  posts.sort((a, b) => {
    const da = Date.parse(a?.Date);
    const db = Date.parse(b?.Date);
    if (!Number.isNaN(da) && !Number.isNaN(db)) return db - da;
    return 0;
  });

  const staticPages = [
    { loc: "/", priority: "1.0" },
    { loc: "/start-here", priority: "0.9" },
    { loc: "/about", priority: "0.9" },
    { loc: "/contact", priority: "0.8" },
    { loc: "/consulting", priority: "0.8" },
    { loc: "/projects", priority: "0.8" },
    { loc: "/football", priority: "0.8" },
    { loc: "/learning-path", priority: "0.8" },
    { loc: "/garden", priority: "0.7" },
    { loc: "/ai-gallery", priority: "0.7" },
    { loc: "/savarkar-documentary", priority: "0.7" },
    { loc: "/key", priority: "0.5" },
    { loc: "/archive", priority: "0.5" },
    { loc: "/privacy-policy", priority: "0.5" },
    { loc: "/terms-of-service", priority: "0.5" },
    ...[...topics].map((t) => ({ loc: `/topic/${encodeURIComponent(t)}`, priority: "0.6" })),
  ];

  const postEntries = posts.map((data) => {
    const slug = generateSlug(data.Title);
    const dateRaw = Date.parse(data.Date);
    const lastmod = !Number.isNaN(dateRaw) ? new Date(dateRaw).toISOString().split("T")[0] : undefined;
    return { loc: `/blogs/${slug}`, lastmod, priority: "0.7" };
  });

  const urls = [...staticPages, ...postEntries]
    .map(
      ({ loc, lastmod, priority }) =>
        `  <url>\n    <loc>${SITE_URL}${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n    <priority>${priority}</priority>\n  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  fs.writeFileSync(OUT_FILE, xml, "utf-8");
  console.log(`Generated ${OUT_FILE} with ${staticPages.length + postEntries.length} URLs.`);
}

main();
