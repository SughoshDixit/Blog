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

function applyTransformations(values, { logScale, trimPct }) {
  let arr = values.slice();
  // Winsorize/clip extremes by trimPct on each tail
  if (trimPct > 0 && arr.length > 0) {
    const sorted = arr.slice().sort((a, b) => a - b);
    const n = sorted.length;
    const k = Math.floor((trimPct / 100) * n);
    const low = sorted[Math.min(n - 1, Math.max(0, k))];
    const high = sorted[Math.max(0, Math.min(n - 1, n - 1 - k))];
    arr = arr.map((v) => Math.max(low, Math.min(high, v)));
  }
  if (logScale) {
    arr = arr.map((v) => (v > 0 ? Math.log10(v) : v));
  }
  return arr;
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

function buildHistogram(values, numBins = 24) {
  if (!values.length) return { bins: [], min: 0, max: 0, counts: [] };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = max - min || 1;
  const bins = Array.from({ length: numBins + 1 }, (_, i) => min + (i * width) / numBins);
  const counts = new Array(numBins).fill(0);
  for (const v of values) {
    let idx = Math.floor(((v - min) / width) * numBins);
    if (idx < 0) idx = 0;
    if (idx >= numBins) idx = numBins - 1;
    counts[idx] += 1;
  }
  return { bins, min, max, counts };
}

function Histogram({ values, threshold }) {
  const { bins, counts } = useMemo(() => buildHistogram(values, 24), [values]);
  const maxCount = counts.length ? Math.max(...counts) : 0;
  const w = 360;
  const h = 140;
  const padL = 32;
  const padR = 12;
  const padB = 24;
  const padT = 8;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const barW = counts.length ? innerW / counts.length : innerW;

  // Map threshold to x
  let thrX = null;
  if (threshold != null && bins.length) {
    const min = bins[0];
    const max = bins[bins.length - 1];
    const ratio = (threshold - min) / (max - min || 1);
    thrX = padL + Math.max(0, Math.min(1, ratio)) * innerW;
  }

  // Axes labels and ticks
  const xMin = bins[0] ?? 0;
  const xMax = bins[bins.length - 1] ?? 0;
  const tickCount = 4;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => xMin + ((xMax - xMin) * i) / tickCount);

  // Tooltip state
  const [tooltip, setTooltip] = useState(null);

  const handleMove = (e) => {
    if (!bins.length) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const relX = Math.max(padL, Math.min(padL + innerW, x));
    const ratio = (relX - padL) / innerW;
    const idx = Math.max(0, Math.min(counts.length - 1, Math.floor(ratio * counts.length)));
    const binStart = bins[idx];
    const binEnd = bins[idx + 1];
    setTooltip({ x: relX, y: padT + 8, idx, binStart, binEnd, count: counts[idx] || 0 });
  };
  const handleLeave = () => setTooltip(null);

  return (
    <div className="relative">
      <svg width={w} height={h} className="block" onMouseMove={handleMove} onMouseLeave={handleLeave}>
        {/* Bars */}
        {counts.map((c, i) => {
          const barH = maxCount ? (c / maxCount) * innerH : 0;
          const x = padL + i * barW;
          const y = padT + (innerH - barH);
          return (
            <rect key={i} x={x} y={y} width={Math.max(1, barW - 1)} height={barH} fill="#93c5fd" />
          );
        })}
        {/* Threshold line */}
        {thrX != null && (
          <line x1={thrX} x2={thrX} y1={padT} y2={padT + innerH} stroke="#ef4444" strokeWidth={2} strokeDasharray="4 3" />
        )}
        {/* X axis */}
        <line x1={padL} x2={padL + innerW} y1={padT + innerH} y2={padT + innerH} stroke="#9ca3af" strokeWidth={1} />
        {/* X ticks */}
        {ticks.map((t, i) => {
          const tx = padL + (innerW * i) / tickCount;
          return (
            <g key={i}>
              <line x1={tx} x2={tx} y1={padT + innerH} y2={padT + innerH + 4} stroke="#9ca3af" />
              <text x={tx} y={padT + innerH + 16} fontSize={10} textAnchor="middle" fill="#6b7280">
                {Number.isFinite(t) ? t.toFixed(1) : ""}
              </text>
            </g>
          );
        })}
        {/* Axis label */}
        <text x={padL + innerW / 2} y={h - 4} fontSize={10} textAnchor="middle" fill="#6b7280">Values</text>
      </svg>
      {tooltip && (
        <div
          className="absolute bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-200 px-2 py-1 rounded shadow"
          style={{ left: tooltip.x + 8, top: tooltip.y }}
        >
          <div>Bin: {Number.isFinite(tooltip.binStart) ? tooltip.binStart.toFixed(2) : ""} – {Number.isFinite(tooltip.binEnd) ? tooltip.binEnd.toFixed(2) : ""}</div>
          <div>Count: {tooltip.count}</div>
        </div>
      )}
    </div>
  );
}

function PercentileThresholdTuner({ defaultValues, defaultPercentile = 90 }) {
  const [valuesText, setValuesText] = useState(
    (defaultValues && Array.isArray(defaultValues) && defaultValues.join(", ")) ||
      "56, 61, 63, 65, 66, 68, 70, 72, 73, 75, 76, 78, 79, 80, 82, 84, 86, 88, 90, 92"
  );
  const [p, setP] = useState(defaultPercentile);
  const [direction, setDirection] = useState("above");
  const [uploadStatus, setUploadStatus] = useState("");
  const [csvColumns, setCsvColumns] = useState([]);
  const [selectedCol, setSelectedCol] = useState(-1);
  const [appendMode, setAppendMode] = useState(false);
  const [logScale, setLogScale] = useState(false);
  const [trimPct, setTrimPct] = useState(0);
  const [multiPercents, setMultiPercents] = useState("50, 75, 80, 90, 95");

  const { sorted, thr, acceptRate, transformed } = useMemo(() => {
    const vals = parseNumbers(valuesText);
    const transformed = applyTransformations(vals, { logScale, trimPct });
    const sorted = transformed.slice().sort((a, b) => a - b);
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
    return { sorted, thr, acceptRate, transformed };
  }, [valuesText, p, direction, logScale, trimPct]);

  const handleCsvUpload = async (file) => {
    if (!file) return;
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(Boolean);
      let bestCol = -1;
      let bestVals = [];
      let bestCols = [];
      for (const delim of [",", ";", "\t", "|"]) {
        const cols = [];
        for (const line of lines) {
          const parts = line.split(delim);
          parts.forEach((cell, idx) => {
            const num = Number(String(cell).trim());
            if (!cols[idx]) cols[idx] = [];
            if (Number.isFinite(num)) cols[idx].push(num);
          });
        }
        const numericCols = cols.map((arr) => (arr && arr.filter((x) => Number.isFinite(x))) || []);
        const candidateCols = numericCols.filter((arr) => arr.length >= 3);
        if (candidateCols.length) {
          let localBestIdx = -1;
          let localBestLen = -1;
          numericCols.forEach((arr, idx) => {
            if ((arr?.length || 0) > localBestLen) {
              localBestLen = arr.length;
              localBestIdx = idx;
            }
          });
          if (localBestLen > (bestVals?.length || 0)) {
            bestVals = numericCols[localBestIdx];
            bestCol = localBestIdx;
            bestCols = numericCols;
          }
        }
      }
      if (!bestVals || bestVals.length < 3) {
        const nums = (text.match(/[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?/g) || []).map(Number).filter(Number.isFinite);
        if (nums.length >= 3) {
          bestVals = nums;
          bestCols = [nums];
          bestCol = 0;
        }
      }
      if (!bestVals || bestVals.length < 3) {
        setUploadStatus("No numeric column detected in file");
        setCsvColumns([]);
        setSelectedCol(-1);
        return;
      }
      setCsvColumns(bestCols);
      setSelectedCol(bestCol);
      if (appendMode) {
        const current = parseNumbers(valuesText);
        const merged = current.concat(bestVals);
        setValuesText(merged.join(", "));
      } else {
        setValuesText(bestVals.join(", "));
      }
      setUploadStatus(`Loaded ${bestVals.length} values${bestCol >= 0 ? ` from column ${bestCol + 1}` : ""}`);
    } catch (e) {
      console.error("CSV upload failed:", e);
      setUploadStatus("Failed to read file");
      setCsvColumns([]);
      setSelectedCol(-1);
    }
  };

  const applySelectedColumn = () => {
    if (!csvColumns || selectedCol < 0 || !csvColumns[selectedCol]) return;
    const vals = csvColumns[selectedCol];
    if (appendMode) {
      const current = parseNumbers(valuesText);
      const merged = current.concat(vals);
      setValuesText(merged.join(", "));
    } else {
      setValuesText(vals.join(", "));
    }
    setUploadStatus(`Loaded ${vals.length} values from column ${selectedCol + 1}`);
  };

  const downloadCsv = () => {
    const headers = ["percentile", "threshold", "acceptance_rate", "samples", "direction", "log_scale", "trim_pct"];
    const row = [p, thr == null ? "" : thr.toFixed(6), acceptRate == null ? "" : (acceptRate * 100).toFixed(4) + "%", sorted.length, direction, logScale ? "true" : "false", trimPct];
    const csv = [headers.join(","), row.join(",")].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `percentile_threshold_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadMultiCsv = () => {
    const vals = transformed.slice().sort((a, b) => a - b);
    const list = parseNumbers(multiPercents).filter((x) => x >= 0 && x <= 100);
    const headers = ["percentile", "threshold", "acceptance_rate", "samples", "direction", "log_scale", "trim_pct"];
    const rows = list.map((pp) => {
      const t = percentile(vals, pp);
      let ar = null;
      if (t != null && vals.length) {
        if (direction === "above") {
          const accepted = vals.filter((v) => v >= t).length;
          ar = accepted / vals.length;
        } else {
          const accepted = vals.filter((v) => v <= t).length;
          ar = accepted / vals.length;
        }
      }
      return [pp, t == null ? "" : t.toFixed(6), ar == null ? "" : (ar * 100).toFixed(4) + "%", vals.length, direction, logScale ? "true" : "false", trimPct].join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `percentile_thresholds_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <label className="text-[11px] text-gray-500 dark:text-gray-400">or upload CSV/TSV:</label>
            <input
              type="file"
              accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values"
              onChange={(e) => handleCsvUpload(e.target.files?.[0])}
              className="text-xs"
            />
            <label className="text-[11px] text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <input type="checkbox" checked={appendMode} onChange={(e) => setAppendMode(e.target.checked)} />
              Append to current
            </label>
          </div>
          {csvColumns && csvColumns.length > 1 && (
            <div className="mt-2 flex items-center gap-2">
              <label className="text-[11px] text-gray-600 dark:text-gray-400">Choose column:</label>
              <select
                className="text-xs border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                value={selectedCol}
                onChange={(e) => setSelectedCol(Number(e.target.value))}
              >
                {csvColumns.map((col, idx) => (
                  <option key={idx} value={idx}>{`Column ${idx + 1} (${col.length} nums)`}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={applySelectedColumn}
                className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                Load column
              </button>
            </div>
          )}
          {uploadStatus && (
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{uploadStatus}</div>
          )}
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

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400">Decision:</span>
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
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <input type="checkbox" checked={logScale} onChange={(e) => setLogScale(e.target.checked)} />
                Log10 scale
              </label>
              <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                Trim each tail:
                <input
                  type="number"
                  min={0}
                  max={20}
                  step={1}
                  value={trimPct}
                  onChange={(e) => setTrimPct(Math.max(0, Math.min(20, Number(e.target.value) || 0)))}
                  className="w-14 px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
                %
              </label>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={downloadCsv}
              className="text-xs px-3 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white"
            >
              Download results (CSV)
            </button>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={multiPercents}
                onChange={(e) => setMultiPercents(e.target.value)}
                className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 w-40"
                placeholder="50, 75, 90, 95"
                aria-label="Percentiles list"
              />
              <button
                type="button"
                onClick={downloadMultiCsv}
                className="text-xs px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Export list CSV
              </button>
            </div>
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

      <div className="mt-4">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Distribution preview</div>
        <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2">
          <Histogram values={sorted} threshold={thr} />
        </div>
      </div>

      <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-3">Percentiles are monotone: increasing p raises the threshold for ascending data and typically reduces acceptance (when accepting ≥ threshold).</div>
    </section>
  );
}

export default PercentileThresholdTuner;
