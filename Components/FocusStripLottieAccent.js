export default function FocusStripLottieAccent() {
  return (
    <div className="hidden lg:block reveal-right rounded-2xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-[#fffaf3] dark:bg-[#23211f] p-4">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#9a8f75] dark:text-[#6E6B68] mb-2">
        Research pulse
      </p>
      <div className="research-pulse h-24 rounded-xl border border-[#eee4d5] dark:border-[#3D3A36]">
        <span className="pulse-bar pulse-bar-1" aria-hidden="true" />
        <span className="pulse-bar pulse-bar-2" aria-hidden="true" />
        <span className="pulse-bar pulse-bar-3" aria-hidden="true" />
        <span className="pulse-bar pulse-bar-4" aria-hidden="true" />
        <span className="pulse-bar pulse-bar-5" aria-hidden="true" />
        <span className="pulse-badge">Model drift: low</span>
      </div>
    </div>
  );
}
