import db from "../../../Firebase/Firebase-admin";
const requestIp = require("request-ip");
const bcrypt = require("bcryptjs");

export default async (req, res) => {
  const { pid, uid } = req.query;

  if (!pid) return res.status(400).json({ message: "Missing post ID" });

  let hasUserLiked = false;
  let totalLikes = 0;
  const likeRef = db.collection("posts").doc(pid).collection("likes");

  try {
    const snapshot = await likeRef.get();
    totalLikes = snapshot.size;

    if (uid) {
      const uidDoc = await likeRef.doc(`uid_${uid}`).get();
      hasUserLiked = uidDoc.exists;
    } else {
      const clientIp = requestIp.getClientIp(req);
      snapshot.forEach((doc) => {
        const docData = doc.data();
        if (docData.type === "uid") return;
        const userIp = docData?.userIp;
        if (clientIp && userIp && typeof userIp === "string") {
          try {
            if (bcrypt.compareSync(clientIp, userIp)) hasUserLiked = true;
          } catch (_) {}
        }
      });
    }

    res.status(200).json({ hasUserLiked, totalLikes });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ message: "Error fetching likes" });
  }
};
