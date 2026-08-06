import React, { useMemo } from "react";
import { generateSlug } from "../Lib/utils";
import { FiBookOpen, FiArrowRight } from "react-icons/fi";
import { FaOm } from "react-icons/fa";

function VedicStudiesShelf({ blogs }) {
  const essayBlogs = useMemo(() => {
    const topicBlogs = (blogs || []).filter(
      (blog) => blog?.data?.isPublished && blog?.data?.Topic === "Vedic Studies"
    );

    return [...topicBlogs].sort((a, b) => {
      const da = Date.parse(a?.data?.Date);
      const db = Date.parse(b?.data?.Date);
      if (!Number.isNaN(da) && !Number.isNaN(db)) return db - da;
      return (Number(b?.data?.Id) || 0) - (Number(a?.data?.Id) || 0);
    });
  }, [blogs]);

  if (essayBlogs.length === 0) return null;

  return (
    <section
      className="reveal rounded-3xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white/90 dark:bg-[#2C2A27]/90 shadow-lg shadow-black/5 overflow-hidden"
      aria-labelledby="vedic-studies-shelf-heading"
    >
      <div className="p-6 md:p-8 border-b border-[#E0DDD9] dark:border-[#3D3A36] bg-gradient-to-r from-[#FFF9F3] via-white to-[#FFF9F3] dark:from-[#2A231C] dark:via-[#2C2A27] dark:to-[#2A231C] flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#D97706] dark:text-[#F59E0B] mb-2">
            <FaOm className="w-5 h-5 shrink-0 animate-pulse" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-widest">Vedic Studies &amp; Philosophy</span>
          </div>
          <h2
            id="vedic-studies-shelf-heading"
            className="text-2xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-1"
            style={{ fontFamily: "Charter, Georgia, serif" }}
          >
            Śāstra, Dharma &amp; Metaphysics
          </h2>
          <p className="text-sm text-[#6E6B68] dark:text-[#B8B4B0] max-w-xl">
            Philosophical deep-dives, scriptural commentary, and foundational discussions on Indian thought.
          </p>
        </div>
        <div>
          <a
            href="/topic/Vedic Studies"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-[#D97706] hover:bg-[#B45309] text-white transition-all shadow-md shadow-[#D97706]/20"
          >
            Explore Topic
            <FiArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {essayBlogs.map((blog) => (
            <a
              key={blog.data.Id}
              href={`/blogs/${generateSlug(blog.data.Title)}`}
              className="block p-5 rounded-2xl border border-[#EEE4D5] dark:border-[#3D3A36] bg-[#FFFBF7]/50 dark:bg-[#25211D]/40 hover:border-[#D97706] hover:bg-[#FFFBF7] dark:hover:bg-[#2A231C] transition-all duration-300 group min-w-0"
            >
              <div className="flex items-center gap-2 text-xs text-[#8C857B] dark:text-[#A19A91] mb-2">
                <span>{blog.data.Date}</span>
                <span>&middot;</span>
                <span>{blog.readTime.text}</span>
              </div>
              <h4 className="text-base font-semibold text-[#161513] dark:text-[#F5F4F2] group-hover:text-[#D97706] dark:group-hover:text-[#F59E0B] transition-colors line-clamp-2" style={{ fontFamily: "Charter, Georgia, serif" }}>
                {blog.data.Title}
              </h4>
              <p className="text-xs text-[#6E6B68] dark:text-[#B8B4B0] mt-2 line-clamp-2 leading-relaxed">
                {blog.data.Abstract}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default VedicStudiesShelf;
