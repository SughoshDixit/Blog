import { useState } from "react";
import { useTheme } from "next-themes";
import useSWR, { useSWRConfig } from "swr";
import { AiOutlineHeart, AiFillHeart, AiOutlineLoading } from "react-icons/ai";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function LikeBtn({ id }) {
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const { data, error } = useSWR(`/api/likes/${id}`, fetcher);

  const handelClick = async () => {
    setLoading(true);
    const response = await fetch("/api/like-blog", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      mutate(`/api/likes/${id}`);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-8 pb-4 sm:pt-16 sm:pb-6">
      {loading ? (
        <AiOutlineLoading
          className="animate-spin text-gray-500"
          style={{ fontSize: "1.25rem" }}
        />
      ) : (
        <div className="flex items-center space-x-2">
          <button 
            onClick={handelClick} 
            disabled={loading ? true : false}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {data && data.hasUserLiked ? (
              <AiFillHeart
                className="text-red-500"
                style={{ fontSize: "1.5rem" }}
              />
            ) : (
              <AiOutlineHeart 
                className="text-gray-500"
                style={{ fontSize: "1.5rem" }} 
              />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {data && data.totalLikes}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default LikeBtn;
