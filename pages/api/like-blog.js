import db from "../../Firebase/Firebase-admin";
const requestIp = require("request-ip");
const bcrypt = require("bcryptjs");

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const pid = req.body.id;
  const uid = req.body.uid;

  if (!pid) return res.status(400).json({ message: "Missing post id" });

  const likeRef = db.collection("posts").doc(pid).collection("likes");

  try {
    if (uid) {
      const uidDoc = likeRef.doc(`uid_${uid}`);
      const existing = await uidDoc.get();
      if (existing.exists) {
        await uidDoc.delete();
      } else {
        await uidDoc.set({ uid, type: "uid", createdAt: new Date().toISOString() });
      }
      return res.status(200).json({ message: "Successful" });
    }

    const clientIp = requestIp.getClientIp(req);
    if (!clientIp) return res.status(400).json({ message: "Cannot identify user" });

    const snapshot = await likeRef.get();
    let isFound = false;
    let docId;
    snapshot.forEach((doc) => {
      const docData = doc.data();
      if (docData.type === "uid") return;
      const userIp = docData?.userIp;
      if (clientIp && userIp && typeof userIp === "string") {
        try {
          if (bcrypt.compareSync(clientIp, userIp)) {
            isFound = true;
            docId = doc.id;
          }
        } catch (_) {}
      }
    });

    if (!isFound) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(clientIp, salt);
      await likeRef.add({ userIp: hash, type: "ip" });
    } else {
      await likeRef.doc(docId).delete();
    }
    res.status(200).json({ message: "Successful" });
  } catch (error) {
    console.error("Error processing like:", error);
    res.status(500).json({ message: "Error processing like" });
  }
};
