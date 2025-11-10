---
Id: 1005
Title: "Day 5 — Robust Location and Scale: Median & MAD (Simple Guide + Worked Example)"
Author: Sughosh P Dixit
Date: "2024-12-05"
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

> 💡 **Note:** This article uses technical terms and abbreviations. For definitions, check out the [Key Terms & Glossary](/key) page.

---

## 🎯 Introduction

When data contains outliers, traditional measures like mean and [SD](/key) can be misleading. [Robust statistics](/key) like the [median](/key) and [MAD](/key) provide stable estimates that resist distortion from extreme values.

**TL;DR:**

The mean and standard deviation ([SD](/key)) can be swayed by outliers like reeds in the wind 🌾 — a single extreme value can pull them off course.

The [median](/key) and [MAD](/key) (Median Absolute Deviation), on the other hand, are sturdy rocks in the statistical stream. 💪

They resist distortion and give reliable "center" and "spread" estimates, even when your data are skewed or heavy-tailed.

Use them to compute robust [z-scores](/key), which catch anomalies without being fooled by [outliers](/key). 🚨

![Median & MAD Concept](/DS-5/median_mad_concept.png)

---

## 💡 Why Robust Statistics?

⚠️ **Mean/SD are fragile:** a single large value can shift both.

🧱 **Median/MAD are robust:** they focus on the central tendency and typical deviation.

🎯 **Robust z-scores** highlight genuine outliers even when your data contain a few extremes.

![Why Robust Statistics](/DS-5/why_robust.png)

---

## 📘 Key Definitions

**[Median](/key):** the "middle" value after sorting your data (half below, half above).

**[MAD](/key) (Median Absolute Deviation):**

* Compute the [median](/key) *m*.
* Take absolute deviations |*x*ᵢ − *m*|.
* Take the [median](/key) of those deviations → that's [MAD](/key).

**Robust [z-score](/key):**

*z*ᵣ = 0.6745 × (*x* − median) / MAD

**Why 0.6745?** Because for a Normal distribution, [MAD](/key) ≈ 0.6745 × [SD](/key).

That scaling ensures robust [z-scores](/key) align roughly with classical [z-scores](/key).

![Key Definitions Visualization](/DS-5/key_definitions.png)

---

## 🧮 Worked Example — Step by Step

**Data with one big outlier:**

`[10, 12, 13, 13, 14, 15, 100]`

### Step 1️⃣ — Median

*n* = 7 → 4th value = **13**

### Step 2️⃣ — Absolute deviations from the median

<table>
<thead>
<tr>
<th >*x*</th>
<th >\|*x* − 13\|</th>
</tr>
</thead>
<tbody>
<tr>
<td >10</td>
<td >3</td>
</tr>
<tr>
<td >12</td>
<td >1</td>
</tr>
<tr>
<td >13</td>
<td >0</td>
</tr>
<tr>
<td >13</td>
<td >0</td>
</tr>
<tr>
<td >14</td>
<td >1</td>
</tr>
<tr>
<td >15</td>
<td >2</td>
</tr>
<tr>
<td >100</td>
<td >87</td>
</tr>
</tbody>
</table>

Sorted deviations: `[0, 0, 1, 1, 2, 3, 87]`

→ **MAD = 1** (the 4th value)

### Step 3️⃣ — Robust z-scores

*z*ᵣ = 0.6745 × (*x* − 13) / 1

<table>
<thead>
<tr>
<th >*x*</th>
<th >*z*ᵣ</th>
</tr>
</thead>
<tbody>
<tr>
<td >10</td>
<td >−2.02</td>
</tr>
<tr>
<td >12</td>
<td >−0.67</td>
</tr>
<tr>
<td >13</td>
<td >0.00</td>
</tr>
<tr>
<td >14</td>
<td >+0.67</td>
</tr>
<tr>
<td >15</td>
<td >+1.35</td>
</tr>
<tr>
<td >100</td>
<td >+58.68 🚨</td>
</tr>
</tbody>
</table>

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

<table>
<thead>
<tr>
<th >*x*</th>
<th >Classical *z*</th>
<th >Robust *z*</th>
</tr>
</thead>
<tbody>
<tr>
<td >10</td>
<td >−0.50</td>
<td >−2.02</td>
</tr>
<tr>
<td >12</td>
<td >−0.43</td>
<td >−0.67</td>
</tr>
<tr>
<td >13</td>
<td >−0.40</td>
<td >0.00</td>
</tr>
<tr>
<td >14</td>
<td >−0.37</td>
<td >+0.67</td>
</tr>
<tr>
<td >15</td>
<td >−0.34</td>
<td >+1.35</td>
</tr>
<tr>
<td >100</td>
<td >+2.45</td>
<td >+58.68 🚨</td>
</tr>
</tbody>
</table>

**Robust z tells the truth — and the truth is loud.** 📣

![Recap Table Visualization](/DS-5/recap_comparison.png)

---

## 🌟 Takeaway

* [Median](/key) + [MAD](/key) = the sturdier cousins of mean/[SD](/key).
* They stay centered when [outliers](/key) appear.
* Robust [z-scores](/key) reveal what classical [z-scores](/key) often hide.
* Use them when your data aren't "nice and Normal."

They'll never overreact — or underreact — to the wild ones. 🔍💪

---

## 📚 References

1. Hampel, F. R., Ronchetti, E. M., Rousseeuw, P. J., & Stahel, W. A. (2011). *Robust Statistics: The Approach Based on Influence Functions*. John Wiley & Sons.

2. Huber, P. J., & Ronchetti, E. M. (2009). *Robust Statistics* (2nd ed.). John Wiley & Sons.

3. Rousseeuw, P. J., & Croux, C. (1993). Alternatives to the median absolute deviation. *Journal of the American Statistical Association*, 88(424), 1273-1283.

4. Leys, C., Ley, C., Klein, O., Bernard, P., & Licata, L. (2013). Detecting outliers: Do not use standard deviation around the mean, use absolute deviation around the median. *Journal of Experimental Social Psychology*, 49(4), 764-766.

5. Mosteller, F., & Tukey, J. W. (1977). *Data Analysis and Regression: A Second Course in Statistics*. Addison-Wesley.

6. Hoaglin, D. C., Mosteller, F., & Tukey, J. W. (Eds.). (1983). *Understanding Robust and Exploratory Data Analysis*. John Wiley & Sons.

7. Wilcox, R. R. (2012). *Introduction to Robust Estimation and Hypothesis Testing* (3rd ed.). Academic Press.

8. Maronna, R. A., Martin, R. D., & Yohai, V. J. (2019). *Robust Statistics: Theory and Methods* (2nd ed.). John Wiley & Sons.

9. Iglewicz, B., & Hoaglin, D. C. (1993). How to detect and handle outliers. *ASQ Basic References in Quality Control: Statistical Techniques*, 16, 87-88.

10. Rousseeuw, P. J., & Leroy, A. M. (2005). *Robust Regression and Outlier Detection*. John Wiley & Sons.

---

<div style={{textAlign: 'center', margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '15px', color: 'white'}}>
  <div id="lottie-celebration" style={{width: '200px', height: '200px', margin: '0 auto'}}></div>
  <h3 style={{margin: '1rem 0', color: 'white'}}>Day 5 Complete! 🎉</h3>
  <p style={{margin: 0, fontSize: '1.1rem', opacity: 0.9}}>*This is Day 5 of my 30-day challenge documenting my Data Science journey at Oracle! Stay tuned for more insights and mathematical foundations of data science. 🚀*</p>
  <div style={{marginTop: '1.5rem'}}>
    <span style={{background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '25px', fontSize: '0.9rem'}}>Next: Day 6 - Coming Tomorrow!</span>
  </div>
</div>

