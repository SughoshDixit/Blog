export default function HeroLottieAccent() {
  return (
    <div className="reveal-scale rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-4 py-3 shadow-lg shadow-black/20">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#B8E0D8]/80 mb-2">
        Live Visual Note
      </p>
      <div className="hero-visual-note h-28 md:h-32 overflow-hidden rounded-xl border border-white/10">
        <div className="hero-visual-grid" aria-hidden="true" />
        <div className="hero-visual-glow hero-visual-glow-a" aria-hidden="true" />
        <div className="hero-visual-glow hero-visual-glow-b" aria-hidden="true" />
        <div className="hero-wave-track" aria-hidden="true">
          <span className="hero-wave-line hero-wave-line-a" />
          <span className="hero-wave-line hero-wave-line-b" />
          <span className="hero-wave-line hero-wave-line-c" />
        </div>
        <div className="hero-note-chip">Signal stable</div>
      </div>
    </div>
  );
}
