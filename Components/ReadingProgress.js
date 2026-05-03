import { useEffect, useState } from "react";

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      const scrollableHeight = documentHeight - windowHeight;
      const progressPercentage = scrollableHeight > 0 
        ? Math.min(100, (scrollTop / scrollableHeight) * 100)
        : 0;
      
      setProgress(progressPercentage);
    };

    window.addEventListener("scroll", updateProgress);
    window.addEventListener("resize", updateProgress);
    updateProgress(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-gray-200/20 dark:bg-gray-800/20 backdrop-blur-sm pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-[#C74634] via-[#E8572A] to-[#C74634] shadow-[0_0_15px_rgba(199,70,52,0.6)] transition-all duration-300 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute right-0 top-0 h-full w-4 bg-white/30 blur-sm animate-pulse" />
      </div>
    </div>
  );
}

export default ReadingProgress;

