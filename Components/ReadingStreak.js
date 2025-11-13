import { useState, useEffect } from "react";
import { FiZap, FiStar } from "react-icons/fi";

function ReadingStreak() {
  const [streak, setStreak] = useState(0);
  const [totalRead, setTotalRead] = useState(0);
  const [badges, setBadges] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window === 'undefined') return;

    const history = JSON.parse(localStorage.getItem("readingHistory") || "[]");
    const total = history.length;
    setTotalRead(total);

    // Calculate streak
    const today = new Date().toDateString();
    const dates = history.map((h) => new Date(h.readAt).toDateString());
    const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a));
    
    let currentStreak = 0;
    let checkDate = new Date(today);
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const dateStr = checkDate.toDateString();
      if (uniqueDates.includes(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    setStreak(currentStreak);

    // Calculate badges
    const earnedBadges = [];
    if (total >= 10) earnedBadges.push({ name: "Reader", icon: "📚" });
    if (total >= 25) earnedBadges.push({ name: "Bookworm", icon: "🐛" });
    if (total >= 50) earnedBadges.push({ name: "Scholar", icon: "🎓" });
    if (currentStreak >= 7) earnedBadges.push({ name: "Week Warrior", icon: "🔥" });
    if (currentStreak >= 30) earnedBadges.push({ name: "Monthly Master", icon: "⭐" });
    
    setBadges(earnedBadges);
  }, []);

  if (!isClient || totalRead === 0) return null;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FiZap className="text-orange-500 text-xl" />
          <div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Reading Streak</div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {streak} {streak === 1 ? "day" : "days"}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Read</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">{totalRead}</div>
        </div>
      </div>
      
      {badges.length > 0 && (
        <div className="flex items-center gap-2 pt-3 border-t border-orange-200 dark:border-orange-800">
          <FiStar className="text-orange-500" />
          <div className="flex gap-2">
            {badges.map((badge, idx) => (
              <span key={idx} className="text-sm" title={badge.name}>
                {badge.icon}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadingStreak;

