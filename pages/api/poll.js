import admin from "firebase-admin";
import db from "../../Firebase/Firebase-admin";

export default async function handler(req, res) {
  const slug = String(req.query?.slug || req.body?.slug || "").trim();
  if (!slug || slug.length > 200) {
    return res.status(400).json({ error: "Valid post slug is required" });
  }

  const docRef = db.collection("polls").doc(slug);

  if (req.method === "GET") {
    try {
      const snap = await docRef.get();
      const data = snap.exists ? snap.data() || {} : {};
      const counts = data.counts || {};
      const total = Object.values(counts).reduce((sum, n) => sum + (Number(n) || 0), 0);
      return res.status(200).json({ counts, total });
    } catch (err) {
      console.error("Poll GET error:", err);
      return res.status(200).json({ counts: {}, total: 0 });
    }
  }

  if (req.method === "POST") {
    try {
      const optionIndex = Number(req.body?.optionIndex);
      if (!Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex > 5) {
        return res.status(400).json({ error: "Invalid optionIndex" });
      }

      await docRef.set(
        {
          counts: {
            [String(optionIndex)]: admin.firestore.FieldValue.increment(1),
          },
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      const updated = await docRef.get();
      const counts = updated.exists ? updated.data()?.counts || {} : {};
      const total = Object.values(counts).reduce((sum, n) => sum + (Number(n) || 0), 0);
      return res.status(200).json({ counts, total });
    } catch (err) {
      console.error("Poll POST error:", err);
      return res.status(500).json({ error: "Failed to record vote" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
