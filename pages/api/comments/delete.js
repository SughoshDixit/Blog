import db from "../../../Firebase/Firebase-admin";

export default async (req, res) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { pid, commentId, userId } = req.body;

    if (!pid || !commentId || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // First, verify the comment exists and belongs to the user
    const commentRef = db.collection("posts").doc(pid).collection("comments").doc(commentId);
    const commentDoc = await commentRef.get();

    if (!commentDoc.exists) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const commentData = commentDoc.data();
    if (commentData.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    // Delete the comment
    await commentRef.delete();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
