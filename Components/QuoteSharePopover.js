import { useEffect, useState } from "react";
import { FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { FiCopy, FiCheck } from "react-icons/fi";
import { SITE_URL } from "../Lib/siteConfig";

export default function QuoteSharePopover({ articleRef, title, slug }) {
  const [selection, setSelection] = useState(null); // { text, top, left }
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const updateSelection = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !articleRef?.current) {
        setSelection(null);
        return;
      }

      const text = sel.toString().trim();
      if (text.length < 15 || text.length > 280) {
        setSelection(null);
        return;
      }

      const anchorNode = sel.anchorNode;
      if (!anchorNode || !articleRef.current.contains(anchorNode)) {
        setSelection(null);
        return;
      }

      try {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (!rect || (rect.width === 0 && rect.height === 0)) {
          setSelection(null);
          return;
        }
        setSelection({
          text,
          top: Math.max(12, rect.top + window.scrollY - 48),
          left: Math.min(
            window.innerWidth - 140,
            Math.max(140, rect.left + rect.width / 2 + window.scrollX)
          ),
        });
      } catch {
        setSelection(null);
      }
    };

    const handleClear = (e) => {
      if (e.target?.closest?.("[data-quote-popover]")) return;
      setTimeout(updateSelection, 10);
    };

    document.addEventListener("mouseup", handleClear);
    document.addEventListener("keyup", handleClear);
    document.addEventListener("touchend", handleClear);

    return () => {
      document.removeEventListener("mouseup", handleClear);
      document.removeEventListener("keyup", handleClear);
      document.removeEventListener("touchend", handleClear);
    };
  }, [articleRef]);

  if (!selection) return null;

  const url = `${SITE_URL}/blogs/${slug}`;
  const quoteText = `"${selection.text}"`;

  const handleCopyQuote = async () => {
    try {
      await navigator.clipboard.writeText(`${quoteText}\n— ${title} (${url})`);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setSelection(null);
      }, 1200);
    } catch {
      // Ignore
    }
  };

  return (
    <div
      data-quote-popover="true"
      style={{
        position: "absolute",
        top: `${selection.top}px`,
        left: `${selection.left}px`,
        transform: "translateX(-50%)",
      }}
      className="z-50 flex items-center gap-1 px-2 py-1.5 rounded-full bg-[#161513] dark:bg-[#2C2A27] text-white border border-[#3D3A36] shadow-2xl text-xs"
    >
      <button
        type="button"
        onClick={handleCopyQuote}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        title="Copy quote with link"
      >
        {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
        <span>{copied ? "Copied" : "Copy quote"}</span>
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${quoteText} — @PSughosh`)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
        title="Share quote on X"
        aria-label="Share quote on X"
      >
        <FaTwitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
      >
        <FaLinkedinIn className="w-3.5 h-3.5 text-[#60A5FA]" />
      </a>
    </div>
  );
}
