import { useEffect, useRef, useState } from "react";

export default function FocusStripLottieAccent() {
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || reducedMotion) return;
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (!shouldLoad || reducedMotion || !containerRef.current) return;
    let instance;
    let cancelled = false;

    const load = async () => {
      try {
        const { default: lottie } = await import("lottie-web");
        if (cancelled || !containerRef.current) return;

        const response = await fetch("/lottie/classical_vs_robust.json");
        if (!response.ok) return;
        const animationData = await response.json();
        if (cancelled || !containerRef.current) return;

        instance = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
          },
        });

        // Keep this accent subtle and less energetic than hero animation.
        instance.setSpeed(0.65);
      } catch (error) {
        console.error("Focus strip Lottie failed to load:", error);
      }
    };

    load();

    return () => {
      cancelled = true;
      if (instance) instance.destroy();
    };
  }, [shouldLoad, reducedMotion]);

  return (
    <div className="hidden lg:block reveal-right rounded-2xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-[#fffaf3] dark:bg-[#23211f] p-4">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#9a8f75] dark:text-[#6E6B68] mb-2">
        Research pulse
      </p>
      <div className="h-24 rounded-xl border border-[#eee4d5] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27]">
        {reducedMotion ? (
          <div className="h-full w-full flex items-center justify-center text-xs text-[#6E6B68] dark:text-[#B8B4B0]">
            Motion disabled
          </div>
        ) : (
          <div ref={containerRef} className="h-full w-full opacity-85" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
