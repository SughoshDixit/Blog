import { useMemo, useState } from "react";

function parseNumbers(input) {
  if (!input) return [];
  return input
    .split(/[ ,\n\t;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((x) => Number(x))
    .filter((x) => Number.isFinite(x));
}

function percentile(sortedVals, p) {
  if (!sortedVals.length) return null;
  const clamped = Math.min(100, Math.max(0, p));
  const idx = (clamped / 100) * (sortedVals.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sortedVals[lo];
  const frac = idx - lo;
  return sortedVals[lo] + frac * (sortedVals[hi] - sortedVals[lo]);
}

function PercentileThresholdTuner({ defaultValues, defaultPercentile = 90 }) {
  const [valuesText, setValuesText] = useState(
    (defaultValues && Array.isArray(defaultValues) && defaultValues.join(", ")) ||
      "56, 61, 63, 65, 66, 68, 70, 72, 73, 75, 76, 78, 79, 80, 82, 84, 86, 88, 90, 92"
  );
  const [p, setP] = useState(defaultPercentile);
  const [direction, setDirection] = useState("above"); // accept above/below threshold

  const { sorted, thr, acceptRate } = useMemo(() => {
    const vals = parseNumbers(valuesText);
    const sorted = vals.slice().sort((a, b) => a - b);
    const thr = percentile(sorted, p);
    let acceptRate = null;
    if (thr != null && sorted.length) {
      if (direction === "above") {
        const accepted = sorted.filter((v) => v >= thr).length;
        acceptRate = accepted / sorted.length;
      } else {
        const accepted = sorted.filter((v) => v <= thr).length;
        acceptRate = accepted / sorted.length;
      }
    }
    return { sorted, thr, acceptRate };
  }, [valuesText, p, direction]);

  return (
    <section className="my-6 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/60">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Percentile Threshold Tuner</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Pick a percentile to set a decision threshold. See how the acceptance rate changes if you approve scores {direction === "above" ? "above" : "below"} the threshold.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Data values (comma/space separated)</label>
          <textarea
            className="w-full h-28 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            value={valuesText}
            onChange={(e) => setValuesText(e.target.value)}
          />
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Provide any numeric scores: risk, anomaly, quality, etc.</div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Percentile (p)</label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={p}
            onChange={(e) => setP(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
            <span>0%</span>
            <span className="font-medium">{p}%</span>
            <span>100%</span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="text-gray-500 dark:text-gray-400">Decision direction:</span>
            <button
              type="button"
              onClick={() => setDirection("above")}
              className={`px-2 py-1 rounded border text-xs ${
                direction === "above"
                  ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-900/40"
                  : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
              }`}
            >
              Accept ≥ threshold
            </button>
            <button
              type="button"
              onClick={() => setDirection("below")}
              className={`px-2 py-1 rounded border text-xs ${
                direction === "below"
                  ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-900/40"
                  : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
              }`}
            >
              Accept ≤ threshold
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">Samples</div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{sorted.length}</div>
        </div>
        <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">Threshold @ {p}%</div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{thr == null ? "—" : thr.toFixed(2)}</div>
        </div>
        <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">Acceptance rate</div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{acceptRate == null ? "—" : `${(acceptRate * 100).toFixed(1)}%`}</div>
        </div>
      </div>

      <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-3">Percentiles are monotone: increasing p raises the threshold for ascending data and typically reduces acceptance (when accepting ≥ threshold).</div>
    </section>
  );
}

export default PercentileThresholdTuner;
