import { useEffect, useState } from "react";
import { FiArrowUp, FiList, FiSliders, FiVolume2 } from "react-icons/fi";
import ReadAloud from "./ReadAloud";
import ReadingSettings from "./ReadingSettings";
import MobileTocDrawer from "./MobileTocDrawer";

export default function ReaderDock({ articleRef, headings = [] }) {
  const [activePanel, setActivePanel] = useState(null); // "audio" | "settings" | "toc" | null
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const togglePanel = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const pillBtn = (isActive) =>
    `inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
      isActive
        ? "bg-[#C74634] text-white"
        : "text-[#161513] dark:text-[#F5F4F2] hover:bg-[#FAF8F6] dark:hover:bg-[#201E1C]"
    }`;

  return (
    <>
      <ReadAloud
        articleRef={articleRef}
        docked
        externalOpen={activePanel === "audio"}
        onExternalClose={() => setActivePanel(null)}
      />

      <ReadingSettings
        articleRef={articleRef}
        docked
        externalOpen={activePanel === "settings"}
        onExternalClose={() => setActivePanel(null)}
      />

      <MobileTocDrawer
        headings={headings}
        docked
        externalOpen={activePanel === "toc"}
        onExternalClose={() => setActivePanel(null)}
      />

      {/* Unified Floating Reader Dock */}
      <div
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 inline-flex items-center gap-1 p-1 rounded-full bg-white/95 dark:bg-[#2C2A27]/95 border border-[#E0DDD9] dark:border-[#3D3A36] shadow-xl backdrop-blur-md"
        role="toolbar"
        aria-label="Reader controls"
      >
        <button
          type="button"
          onClick={() => togglePanel("audio")}
          className={pillBtn(activePanel === "audio")}
          title="Read Aloud"
          aria-label="Toggle Read Aloud"
        >
          <FiVolume2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Listen</span>
        </button>

        <button
          type="button"
          onClick={() => togglePanel("settings")}
          className={pillBtn(activePanel === "settings")}
          title="Display & Reading Settings"
          aria-label="Toggle Reading Settings"
        >
          <FiSliders className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Aa</span>
        </button>

        {headings && headings.length > 0 && (
          <button
            type="button"
            onClick={() => togglePanel("toc")}
            className={`${pillBtn(activePanel === "toc")} lg:hidden`}
            title="Table of Contents"
            aria-label="Toggle Table of Contents"
          >
            <FiList className="w-3.5 h-3.5" />
            <span>Contents</span>
          </button>
        )}

        {showTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={pillBtn(false)}
            title="Back to top"
            aria-label="Back to top"
          >
            <FiArrowUp className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </>
  );
}
