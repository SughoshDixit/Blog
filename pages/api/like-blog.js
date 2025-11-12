import db from "../../Firebase/Firebase-admin";
const requestIp = require("request-ip");
const bcrypt = require("bcryptjs");

export default async (req, res) => {
  if (req.method == "POST") {
    const clientIp = requestIp.getClientIp(req);
    const pid = req.body.id;

    // Validate that we have both clientIp and pid
    if (!clientIp || !pid) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const likeRef = db.collection("posts").doc(pid).collection("likes");

    try {
      const snapshot = await likeRef.get();
      let isFound = false;
      let docId;
      snapshot.forEach((doc) => {
        const docData = doc.data();
        const userIp = docData?.userIp;
        
        // Only compare if userIp exists and clientIp is valid
        if (clientIp && userIp && typeof userIp === 'string') {
          try {
            if (bcrypt.compareSync(clientIp, userIp)) {
              isFound = true;
              docId = doc.id;
            }
          } catch (error) {
            // If comparison fails (e.g., invalid hash), skip this document
            console.error('Error comparing IP hash:', error);
          }
        }
      });

      if (!isFound) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(clientIp, salt);
        await likeRef.add({ userIp: hash });
      } else {
        await likeRef.doc(docId).delete();
      }
      res.status(200).json({ message: "Successful" });
    } catch (error) {
      console.error('Error processing like:', error);
      res.status(500).json({ message: "Error processing like", error: error.message });
    }
  } else {
    res.status(304).json({ message: "Invalid Request" });
  }
};
