import db from "../../../Firebase/Firebase-admin";

export default async function handler(req, res) {
  try {
    const snap = await db.collection("visits").get();
    let total = 0;
    const perPost = {};
    snap.forEach(doc => {
      const data = doc.data();
      const count = typeof data.count === 'number' ? data.count : 0;
      total += count;
      perPost[doc.id] = count;
    });
    res.status(200).json({ total, perPost });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "internal_error" });
  }
}










