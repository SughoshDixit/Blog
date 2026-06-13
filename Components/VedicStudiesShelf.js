import React, { useMemo } from "react";
import { generateSlug } from "../Lib/utils";
import { FiBookOpen, FiBookmark, FiArrowRight } from "react-icons/fi";
import { FaOm } from "react-icons/fa";

function VedicStudiesShelf({ blogs }) {
  const { essayBlogs, playlistBlogs } = useMemo(() => {
    const topicBlogs = (blogs || []).filter(
      (blog) => blog?.data?.isPublished && blog?.data?.Topic === "Vedic Studies"
    );

    // Sort by date/id descending
    const sorted = [...topicBlogs].sort((a, b) => {
      const da = Date.parse(a?.data?.Date);
      const db = Date.parse(b?.data?.Date);
      if (!Number.isNaN(da) && !Number.isNaN(db)) return db - da;
      return (Number(b?.data?.Id) || 0) - (Number(a?.data?.Id) || 0);
    });

    const playlist = sorted.filter(
      (blog) => blog.data?.Series === "Ekadashi and its significance"
    );
    const essays = sorted.filter(
      (blog) => blog.data?.Series !== "Ekadashi and its significance"
    );

    return {
      essayBlogs: essays,
      playlistBlogs: playlist,
    };
  }, [blogs]);

  if (essayBlogs.length === 0 && playlistBlogs.length === 0) return null;

  return (
    <section
      className="reveal rounded-3xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white/90 dark:bg-[#2C2A27]/90 shadow-lg shadow-black/5 overflow-hidden"
      aria-labelledby="vedic-studies-shelf-heading"
    >
      {/* Header section with warm Vedic palette */}
      <div className="p-6 md:p-8 border-b border-[#E0DDD9] dark:border-[#3D3A36] bg-gradient-to-r from-[#FFF9F3] via-white to-[#FFF9F3] dark:from-[#2A231C] dark:via-[#2C2A27] dark:to-[#2A231C] flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#D97706] dark:text-[#F59E0B] mb-2">
            <FaOm className="w-5 h-5 shrink-0 animate-pulse" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-widest">Vedic Studies & Philosophy</span>
          </div>
          <h2
            id="vedic-studies-shelf-heading"
            className="text-2xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-1"
            style={{ fontFamily: "Charter, Georgia, serif" }}
          >
            Śāstra, Dharma &amp; Metaphysics
          </h2>
          <p className="text-sm text-[#6E6B68] dark:text-[#B8B4B0] max-w-xl">
            Rigorous philosophical deep-dives, word-by-word stotra exegesis, and scriptural guidelines for spiritual practices.
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
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Deep-Dive Essays */}
          <div className="space-y-5 min-w-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9a8f75] dark:text-[#8C857B] flex items-center gap-1.5 mb-2">
              <FiBookOpen className="w-4 h-4 text-[#D97706]" />
              Deep-Dive Essays &amp; Exegesis
            </h3>
            <div className="space-y-4">
              {essayBlogs.slice(0, 3).map((blog) => (
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

          {/* Right: Ekadashi & Significance Playlist */}
          <div className="space-y-5 min-w-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9a8f75] dark:text-[#8C857B] flex items-center gap-1.5 mb-2">
              <FiBookmark className="w-4 h-4 text-[#D97706]" />
              Ekadashi &amp; Sacred Series
            </h3>
            
            {playlistBlogs.length > 0 ? (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFF9F2] to-[#FFF3E5] dark:from-[#2B231A] dark:to-[#342415] border border-[#FCD34D] dark:border-[#78350F] relative overflow-hidden shadow-inner">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#F59E0B]/5 rounded-full blur-2xl -mr-6 -mt-6"></div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 text-[#D97706] dark:text-[#F59E0B] text-[10px] font-bold uppercase tracking-widest mb-3">
                    Featured Playlist
                  </span>
                  <h4 className="text-lg font-bold text-[#78350F] dark:text-[#FCD34D] mb-1" style={{ fontFamily: "Charter, Georgia, serif" }}>
                    Ekadashi and its significance
                  </h4>
                  <p className="text-xs text-[#92400E] dark:text-[#FDE68A]/80 leading-relaxed mb-4">
                    A curated series covering the history, exegesis, fasting science, and scriptural narratives of holy Ekadashi fasts.
                  </p>
                  
                  <div className="space-y-3">
                    {playlistBlogs.map((blog) => (
                      <a
                        key={blog.data.Id}
                        href={`/blogs/${generateSlug(blog.data.Title)}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/70 dark:bg-black/30 border border-[#FEE2E2]/10 hover:border-[#D97706] dark:hover:border-[#F59E0B] hover:bg-white dark:hover:bg-black/50 transition-all group/item"
                      >
                        <div className="h-8 w-8 rounded-lg bg-[#D97706]/10 dark:bg-[#F59E0B]/10 flex items-center justify-center font-bold text-xs text-[#D97706] dark:text-[#F59E0B] shrink-0">
                          {blog.data.SeriesPart || "1"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#161513] dark:text-[#F5F4F2] group-hover/item:text-[#D97706] dark:group-hover/item:text-[#F59E0B] transition-colors truncate">
                            {blog.data.Title}
                          </p>
                          <p className="text-[10px] text-[#8C857B] dark:text-[#A19A91]">
                            Part {blog.data.SeriesPart || "1"} &middot; {blog.readTime.text}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-dashed border-[#EEE4D5] dark:border-[#3D3A36] text-center text-sm text-[#8C857B] dark:text-[#A19A91]">
                No playlist items loaded.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default VedicStudiesShelf;
