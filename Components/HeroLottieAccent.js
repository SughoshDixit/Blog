import { FaFutbol } from "react-icons/fa";
import useSWR from "swr";
import { useState, useEffect } from "react";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function HeroLottieAccent() {
  const { data, error } = useSWR(
    "https://api.rss2json.com/v1/api.json?rss_url=http://feeds.bbci.co.uk/sport/football/rss.xml",
    fetcher,
    { refreshInterval: 60000 } // Refresh feed every minute
  );

  const items = data?.items?.slice(0, 5) || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;

    const intervalId = setInterval(() => {
      setIsFading(true);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        setIsFading(false);
      }, 500); // 500ms fade out duration
      
    }, 6000); // Cycle every 6 seconds

    return () => clearInterval(intervalId);
  }, [items.length]);

  const currentItem = items[currentIndex];

  return (
    <div className="reveal-scale rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-4 py-3 shadow-lg shadow-black/20 w-72 md:w-80">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#B8E0D8]/80 flex items-center gap-2 m-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8572A] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C74634]"></span>
          </span>
          Live Football News
        </p>
        <FaFutbol className="text-white/40 text-sm animate-[spin_4s_linear_infinite]" />
      </div>
      
      <div className="h-32 overflow-hidden rounded-xl border border-white/10 bg-[#161513]/60 relative flex items-center p-4">
        {/* Background tactical lines */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
        
        <div className="relative z-10 w-full h-full flex flex-col justify-center">
          {error ? (
            <p className="text-sm text-red-400">Failed to load live feed.</p>
          ) : !data ? (
            <div className="flex items-center gap-3 w-full">
              <div className="w-6 h-6 rounded-full border-2 border-[#C74634]/30 border-t-[#C74634] animate-spin shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-2 bg-white/10 rounded w-full animate-pulse"></div>
                <div className="h-2 bg-white/10 rounded w-2/3 animate-pulse"></div>
                <div className="h-2 bg-white/10 rounded w-4/5 animate-pulse"></div>
              </div>
            </div>
          ) : currentItem ? (
            <a 
              href={currentItem.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`block group transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
            >
              <h3 
                className="text-white text-base font-semibold leading-snug line-clamp-3 group-hover:text-[#F5E4D3] transition-colors"
                style={{ fontFamily: "Charter, Georgia, serif" }}
              >
                {currentItem.title}
              </h3>
              <div className="mt-2 text-[11px] text-[#B8E0D8]/60 flex items-center gap-1 group-hover:text-[#C74634] transition-colors uppercase tracking-wider font-semibold">
                Read full story &rarr;
              </div>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
