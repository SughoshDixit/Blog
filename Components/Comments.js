import { useState, useEffect } from "react";
import { checkAuth } from "../Lib/CheckAuth";
import Alert from "./Alert";
import { useSelector } from "react-redux";
import { AiFillDelete } from "react-icons/ai";
import CommentReactions from "./CommentReactions";
import { db } from "../Firebase/Firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

function Comments({ id }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [viewAlert, setViewAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [textAreaHeight, setTextAreaHeight] = useState(100);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!id) return;
    const ref = collection(db, "posts", id, "comments");
    const q = query(ref, orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const live = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          comment: data.comment,
          userName: data.userName,
          userImage: data.userImage,
          date: data.date?.toDate ? data.date.toDate().toDateString() : String(data.date || ""),
          userId: data.userId,
        };
      });
      setComments(live);
    }, () => {
      fetch(`/api/comments/${id}`)
        .then((r) => r.json())
        .then((d) => setComments(d.comments || []))
        .catch(() => {});
    });
    return () => unsub();
  }, [id]);

  const showAlert = (msg, type) => {
    setAlertMessage(msg);
    setAlertType(type);
    setViewAlert(true);
    setTimeout(() => setViewAlert(false), 2000);
  };

  const handleDeleteComment = async (commentId) => {
    const u = checkAuth();
    if (!u) return showAlert("Please SignIn to comment", "error");

    try {
      const response = await fetch("/api/comments/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pid: id, commentId, userId: u.uid }),
      });
      if (response.ok) showAlert("Comment deleted", "success");
      else showAlert("Failed to delete comment", "error");
    } catch {
      showAlert("Failed to delete comment", "error");
    }
  };

  const handelPost = async (e) => {
    e.preventDefault();
    const text = comment;
    setComment("");
    const u = checkAuth();
    if (!u) return showAlert("Please SignIn to comment", "error");
    if (!text) return;

    try {
      const response = await fetch("/api/comments/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pid: id,
          comment: text,
          userName: u.name,
          userImage: u.photo,
          userId: u.uid,
        }),
      });
      if (response.ok) showAlert("Comment posted!", "success");
      else showAlert("Failed to post comment", "error");
    } catch {
      showAlert("Failed to post comment", "error");
    }
  };

  return (
    <>
      <Alert show={viewAlert} type={alertType} message={alertMessage} />
      <div className="mb-6 mt-6 mx-auto max-w-screen-md px-4 sm:px-0">
        <div className="relative">
          <form>
            <textarea
              className="resize-none tracking-wide py-3 px-4 mb-4 leading-relaxed appearance-none block w-full bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-lg focus:outline-none focus:bg-white focus:border-gray-300 dark:focus:bg-gray-900 dark:focus:border-gray-600 text-sm sm:text-base"
              id="message"
              type="text"
              placeholder="What are your thoughts..?"
              rows="3"
              value={comment}
              style={{ height: textAreaHeight }}
              onChange={(e) => {
                setComment(e.target.value);
                setTextAreaHeight(e.target.scrollHeight > 100 ? e.target.scrollHeight : 100);
              }}
            />
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
                onClick={(e) => { e.preventDefault(); setComment(""); }}
              >
                Reset
              </button>
              <button
                className="bg-redwood-500 hover:bg-redwood-500 dark:bg-redwood-500 dark:hover:bg-redwood-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
                onClick={handelPost}
              >
                Post Comment
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="mx-auto max-w-screen-md px-4 sm:px-0">
        <div className="space-y-4">
          {comments.map((c) => (
            <div className="py-3" key={c.id}>
              <div className="flex">
                <div className="flex-shrink-0 mr-3">
                  <img className="mt-1 rounded-full w-8 h-8 sm:w-10 sm:h-10" src={c.userImage} alt={c.userName} />
                </div>
                <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-3 sm:px-4 sm:py-4 leading-relaxed relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <strong className="text-sm sm:text-base text-gray-700 dark:text-gray-200">{c.userName}</strong>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {String(c?.date || "").split(" ").slice(1, 4).join("-")}
                      </span>
                    </div>
                    {c && user && c.userId === user.uid && (
                      <button
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        onClick={() => handleDeleteComment(c.id)}
                      >
                        <AiFillDelete className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {String(c?.comment || "").split("\n").map((line, i) => (
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed" key={i}>{line}</p>
                  ))}
                  <CommentReactions commentId={c.id} postId={id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Comments;
