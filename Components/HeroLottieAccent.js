import { useEffect, useRef, useState } from "react";

export default function HeroLottieAccent() {
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

        const response = await fetch("/lottie/robust_workflow.json");
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

        // Keep motion premium but calm in the hero.
        instance.setSpeed(0.8);
      } catch (error) {
        console.error("Hero Lottie failed to load:", error);
      }
    };

    load();

    return () => {
      cancelled = true;
      if (instance) instance.destroy();
    };
  }, [shouldLoad, reducedMotion]);

  return (
    <div className="reveal-scale rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-4 py-3 shadow-lg shadow-black/20">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#B8E0D8]/80 mb-2">
        Live Visual Note
      </p>
      <div className="h-28 md:h-32 overflow-hidden rounded-xl bg-[#003b46]/40 border border-white/10">
        {reducedMotion ? (
          <div className="h-full w-full flex items-center justify-center text-xs text-[#B8E0D8]">
            Motion disabled by preference
          </div>
        ) : (
          <div ref={containerRef} className="h-full w-full" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
