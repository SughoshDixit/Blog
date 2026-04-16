const WORDS = [
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
];

export default function TopicWordCloud() {
  return (
    <div className="topic-cloud relative overflow-hidden rounded-3xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] p-6 md:p-8 shadow-soft reveal">
      <div className="topic-cloud-orb topic-cloud-orb-a" aria-hidden="true" />
      <div className="topic-cloud-orb topic-cloud-orb-b" aria-hidden="true" />
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
      <div className="relative flex flex-wrap gap-2.5 md:gap-3.5">
        {WORDS.map((word, idx) => (
          <span
            key={`${word.label}-${idx}`}
            className={`cloud-chip cloud-${word.weight} cloud-${word.tone} cloud-tilt-${word.tilt}`}
            style={{ animationDelay: `${(idx % 8) * 120}ms` }}
          >
            {word.label}
          </span>
        ))}
      </div>
    </div>
  );
}
