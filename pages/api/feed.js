import { getAllBlogPosts } from "../../Lib/Data";
import { generateSlug } from "../../Lib/utils";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const allBlogs = getAllBlogPosts();
    const publishedBlogs = allBlogs
      .filter((blog) => blog.data.isPublished)
      .sort((a, b) => new Date(b.data.Date) - new Date(a.data.Date));

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sughoshblog.vercel.app";
    const siteTitle = "Sughosh's Chronicles";
    const siteDescription = "Stories on technology, data, and imagination";

    const rssItems = publishedBlogs.map((blog) => {
      const slug = generateSlug(blog.data.Title);
      const url = `${siteUrl}/blogs/${slug}`;
      const pubDate = new Date(blog.data.Date).toUTCString();
      
      return `    <item>
      <title><![CDATA[${blog.data.Title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${blog.data.Abstract || ""}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>${blog.data.Author || "Sughosh P Dixit"}</author>
      <category>${blog.data.Topic || ""}</category>
    </item>`;
    }).join("\n");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteTitle}</title>
    <link>${siteUrl}</link>
    <description>${siteDescription}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/api/feed" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`;

    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(rss);
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    res.status(500).json({ error: "Failed to generate RSS feed" });
  }
}

