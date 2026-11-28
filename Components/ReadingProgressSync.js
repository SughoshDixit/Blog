import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { db } from "../Firebase/Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function ReadingProgressSync({ slug }) {
  const user = useSelector((state) => state.user);
  const [showResume, setShowResume] = useState(false);
  const [savedPercent, setSavedPercent] = useState(0);
  const lastSaved = useRef(0);
  const dismissed = useRef(false);

  useEffect(() => {
    if (!user?.uid || !slug) return;
    const ref = doc(db, "users", user.uid, "progress", slug);
    getDoc(ref)
      .then((snap) => {
        if (snap.exists()) {
          const pct = snap.data().percent || 0;
          if (pct > 10 && pct < 95) {
            setSavedPercent(pct);
            setShowResume(true);
          }
        }
      })
      .catch(() => {});
  }, [user, slug]);

  // Auto-dismiss after 8 seconds so it doesn't obstruct reading
  useEffect(() => {
    if (!showResume) return;
    const timer = setTimeout(() => {
      setShowResume(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [showResume]);

  const saveProgress = useCallback(() => {
    if (!user?.uid || !slug) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const pct = Math.round((scrollTop / docHeight) * 100);
    if (Math.abs(pct - lastSaved.current) < 5) return;
    lastSaved.current = pct;
    const ref = doc(db, "users", user.uid, "progress", slug);
    setDoc(ref, { percent: pct, lastRead: new Date().toISOString() }, { merge: true }).catch(() => {});
  }, [user, slug]);

  useEffect(() => {
    if (!user?.uid) return;
    let timer;
    const handler = () => {
      clearTimeout(timer);
      timer = setTimeout(saveProgress, 2000);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handler);
    };
  }, [user, saveProgress]);

  const handleResume = () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: (savedPercent / 100) * docHeight, behavior: "smooth" });
    setShowResume(false);
  };

  const handleDismiss = () => {
    setShowResume(false);
    dismissed.current = true;
  };

  if (!showResume || dismissed.current) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-full bg-[#161513]/95 dark:bg-[#FAF8F6]/95 backdrop-blur-md text-white dark:text-[#161513] shadow-2xl border border-white/10 dark:border-black/10 flex items-center gap-3 text-xs sm:text-sm font-medium animate-slide-up max-w-[92vw]">
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#C74634]/20 text-[#E8572A] dark:text-[#C74634] text-[11px] font-bold shrink-0">
        {savedPercent}%
      </span>
      <span className="truncate">Resume where you left off</span>
      <button
        onClick={handleResume}
        className="px-3.5 py-1 rounded-full bg-[#C74634] text-white text-xs font-semibold hover:bg-[#A73A2C] transition-colors shrink-0 cursor-pointer"
      >
        Resume
      </button>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss resume prompt"
        className="text-gray-400 hover:text-gray-200 dark:hover:text-gray-600 shrink-0 cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
