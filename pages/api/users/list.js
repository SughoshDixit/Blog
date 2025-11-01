import db from "../../../Firebase/Firebase-admin";

export default async function handler(req, res) {
  try {
    const snap = await db.collection("users").get();
    const users = [];
    snap.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
    res.status(200).json({ total: users.length, users });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "internal_error" });
  }
}










