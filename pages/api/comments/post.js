import db from "../../../Firebase/Firebase-admin";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { pid, comment, userName, userImage, userId } = req.body;

    if (!pid || !comment || !userName || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const commentsRef = db.collection("posts").doc(pid).collection("comments");
    
    const docData = {
      userName,
      userImage: userImage || "",
      comment,
      date: new Date(),
      userId,
    };

    const docRef = await commentsRef.add(docData);

    res.status(200).json({ 
      message: "Comment posted successfully",
      id: docRef.id 
    });
  } catch (error) {
    console.error("Error posting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
