import fs from "fs";
import path from "path";
import { getAllBlogPosts } from "../../Lib/Data";
import { generateSlug } from "../../Lib/utils";
import { isProminentShelf } from "../../Lib/postVisibility";

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { q, topic, maxRead } = req.query;
  
  if (!q || q.trim().length === 0) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const searchQuery = q.toLowerCase().trim();
    const terms = searchQuery.split(/\s+/).filter(Boolean);
    const toMinutes = (readText) => {
      const match = String(readText || "").match(/(\d+)\s*min/i);
      return match ? Number(match[1]) : null;
    };

    const indexPath = path.join(process.cwd(), "public", "search-index.json");
    let sourceItems = null;
    if (fs.existsSync(indexPath)) {
      sourceItems = JSON.parse(fs.readFileSync(indexPath, "utf8"));
    }

    const searchResults = (Array.isArray(sourceItems)
      ? sourceItems
      : getAllBlogPosts()
          .filter((blog) => blog.data.isPublished && isProminentShelf(blog))
          .map((blog) => ({
            id: generateSlug(blog.data.Title),
            title: blog.data.Title || "",
            abstract: blog.data.Abstract || "",
            author: blog.data.Author || "Sughosh Dixit",
            date: blog.data.Date || "",
            topic: blog.data.Topic || "",
            tags: blog.data.Tags?.split(" ").filter(Boolean) || [],
            readTime: blog.readTime.text,
            headerImage: blog.data.HeaderImage || "",
            body: blog.content || "",
          }))
    )
      .filter((blog) => (topic ? blog.topic === topic : true))
      .filter((blog) => {
        if (!maxRead) return true;
        const mins = toMinutes(blog.readTime);
        return mins !== null ? mins <= Number(maxRead) : true;
      })
      .map((blog) => {
        const title = blog.title.toLowerCase();
        const abstract = blog.abstract.toLowerCase();
        const tags = (blog.tags || []).join(" ").toLowerCase();
        const topicText = blog.topic.toLowerCase();
        const body = (blog.body || "").toLowerCase();

        let score = 0;
        const matchedIn = [];
        terms.forEach((term) => {
          if (title.includes(term)) { score += 6; if (!matchedIn.includes("title")) matchedIn.push("title"); }
          if (abstract.includes(term)) { score += 4; if (!matchedIn.includes("abstract")) matchedIn.push("abstract"); }
          if (tags.includes(term)) { score += 5; if (!matchedIn.includes("tags")) matchedIn.push("tags"); }
          if (topicText.includes(term)) { score += 4; if (!matchedIn.includes("topic")) matchedIn.push("topic"); }
          if (body.includes(term)) { score += 2; if (!matchedIn.includes("content")) matchedIn.push("content"); }
        });

        if (title.includes(searchQuery)) score += 6;
        if (abstract.includes(searchQuery)) score += 4;
        if (tags.includes(searchQuery)) score += 4;
        if (topicText.includes(searchQuery)) score += 4;
        if (body.includes(searchQuery)) score += 2;

        return {
          id: blog.id,
          title: blog.title,
          abstract: blog.abstract,
          author: blog.author,
          date: blog.date,
          topic: blog.topic,
          tags: blog.tags || [],
          readTime: blog.readTime,
          headerImage: blog.headerImage,
          score,
          matchedIn,
        };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );
    res.status(200).json({
      query: q,
      results: searchResults,
      total: searchResults.length
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
