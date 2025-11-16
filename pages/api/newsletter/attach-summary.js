import db from "../../../Firebase/Firebase-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { title, abstract, images = [], takeaways = [], note, postSlug } = req.body || {};
    if (!title) return res.status(400).json({ error: "title is required" });

    const doc = {
      title,
      abstract: abstract || "",
      images: Array.isArray(images) ? images.slice(0, 8) : [],
      takeaways: Array.isArray(takeaways) ? takeaways.slice(0, 10) : [],
      note: note || "",
      postSlug: postSlug || null,
      createdAt: new Date().toISOString(),
      status: "pending", // to be picked up by weekly digest job
    };

    const ref = await db.collection("newsletter_summaries").add(doc);
    return res.status(200).json({ success: true, id: ref.id });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Unknown error" });
  }
}
