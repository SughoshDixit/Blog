import Image from "next/image";
import { FiYoutube, FiExternalLink } from "react-icons/fi";
import {
  TECH_PODCASTS_PLAYLIST_ID,
  TECH_PODCASTS_PLAYLIST_URL,
  TECH_PODCAST_VIDEOS,
  YOUTUBE_CHANNEL_URL,
} from "../Lib/techPodcastsData";

function TechPodcastsShelf() {
  const embedSrc = `https://www.youtube.com/embed/videoseries?list=${TECH_PODCASTS_PLAYLIST_ID}&modestbranding=1`;

  return (
    <section
      className="reveal rounded-3xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white/90 dark:bg-[#2C2A27]/90 shadow-lg shadow-black/5 overflow-hidden"
      aria-labelledby="tech-podcasts-heading"
    >
      <div className="p-6 md:p-8 border-b border-[#E0DDD9] dark:border-[#3D3A36] flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#C74634] dark:text-[#E8572A] mb-2">
            <FiYoutube className="w-5 h-5 shrink-0" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-widest">YouTube</span>
          </div>
          <h2
            id="tech-podcasts-heading"
            className="text-2xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-1"
            style={{ fontFamily: "Charter, Georgia, serif" }}
          >
            Tech Podcasts
          </h2>
          <p className="text-sm text-[#6E6B68] dark:text-[#B8B4B0] max-w-xl">
            Conversations and shorts from the channel — data science, AI, and the journey in tech.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={TECH_PODCASTS_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[#C74634] text-white hover:bg-[#A73A2C] transition-colors"
          >
            Open playlist
            <FiExternalLink className="w-4 h-4" />
          </a>
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-[#E0DDD9] dark:border-[#3D3A36] text-[#4f4636] dark:text-[#F5F4F2] hover:border-[#cbbf9f] transition-colors"
          >
            @sughoshdixit
          </a>
        </div>
      </div>

      <div className="p-6 md:p-8 pt-0 md:pt-2">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/5 dark:bg-black/40 mb-8">
          <iframe
            title="Tech Podcasts playlist on YouTube"
            src={embedSrc}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>

        <p className="text-xs uppercase tracking-widest text-[#9a8f75] dark:text-[#6E6B68] mb-4">
          In this playlist
        </p>
        <ul className="grid gap-4 sm:grid-cols-2">
          {TECH_PODCAST_VIDEOS.map(({ id, title }) => (
            <li key={id}>
              <a
                href={`https://www.youtube.com/watch?v=${id}&list=${TECH_PODCASTS_PLAYLIST_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-3 rounded-xl border border-transparent hover:border-[#dfd2b7] dark:hover:border-[#3D3A36] p-2 -m-2 transition-colors"
              >
                <div className="relative w-28 shrink-0 aspect-video rounded-lg overflow-hidden bg-[#E0DDD9] dark:bg-[#3D3A36]">
                  <Image
                    src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
                    alt=""
                    layout="fill"
                    objectFit="cover"
                    sizes="112px"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiYoutube className="w-8 h-8 text-white drop-shadow" />
                  </span>
                </div>
                <span className="text-sm font-medium text-[#161513] dark:text-[#F5F4F2] group-hover:text-[#C74634] dark:group-hover:text-[#E8572A] leading-snug line-clamp-3">
                  {title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default TechPodcastsShelf;
