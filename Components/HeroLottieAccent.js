import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import skewTuningAnimation from "../public/lottie/skew_tuning.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function HeroLottieAccent() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
  }, []);

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
          <Lottie
            animationData={skewTuningAnimation}
            loop
            autoplay
            aria-hidden="true"
            style={{ width: "100%", height: "100%" }}
            rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
          />
        )}
      </div>
    </div>
  );
}
