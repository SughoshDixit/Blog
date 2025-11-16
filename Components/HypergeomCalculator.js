import { useState, useMemo } from "react";

function nCr(n, r) {
  if (r < 0 || r > n) return 0;
  if (r === 0 || r === n) return 1;
  r = Math.min(r, n - r);
  let numer = 1;
  let denom = 1;
  for (let i = 1; i <= r; i++) {
    numer *= (n - r + i);
    denom *= i;
    // Prevent overflow with incremental reduction
    const g = gcd(numer, denom);
    numer /= g; denom /= g;
  }
  return numer / denom;
}

function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { const t = b; b = a % b; a = t; }
  return a || 1;
}

function probZeroDefects(N, K, n) {
  // P(X=0) = C(N-K, n) / C(N, n) when n <= N-K
  if (n > N) return 0;
  if (K <= 0) return 1;
  if (n > N - K) return 0;
  return nCr(N - K, n) / nCr(N, n);
}

function solveMinSampleSize({ N, K, targetPower }) {
  // Find smallest n s.t. 1 - P0 >= targetPower
  for (let n = 1; n <= N; n++) {
    const p0 = probZeroDefects(N, K, n);
    if (1 - p0 >= targetPower) return n;
  }
  return N;
}

function HypergeomCalculator() {
  const [populationSize, setPopulationSize] = useState(10000);
  const [defectRatePct, setDefectRatePct] = useState(0.5); // % of population
  const [defectiveCount, setDefectiveCount] = useState(0); // optional override
  const [targetPowerPct, setTargetPowerPct] = useState(95); // % probability to detect >=1
  const [chosenSampleSize, setChosenSampleSize] = useState(0);

  const { N, K, targetPower, minN, pDetectChosen } = useMemo(() => {
    const N = Math.max(1, Math.floor(Number(populationSize) || 0));
    let K = Math.floor(Number(defectiveCount) || 0);
    if (K <= 0) {
      const rate = Math.max(0, Number(defectRatePct) || 0) / 100;
      K = Math.max(0, Math.floor(rate * N));
    }
    const targetPower = Math.min(0.9999, Math.max(0.0, (Number(targetPowerPct) || 0) / 100));
    const minN = solveMinSampleSize({ N, K, targetPower });

    let pDetectChosen = null;
    const n = Math.max(0, Math.floor(Number(chosenSampleSize) || 0));
    if (n > 0) {
      const p0 = probZeroDefects(N, K, n);
      pDetectChosen = 1 - p0;
    }

    return { N, K, targetPower, minN, pDetectChosen };
  }, [populationSize, defectRatePct, defectiveCount, targetPowerPct, chosenSampleSize]);

  return (
    <section className="my-6 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/60">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Hypergeometric Sample Size Calculator</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Compute the minimum sample size to detect at least one defect (sampling without replacement), or evaluate detection probability for a chosen sample size.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Population size (N)</label>
          <input type="number" value={populationSize} onChange={(e)=>setPopulationSize(e.target.value)} className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" min={1} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Defect rate (%)</label>
          <input type="number" value={defectRatePct} onChange={(e)=>setDefectRatePct(e.target.value)} className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" min={0} step="0.01" />
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Or enter a defective count below</div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Defective count (K)</label>
          <input type="number" value={defectiveCount} onChange={(e)=>setDefectiveCount(e.target.value)} className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" min={0} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Target detection probability (%)</label>
          <input type="number" value={targetPowerPct} onChange={(e)=>setTargetPowerPct(e.target.value)} className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" min={50} max={99.9} step="0.1" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">Minimum sample size</div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{Number.isFinite(minN) ? minN : "—"}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">N = {N.toLocaleString()} • K ≈ {K.toLocaleString()} • Target ≥ {(targetPower*100).toFixed(1)}%</div>
        </div>
        <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700">
          <label className="block text-xs text-gray-500 dark:text-gray-400">Try a sample size</label>
          <input type="number" value={chosenSampleSize} onChange={(e)=>setChosenSampleSize(e.target.value)} className="w-full px-3 py-2 mt-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" min={0} />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Detection probability: <span className="font-semibold text-gray-900 dark:text-gray-100">{pDetectChosen == null ? "—" : `${(pDetectChosen*100).toFixed(2)}%`}</span></div>
        </div>
      </div>

      <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-3">Formula: P(no defect) = C(N−K, n)/C(N, n); choose smallest n with 1 − P(no defect) ≥ target.</div>
    </section>
  );
}

export default HypergeomCalculator;
