import { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';

function ReadingTimeRemaining({ readTime, articleRef }) {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!readTime || !articleRef?.current) return;

    // Extract minutes from readTime string (e.g., "5 min read" -> 5)
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

      // Calculate how much of the article has been read
      const scrollPosition = scrollTop + windowHeight;
      const articleBottom = articleTop + articleHeight;
      
      // How much has been read (0 to 1)
      const readProgress = Math.max(0, Math.min(1, (scrollPosition - articleTop) / articleHeight));
      
      // Calculate remaining time
      const remainingMinutes = Math.max(0, totalMinutes * (1 - readProgress));
      const remainingSeconds = Math.floor((remainingMinutes % 1) * 60);
      const remainingWholeMinutes = Math.floor(remainingMinutes);

      if (remainingWholeMinutes > 0 || remainingSeconds > 30) {
        let timeText = '';
        if (remainingWholeMinutes > 0) {
          timeText = `${remainingWholeMinutes} min`;
          if (remainingSeconds > 0) {
            timeText += ` ${remainingSeconds} sec`;
          }
        } else {
          timeText = `${remainingSeconds} sec`;
        }
        setTimeRemaining(timeText);
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Update on scroll
    window.addEventListener('scroll', updateTimeRemaining);
    updateTimeRemaining(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', updateTimeRemaining);
    };
  }, [readTime, articleRef]);

  if (!isVisible || !timeRemaining) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-30 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center gap-2">
      <FaClock className="text-blue-600 dark:text-blue-400 text-sm" />
      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
        {timeRemaining} left
      </span>
    </div>
  );
}

export default ReadingTimeRemaining;

