import { useMemo } from "react";

function Tldr({ title, abstract, headings = [], actions = [] }) {
  const takeaways = useMemo(() => {
    // Pick top 3 meaningful headings (h2/h3) as takeaways
    const items = (headings || [])
      .filter((h) => h.depth === 2 || h.depth === 3)
      .slice(0, 3)
      .map((h) => h.text);
    // Fallbacks
    if (items.length === 0 && title) return [title];
    return items;
  }, [headings, title]);

  const actionItems = useMemo(() => {
    if (actions && actions.length > 0) return actions;
    // Sensible defaults
    return [
      { label: "Listen with Read Aloud", href: "#" },
      { label: "Share a key section", href: "#" },
      { label: "Explore related posts", href: "#related-posts" },
    ];
  }, [actions]);

  return (
    <section className="mb-6 sm:mb-8">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/60 p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">TL;DR</h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">Quick summary</span>
        </div>

        {abstract && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            {abstract}
          </p>
        )}

        {takeaways && takeaways.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Key takeaways</div>
            <ul className="list-disc ml-5 space-y-1">
              {takeaways.map((t, idx) => (
                <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">{t}</li>) )}
            </ul>
          </div>
        )}

        {actionItems && actionItems.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            {actionItems.map((a, idx) => (
              <a
                key={idx}
                href={a.href}
                className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 transition-colors"
              >
                {a.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Tldr;
