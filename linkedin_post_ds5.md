# LinkedIn Post for Day 5 — Robust Location and Scale: Median & MAD

---

📊 **Day 5 of my 30-Day Data Science Journey at Oracle**

Ever noticed how a single outlier can completely throw off your mean and standard deviation? 🌾

Today I'm diving into **Robust Statistics** — specifically **Median & MAD (Median Absolute Deviation)** — the sturdy rocks in the statistical stream that resist distortion! 💪

**Here's why they matter:**

⚠️ **Mean/SD are fragile**: One extreme value can shift both dramatically  
🧱 **Median/MAD are robust**: They stay centered even when outliers appear  

**The Power of Robust Z-Scores:**

Instead of classical z-scores that get fooled by outliers, robust z-scores use:
```
z_robust = 0.6745 × (x - median) / MAD
```

**Real Example:**
Data: [10, 12, 13, 13, 14, 15, 100]

• **Classical z-score for 100**: +2.45 (barely flags it as unusual)  
• **Robust z-score for 100**: +58.68 🚨 (screams "outlier!")

The difference? Robust measures don't let one big number distort the story.

**When to use Median/MAD:**
✅ Data have outliers or long tails  
✅ Building anomaly detectors  
✅ Need stable estimates of center/spread  
✅ Creating control charts that must resist distortion  

Simple. Explainable. Powerful. 🔍

This is part of my daily commitment to documenting the mathematical foundations of data science. Follow along if you're interested in robust statistics, anomaly detection, or just want to see how I'm building my knowledge base day by day!

#DataScience #Statistics #RobustStatistics #AnomalyDetection #MachineLearning #Oracle #LearningInPublic #DataAnalytics #OutlierDetection #Median #MAD #ZScore #30DayChallenge

---

