import { useMemo } from "react";
import { generateSlug, sortByDateDesc } from "../Lib/utils";
import PlaylistShelf from "./PlaylistShelf";
import {
  FEATURED_FEED_SLUGS,
  PLAYLIST_EXCLUDED_TOPICS,
  playlistMetaFor,
} from "../Lib/homeCuration";
import { isUnlisted } from "../Lib/postVisibility";

const byDateDesc = sortByDateDesc;

const bySeriesPartAsc = (a, b) =>
  (Number(a?.data?.SeriesPart) || 0) - (Number(b?.data?.SeriesPart) || 0);

/**
 * Auto-groups every published editorial post (minus the curated home feed and
 * minus topics handled elsewhere) into curated playlists:
 *   1. Posts sharing a `Series` become one playlist (ordered by SeriesPart).
 *   2. Remaining posts are grouped by `Topic` into a playlist each.
 * Presentation/labels come from PLAYLIST_META in Lib/homeCuration.js.
 */
function BlogPlaylists({ blogs = [], featuredSlugs = FEATURED_FEED_SLUGS }) {
  const featuredSet = useMemo(
    () => new Set(featuredSlugs),
    [featuredSlugs]
  );

  const playlists = useMemo(() => {
    const candidates = (blogs || []).filter((blog) => {
      if (!blog?.data?.isPublished) return false;
      if (isUnlisted(blog)) return false;
      const topic = blog?.data?.Topic || "";
      if (PLAYLIST_EXCLUDED_TOPICS.includes(topic)) return false;
      const slug = generateSlug(blog?.data?.Title || "");
      if (featuredSet.has(slug)) return false;
      return true;
    });

    const seriesGroups = new Map();
    const topicGroups = new Map();

    for (const blog of candidates) {
      const series = (blog?.data?.Series || "").trim();
      if (series) {
        if (!seriesGroups.has(series)) seriesGroups.set(series, []);
        seriesGroups.get(series).push(blog);
      } else {
        const topic = (blog?.data?.Topic || "Essays").trim();
        if (!topicGroups.has(topic)) topicGroups.set(topic, []);
        topicGroups.get(topic).push(blog);
      }
    }

    const result = [];

    for (const [series, posts] of seriesGroups.entries()) {
      const meta = playlistMetaFor(series);
      result.push({
        key: `series:${series}`,
        kicker: meta.kicker || "Series",
        title: meta.title || series,
        blurb: meta.blurb,
        order: meta.order ?? 50,
        numbering: "part",
        posts: [...posts].sort(bySeriesPartAsc),
        hrefAll: posts[0]
          ? `/blogs/${generateSlug(posts[0].data.Title)}`
          : undefined,
        ctaLabel: "Start the series",
      });
    }

    for (const [topic, posts] of topicGroups.entries()) {
      const meta = playlistMetaFor(topic);
      result.push({
        key: `topic:${topic}`,
        kicker: meta.kicker || "Collection",
        title: meta.title || topic,
        blurb: meta.blurb,
        order: meta.order ?? 60,
        numbering: "index",
        posts: [...posts].sort(byDateDesc),
        hrefAll: `/topic/${encodeURIComponent(topic)}`,
        ctaLabel: "Explore topic",
      });
    }

    return result.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  }, [blogs, featuredSet]);

  if (playlists.length === 0) return null;

  return (
    <div className="space-y-14">
      <div className="reveal rounded-3xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white/90 dark:bg-[#2C2A27] p-8 shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-[#9a8f75] dark:text-[#6E6B68] mb-2">
          Curated Playlists
        </p>
        <h2
          className="text-2xl md:text-3xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-2"
          style={{ fontFamily: "Charter, Georgia, serif" }}
        >
          Read by series, not by scroll
        </h2>
        <p className="text-sm md:text-base text-[#5e5645] dark:text-[#B8B4B0]">
          Every essay outside the editorial picks is organized into a binge-able
          playlist — start at part one and follow the thread.
        </p>
      </div>

      {playlists.map((pl) => (
        <PlaylistShelf
          key={pl.key}
          kicker={pl.kicker}
          title={pl.title}
          blurb={pl.blurb}
          posts={pl.posts}
          hrefAll={pl.hrefAll}
          ctaLabel={pl.ctaLabel}
          numbering={pl.numbering}
        />
      ))}
    </div>
  );
}

export default BlogPlaylists;
