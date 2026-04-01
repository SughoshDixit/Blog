import { getAllBlogPosts } from "../../Lib/Data";
import { generateSlug } from "../../Lib/utils";

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { q, topic, maxRead } = req.query;
  
  if (!q || q.trim().length === 0) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const allBlogs = getAllBlogPosts();
    const searchQuery = q.toLowerCase().trim();
    const terms = searchQuery.split(/\s+/).filter(Boolean);
    
    // Filter blogs based on search query
    const toMinutes = (readText) => {
      const match = String(readText || "").match(/(\d+)\s*min/i);
      return match ? Number(match[1]) : null;
    };

    const searchResults = allBlogs
      .filter((blog) => blog.data.isPublished)
      .filter((blog) => (topic ? blog?.data?.Topic === topic : true))
      .filter((blog) => {
        if (!maxRead) return true;
        const mins = toMinutes(blog?.readTime?.text);
        return mins !== null ? mins <= Number(maxRead) : true;
      })
      .map((blog) => {
        const title = blog.data.Title?.toLowerCase() || '';
        const abstract = blog.data.Abstract?.toLowerCase() || '';
        const tags = blog.data.Tags?.toLowerCase() || '';
        const topicText = blog.data.Topic?.toLowerCase() || '';
        const body = blog.content?.toLowerCase() || '';

        let score = 0;
        const matchedIn = [];
        terms.forEach((term) => {
          if (title.includes(term)) {
            score += 6;
            if (!matchedIn.includes("title")) matchedIn.push("title");
          }
          if (abstract.includes(term)) {
            score += 4;
            if (!matchedIn.includes("abstract")) matchedIn.push("abstract");
          }
          if (tags.includes(term)) {
            score += 5;
            if (!matchedIn.includes("tags")) matchedIn.push("tags");
          }
          if (topicText.includes(term)) {
            score += 4;
            if (!matchedIn.includes("topic")) matchedIn.push("topic");
          }
          if (body.includes(term)) {
            score += 2;
            if (!matchedIn.includes("content")) matchedIn.push("content");
          }
        });

        if (title.includes(searchQuery)) score += 6;
        if (abstract.includes(searchQuery)) score += 4;
        if (tags.includes(searchQuery)) score += 4;
        if (topicText.includes(searchQuery)) score += 4;
        if (body.includes(searchQuery)) score += 2;

        return {
          id: generateSlug(blog.data.Title),
          title: blog.data.Title,
          abstract: blog.data.Abstract,
          author: blog.data.Author,
          date: blog.data.Date,
          topic: blog.data.Topic,
          tags: blog.data.Tags?.split(" ").filter(Boolean) || [],
          readTime: blog.readTime.text,
          headerImage: blog.data.HeaderImage,
          score,
          matchedIn,
        };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);

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
