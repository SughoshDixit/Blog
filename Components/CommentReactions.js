import { useState, useEffect } from "react";
import { FiThumbsUp, FiHeart, FiSmile, FiHelpCircle } from "react-icons/fi";
import useSWR, { useSWRConfig } from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const REACTIONS = [
  { type: "like", icon: FiThumbsUp, label: "Like", emoji: "👍" },
  { type: "love", icon: FiHeart, label: "Love", emoji: "❤️" },
  { type: "celebrate", icon: FiSmile, label: "Celebrate", emoji: "🎉" },
  { type: "insightful", icon: FiHelpCircle, label: "Insightful", emoji: "🤔" },
];

function CommentReactions({ commentId, postId }) {
  const { data, error } = useSWR(`/api/comments/reactions?commentId=${commentId}&postId=${postId}`, fetcher);
  const { mutate } = useSWRConfig();
  const [isReacting, setIsReacting] = useState(false);

  const handleReaction = async (reactionType) => {
    setIsReacting(true);
    try {
      const response = await fetch("/api/comments/reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId,
          postId,
          reactionType,
        }),
      });

      if (response.ok) {
        mutate(`/api/comments/reactions?commentId=${commentId}&postId=${postId}`);
      }
    } catch (error) {
      console.error("Error reacting to comment:", error);
    } finally {
      setIsReacting(false);
    }
  };

  if (error) return null;

  const reactions = data?.reactions || {};
  const userReactions = data?.userReactions || [];

  return (
    <div className="flex items-center gap-2 mt-2">
      {REACTIONS.map((reaction) => {
        const Icon = reaction.icon;
        const count = reactions[reaction.type] || 0;
        const isActive = userReactions.includes(reaction.type);

        return (
          <button
            key={reaction.type}
            onClick={() => handleReaction(reaction.type)}
            disabled={isReacting}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${
              isActive
                ? "bg-[#1a8917]/10 dark:bg-[#26c281]/20 text-[#1a8917] dark:text-[#26c281]"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            title={reaction.label}
          >
            <span>{reaction.emoji}</span>
            {count > 0 && <span className="font-medium">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}

export default CommentReactions;

