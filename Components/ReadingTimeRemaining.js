import { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";

function ReadingTimeRemaining({ readTime, articleRef }) {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [finishBy, setFinishBy] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!readTime || !articleRef?.current) return;

    const minutesMatch = readTime.match(/(\d+)\s*min/);
    if (!minutesMatch) return;

    const totalMinutes = parseInt(minutesMatch[1], 10);
    if (!totalMinutes) return;

    const updateTimeRemaining = () => {
      const article = articleRef.current;
      if (!article) return;

      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      const scrollPosition = scrollTop + windowHeight;
      const readProgress = Math.max(0, Math.min(1, (scrollPosition - articleTop) / articleHeight));

      const remainingMinutes = Math.max(0, totalMinutes * (1 - readProgress));
      const remainingSeconds = Math.floor((remainingMinutes % 1) * 60);
      const remainingWholeMinutes = Math.floor(remainingMinutes);

      if (remainingWholeMinutes > 0 || remainingSeconds > 30) {
        let timeText = "";
        if (remainingWholeMinutes > 0) {
          timeText = `${remainingWholeMinutes} min`;
          if (remainingSeconds > 0) {
            timeText += ` ${remainingSeconds}s`;
          }
        } else {
          timeText = `${remainingSeconds}s`;
        }

        const eta = new Date(Date.now() + remainingMinutes * 60 * 1000);
        const etaStr = eta.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

        setTimeRemaining(timeText);
        setFinishBy(etaStr);
        setIsVisible(scrollTop > 180);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", updateTimeRemaining, { passive: true });
    updateTimeRemaining();

    return () => {
      window.removeEventListener("scroll", updateTimeRemaining);
    };
  }, [readTime, articleRef]);

  if (!isVisible || !timeRemaining) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-30 bg-white/95 dark:bg-[#2C2A27]/95 backdrop-blur-md rounded-full shadow-lg border border-[#E0DDD9] dark:border-[#3D3A36] px-3.5 py-1.5 flex items-center gap-2 text-xs text-[#5e5645] dark:text-[#B8B4B0] font-medium">
      <FaClock className="text-[#C74634] dark:text-[#E8572A] text-xs" />
      <span>{timeRemaining} left</span>
      {finishBy && (
        <>
          <span className="opacity-40">·</span>
          <span className="hidden sm:inline">Finish by {finishBy}</span>
        </>
      )}
    </div>
  );
}

export default ReadingTimeRemaining;
