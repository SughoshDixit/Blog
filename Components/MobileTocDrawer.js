import { useState } from "react";
import { FiList, FiX } from "react-icons/fi";

export default function MobileTocDrawer({ headings = [] }) {
  const [open, setOpen] = useState(false);

  if (!headings || headings.length === 0) return null;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 left-4 z-40 inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white/95 dark:bg-[#2C2A27]/95 border border-[#E0DDD9] dark:border-[#3D3A36] text-xs font-semibold text-[#161513] dark:text-[#F5F4F2] shadow-lg backdrop-blur-md hover:border-[#C74634] transition-all cursor-pointer"
        aria-label="Open table of contents"
      >
        <FiList className="w-3.5 h-3.5 text-[#C74634] dark:text-[#E8572A]" />
        <span>Contents</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-t-3xl bg-white dark:bg-[#2C2A27] border-t border-[#E0DDD9] dark:border-[#3D3A36] p-6 max-h-[70vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E0DDD9] dark:border-[#3D3A36]">
              <h3
                className="text-base font-semibold text-[#161513] dark:text-[#F5F4F2]"
                style={{ fontFamily: "Charter, Georgia, serif" }}
              >
                In This Article
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-full text-[#6E6B68] hover:text-[#161513] dark:text-[#B8B4B0] dark:hover:text-[#F5F4F2] cursor-pointer"
                aria-label="Close table of contents"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
            <nav aria-label="Article table of contents">
              <ul className="space-y-2.5">
                {headings.map((h, i) => (
                  <li
                    key={`${h.id}-${i}`}
                    style={{ paddingLeft: `${Math.max(0, (h.level - 2) * 14)}px` }}
                  >
                    <a
                      href={`#${h.id}`}
                      onClick={() => setOpen(false)}
                      className="block py-1 text-sm text-[#5e5645] dark:text-[#B8B4B0] hover:text-[#C74634] dark:hover:text-[#E8572A] transition-colors"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
