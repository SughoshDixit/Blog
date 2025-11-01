---
Id: 1004
Title: "Day 4 — Percentile Rank and Stratification (with Solved Examples)"
Author: Sughosh P Dixit
Tags: Data Science Statistics Percentile Rank Stratification ECDF Quantiles Sampling
Topic: Data Science
Abstract: "Percentile ranks turn any numeric feature into a simple score in [0,1] that says 'what fraction of the data is at or below this value.' Learn how to combine ranks with min/max and create strata for sampling, prioritization, or analysis."
HeaderImage: /DS-4/percentile_rank_concept.png
isPublished: true
---

# **Day 4 — Percentile Rank and Stratification (with Solved Examples)** 📈🎯

<div style={{textAlign: 'center', margin: '2rem 0'}}>
  <div id="lottie-rank" style={{width: '200px', height: '200px', margin: '0 auto'}}></div>
  <p style={{fontStyle: 'italic', color: '#666', marginTop: '1rem'}}>Ranking and stratifying data for insights! 📊</p>
</div>

**TL;DR:**

Percentile ranks turn any numeric feature into a simple score in `[0,1]` that says *"what fraction of the data is at or below this value."*

Because percentile ranks are order-based, they are **stable under rescaling** and other monotone transforms.

If you combine several features' ranks using **min (for AND-like behavior)** or **max (for OR-like behavior)**, you get a single score that you can cut into **strata** (e.g., quartiles/deciles) for sampling, prioritization, or analysis. 💡

![Percentile Rank Concept](/DS-4/percentile_rank_concept.png)

---

## 🧮 Percentile rank: a simple [0,1] scale

* Given a feature **X** and a dataset of size **n**, the percentile rank of a value *xᵢ* is:

  📊 `rankᵢ = Fₙ(xᵢ) = (1/n) × (# of values ≤ xᵢ)`

* This maps each observation to a number between **0 and 1** (inclusive).

* ✨ Properties you get *for free*:

  * 🔼 **Monotonicity (isotonicity):** If xᵢ ≤ xⱼ, then rankᵢ ≤ rankⱼ.

  * 🔁 **Invariance to monotone transforms:** If f is strictly increasing (e.g., a·x+b with a>0), ranks don't change.

💡 *Why this matters:* Different features may have different scales or units. Percentile ranks put everything onto the same comparable [0,1] scale, making multi-feature logic easy to reason about.

![Percentile Rank Properties](/DS-4/rank_properties.png)

---

## ⚙️ Combining percentile ranks across features

If you have features **A** and **B** with ranks *rA* and *rB*:

* 🔒 **Conservative (AND-like) combination:**

  `rAND = min(rA, rB)`

  → Combined score limited by the weaker (smaller) rank. Safe way to demand "both high."

* 🌈 **Liberal (OR-like) combination:**

  `rOR = max(rA, rB)`

  → Combined score benefits from the stronger (larger) rank. Allows "either high."

These match **Day 1's logic mapping:**

🧩 AND ≈ min  OR ≈ max

They're simple, monotone, and explainable ✅

![Combining Ranks](/DS-4/combining_ranks.png)

---

## 🧭 Stratification from combined ranks

Once you have a single combined rank per observation (e.g., rAND), split the population into **strata**:

* 🔢 **Deciles:** [0.0, 0.1, 0.2, …, 0.9, 1.0]

* 🧮 **Quartiles:** [0.0, 0.25, 0.5, 0.75, 1.0]

* ⚖️ **Custom cuts:** e.g., [0.0, 0.2, 0.5, 0.8, 1.0]

Use strata to:

* 🎯 Draw balanced samples

* 🚦 Prioritize reviews/interventions

* 📊 Report performance metrics by difficulty bands

Because ranks are monotone-invariant, your strata stay meaningful even if raw features change scale.

![Stratification Concept](/DS-4/stratification_concept.png)

---

## 🧩 Solved example — From raw features to strata

| id | A  | B  |
| -- | -- | -- |
| 1  | 10 | 5  |
| 2  | 7  | 3  |
| 3  | 12 | 9  |
| 4  | 15 | 4  |
| 5  | 8  | 8  |
| 6  | 20 | 6  |
| 7  | 9  | 2  |
| 8  | 18 | 10 |

### Step 1️⃣: Compute percentile ranks per feature

Use the empirical CDF (rank = i/n). Example (rounded):

| A  | rankA | B  | rankB |
| -- | ----- | -- | ----- |
| 7  | 0.12  | 2  | 0.12  |
| 8  | 0.25  | 3  | 0.25  |
| 9  | 0.38  | 4  | 0.38  |
| 10 | 0.50  | 5  | 0.50  |
| 12 | 0.62  | 6  | 0.62  |
| 15 | 0.75  | 8  | 0.75  |
| 18 | 0.88  | 9  | 0.88  |
| 20 | 1.00  | 10 | 1.00  |

### Step 2️⃣: Combine with min (AND-like) and max (OR-like)

| id | A  | B  | rA   | rB   | rAND = min(rA,rB) | rOR = max(rA,rB) |
| -- | -- | -- | ---- | ---- | ----------------- | ---------------- |
| 1  | 10 | 5  | 0.50 | 0.50 | 0.50              | 0.50             |
| 2  | 7  | 3  | 0.12 | 0.25 | 0.12              | 0.25             |
| 3  | 12 | 9  | 0.62 | 0.88 | 0.62              | 0.88             |
| 4  | 15 | 4  | 0.75 | 0.38 | 0.38              | 0.75             |
| 5  | 8  | 8  | 0.25 | 0.75 | 0.25              | 0.75             |
| 6  | 20 | 6  | 1.00 | 0.62 | 0.62              | 1.00             |
| 7  | 9  | 2  | 0.38 | 0.12 | 0.12              | 0.38             |
| 8  | 18 | 10 | 0.88 | 1.00 | 0.88              | 1.00             |

### Step 3️⃣: Create strata from rAND

Cuts at 0.2, 0.5, 0.8 →

* 🩵 Stratum 1: rAND < 0.2 → ids 2, 7

* 💙 Stratum 2: 0.2 ≤ rAND < 0.5 → ids 5, 4

* 💜 Stratum 3: 0.5 ≤ rAND < 0.8 → ids 1, 3, 6

* 💛 Stratum 4: rAND ≥ 0.8 → id 8

📈 Using min is conservative: an observation only scores high if **both A and B** are high.

Using max is liberal — more points rise into higher strata.

![Solved Example Visualization](/DS-4/solved_example.png)

---

## 💭 Why "min of ranks" is conservative

* rAND = min(rA, rB) can never exceed either input.

* Raising any rank can only lift (not drop) rAND.

* Thus, demanding high rAND ≈ saying "both inputs are high." ✅

![Min vs Max Comparison](/DS-4/min_max_comparison.png)

---

## 🖼️ Visual ideas

* 🧊 Two 2-D heatmaps:

  1️⃣ rA (x-axis = id, y-axis = rank) and rB similarly.

  2️⃣ The combined min(rA,rB) mesh — shows the "AND valley."

* 📊 Simple bar chart: rAND per id colored by stratum.

![Visual Heatmaps](/DS-4/visual_heatmaps.png)

---

## 🧠 Practical tips

* 📦 Compute ranks *per group* for fair comparison (region/time).

* 🧾 Handle ties consistently (average ranks).

* 🪜 Pre-decide strata cuts (deciles, quartiles, custom).

* 🔄 Extend beyond two features:

  * rAND = min(r₁,…,rₖ)

  * rOR  = max(r₁,…,rₖ)

---

## 🎓 Takeaway

Percentile ranks normalize features onto a **common [0,1] scale**.

Combining them with **min (AND)** or **max (OR)** gives an interpretable, monotone score ideal for **sampling, prioritization, and reporting.**

Simple ✅ Robust 🧩 Explainable 💡

---

<div style={{textAlign: 'center', margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '15px', color: 'white'}}>
  <div id="lottie-celebration" style={{width: '200px', height: '200px', margin: '0 auto'}}></div>
  <h3 style={{margin: '1rem 0', color: 'white'}}>Day 4 Complete! 🎉</h3>
  <p style={{margin: 0, fontSize: '1.1rem', opacity: 0.9}}>*This is Day 4 of my 30-day challenge documenting my Data Science journey at Oracle! Stay tuned for more insights and mathematical foundations of data science. 🚀*</p>
  <div style={{marginTop: '1.5rem'}}>
    <span style={{background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '25px', fontSize: '0.9rem'}}>Next: Day 5 - Coming Tomorrow!</span>
  </div>
</div>

