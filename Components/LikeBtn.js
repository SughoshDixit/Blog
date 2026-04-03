import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { useSelector } from "react-redux";
import { AiOutlineHeart, AiFillHeart, AiOutlineLoading } from "react-icons/ai";

function LikeBtn({ id, className = "pt-8 pb-4 sm:pt-16 sm:pb-6" }) {
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const user = useSelector((state) => state.user);
  const uid = user?.uid;

  const likeUrl = uid ? `/api/likes/${id}?uid=${uid}` : `/api/likes/${id}`;
  const fetcher = (...args) => fetch(...args).then((r) => r.json());
  const { data } = useSWR(likeUrl, fetcher);

  const handleClick = async () => {
    setLoading(true);
    const body = uid ? { id, uid } : { id };
    const response = await fetch("/api/like-blog", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) mutate(likeUrl);
    setLoading(false);
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {loading ? (
        <AiOutlineLoading className="animate-spin text-gray-500" style={{ fontSize: "1.25rem" }} />
      ) : (
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClick}
            disabled={loading}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {data?.hasUserLiked ? (
              <AiFillHeart className="text-red-500" style={{ fontSize: "1.5rem" }} />
            ) : (
              <AiOutlineHeart className="text-gray-500" style={{ fontSize: "1.5rem" }} />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {data?.totalLikes ?? ""}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default LikeBtn;
