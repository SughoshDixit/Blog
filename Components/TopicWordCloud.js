const DEFAULT_WORDS = [
  { label: "Data Science", weight: "xl", tone: "ember", tilt: "left" },
  { label: "Statistics", weight: "lg", tone: "teal", tilt: "right" },
  { label: "AI", weight: "lg", tone: "amber", tilt: "flat" },
  { label: "Machine Learning", weight: "md", tone: "teal", tilt: "left" },
  { label: "Civilization", weight: "lg", tone: "ember", tilt: "flat" },
  { label: "Indian Knowledge Systems", weight: "md", tone: "violet", tilt: "right" },
  { label: "Football", weight: "md", tone: "teal", tilt: "left" },
  { label: "Bayesian", weight: "sm", tone: "amber", tilt: "flat" },
  { label: "Nonparametric", weight: "md", tone: "ember", tilt: "right" },
  { label: "Robust Methods", weight: "sm", tone: "teal", tilt: "left" },
  { label: "Hypothesis Testing", weight: "sm", tone: "violet", tilt: "flat" },
  { label: "Causal Thinking", weight: "sm", tone: "amber", tilt: "right" },
  { label: "Sampling Theory", weight: "sm", tone: "ember", tilt: "flat" },
  { label: "Kernel Density", weight: "sm", tone: "teal", tilt: "left" },
  { label: "Fuzzy Logic", weight: "sm", tone: "violet", tilt: "right" },
  { label: "Narrative Essays", weight: "sm", tone: "amber", tilt: "flat" },
  { label: "Geopolitics", weight: "sm", tone: "ember", tilt: "right" },
  { label: "Vedic Studies", weight: "sm", tone: "violet", tilt: "left" },
  { label: "Productivity", weight: "sm", tone: "teal", tilt: "flat" },
  { label: "Learning Path", weight: "md", tone: "amber", tilt: "right" },
  { label: "Generative AI", weight: "lg", tone: "ember", tilt: "left" },
  { label: "LLMs", weight: "md", tone: "teal", tilt: "right" },
  { label: "LoRA", weight: "sm", tone: "amber", tilt: "flat" },
  { label: "Oracle Cloud", weight: "md", tone: "violet", tilt: "left" },
  { label: "Time Series", weight: "sm", tone: "teal", tilt: "right" },
  { label: "Feature Engineering", weight: "md", tone: "amber", tilt: "flat" },
];

export default function TopicWordCloud({ 
  words = DEFAULT_WORDS, 
  title = "Word Cloud",
  subtitle = "A quick map of the ideas, methods, and domains this platform explores.",
  className = ""
}) {
  return (
    <div className={`topic-cloud relative overflow-hidden rounded-3xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] p-6 md:p-8 shadow-soft reveal ${className}`}>
      <div className="topic-cloud-orb topic-cloud-orb-a" aria-hidden="true" />
      <div className="topic-cloud-orb topic-cloud-orb-b" aria-hidden="true" />
      <p className="text-xs uppercase tracking-[0.2em] text-[#9a8f75] dark:text-[#6E6B68] mb-3">
        Topic Coverage
      </p>
      <h3
        className="text-2xl md:text-3xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-2"
        style={{ fontFamily: "Charter, Georgia, serif" }}
      >
        {title}
      </h3>
      <p className="text-sm md:text-base text-[#5e5645] dark:text-[#B8B4B0] mb-6">
        {subtitle}
      </p>
      <div className="relative flex flex-wrap gap-2.5 md:gap-3.5">
        {words.map((word, idx) => (
          <span
            key={`${word.label}-${idx}`}
            className={`cloud-chip cloud-${word.weight || 'sm'} cloud-${word.tone || 'amber'} cloud-tilt-${word.tilt || 'flat'}`}
            style={{ animationDelay: `${(idx % 8) * 120}ms` }}
          >
            {word.label}
          </span>
        ))}
      </div>
    </div>
  );
}
