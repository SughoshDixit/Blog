import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "sd_cookie_consent";

function applyGoogleConsent(status) {
  if (typeof window === "undefined") return;
  const granted = status === "accepted" ? "granted" : "denied";
  window.__cookieConsent = status;

  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: granted,
      ad_user_data: granted,
      ad_personalization: granted,
      analytics_storage: granted,
    });
  }
}

export function openCookieSettings() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-cookie-consent"));
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONSENT_KEY);
      if (!saved) {
        setVisible(true);
      } else {
        const parsed = JSON.parse(saved);
        if (parsed?.status) {
          applyGoogleConsent(parsed.status);
        } else {
          setVisible(true);
        }
      }
    } catch {
      setVisible(true);
    }

    const handleOpen = () => setVisible(true);
    window.addEventListener("open-cookie-consent", handleOpen);
    return () => window.removeEventListener("open-cookie-consent", handleOpen);
  }, []);

  const handleChoice = (status) => {
    try {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ status, updatedAt: new Date().toISOString() })
      );
    } catch {
      // Ignore storage errors in private browsing
    }
    applyGoogleConsent(status);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-[9990] rounded-2xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white/95 dark:bg-[#2C2A27]/95 backdrop-blur-md shadow-2xl p-5 transition-all"
    >
      <p className="text-sm font-semibold text-[#161513] dark:text-[#F5F4F2] mb-1.5">
        Cookies &amp; Privacy
      </p>
      <p className="text-xs leading-relaxed text-[#5e5645] dark:text-[#B8B4B0] mb-4">
        This site uses essential cookies for theme and reading preferences, plus
        optional analytics and Google AdSense cookies to keep content free.{" "}
        <Link href="/privacy-policy">
          <a className="text-[#C74634] dark:text-[#E8572A] underline hover:opacity-80">
            Privacy Policy
          </a>
        </Link>
      </p>
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => handleChoice("accepted")}
          className="px-4 py-2 rounded-lg bg-[#C74634] hover:bg-[#A73A2C] text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          Accept All
        </button>
        <button
          type="button"
          onClick={() => handleChoice("essential")}
          className="px-4 py-2 rounded-lg border border-[#E0DDD9] dark:border-[#3D3A36] text-[#161513] dark:text-[#F5F4F2] hover:bg-[#FAF8F6] dark:hover:bg-[#201E1C] text-xs font-medium transition-colors cursor-pointer"
        >
          Essential Only
        </button>
      </div>
    </div>
  );
}
