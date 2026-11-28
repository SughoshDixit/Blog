const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const readingTime = require("reading-time");

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://sughoshdixit.com").replace(/\/$/, "");
const CONTENT_DIR = path.join(process.cwd(), "_content");
const PUBLIC_DIR = path.join(process.cwd(), "public");

function generateSlug(title) {
  if (!title) return "";
  return String(title)
    .toLowerCase()
    .replace(/[\u2014\u2013\u2015]/g, "-")
    .replace(/:/g, "-")
    .replace(/&/g, "and")
    .replace(/\+/g, "plus")
    .replace(/\(/g, "-")
    .replace(/\)/g, "-")
    .replace(/\?/g, "")
    .replace(/!/g, "")
    .replace(/,/g, "")
    .replace(/[→←]/g, "-")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter((w) => w.length > 0)
    .join("-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripMarkdown(md) {
  return String(md || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#*_`>~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function main() {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const sitemapPosts = [];
  const prominentPosts = [];
  const topics = new Set();

  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    if (!data?.isPublished || data?.unlisted === true) continue;

    const rt = readingTime(content);
    const postObj = { data, content, readTime: rt };
    sitemapPosts.push(postObj);

    if (data.prominentShelf !== false) {
      prominentPosts.push(postObj);
      if (data.Topic && typeof data.Topic === "string" && data.Topic.trim()) {
        topics.add(data.Topic.trim());
      }
    }
  }

  const sortByDate = (a, b) => {
    const da = Date.parse(a?.data?.Date);
    const db = Date.parse(b?.data?.Date);
    if (!Number.isNaN(da) && !Number.isNaN(db)) return db - da;
    return 0;
  };

  sitemapPosts.sort(sortByDate);
  prominentPosts.sort(sortByDate);

  // 1. Generate public/sitemap.xml
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

  const postEntries = sitemapPosts.map(({ data }) => {
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
  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), xml, "utf-8");

  // 2. Generate public/rss.xml
  const rssItems = prominentPosts
    .map(({ data }) => {
      const slug = generateSlug(data.Title);
      const url = `${SITE_URL}/blogs/${slug}`;
      const pubDate = !Number.isNaN(Date.parse(data.Date))
        ? new Date(data.Date).toUTCString()
        : new Date().toUTCString();
      return `    <item>
      <title><![CDATA[${data.Title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${data.Abstract || ""}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>${data.Author || "Sughosh P Dixit"}</author>
      <category>${data.Topic || ""}</category>
    </item>`;
    })
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sughosh Dixit — Writing &amp; Essays</title>
    <link>${SITE_URL}</link>
    <description>Data science, personal essays, books, fitness, football, and life in India.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>\n`;
  fs.writeFileSync(path.join(PUBLIC_DIR, "rss.xml"), rssXml, "utf-8");

  // 3. Generate public/search-index.json
  const searchIndex = prominentPosts.map(({ data, content, readTime: rt }) => ({
    id: generateSlug(data.Title),
    title: data.Title || "",
    abstract: data.Abstract || "",
    author: data.Author || "Sughosh Dixit",
    date: data.Date || "",
    topic: data.Topic || "",
    tags: data.Tags ? String(data.Tags).split(/\s+/).filter(Boolean) : [],
    readTime: rt?.text || "5 min read",
    headerImage: data.HeaderImage || "",
    body: stripMarkdown(content).slice(0, 6000),
  }));
  fs.writeFileSync(path.join(PUBLIC_DIR, "search-index.json"), JSON.stringify(searchIndex), "utf-8");

  console.log(
    `Generated sitemap.xml (${staticPages.length + postEntries.length} URLs), rss.xml (${prominentPosts.length} items), search-index.json (${searchIndex.length} posts).`
  );
}

main();
