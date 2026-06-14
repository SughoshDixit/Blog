import { generateSlug } from "../Lib/utils";
import { FiPlayCircle, FiArrowRight } from "react-icons/fi";

/**
 * Generic "playlist" shelf: renders a curated, numbered series of blog posts
 * as a single card (like a YouTube playlist, but for essays).
 *
 * Props:
 *  - kicker:   small uppercase label above the title
 *  - title:    playlist title
 *  - blurb:    one-line description
 *  - posts:    ordered array of blog objects ({ data, readTime })
 *  - hrefAll:  optional "see all" link
 *  - ctaLabel: optional label for the "see all" link
 *  - numbering:"part" uses data.SeriesPart, anything else uses 1..n
 */
function PlaylistShelf({
  kicker = "Playlist",
  title,
  blurb,
  posts = [],
  hrefAll,
  ctaLabel = "Explore all",
  numbering = "index",
}) {
  if (!posts || posts.length === 0) return null;

  return (
    <section
      className="reveal rounded-3xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white/90 dark:bg-[#2C2A27]/90 shadow-lg shadow-black/5 overflow-hidden"
      aria-label={`${title} playlist`}
    >
      <div className="p-6 md:p-8 border-b border-[#E0DDD9] dark:border-[#3D3A36] bg-gradient-to-r from-[#FFF9F3] via-white to-[#FFF9F3] dark:from-[#2A231C] dark:via-[#2C2A27] dark:to-[#2A231C] flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[#C74634] dark:text-[#E8572A] mb-2">
            <FiPlayCircle className="w-5 h-5 shrink-0" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-widest">
              {kicker} &middot; {posts.length} {posts.length === 1 ? "part" : "parts"}
            </span>
          </div>
          <h2
            className="text-2xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-1"
            style={{ fontFamily: "Charter, Georgia, serif" }}
          >
            {title}
          </h2>
          {blurb && (
            <p className="text-sm text-[#6E6B68] dark:text-[#B8B4B0] max-w-xl">
              {blurb}
            </p>
          )}
        </div>
        {hrefAll && (
          <a
            href={hrefAll}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-[#C74634] hover:bg-[#A73A2C] text-white transition-all shadow-md shadow-[#C74634]/20 shrink-0"
          >
            {ctaLabel}
            <FiArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>

      <div className="p-4 md:p-5">
        <ol className="space-y-2">
          {posts.map((post, index) => {
            const partLabel =
              numbering === "part" && post?.data?.SeriesPart
                ? String(post.data.SeriesPart)
                : String(index + 1);
            return (
              <li key={post?.data?.Id ?? index}>
                <a
                  href={`/blogs/${generateSlug(post.data.Title)}`}
                  className="flex items-center gap-4 p-3 rounded-2xl border border-transparent hover:border-[#dfd2b7] dark:hover:border-[#3D3A36] hover:bg-[#FFFBF7] dark:hover:bg-[#25211D]/60 transition-all group min-w-0"
                >
                  <span className="h-9 w-9 rounded-xl bg-[#C74634]/10 dark:bg-[#E8572A]/15 flex items-center justify-center font-bold text-sm text-[#C74634] dark:text-[#E8572A] shrink-0">
                    {partLabel}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className="block text-sm md:text-base font-semibold text-[#161513] dark:text-[#F5F4F2] group-hover:text-[#C74634] dark:group-hover:text-[#E8572A] transition-colors line-clamp-2"
                      style={{ fontFamily: "Charter, Georgia, serif" }}
                    >
                      {post.data.Title}
                    </span>
                    <span className="block text-xs text-[#8C857B] dark:text-[#A19A91] mt-0.5">
                      {post.data.Date}
                      {post?.readTime?.text ? ` · ${post.readTime.text}` : ""}
                    </span>
                  </span>
                  <FiArrowRight className="w-4 h-4 text-[#bcae93] dark:text-[#6E6B68] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default PlaylistShelf;
