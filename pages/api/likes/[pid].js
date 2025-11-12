import db from "../../../Firebase/Firebase-admin";
const requestIp = require("request-ip");
const bcrypt = require("bcryptjs");

export default async (req, res) => {
  const { pid } = req.query;

  // Validate that we have pid
  if (!pid) {
    return res.status(400).json({ message: "Missing post ID" });
  }

  let hasUserLiked = false,
    totalLikes = 0;
  const clientIp = requestIp.getClientIp(req);
  const likeRef = db.collection("posts").doc(pid).collection("likes");

  try {
    const snapshot = await likeRef.get();
    snapshot.forEach((doc) => {
      const docData = doc.data();
      const userIp = docData?.userIp;
      
      // Only compare if userIp exists and clientIp is valid
      if (clientIp && userIp && typeof userIp === 'string') {
        try {
          if (bcrypt.compareSync(clientIp, userIp)) {
            hasUserLiked = true;
          }
        } catch (error) {
          // If comparison fails (e.g., invalid hash), skip this document
          console.error('Error comparing IP hash:', error);
        }
      }
      totalLikes++;
    });

    res.status(200).json({ hasUserLiked: hasUserLiked, totalLikes: totalLikes });
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ message: "Error fetching likes", error: error.message });
  }
};
