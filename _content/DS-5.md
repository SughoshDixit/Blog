---
Id: 1005
Title: "Day 5 — Robust Location and Scale: Median & MAD (Simple Guide + Worked Example)"
Author: Sughosh P Dixit
Tags: Data Science Statistics Robust Statistics Median MAD Outliers Z-Scores Anomaly Detection
Topic: Data Science
Abstract: "The mean and standard deviation (SD) can be swayed by outliers like reeds in the wind — a single extreme value can pull them off course. The median and MAD (Median Absolute Deviation), on the other hand, are sturdy rocks in the statistical stream. They resist distortion and give reliable 'center' and 'spread' estimates, even when your data are skewed or heavy-tailed."
HeaderImage: /DS-5/median_mad_concept.png
isPublished: true
---

# **Day 5 — Robust Location and Scale: Median & MAD (Simple Guide + Worked Example)** ✨

<div style={{textAlign: 'center', margin: '2rem 0'}}>
  <div id="lottie-robust" style={{width: '200px', height: '200px', margin: '0 auto'}}></div>
  <p style={{fontStyle: 'italic', color: '#666', marginTop: '1rem'}}>Robust statistics that resist outliers! 💪</p>
</div>

**TL;DR:**

The mean and standard deviation (SD) can be swayed by outliers like reeds in the wind 🌾 — a single extreme value can pull them off course.

The median and MAD (Median Absolute Deviation), on the other hand, are sturdy rocks in the statistical stream. 💪

They resist distortion and give reliable "center" and "spread" estimates, even when your data are skewed or heavy-tailed.

Use them to compute robust z-scores, which catch anomalies without being fooled by outliers. 🚨

![Median & MAD Concept](/DS-5/median_mad_concept.png)

---

## 💡 Why Robust Statistics?

⚠️ **Mean/SD are fragile:** a single large value can shift both.

🧱 **Median/MAD are robust:** they focus on the central tendency and typical deviation.

🎯 **Robust z-scores** highlight genuine outliers even when your data contain a few extremes.

![Why Robust Statistics](/DS-5/why_robust.png)

---

## 📘 Key Definitions

**Median:** the "middle" value after sorting your data (half below, half above).

**MAD (Median Absolute Deviation):**

* Compute the median *m*.
* Take absolute deviations |*x*ᵢ − *m*|.
* Take the median of those deviations → that's MAD.

**Robust z-score:**

*z*ᵣ = 0.6745 × (*x* − median) / MAD

**Why 0.6745?** Because for a Normal distribution, MAD ≈ 0.6745 × SD.

That scaling ensures robust z-scores align roughly with classical z-scores.

![Key Definitions Visualization](/DS-5/key_definitions.png)

---

## 🧮 Worked Example — Step by Step

**Data with one big outlier:**

`[10, 12, 13, 13, 14, 15, 100]`

### Step 1️⃣ — Median

*n* = 7 → 4th value = **13**

### Step 2️⃣ — Absolute deviations from the median

| *x* | |*x* − 13| |
|-----|----------|
| 10  | 3        |
| 12  | 1        |
| 13  | 0        |
| 13  | 0        |
| 14  | 1        |
| 15  | 2        |
| 100 | 87       |

Sorted deviations: `[0, 0, 1, 1, 2, 3, 87]`

→ **MAD = 1** (the 4th value)

### Step 3️⃣ — Robust z-scores

*z*ᵣ = 0.6745 × (*x* − 13) / 1

| *x*  | *z*ᵣ      |
|------|-----------|
| 10   | −2.02     |
| 12   | −0.67     |
| 13   | 0.00      |
| 14   | +0.67     |
| 15   | +1.35     |
| 100  | +58.68 🚨 |

✅ **Interpretation:**

* Most points sit around ±2 — normal variation.
* The outlier (100) explodes to +58.7 — unmistakably extreme.

![Worked Example](/DS-5/worked_example.png)

---

## 🔍 Compare with Mean & SD

Let's see how classical stats behave on the same data:

* **Mean** ≈ 25.29
* **SD** ≈ 30.54

**Classical z-score for *x* = 100:**

(100 − 25.29) / 30.54 ≈ **+2.45**

🧩 **Observation:**

* The classical z-score barely flags 100 as unusual (+2.45).
* The robust z-score screams "outlier!" (+58.68).

That's the power of robust measures: they don't let one big number distort the story.

![Mean vs Median Comparison](/DS-5/mean_vs_median.png)

---

## 🧭 When to Use Median/MAD

✅ **Use when:**

* Your data have outliers or long tails.
* You need stable estimates of center/spread.
* You're building anomaly detectors or control charts that must resist distortion.

🚫 **Avoid when:**

* Data are clean, symmetric, and close to Normal — mean/SD are slightly more efficient there.

![When to Use Robust Statistics](/DS-5/when_to_use.png)

---

## 🍳 Quick Recipe (Ready to Copy)

1️⃣ Sort your data → compute median.

2️⃣ Compute absolute deviations → find MAD.

3️⃣ Compute for each *x*:

```
z_robust = 0.6745 × (x − median) / MAD
```

4️⃣ Flag outliers if |*z*ᵣₒbᵤₛₜ| > threshold (common thresholds: 3.5 or 4.5).

**Simple. Explainable. Powerful.**

---

## 📈 Visual Idea (Optional Plot)

Create a scatterplot of classical z vs robust z.

On skewed data, classical z flattens the extremes, while robust z exposes them.

A picture that says a thousand outliers. 😉

![Classical vs Robust Z-Scores](/DS-5/zscore_comparison.png)

---

## 📋 Tiny Recap Table

| *x*  | Classical *z* | Robust *z* |
|------|---------------|------------|
| 10   | −0.50         | −2.02      |
| 12   | −0.43         | −0.67      |
| 13   | −0.40         | 0.00       |
| 14   | −0.37         | +0.67      |
| 15   | −0.34         | +1.35      |
| 100  | +2.45         | +58.68 🚨  |

**Robust z tells the truth — and the truth is loud.** 📣

![Recap Table Visualization](/DS-5/recap_comparison.png)

---

## 🌟 Takeaway

* Median + MAD = the sturdier cousins of mean/SD.
* They stay centered when outliers appear.
* Robust z-scores reveal what classical z-scores often hide.
* Use them when your data aren't "nice and Normal."

They'll never overreact — or underreact — to the wild ones. 🔍💪

---

<div style={{textAlign: 'center', margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '15px', color: 'white'}}>
  <div id="lottie-celebration" style={{width: '200px', height: '200px', margin: '0 auto'}}></div>
  <h3 style={{margin: '1rem 0', color: 'white'}}>Day 5 Complete! 🎉</h3>
  <p style={{margin: 0, fontSize: '1.1rem', opacity: 0.9}}>*This is Day 5 of my 30-day challenge documenting my Data Science journey at Oracle! Stay tuned for more insights and mathematical foundations of data science. 🚀*</p>
  <div style={{marginTop: '1.5rem'}}>
    <span style={{background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '25px', fontSize: '0.9rem'}}>Next: Day 6 - Coming Tomorrow!</span>
  </div>
</div>

