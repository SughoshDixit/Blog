import Image from "next/image";
import { FiYoutube, FiExternalLink } from "react-icons/fi";
import { FaChartLine } from "react-icons/fa";
import {
  DS_EMBED_SRC,
  DS_VIDEOS,
  DS_PLAYLIST_URL,
  YOUTUBE_CHANNEL_URL,
} from "../Lib/dataScienceYouTubeData";

function DataScienceYouTubeShelf() {
  const embedSrc = DS_EMBED_SRC;

  return (
    <section
      className="reveal rounded-3xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white/90 dark:bg-[#2C2A27]/90 shadow-lg shadow-black/5 overflow-hidden"
      aria-labelledby="ds-youtube-shelf-heading"
    >
      <div className="p-6 md:p-8 border-b border-[#E0DDD9] dark:border-[#3D3A36] flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#C74634] dark:text-[#E8572A] mb-2">
            <FaChartLine className="w-4 h-4 shrink-0" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-widest">Data Science on YouTube</span>
          </div>
          <h2
            id="ds-youtube-shelf-heading"
            className="text-2xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-1"
            style={{ fontFamily: "Charter, Georgia, serif" }}
          >
            Data Science &amp; AI
          </h2>
          <p className="text-sm text-[#6E6B68] dark:text-[#B8B4B0] max-w-xl">
            Conversations, tutorials, and career insights — from breaking into data science to building ML products at Oracle.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={DS_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[#C74634] text-white hover:bg-[#A73A2C] transition-colors"
          >
            Watch on YouTube
            <FiExternalLink className="w-4 h-4" />
          </a>
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-[#E0DDD9] dark:border-[#3D3A36] text-[#4f4636] dark:text-[#F5F4F2] hover:border-[#cbbf9f] transition-colors"
          >
            <FiYoutube className="w-4 h-4" />
            @sughoshdixit
          </a>
        </div>
      </div>

      <div className="p-6 md:p-8 pt-0 md:pt-2">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/5 dark:bg-black/40 mb-8">
          <iframe
            title="Data Science & Tech Podcasts playlist by Sughosh Dixit"
            src={embedSrc}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>

        <p className="text-xs uppercase tracking-widest text-[#9a8f75] dark:text-[#6E6B68] mb-4">
          In this series
        </p>
        <ul className="grid gap-4 sm:grid-cols-2">
          {DS_VIDEOS.map(({ id, title }) => (
            <li key={id}>
              <a
                href={`https://www.youtube.com/watch?v=${id}`}
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

        <div className="mt-6 pt-6 border-t border-[#E0DDD9] dark:border-[#3D3A36] flex flex-wrap gap-4">
          <a
            href="/learning-path"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#C74634] dark:text-[#E8572A] hover:underline"
          >
            Read the 30-Day DS Challenge &rarr;
          </a>
          <a
            href="/topic/Data Science"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#6E6B68] dark:text-[#B8B4B0] hover:text-[#C74634] dark:hover:text-[#E8572A] hover:underline transition-colors"
          >
            All Data Science posts &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}

export default DataScienceYouTubeShelf;
