import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import classicalVsRobustAnimation from "../public/lottie/classical_vs_robust.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function FocusStripLottieAccent() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
  }, []);

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
          <div className="h-full w-full opacity-90" aria-hidden="true">
            <Lottie
              animationData={classicalVsRobustAnimation}
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
              rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
