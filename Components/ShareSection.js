import { useState, useEffect } from "react";
import { FiShare2, FiCheck } from "react-icons/fi";

function ShareSection({ headingId, headingText }) {
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleShare = async () => {
    if (!isClient) return;
    const url = `${window.location.origin}${window.location.pathname}#${headingId}`;
    
    try {
      if (navigator.share) {
        // Use native share API on mobile
        await navigator.share({
          title: headingText,
          text: `Check out this section: ${headingText}`,
          url: url,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      // User cancelled or error occurred
      if (error.name !== "AbortError") {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  if (!isClient) return null;

  return (
    <button
      onClick={handleShare}
      className="ml-2 p-1.5 text-gray-400 hover:text-[#1a8917] dark:hover:text-[#26c281] transition-colors opacity-0 group-hover:opacity-100"
      title="Share this section"
    >
      {copied ? (
        <FiCheck className="w-4 h-4 text-green-500" />
      ) : (
        <FiShare2 className="w-4 h-4" />
      )}
    </button>
  );
}

export default ShareSection;

