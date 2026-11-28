import { useEffect, useMemo, useState } from "react";
import { FiBarChart2, FiCheckCircle } from "react-icons/fi";

function getPollConfig(data, slug) {
  if (data?.PollQuestion && Array.isArray(data?.PollOptions) && data.PollOptions.length >= 2) {
    return {
      question: data.PollQuestion,
      options: data.PollOptions,
    };
  }

  if (slug && slug.includes("why-do-we-go-to-the-gym")) {
    return {
      question: "If your gym membership became free tomorrow, what would you choose?",
      options: [
        "Still hit the gym consistently",
        "Train bodyweight / calisthenics anywhere",
        "A hybrid mix of both",
      ],
    };
  }

  const topic = (data?.Topic || "").toLowerCase();
  if (topic.includes("book")) {
    return {
      question: "What was your biggest takeaway from these book notes?",
      options: [
        "Sharp mental model / perspective",
        "Practical habits I can apply today",
        "Want to read the full book now",
      ],
    };
  }

  if (topic.includes("data science") || topic.includes("experience")) {
    return {
      question: "How useful was this technical deep-dive for your work?",
      options: [
        "Solved an active problem for me",
        "Clarified the intuition cleanly",
        "Would love a follow-up with more code",
      ],
    };
  }

  return {
    question: "What resonated most with you in this essay?",
    options: [
      "The core argument & perspective",
      "Personal experiences & honesty",
      "Practical ideas to reflect on",
    ],
  };
}

export default function ArticlePoll({ data, slug }) {
  const config = useMemo(() => getPollConfig(data, slug), [data, slug]);
  const [counts, setCounts] = useState({});
  const [total, setTotal] = useState(0);
  const [votedIndex, setVotedIndex] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const storageKey = `sd_poll_${slug}`;

  useEffect(() => {
    if (!slug) return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        const idx = Number(saved);
        if (Number.isInteger(idx)) setVotedIndex(idx);
      }
    } catch {
      // Ignore
    }

    fetch(`/api/poll?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (res && typeof res.total === "number") {
          setCounts(res.counts || {});
          setTotal(res.total);
        }
      })
      .catch(() => {});
  }, [slug, storageKey]);

  const handleVote = async (idx) => {
    if (votedIndex !== null || submitting) return;
    setSubmitting(true);
    setVotedIndex(idx);

    try {
      localStorage.setItem(storageKey, String(idx));
    } catch {
      // Ignore
    }

    // Optimistic update
    setCounts((prev) => ({ ...prev, [String(idx)]: (Number(prev[String(idx)]) || 0) + 1 }));
    setTotal((t) => t + 1);

    try {
      const res = await fetch("/api/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, optionIndex: idx }),
      });
      if (res.ok) {
        const json = await res.json();
        setCounts(json.counts || {});
        setTotal(json.total || 0);
      }
    } catch {
      // Keep optimistic UI
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="my-10 rounded-2xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-[#FAF8F6] dark:bg-[#2C2A27] p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#C74634] dark:text-[#E8572A]">
          <FiBarChart2 className="w-3.5 h-3.5" />
          Reader Pulse
        </span>
        {total > 0 && (
          <span className="text-xs text-[#6E6B68] dark:text-[#B8B4B0]">
            {total} {total === 1 ? "vote" : "votes"}
          </span>
        )}
      </div>

      <h3
        className="text-lg sm:text-xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-4"
        style={{ fontFamily: "Charter, Georgia, serif" }}
      >
        {config.question}
      </h3>

      <div className="space-y-2.5">
        {config.options.map((opt, idx) => {
          const count = Number(counts[String(idx)]) || 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const isChosen = votedIndex === idx;
          const hasVoted = votedIndex !== null;

          return (
            <button
              key={opt}
              type="button"
              disabled={hasVoted || submitting}
              onClick={() => handleVote(idx)}
              className={`relative w-full text-left px-4 py-3 rounded-xl border overflow-hidden transition-all ${
                isChosen
                  ? "border-[#C74634] dark:border-[#E8572A] bg-white dark:bg-[#201E1C]"
                  : hasVoted
                  ? "border-[#E0DDD9] dark:border-[#3D3A36] bg-white/60 dark:bg-[#201E1C]/60 cursor-default"
                  : "border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#201E1C] hover:border-[#C74634] dark:hover:border-[#E8572A] cursor-pointer"
              }`}
            >
              {hasVoted && (
                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                    isChosen ? "bg-[#C74634]/15 dark:bg-[#E8572A]/20" : "bg-[#E0DDD9]/45 dark:bg-[#3D3A36]/45"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              )}
              <div className="relative flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-medium text-[#161513] dark:text-[#F5F4F2]">
                  {isChosen && <FiCheckCircle className="w-4 h-4 text-[#C74634] dark:text-[#E8572A] shrink-0" />}
                  {opt}
                </span>
                {hasVoted && (
                  <span className="text-xs font-semibold text-[#6E6B68] dark:text-[#B8B4B0] shrink-0">
                    {pct}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
