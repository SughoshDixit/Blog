import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Rectangle, FancyBboxPatch, FancyArrowPatch
import seaborn as sns
import os

# Set style
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

# Create DS-7 directory if it doesn't exist
os.makedirs('public/DS-7', exist_ok=True)

# 1. Boxplot Concept - Main header image
fig, axes = plt.subplots(1, 2, figsize=(16, 8))

# Left: Simple boxplot with labels
data1 = np.array([3, 4, 5, 6, 7, 8, 9, 15, 30])
bp1 = axes[0].boxplot(data1, vert=True, patch_artist=True, 
                      widths=0.6, showmeans=False, showfliers=True)
bp1['boxes'][0].set_facecolor('lightblue')
bp1['boxes'][0].set_alpha(0.7)
bp1['medians'][0].set_color('red')
bp1['medians'][0].set_linewidth(2)
bp1['whiskers'][0].set_color('black')
bp1['whiskers'][1].set_color('black')
bp1['caps'][0].set_color('black')
bp1['caps'][1].set_color('black')

# Add annotations
axes[0].annotate('Outliers', xy=(1, 30), xytext=(1.4, 30),
                arrowprops=dict(arrowstyle='->', color='red', lw=2),
                fontsize=12, fontweight='bold', color='red')
axes[0].annotate('Upper Fence', xy=(1, 15.75), xytext=(1.4, 17),
                arrowprops=dict(arrowstyle='->', color='blue', lw=1.5),
                fontsize=10, fontweight='bold', color='blue')
axes[0].annotate('Q₃', xy=(1, 9), xytext=(1.3, 9),
                fontsize=11, fontweight='bold')
axes[0].annotate('Median', xy=(1, 7), xytext=(1.3, 7),
                fontsize=11, fontweight='bold', color='red')
axes[0].annotate('Q₁', xy=(1, 4.5), xytext=(1.3, 4.5),
                fontsize=11, fontweight='bold')

axes[0].set_ylabel('Value', fontsize=12, fontweight='bold')
axes[0].set_title('Boxplot with Tukey Fences', fontsize=14, fontweight='bold')
axes[0].grid(True, alpha=0.3, axis='y')

# Right: Formula and concept
axes[1].axis('off')
formula_text = """
Boxplot & Tukey Fences

IQR = Q₃ − Q₁

Lower Fence = Q₁ − 1.5 × IQR

Upper Fence = Q₃ + 1.5 × IQR

Points outside these fences 
are suspected outliers.

✅ Simple
✅ Robust  
✅ Nonparametric
✅ Visual
"""
axes[1].text(0.1, 0.5, formula_text, fontsize=14, fontweight='bold',
         verticalalignment='center', family='sans-serif',
         bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.7, pad=1))

plt.suptitle('Boxplots, IQR, and Tukey Fences', fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout()
plt.savefig('public/DS-7/boxplot_concept.png', dpi=300, bbox_inches='tight')
plt.close()

# 2. Boxplot Anatomy
fig, ax = plt.subplots(figsize=(14, 8))

# Create detailed boxplot
data2 = np.array([3, 4, 5, 6, 7, 8, 9, 15, 30])
bp2 = ax.boxplot(data2, vert=True, patch_artist=True, 
                 widths=0.8, showmeans=False, showfliers=True)
bp2['boxes'][0].set_facecolor('lightblue')
bp2['boxes'][0].set_alpha(0.7)
bp2['boxes'][0].set_edgecolor('black')
bp2['boxes'][0].set_linewidth(2)
bp2['medians'][0].set_color('red')
bp2['medians'][0].set_linewidth(3)
bp2['whiskers'][0].set_color('green')
bp2['whiskers'][1].set_color('green')
bp2['whiskers'][0].set_linewidth(2)
bp2['whiskers'][1].set_linewidth(2)
bp2['caps'][0].set_color('green')
bp2['caps'][1].set_color('green')
bp2['caps'][0].set_linewidth(2)
bp2['caps'][1].set_linewidth(2)

# Add detailed labels
ax.annotate('Outliers\n(•)', xy=(1, 30), xytext=(1.5, 30),
           arrowprops=dict(arrowstyle='->', color='red', lw=2),
           fontsize=12, fontweight='bold', color='red',
           bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.7))
ax.annotate('Upper Fence\n|-------------------|', xy=(1, 15.75), xytext=(1.5, 18),
           arrowprops=dict(arrowstyle='->', color='blue', lw=1.5),
           fontsize=10, fontweight='bold', color='blue')
ax.annotate('Q₃ = 9', xy=(1, 9), xytext=(1.4, 10),
           fontsize=11, fontweight='bold',
           bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.7))
ax.annotate('Median (Q₂) = 7\n|', xy=(1, 7), xytext=(1.4, 6),
           fontsize=11, fontweight='bold', color='red',
           bbox=dict(boxstyle='round', facecolor='lightcoral', alpha=0.7))
ax.annotate('Q₁ = 4.5', xy=(1, 4.5), xytext=(1.4, 3.5),
           fontsize=11, fontweight='bold',
           bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.7))
ax.annotate('Lower Fence\n|-------------------|', xy=(1, -2.25), xytext=(1.5, -5),
           arrowprops=dict(arrowstyle='->', color='blue', lw=1.5),
           fontsize=10, fontweight='bold', color='blue')

# Add box label
ax.annotate('Box (Q₁ → Q₃)\n|-----------|', xy=(1, 6.75), xytext=(1.5, 6.75),
           fontsize=10, fontweight='bold',
           bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.7))

ax.set_ylabel('Value', fontsize=14, fontweight='bold')
ax.set_title('The Anatomy of a Boxplot', fontsize=16, fontweight='bold')
ax.grid(True, alpha=0.3, axis='y')
ax.set_xlim(0.5, 2.5)

plt.tight_layout()
plt.savefig('public/DS-7/boxplot_anatomy.png', dpi=300, bbox_inches='tight')
plt.close()

# 3. Step-by-Step Example
fig = plt.figure(figsize=(16, 10))
gs = fig.add_gridspec(2, 2, hspace=0.3, wspace=0.3)

# Step 1: Data and quartiles
ax1 = fig.add_subplot(gs[0, 0])
data3 = np.array([3, 4, 5, 6, 7, 8, 9, 15, 30])
q1, q2, q3 = np.percentile(data3, [25, 50, 75])
ax1.scatter(data3, [1]*len(data3), s=200, alpha=0.7, c='blue', 
           edgecolors='black', linewidth=2)
ax1.axvline(q1, color='green', linestyle='--', linewidth=2, label=f'Q₁ = {q1:.1f}')
ax1.axvline(q2, color='red', linestyle='--', linewidth=2, label=f'Q₂ = {q2:.0f}')
ax1.axvline(q3, color='blue', linestyle='--', linewidth=2, label=f'Q₃ = {q3:.0f}')
ax1.set_xlabel('Value', fontsize=11, fontweight='bold')
ax1.set_title('Step 1-2: Find Quartiles', fontsize=12, fontweight='bold')
ax1.legend(fontsize=10)
ax1.grid(True, alpha=0.3, axis='x')
ax1.set_yticks([])
ax1.set_ylim(0.5, 1.5)

# Step 2: IQR calculation
ax2 = fig.add_subplot(gs[0, 1])
iqr = q3 - q1
ax2.barh([0], [iqr], color='lightblue', alpha=0.7, edgecolor='black', linewidth=2)
ax2.set_xlim(0, 5)
ax2.set_ylim(-0.5, 0.5)
ax2.set_xlabel('Value', fontsize=11, fontweight='bold')
ax2.set_title(f'Step 3: IQR = Q₃ - Q₁ = {q3:.1f} - {q1:.1f} = {iqr:.1f}', 
             fontsize=12, fontweight='bold')
ax2.text(iqr/2, 0, f'IQR = {iqr:.1f}', ha='center', va='center',
        fontsize=14, fontweight='bold',
        bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.7))
ax2.grid(True, alpha=0.3, axis='x')
ax2.set_yticks([])

# Step 3: Fences
ax3 = fig.add_subplot(gs[1, 0])
lower_fence = q1 - 1.5 * iqr
upper_fence = q3 + 1.5 * iqr
ax3.axvspan(lower_fence, upper_fence, alpha=0.2, color='green', label='Within Fences')
ax3.axvline(lower_fence, color='red', linestyle='--', linewidth=2, 
           label=f'Lower Fence = {lower_fence:.2f}')
ax3.axvline(upper_fence, color='red', linestyle='--', linewidth=2, 
           label=f'Upper Fence = {upper_fence:.2f}')
ax3.scatter(data3, [1]*len(data3), s=200, alpha=0.7, 
           c=['green' if lower_fence <= x <= upper_fence else 'red' for x in data3],
           edgecolors='black', linewidth=2)
ax3.set_xlabel('Value', fontsize=11, fontweight='bold')
ax3.set_title('Step 4: Compute Tukey Fences', fontsize=12, fontweight='bold')
ax3.legend(fontsize=9)
ax3.grid(True, alpha=0.3, axis='x')
ax3.set_yticks([])
ax3.set_ylim(0.5, 1.5)

# Step 4: Outliers identified
ax4 = fig.add_subplot(gs[1, 1])
outliers = [x for x in data3 if x < lower_fence or x > upper_fence]
normal = [x for x in data3 if lower_fence <= x <= upper_fence]
ax4.scatter(normal, [1]*len(normal), s=200, alpha=0.7, c='green', 
           edgecolors='black', linewidth=2, label='Normal')
ax4.scatter(outliers, [1]*len(outliers), s=300, alpha=0.7, c='red', 
           marker='X', edgecolors='black', linewidth=2, label='Outliers')
ax4.axvline(upper_fence, color='red', linestyle='--', linewidth=2)
ax4.set_xlabel('Value', fontsize=11, fontweight='bold')
ax4.set_title(f'Step 5: Identify Outliers\n{len(outliers)} outlier(s) found', 
             fontsize=12, fontweight='bold')
ax4.legend(fontsize=10)
ax4.grid(True, alpha=0.3, axis='x')
ax4.set_yticks([])
ax4.set_ylim(0.5, 1.5)
for out in outliers:
    ax4.annotate(f'{out} > {upper_fence:.2f}', xy=(out, 1), xytext=(out, 1.3),
                arrowprops=dict(arrowstyle='->', color='red', lw=2),
                fontsize=10, fontweight='bold', color='red')

plt.suptitle('Step-by-Step: Building a Boxplot with Tukey Fences', 
             fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout()
plt.savefig('public/DS-7/step_by_step_example.png', dpi=300, bbox_inches='tight')
plt.close()

# 4. Mild vs Extreme Fences
fig, axes = plt.subplots(1, 2, figsize=(16, 8))

# Left: Mild outliers (1.5 × IQR)
data4 = np.array([3, 4, 5, 6, 7, 8, 9, 15, 30])
q1_4, q3_4 = np.percentile(data4, [25, 75])
iqr_4 = q3_4 - q1_4
mild_lower = q1_4 - 1.5 * iqr_4
mild_upper = q3_4 + 1.5 * iqr_4
extreme_lower = q1_4 - 3 * iqr_4
extreme_upper = q3_4 + 3 * iqr_4

bp3 = axes[0].boxplot(data4, vert=True, patch_artist=True, widths=0.6)
bp3['boxes'][0].set_facecolor('lightblue')
bp3['boxes'][0].set_alpha(0.7)

axes[0].axhline(mild_upper, color='orange', linestyle='--', linewidth=2, 
               label=f'Inner Fence (1.5×IQR) = {mild_upper:.2f}')
axes[0].axhline(extreme_upper, color='red', linestyle='--', linewidth=2, 
               label=f'Outer Fence (3×IQR) = {extreme_upper:.2f}')
axes[0].scatter([1], [30], s=300, c='orange', marker='o', 
               edgecolors='black', linewidth=2, label='Mild Outlier (○)')
axes[0].set_ylabel('Value', fontsize=12, fontweight='bold')
axes[0].set_title('Mild Outliers: 1.5 × IQR', fontsize=14, fontweight='bold')
axes[0].legend(fontsize=10)
axes[0].grid(True, alpha=0.3, axis='y')

# Right: Extreme outliers (3 × IQR)
bp4 = axes[1].boxplot(data4, vert=True, patch_artist=True, widths=0.6)
bp4['boxes'][0].set_facecolor('lightblue')
bp4['boxes'][0].set_alpha(0.7)

axes[1].axhline(mild_upper, color='orange', linestyle='--', linewidth=2, 
               label=f'Inner Fence (1.5×IQR) = {mild_upper:.2f}')
axes[1].axhline(extreme_upper, color='red', linestyle='--', linewidth=2, 
               label=f'Outer Fence (3×IQR) = {extreme_upper:.2f}')
axes[1].scatter([1], [30], s=400, c='red', marker='*', 
               edgecolors='black', linewidth=2, label='Extreme Outlier (★)')
axes[1].set_ylabel('Value', fontsize=12, fontweight='bold')
axes[1].set_title('Extreme Outliers: 3 × IQR', fontsize=14, fontweight='bold')
axes[1].legend(fontsize=10)
axes[1].grid(True, alpha=0.3, axis='y')

plt.suptitle('Mild vs Extreme Fences: Two Layers of Scrutiny', 
             fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout()
plt.savefig('public/DS-7/fence_variants.png', dpi=300, bbox_inches='tight')
plt.close()

# 5. IQR Robustness
fig, axes = plt.subplots(2, 1, figsize=(14, 10))

# Top: IQR vs SD sensitivity
data_clean = np.array([3, 4, 5, 6, 7, 8, 9, 15])
outlier_values = [0, 30, 50, 100, 200]
iqr_vals = []
sd_vals = []

for outlier in outlier_values:
    data_test = np.append(data_clean, outlier)
    q1_test, q3_test = np.percentile(data_test, [25, 75])
    iqr_vals.append(q3_test - q1_test)
    sd_vals.append(np.std(data_test, ddof=1))

axes[0].plot(outlier_values, iqr_vals, 'o-', linewidth=2, markersize=8, 
            label='IQR', color='green')
axes[0].plot(outlier_values, sd_vals, 's-', linewidth=2, markersize=8, 
            label='Standard Deviation', color='orange')
axes[0].set_xlabel('Outlier Value', fontsize=12, fontweight='bold')
axes[0].set_ylabel('Spread Measure', fontsize=12, fontweight='bold')
axes[0].set_title('IQR vs SD: Sensitivity to Outliers', fontsize=14, fontweight='bold')
axes[0].legend(fontsize=11)
axes[0].grid(True, alpha=0.3)
axes[0].annotate('IQR stays stable', xy=(100, iqr_vals[3]), 
                xytext=(120, iqr_vals[3] + 1),
                arrowprops=dict(arrowstyle='->', color='green', lw=2),
                fontsize=10, fontweight='bold', color='green')
axes[0].annotate('SD increases dramatically', xy=(100, sd_vals[3]), 
                xytext=(120, sd_vals[3] - 15),
                arrowprops=dict(arrowstyle='->', color='orange', lw=2),
                fontsize=10, fontweight='bold', color='orange')

# Bottom: Visual comparison
data_with_outlier = np.array([3, 4, 5, 6, 7, 8, 9, 15, 200])
q1_b, q3_b = np.percentile(data_with_outlier, [25, 75])
iqr_b = q3_b - q1_b
sd_b = np.std(data_with_outlier, ddof=1)
mean_b = np.mean(data_with_outlier)

axes[1].scatter(data_with_outlier[:-1], [1]*(len(data_with_outlier)-1), 
               s=150, c='blue', alpha=0.7, edgecolors='black', linewidth=2)
axes[1].scatter([200], [1], s=300, c='red', marker='X', 
               alpha=0.7, edgecolors='black', linewidth=2, label='Outlier')
axes[1].axvspan(q1_b, q3_b, alpha=0.2, color='green', label=f'IQR = {iqr_b:.1f} (stable)')
axes[1].axvline(mean_b - sd_b, color='orange', linestyle='--', linewidth=2, 
               label=f'SD = {sd_b:.1f} (inflated)')
axes[1].axvline(mean_b + sd_b, color='orange', linestyle='--', linewidth=2)
axes[1].set_xlim(-5, 210)
axes[1].set_ylim(0.5, 1.5)
axes[1].set_xlabel('Value', fontsize=12, fontweight='bold')
axes[1].set_title('Visual Comparison: IQR Focuses on Middle 50%', fontsize=14, fontweight='bold')
axes[1].legend(fontsize=10)
axes[1].grid(True, alpha=0.3, axis='x')
axes[1].set_yticks([])

plt.suptitle('Why IQR Is Robust: Focuses on the Calm Middle', 
             fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout()
plt.savefig('public/DS-7/iqr_robustness.png', dpi=300, bbox_inches='tight')
plt.close()

# 6. Data Science Connections
fig, ax = plt.subplots(figsize=(14, 8))
ax.axis('off')

connections_text = """
Boxplot Fences in Data Science:

1. iqr_outliers Functions
   → Python/R libraries use 1.5×IQR rule
   → Quick outlier detection baseline

2. Feature Capping/Winsorizing
   → Cap values at 1.5× or 3× IQR
   → Reduces impact of extremes
   → Common in preprocessing pipelines

3. Anomaly Detection
   → IQR acts as simple baseline score
   → Fast and interpretable
   → No assumptions about distribution

4. EDA (Exploratory Data Analysis)
   → Visual outlier identification
   → First step in data cleaning
   → Built into every boxplot

Key Advantage: Nonparametric, robust, visual, and explainable!
"""
ax.text(0.1, 0.5, connections_text, fontsize=14, fontweight='bold',
       verticalalignment='center', family='sans-serif',
       bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.7, pad=1))

plt.suptitle('How Boxplot Fences Connect to Data Science', 
             fontsize=16, fontweight='bold', y=0.95)
plt.tight_layout()
plt.savefig('public/DS-7/data_science_connections.png', dpi=300, bbox_inches='tight')
plt.close()

# 7. Boxplot Examples (Symmetric vs Skewed)
fig, axes = plt.subplots(1, 2, figsize=(16, 8))

# Left: Symmetric data
symmetric_data = np.random.normal(50, 10, 100)
bp5 = axes[0].boxplot(symmetric_data, vert=True, patch_artist=True, widths=0.6)
bp5['boxes'][0].set_facecolor('lightblue')
bp5['boxes'][0].set_alpha(0.7)
axes[0].set_ylabel('Value', fontsize=12, fontweight='bold')
axes[0].set_title('Symmetric Data → Balanced Box', fontsize=14, fontweight='bold')
axes[0].grid(True, alpha=0.3, axis='y')
axes[0].text(0.5, 0.02, 'Median near center\nEqual whiskers', 
            transform=axes[0].transAxes, ha='center', fontsize=11,
            bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.7))

# Right: Right-skewed data
skewed_data = np.random.gamma(2, 2, 100) * 10
bp6 = axes[1].boxplot(skewed_data, vert=True, patch_artist=True, widths=0.6)
bp6['boxes'][0].set_facecolor('lightcoral')
bp6['boxes'][0].set_alpha(0.7)
axes[1].set_ylabel('Value', fontsize=12, fontweight='bold')
axes[1].set_title('Right-Skewed Data → Longer Upper Whisker', fontsize=14, fontweight='bold')
axes[1].grid(True, alpha=0.3, axis='y')
axes[1].text(0.5, 0.02, 'Median left of center\nLong upper whisker\nOutliers on right', 
            transform=axes[1].transAxes, ha='center', fontsize=11,
            bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.7))

plt.suptitle('Boxplot Examples: Symmetric vs Skewed Data', 
             fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout()
plt.savefig('public/DS-7/boxplot_examples.png', dpi=300, bbox_inches='tight')
plt.close()

# 8. Mini Exercise Solution
fig, axes = plt.subplots(2, 1, figsize=(14, 10))

# Exercise dataset
exercise_data = np.array([5, 7, 8, 9, 10, 10, 11, 12, 14, 25])
q1_ex, q2_ex, q3_ex = np.percentile(exercise_data, [25, 50, 75])
iqr_ex = q3_ex - q1_ex
mild_lower_ex = q1_ex - 1.5 * iqr_ex
mild_upper_ex = q3_ex + 1.5 * iqr_ex
extreme_lower_ex = q1_ex - 3 * iqr_ex
extreme_upper_ex = q3_ex + 3 * iqr_ex

# Top: Data with calculations
axes[0].scatter(exercise_data, [1]*len(exercise_data), s=200, alpha=0.7, 
               c=['blue']*9 + ['red'], edgecolors='black', linewidth=2)
axes[0].axvline(q1_ex, color='green', linestyle='--', linewidth=2, label=f'Q₁ = {q1_ex:.1f}')
axes[0].axvline(q2_ex, color='red', linestyle='--', linewidth=2, label=f'Q₂ = {q2_ex:.0f}')
axes[0].axvline(q3_ex, color='blue', linestyle='--', linewidth=2, label=f'Q₃ = {q3_ex:.1f}')
axes[0].axvline(mild_upper_ex, color='orange', linestyle='--', linewidth=2, 
               label=f'Upper Fence (1.5×) = {mild_upper_ex:.2f}')
axes[0].axvline(extreme_upper_ex, color='purple', linestyle='--', linewidth=2, 
               label=f'Upper Fence (3×) = {extreme_upper_ex:.2f}')
axes[0].set_xlabel('Value', fontsize=12, fontweight='bold')
axes[0].set_title(f'Mini Exercise Dataset\nQ₁={q1_ex:.1f}, Q₂={q2_ex:.0f}, Q₃={q3_ex:.1f}, IQR={iqr_ex:.1f}', 
                 fontsize=13, fontweight='bold')
axes[0].legend(fontsize=9, loc='upper left')
axes[0].grid(True, alpha=0.3, axis='x')
axes[0].set_yticks([])
axes[0].set_ylim(0.5, 1.5)
axes[0].annotate('Outlier?', xy=(25, 1), xytext=(25, 1.3),
                arrowprops=dict(arrowstyle='->', color='red', lw=2),
                fontsize=12, fontweight='bold', color='red')

# Bottom: Boxplot with outliers
bp7 = axes[1].boxplot(exercise_data, vert=True, patch_artist=True, widths=0.6)
bp7['boxes'][0].set_facecolor('lightblue')
bp7['boxes'][0].set_alpha(0.7)
axes[1].axhline(mild_upper_ex, color='orange', linestyle='--', linewidth=2, 
               label=f'1.5×IQR Fence = {mild_upper_ex:.2f}')
axes[1].axhline(extreme_upper_ex, color='purple', linestyle='--', linewidth=2, 
               label=f'3×IQR Fence = {extreme_upper_ex:.2f}')
axes[1].scatter([1], [25], s=300, c='red', marker='X', 
               edgecolors='black', linewidth=2, label='25 is an outlier')
axes[1].set_ylabel('Value', fontsize=12, fontweight='bold')
axes[1].set_title('Solution: 25 is outside both fences → Outlier!', 
                 fontsize=13, fontweight='bold')
axes[1].legend(fontsize=10)
axes[1].grid(True, alpha=0.3, axis='y')

plt.suptitle('Mini Exercise Solution: Identifying Outliers', 
             fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout()
plt.savefig('public/DS-7/mini_exercise.png', dpi=300, bbox_inches='tight')
plt.close()

print("All DS-7 images created successfully!")

