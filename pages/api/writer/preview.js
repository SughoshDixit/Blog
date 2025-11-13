import { serialize } from "next-mdx-remote/serialize";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { content } = req.body || {};

  if (!content || typeof content !== "string") {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const serialized = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    });

    return res.status(200).json({ 
      compiledSource: serialized.compiledSource,
      scope: serialized.scope,
      frontmatter: serialized.frontmatter,
    });
  } catch (error) {
    console.error("Preview serialization error:", error);
    return res.status(500).json({ error: "Failed to generate preview" });
  }
}

