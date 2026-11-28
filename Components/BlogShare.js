import { useState } from "react";
import { FaTwitter, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { FiLink, FiCheck, FiShare2 } from "react-icons/fi";
import { generateSlug } from "../Lib/utils";
import { SITE_URL } from "../Lib/siteConfig";

function BlogShare({ data }) {
  const [copied, setCopied] = useState(false);

  const title = data?.Title || "";
  const slug = generateSlug(title);
  const url = `${SITE_URL}/blogs/${slug}`;
  const hashtags = (data?.Tags || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .join(",");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: data?.Abstract || title, url });
      } catch {
        // Cancelled
      }
    } else {
      handleCopy();
    }
  };

  const btnBase =
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] text-[#161513] dark:text-[#F5F4F2] hover:border-[#C74634] hover:text-[#C74634] dark:hover:text-[#E8572A] transition-colors cursor-pointer";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={handleCopy} className={btnBase} title="Copy article link">
        {copied ? <FiCheck className="w-3.5 h-3.5 text-emerald-600" /> : <FiLink className="w-3.5 h-3.5" />}
        <span>{copied ? "Copied!" : "Copy link"}</span>
      </button>

      <a
        className={btnBase}
        rel="noopener noreferrer"
        target="_blank"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        title="Share on LinkedIn"
      >
        <FaLinkedinIn className="w-3.5 h-3.5 text-[#0A66C2]" />
        <span className="hidden sm:inline">LinkedIn</span>
      </a>

      <a
        className={btnBase}
        rel="noopener noreferrer"
        target="_blank"
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n${url}`)}`}
        title="Share on WhatsApp"
      >
        <FaWhatsapp className="w-3.5 h-3.5 text-[#25D366]" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>

      <a
        className={btnBase}
        rel="noopener noreferrer"
        target="_blank"
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} by @PSughosh`)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`}
        title="Share on X"
      >
        <FaTwitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
        <span className="hidden sm:inline">Post</span>
      </a>

      <button
        type="button"
        onClick={handleNativeShare}
        className={`${btnBase} sm:hidden`}
        title="More share options"
        aria-label="Share"
      >
        <FiShare2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default BlogShare;
