import db from "../../Firebase/Firebase-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { slugs } = req.body;
  if (!Array.isArray(slugs) || slugs.length === 0) {
    return res.status(400).json({ message: "slugs array required" });
  }

  const cap = slugs.slice(0, 100);

  try {
    const results = {};

    await Promise.all(
      cap.map(async (slug) => {
        let likes = 0;
        let comments = 0;

        try {
          const likesSnap = await db
            .collection("posts")
            .doc(slug)
            .collection("likes")
            .get();
          likes = likesSnap.size;
        } catch (_) {}

        try {
          const commentsSnap = await db
            .collection("posts")
            .doc(slug)
            .collection("comments")
            .get();
          comments = commentsSnap.size;
        } catch (_) {}

        results[slug] = { likes, comments };
      })
    );

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );
    res.status(200).json(results);
  } catch (error) {
    console.error("Engagement batch error:", error);
    res.status(500).json({ message: "Error fetching engagement" });
  }
}
