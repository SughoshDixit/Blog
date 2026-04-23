import { FaFutbol } from "react-icons/fa";

export default function HeroLottieAccent() {
  return (
    <div className="reveal-scale rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-4 py-3 shadow-lg shadow-black/20">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#B8E0D8]/80 mb-2 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8572A] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C74634]"></span>
        </span>
        Live Football Feed
      </p>
      <div className="h-28 md:h-32 overflow-hidden rounded-xl border border-white/10 bg-[#161513]/40 flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
        <div className="animate-bounce relative z-10">
          <FaFutbol className="text-white text-4xl animate-[spin_3s_linear_infinite] drop-shadow-xl" />
        </div>
        <div className="w-8 h-1 bg-white/20 rounded-[50%] blur-sm mb-2 relative z-10 animate-pulse"></div>
        <div className="hero-note-chip !bg-[#C74634]/20 !text-[#E8572A] !border-[#C74634]/30 relative z-10 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider">
          ANALYSIS ACTIVE
        </div>
      </div>
    </div>
  );
}
