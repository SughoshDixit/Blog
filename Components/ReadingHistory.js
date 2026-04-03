import { useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../Firebase/Firebase";
import { doc, setDoc } from "firebase/firestore";

function ReadingHistory({ postId, postTitle, postData }) {
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (typeof window === "undefined" || !postId || !postTitle) return;

    const history = JSON.parse(localStorage.getItem("readingHistory") || "[]");
    const filtered = history.filter((h) => h.id !== postId);
    const entry = {
      id: postId,
      title: postTitle,
      data: postData,
      readAt: new Date().toISOString(),
    };
    const updated = [entry, ...filtered].slice(0, 50);
    localStorage.setItem("readingHistory", JSON.stringify(updated));

    if (user?.uid) {
      const ref = doc(db, "users", user.uid, "history", postId);
      setDoc(ref, {
        title: postTitle,
        topic: postData?.Topic || "",
        readAt: new Date().toISOString(),
      }, { merge: true }).catch(() => {});
    }
  }, [postId, postTitle, postData, user]);

  return null;
}

export default ReadingHistory;
