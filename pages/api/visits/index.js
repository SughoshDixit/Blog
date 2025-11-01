import db from "../../../Firebase/Firebase-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { pid } = req.body || {};
    const docId = pid ? String(pid) : "_site";
    const ref = db.collection("visits").doc(docId);

    await db.runTransaction(async (t) => {
      const snap = await t.get(ref);
      const current = snap.exists && typeof snap.data().count === "number" ? snap.data().count : 0;
      t.set(ref, { count: current + 1, updatedAt: new Date() }, { merge: true });
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "internal_error" });
  }
}










