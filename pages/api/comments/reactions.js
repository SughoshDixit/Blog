import db from "../../../Firebase/Firebase-admin";
const requestIp = require("request-ip");
const bcrypt = require("bcryptjs");

export default async function handler(req, res) {
  // GET requests use query, POST requests use body
  const commentId = req.method === "GET" ? req.query.commentId : req.body.commentId;
  const postId = req.method === "GET" ? req.query.postId : req.body.postId;
  const reactionType = req.method === "POST" ? req.body.reactionType : null;

  if (!commentId || !postId) {
    return res.status(400).json({ error: "Missing commentId or postId" });
  }

  const clientIp = requestIp.getClientIp(req);
  const reactionsRef = db
    .collection("posts")
    .doc(postId)
    .collection("comments")
    .doc(commentId)
    .collection("reactions");

  if (req.method === "GET") {
    try {
      const snapshot = await reactionsRef.get();
      const reactions = {};
      const userReactions = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        const type = data.reactionType;
        reactions[type] = (reactions[type] || 0) + 1;

        // Check if user has reacted
        if (clientIp && data.userIp) {
          try {
            if (bcrypt.compareSync(clientIp, data.userIp)) {
              userReactions.push(type);
            }
          } catch (error) {
            // Skip invalid hashes
          }
        }
      });

      return res.status(200).json({ reactions, userReactions });
    } catch (error) {
      console.error("Error fetching reactions:", error);
      return res.status(500).json({ error: "Failed to fetch reactions" });
    }
  }

  if (req.method === "POST") {
    if (!reactionType) {
      return res.status(400).json({ error: "Missing reactionType" });
    }

    if (!clientIp) {
      return res.status(400).json({ error: "Unable to identify user" });
    }

    try {
      // Check if user already reacted with this type
      const snapshot = await reactionsRef
        .where("reactionType", "==", reactionType)
        .get();

      let found = false;
      let docId = null;

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userIp) {
          try {
            if (bcrypt.compareSync(clientIp, data.userIp)) {
              found = true;
              docId = doc.id;
            }
          } catch (error) {
            // Skip invalid hashes
          }
        }
      });

      if (found && docId) {
        // Remove reaction
        await reactionsRef.doc(docId).delete();
      } else {
        // Add reaction
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(clientIp, salt);
        await reactionsRef.add({
          reactionType,
          userIp: hash,
          createdAt: new Date().toISOString(),
        });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error processing reaction:", error);
      return res.status(500).json({ error: "Failed to process reaction" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

