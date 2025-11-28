# LinkedIn Post for Day 28: Robust Imputation and Numeric Coercion

📅 Day 28 of my 30 Day Data Science Challenge — Data Preprocessing Impact

Before rules can be evaluated, data must be clean. How you handle missing values changes everything!

**The Problem:**
Your pipeline receives:
- Missing values (NA, NULL, "")
- Mixed types ("100", 100, "N/A")
- Invalid entries ("error", -999)

**The Tool: Imputation Strategies 🩹**

**Zero Imputation:**
- Mean: ↓ Decreases
- Variance: ↑ Increases
- p50: ↓ Shifts left

**Mean Imputation:**
- Mean: = Preserved
- Variance: ↓ Decreases
- p50: ~ Compressed

**Median Imputation:**
- Mean: ~ Stable
- Variance: ↓ Decreases
- p50: = Preserved

**The Surprise:**

```
Original: [10, 20, 30, 40, 50] → p50 = 30
After 20% zero imputation: [0, 10, 20, 30, 40, 50] → p50 = 25

27% shift in median threshold! 📉
```

**Why It Matters:**
- Thresholds based on quantiles move
- Decision boundaries shift in feature space
- Rule geometry changes fundamentally

**Bottom line:** Imputation isn't neutral. Zero imputation shifts distributions left, mean imputation reduces variance. Choose your strategy based on domain knowledge! 🔧

🔵 Full guide with distribution impact analysis 👇 🔗 [Link to blog]

#DataScience #DataPreprocessing #Imputation #MissingData #Statistics #LearningBySharing #30DayChallenge #SughoshWrites
