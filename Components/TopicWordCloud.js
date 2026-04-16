const WORDS = [
  { label: "Data Science", weight: "xl" },
  { label: "Statistics", weight: "lg" },
  { label: "AI", weight: "lg" },
  { label: "Machine Learning", weight: "md" },
  { label: "Civilization", weight: "lg" },
  { label: "Indian Knowledge Systems", weight: "md" },
  { label: "Football", weight: "md" },
  { label: "Bayesian", weight: "sm" },
  { label: "Nonparametric", weight: "md" },
  { label: "Robust Methods", weight: "sm" },
  { label: "Hypothesis Testing", weight: "sm" },
  { label: "Causal Thinking", weight: "sm" },
  { label: "Sampling Theory", weight: "sm" },
  { label: "Kernel Density", weight: "sm" },
  { label: "Fuzzy Logic", weight: "sm" },
  { label: "Narrative Essays", weight: "sm" },
  { label: "Geopolitics", weight: "sm" },
  { label: "Vedic Studies", weight: "sm" },
  { label: "Productivity", weight: "sm" },
  { label: "Learning Path", weight: "md" },
];

export default function TopicWordCloud() {
  return (
    <div className="topic-cloud rounded-3xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] p-6 md:p-8 shadow-soft reveal">
      <p className="text-xs uppercase tracking-[0.2em] text-[#9a8f75] dark:text-[#6E6B68] mb-3">
        Topic Coverage
      </p>
      <h3
        className="text-2xl md:text-3xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-2"
        style={{ fontFamily: "Charter, Georgia, serif" }}
      >
        Word Cloud
      </h3>
      <p className="text-sm md:text-base text-[#5e5645] dark:text-[#B8B4B0] mb-6">
        A quick map of the ideas, methods, and domains this platform explores.
      </p>
      <div className="flex flex-wrap gap-2 md:gap-3">
        {WORDS.map((word, idx) => (
          <span
            key={`${word.label}-${idx}`}
            className={`cloud-chip cloud-${word.weight}`}
            style={{ animationDelay: `${(idx % 8) * 120}ms` }}
          >
            {word.label}
          </span>
        ))}
      </div>
    </div>
  );
}
