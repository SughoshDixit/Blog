import { useState } from "react";
import { checkAuth } from "../Lib/CheckAuth";
import Alert from "./Alert";
import useSWR, { useSWRConfig } from "swr";
import { useSelector } from "react-redux";
import { AiFillDelete } from "react-icons/ai";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Comments({ id }) {
  const [comment, setComment] = useState("");
  const [viewAlert, setViewAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [textAreaHeight, setTextAreaHeight] = useState(100);

  const { mutate } = useSWRConfig();
  const { data, error } = useSWR(`/api/comments/${id}`, fetcher);
  const user = useSelector((state) => state.user);

  const handleDeleteComment = async (commentId) => {
    const user = checkAuth();

    if (!user) {
      setAlertMessage("Please SignIn to comment");
      setAlertType("error");
      setViewAlert(true);

      setTimeout(() => {
        setViewAlert(false);
      }, 2000);

      return;
    }

    try {
      const response = await fetch('/api/comments/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pid: id,
          commentId: commentId,
          userId: user.uid
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setAlertMessage("Comment deleted successfully..");
        setAlertType("success");
        setViewAlert(true);
        mutate(`/api/comments/${id}`);
      } else {
        setAlertMessage(result.message || "Failed to delete comment");
        setAlertType("error");
        setViewAlert(true);
      }

      setTimeout(() => {
        setViewAlert(false);
      }, 2000);
    } catch (error) {
      console.error("Error deleting comment:", error);
      setAlertMessage("Failed to delete comment");
      setAlertType("error");
      setViewAlert(true);
      setTimeout(() => {
        setViewAlert(false);
      }, 2000);
    }
  };

  const handelPost = async (e) => {
    e.preventDefault();
    const commentText = comment;
    setComment("");

    const user = checkAuth();

    if (!user) {
      setAlertMessage("Please SignIn to comment");
      setAlertType("error");
      setViewAlert(true);

      setTimeout(() => {
        setViewAlert(false);
      }, 2000);

      return;
    }

    if (commentText && user) {
      try {
        const response = await fetch('/api/comments/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pid: id,
            comment: commentText,
            userName: user.name,
            userImage: user.photo,
            userId: user.uid,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setAlertMessage("Comment posted successfully..");
          setAlertType("success");
          setViewAlert(true);
          mutate(`/api/comments/${id}`);
        } else {
          setAlertMessage(result.message || "Failed to post comment");
          setAlertType("error");
          setViewAlert(true);
        }

        setTimeout(() => {
          setViewAlert(false);
        }, 2000);
      } catch (error) {
        console.error("Error posting comment:", error);
        setAlertMessage("Failed to post comment");
        setAlertType("error");
        setViewAlert(true);
        setTimeout(() => {
          setViewAlert(false);
        }, 2000);
      }
    }
  };

  return (
    <>
      <Alert show={viewAlert} type={alertType} message={alertMessage} />
      <div className="flex flex-wrap mb-6 mt-6 mx-auto max-w-screen-md">
        <div className="relative container p-1 appearance-none label-floating">
          <form>
            <textarea
              className="resize-none tracking-wide py-2 px-4 mb-3 leading-relaxed appearance-none block w-full bg-gray-100 border border-gray-100 dark:bg-gray-800 dark:border-gray-800 rounded  focus:outline-none focus:bg-white focus:border-gray-300 dark:focus:bg-gray-900 dark:focus:border-gray-700"
              id="message"
              type="text"
              placeholder="What are your thoughts..?"
              rows="3"
              value={comment}
              style={{ height: textAreaHeight }}
              onChange={(e) => {
                setComment(e.target.value);
                setTextAreaHeight(
                  e.target.scrollHeight > 100 ? e.target.scrollHeight : 100
                );
              }}
            />
            <div className="text-right">
              <button
                className="bg-indigo-500 dark:bg-indigo-600 text-white px-3 py-1.5 rounded text-sm font-semibold mr-5"
                onClick={(e) => {
                  e.preventDefault();
                  setComment("");
                }}
              >
                Reset
              </button>
              <button
                className="bg-indigo-500 dark:bg-indigo-600 text-white px-3 py-1.5 rounded text-sm font-semibold"
                onClick={handelPost}
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="mx-auto max-w-screen-md">
        <div className="m-2 md:m-0">
          {data &&
            data.comments &&
            data.comments.map((comment) => (
              <div className="space-y-4 py-3" key={comment.id}>
                <div className="flex">
                  <div className="flex-shrink-0 mr-1.5 md:mr-3">
                    <img
                      className="mt-2 rounded-full w-8 h-8 sm:w-10 sm:h-10"
                      src={comment.userImage}
                      alt={comment.userName}
                    />
                  </div>
                  <div className="flex-1 border border-gray-300 dark:border-gray-500 rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed relative ">
                    <strong className="text-gray-700 dark:text-gray-200">
                      {comment.userName}
                    </strong>{" "}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {String(comment?.date || "").split(" ").slice(1, 4).join("-")}
                    </span>
                    {comment && user && comment.userId === user.uid && (
                      <span
                        className="absolute right-6 top-5 cursor-pointer"
                        onClick={(e) => handleDeleteComment(comment.id)}
                      >
                        <AiFillDelete />
                      </span>
                    )}
                    {String(comment?.comment || "").split("\n").map((com, index) => (
                      <p
                        className="text-sm text-gray-600 dark:text-gray-300"
                        key={index}
                      >
                        {com}
                      </p>
                    ))}
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
