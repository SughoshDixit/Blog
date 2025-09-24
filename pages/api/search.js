import { getAllBlogPosts } from "../../Lib/Data";

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { q } = req.query;
  
  if (!q || q.trim().length === 0) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const allBlogs = getAllBlogPosts();
    const searchQuery = q.toLowerCase().trim();
    
    // Filter blogs based on search query
    const searchResults = allBlogs
      .filter(blog => blog.data.isPublished)
      .filter(blog => {
        const title = blog.data.Title?.toLowerCase() || '';
        const abstract = blog.data.Abstract?.toLowerCase() || '';
        const tags = blog.data.Tags?.toLowerCase() || '';
        const topic = blog.data.Topic?.toLowerCase() || '';
        
        return title.includes(searchQuery) || 
               abstract.includes(searchQuery) || 
               tags.includes(searchQuery) || 
               topic.includes(searchQuery);
      })
      .map(blog => ({
        id: blog.data.Title.split(" ").join("-").toLowerCase(),
        title: blog.data.Title,
        abstract: blog.data.Abstract,
        author: blog.data.Author,
        date: blog.data.Date,
        topic: blog.data.Topic,
        tags: blog.data.Tags?.split(" ").filter(Boolean) || [],
        readTime: blog.readTime.text,
        headerImage: blog.data.HeaderImage
      }))
      .slice(0, 10); // Limit to 10 results

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
