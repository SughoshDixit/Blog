import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Rectangle, FancyBboxPatch
import seaborn as sns
import os

# Set style
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

# Create DS-5 directory if it doesn't exist
os.makedirs('public/DS-5', exist_ok=True)

# 1. Median & MAD Concept - Main visualization
fig, axes = plt.subplots(2, 1, figsize=(14, 10))

# Data with outlier
data = np.array([10, 12, 13, 13, 14, 15, 100])
median = np.median(data)
mean = np.mean(data)

# Top: Data distribution with median and mean
axes[0].scatter(data, [1]*len(data), s=200, alpha=0.7, c=['blue']*6 + ['red'], 
                edgecolors='black', linewidth=2, zorder=3)
axes[0].axvline(median, color='green', linestyle='--', linewidth=3, 
                label=f'Median = {median:.0f}', zorder=2)
axes[0].axvline(mean, color='orange', linestyle='--', linewidth=3, 
                label=f'Mean = {mean:.1f}', zorder=2)
axes[0].set_xlim(0, 105)
axes[0].set_ylim(0.5, 1.5)
axes[0].set_xlabel('Value', fontsize=12, fontweight='bold')
axes[0].set_title('Median vs Mean: The Outlier Effect', fontsize=14, fontweight='bold')
axes[0].legend(loc='upper right', fontsize=11)
axes[0].grid(True, alpha=0.3, axis='x')
axes[0].set_yticks([])
axes[0].annotate('Outlier', xy=(100, 1), xytext=(100, 1.3),
                arrowprops=dict(arrowstyle='->', color='red', lw=2),
                fontsize=12, fontweight='bold', color='red')

# Bottom: MAD calculation
deviations = np.abs(data - median)
mad = np.median(deviations)
sorted_data = np.sort(data)
sorted_deviations = np.sort(deviations)

axes[1].barh(range(len(data)), sorted_data, color='skyblue', alpha=0.7, 
             edgecolor='black', linewidth=1.5)
axes[1].axvline(median, color='green', linestyle='--', linewidth=3, 
                label=f'Median = {median:.0f}')
axes[1].set_yticks(range(len(data)))
axes[1].set_yticklabels([f'{x}' for x in sorted_data])
axes[1].set_xlabel('Value', fontsize=12, fontweight='bold')
axes[1].set_ylabel('Sorted Data Points', fontsize=12, fontweight='bold')
axes[1].set_title(f'MAD Calculation: Median(|xᵢ - median|) = {mad:.0f}', 
                 fontsize=14, fontweight='bold')
axes[1].legend(loc='lower right', fontsize=11)
axes[1].grid(True, alpha=0.3, axis='x')

# Add deviation annotations
for i, (val, dev) in enumerate(zip(sorted_data, sorted_deviations)):
    if dev > 0:
        axes[1].annotate(f'|{val}-{median:.0f}|={dev:.0f}', 
                        xy=(val, i), xytext=(val + 5, i),
                        fontsize=9, fontweight='bold',
                        bbox=dict(boxstyle='round,pad=0.3', facecolor='yellow', alpha=0.7))

plt.suptitle('Median & MAD: Robust Location and Scale', fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout()
plt.savefig('public/DS-5/median_mad_concept.png', dpi=300, bbox_inches='tight')
plt.close()

# 2. Why Robust Statistics
fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# Left: Fragile Mean/SD
data_clean = np.array([10, 12, 13, 13, 14, 15])
data_with_outlier = np.array([10, 12, 13, 13, 14, 15, 100])

mean_clean = np.mean(data_clean)
sd_clean = np.std(data_clean, ddof=1)
mean_outlier = np.mean(data_with_outlier)
sd_outlier = np.std(data_with_outlier, ddof=1)

axes[0].scatter(data_clean, [1]*len(data_clean), s=150, c='blue', alpha=0.7,
                edgecolors='black', linewidth=2, label='Clean data')
axes[0].scatter([100], [1], s=300, c='red', alpha=0.7, marker='X',
                edgecolors='black', linewidth=2, label='Outlier added')
axes[0].axvline(mean_clean, color='blue', linestyle='--', linewidth=2, 
                label=f'Mean (clean) = {mean_clean:.1f}')
axes[0].axvline(mean_outlier, color='red', linestyle='--', linewidth=2, 
                label=f'Mean (with outlier) = {mean_outlier:.1f}')
axes[0].set_xlim(8, 105)
axes[0].set_ylim(0.5, 1.5)
axes[0].set_xlabel('Value', fontsize=12, fontweight='bold')
axes[0].set_title('⚠️ Mean/SD are Fragile', fontsize=14, fontweight='bold')
axes[0].legend(loc='upper right', fontsize=10)
axes[0].grid(True, alpha=0.3, axis='x')
axes[0].set_yticks([])
axes[0].annotate(f'SD shifts from {sd_clean:.1f} to {sd_outlier:.1f}',
                xy=(50, 0.7), fontsize=11, fontweight='bold',
                bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.7))

# Right: Robust Median/MAD
median_clean = np.median(data_clean)
median_outlier = np.median(data_with_outlier)
mad_clean = np.median(np.abs(data_clean - median_clean))
mad_outlier = np.median(np.abs(data_with_outlier - median_outlier))

axes[1].scatter(data_clean, [1]*len(data_clean), s=150, c='blue', alpha=0.7,
                edgecolors='black', linewidth=2, label='Clean data')
axes[1].scatter([100], [1], s=300, c='red', alpha=0.7, marker='X',
                edgecolors='black', linewidth=2, label='Outlier added')
axes[1].axvline(median_clean, color='green', linestyle='--', linewidth=2, 
                label=f'Median (clean) = {median_clean:.0f}')
axes[1].axvline(median_outlier, color='green', linestyle='--', linewidth=2, 
                label=f'Median (with outlier) = {median_outlier:.0f}')
axes[1].set_xlim(8, 105)
axes[1].set_ylim(0.5, 1.5)
axes[1].set_xlabel('Value', fontsize=12, fontweight='bold')
axes[1].set_title('🧱 Median/MAD are Robust', fontsize=14, fontweight='bold')
axes[1].legend(loc='upper right', fontsize=10)
axes[1].grid(True, alpha=0.3, axis='x')
axes[1].set_yticks([])
axes[1].annotate(f'MAD stays at {mad_outlier:.0f}',
                xy=(50, 0.7), fontsize=11, fontweight='bold',
                bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.7))

plt.suptitle('Why Robust Statistics Matter', fontsize=16, fontweight='bold', y=1.02)
plt.tight_layout()
plt.savefig('public/DS-5/why_robust.png', dpi=300, bbox_inches='tight')
plt.close()

# 3. Key Definitions Visualization
fig = plt.figure(figsize=(16, 10))
gs = fig.add_gridspec(2, 2, hspace=0.3, wspace=0.3)

# Median definition
ax1 = fig.add_subplot(gs[0, 0])
data_sorted = np.sort(data)
n = len(data_sorted)
median_idx = n // 2

colors_list = ['lightblue'] * n
colors_list[median_idx] = 'green'
colors_list[median_idx - 1] = 'lightgreen' if n % 2 == 0 else 'green'

bars = ax1.barh(range(n), data_sorted, color=colors_list, edgecolor='black', linewidth=1.5)
ax1.set_yticks(range(n))
ax1.set_yticklabels([f'{x}' for x in data_sorted])
ax1.set_xlabel('Value', fontsize=12, fontweight='bold')
ax1.set_ylabel('Position (sorted)', fontsize=12, fontweight='bold')
ax1.set_title(f'Median = {median:.0f} (middle value)', fontsize=13, fontweight='bold')
ax1.grid(True, alpha=0.3, axis='x')
ax1.axvline(median, color='red', linestyle='--', linewidth=2)
ax1.text(median + 2, median_idx, 'Median', fontsize=11, fontweight='bold', 
         bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.7))

# MAD definition
ax2 = fig.add_subplot(gs[0, 1])
deviations_sorted = np.sort(deviations)
mad_val = np.median(deviations_sorted)
mad_idx = len(deviations_sorted) // 2

colors_list2 = ['lightcoral'] * len(deviations_sorted)
colors_list2[mad_idx] = 'darkred'
if len(deviations_sorted) % 2 == 0:
    colors_list2[mad_idx - 1] = 'red'

bars2 = ax2.barh(range(len(deviations_sorted)), deviations_sorted, 
                 color=colors_list2, edgecolor='black', linewidth=1.5)
ax2.set_yticks(range(len(deviations_sorted)))
ax2.set_yticklabels([f'{d:.0f}' for d in deviations_sorted])
ax2.set_xlabel('|xᵢ - median|', fontsize=12, fontweight='bold')
ax2.set_ylabel('Sorted Deviations', fontsize=12, fontweight='bold')
ax2.set_title(f'MAD = {mad_val:.0f} (median of deviations)', fontsize=13, fontweight='bold')
ax2.grid(True, alpha=0.3, axis='x')
ax2.axvline(mad_val, color='red', linestyle='--', linewidth=2)
ax2.text(mad_val + 5, mad_idx, 'MAD', fontsize=11, fontweight='bold',
         bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.7))

# Robust z-score formula
ax3 = fig.add_subplot(gs[1, :])
ax3.axis('off')
formula_text = """
Robust Z-Score Formula:

    zᵣ = 0.6745 × (x - median) / MAD

Why 0.6745?
    
    For a Normal distribution: MAD ≈ 0.6745 × SD
    
    This scaling ensures robust z-scores align roughly 
    with classical z-scores for Normal data.

Properties:
    
    ✓ Resists outliers
    ✓ Flags genuine anomalies
    ✓ Comparable to classical z-scores
"""
ax3.text(0.1, 0.5, formula_text, fontsize=14, fontweight='bold',
         verticalalignment='center', family='monospace',
         bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.7, pad=1))

plt.suptitle('Key Definitions: Median, MAD, and Robust Z-Score', fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout()
plt.savefig('public/DS-5/key_definitions.png', dpi=300, bbox_inches='tight')
plt.close()

# 4. Worked Example - Step by Step
fig = plt.figure(figsize=(16, 10))
gs = fig.add_gridspec(2, 2, hspace=0.3, wspace=0.3)

# Step 1: Median
ax1 = fig.add_subplot(gs[0, 0])
bars = ax1.barh(range(len(data_sorted)), data_sorted, color='skyblue', 
                edgecolor='black', linewidth=1.5)
bars[median_idx].set_color('green')
bars[median_idx - 1].set_color('lightgreen')
ax1.set_yticks(range(len(data_sorted)))
ax1.set_yticklabels([f'{x}' for x in data_sorted])
ax1.set_xlabel('Value', fontsize=11, fontweight='bold')
ax1.set_title('Step 1: Find Median = 13', fontsize=12, fontweight='bold')
ax1.grid(True, alpha=0.3, axis='x')
ax1.axvline(median, color='red', linestyle='--', linewidth=2)

# Step 2: MAD
ax2 = fig.add_subplot(gs[0, 1])
bars2 = ax2.barh(range(len(deviations_sorted)), deviations_sorted, 
                 color='lightcoral', edgecolor='black', linewidth=1.5)
bars2[mad_idx].set_color('darkred')
if len(deviations_sorted) % 2 == 0:
    bars2[mad_idx - 1].set_color('red')
ax2.set_yticks(range(len(deviations_sorted)))
ax2.set_yticklabels([f'{d:.0f}' for d in deviations_sorted])
ax2.set_xlabel('|x - 13|', fontsize=11, fontweight='bold')
ax2.set_title('Step 2: Find MAD = 1', fontsize=12, fontweight='bold')
ax2.grid(True, alpha=0.3, axis='x')
ax2.axvline(mad_val, color='red', linestyle='--', linewidth=2)

# Step 3: Robust z-scores
ax3 = fig.add_subplot(gs[1, :])
robust_z = 0.6745 * (data - median) / mad_val
colors_z = ['red' if abs(z) > 3 else 'blue' for z in robust_z]
x_pos = np.arange(len(data))

bars3 = ax3.bar(x_pos, robust_z, color=colors_z, alpha=0.7, edgecolor='black', linewidth=1.5)
ax3.set_xticks(x_pos)
ax3.set_xticklabels([f'{x}' for x in data])
ax3.set_ylabel('Robust Z-Score', fontsize=12, fontweight='bold')
ax3.set_xlabel('Data Value', fontsize=12, fontweight='bold')
ax3.set_title('Step 3: Compute Robust Z-Scores', fontsize=13, fontweight='bold')
ax3.axhline(0, color='black', linestyle='-', linewidth=1)
ax3.axhline(3, color='red', linestyle='--', linewidth=2, label='Outlier threshold')
ax3.axhline(-3, color='red', linestyle='--', linewidth=2)
ax3.grid(True, alpha=0.3, axis='y')
ax3.legend(fontsize=10)

# Add value labels
for i, (bar, z_val) in enumerate(zip(bars3, robust_z)):
    height = bar.get_height()
    ax3.text(bar.get_x() + bar.get_width()/2., height,
            f'{z_val:.2f}', ha='center', va='bottom' if height > 0 else 'top',
            fontsize=9, fontweight='bold')

plt.suptitle('Worked Example: Computing Median, MAD, and Robust Z-Scores', 
             fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout()
plt.savefig('public/DS-5/worked_example.png', dpi=300, bbox_inches='tight')
plt.close()

# 5. Mean vs Median Comparison
fig, axes = plt.subplots(2, 1, figsize=(14, 10))

# Top: Sensitivity to outliers
outlier_values = [0, 50, 100, 150, 200]
means = []
medians = []
base_data = np.array([10, 12, 13, 13, 14, 15])

for outlier in outlier_values:
    data_test = np.append(base_data, outlier)
    means.append(np.mean(data_test))
    medians.append(np.median(data_test))

axes[0].plot(outlier_values, means, 'o-', linewidth=2, markersize=8, 
             label='Mean', color='orange')
axes[0].plot(outlier_values, medians, 's-', linewidth=2, markersize=8, 
             label='Median', color='green')
axes[0].set_xlabel('Outlier Value', fontsize=12, fontweight='bold')
axes[0].set_ylabel('Location Estimate', fontsize=12, fontweight='bold')
axes[0].set_title('Sensitivity to Outliers: Mean vs Median', fontsize=14, fontweight='bold')
axes[0].legend(fontsize=11)
axes[0].grid(True, alpha=0.3)
axes[0].annotate('Mean shifts dramatically', xy=(100, means[2]), 
                xytext=(120, means[2] + 15),
                arrowprops=dict(arrowstyle='->', color='orange', lw=2),
                fontsize=10, fontweight='bold', color='orange')
axes[0].annotate('Median stays stable', xy=(100, medians[2]), 
                xytext=(120, medians[2] - 5),
                arrowprops=dict(arrowstyle='->', color='green', lw=2),
                fontsize=10, fontweight='bold', color='green')

# Bottom: Side-by-side comparison with data
ax2_data = np.array([10, 12, 13, 13, 14, 15, 100])
ax2_mean = np.mean(ax2_data)
ax2_median = np.median(ax2_data)

axes[1].scatter(ax2_data, [1]*len(ax2_data), s=200, c=['blue']*6 + ['red'], 
               alpha=0.7, edgecolors='black', linewidth=2, zorder=3)
axes[1].axvline(ax2_mean, color='orange', linestyle='--', linewidth=3, 
               label=f'Mean = {ax2_mean:.1f}', zorder=2)
axes[1].axvline(ax2_median, color='green', linestyle='--', linewidth=3, 
               label=f'Median = {ax2_median:.0f}', zorder=2)
axes[1].set_xlim(0, 105)
axes[1].set_ylim(0.5, 1.5)
axes[1].set_xlabel('Value', fontsize=12, fontweight='bold')
axes[1].set_title('Visual Comparison: Mean is Pulled by Outlier', fontsize=14, fontweight='bold')
axes[1].legend(loc='upper right', fontsize=11)
axes[1].grid(True, alpha=0.3, axis='x')
axes[1].set_yticks([])
axes[1].annotate('Outlier pulls mean right', 
                xy=(ax2_mean, 1), xytext=(ax2_mean + 10, 1.3),
                arrowprops=dict(arrowstyle='->', color='orange', lw=2),
                fontsize=11, fontweight='bold', color='orange')

plt.suptitle('Mean vs Median: Robustness Comparison', fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout()
plt.savefig('public/DS-5/mean_vs_median.png', dpi=300, bbox_inches='tight')
plt.close()

# 6. When to Use Robust Statistics
fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# Left: Use cases
ax1 = axes[0]
ax1.axis('off')
use_cases_text = """
✅ Use Median/MAD when:

• Data have outliers or long tails
• Need stable estimates of center/spread
• Building anomaly detectors
• Creating control charts
• Data are skewed or heavy-tailed
• Outlier resistance is critical

Examples:
• Quality control metrics
• Financial data with spikes
• Sensor data with glitches
• User behavior data
"""
ax1.text(0.1, 0.5, use_cases_text, fontsize=13, fontweight='bold',
         verticalalignment='center', family='sans-serif',
         bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.7, pad=1))

# Right: Avoid cases
ax2 = axes[1]
ax2.axis('off')
avoid_cases_text = """
🚫 Avoid Median/MAD when:

• Data are clean and symmetric
• Data are close to Normal
• Need maximum efficiency
• Working with well-behaved data
• Mean/SD are sufficient

Note: Mean/SD are slightly more
efficient for Normal data, but
Median/MAD are more robust to
violations of assumptions.
"""
ax2.text(0.1, 0.5, avoid_cases_text, fontsize=13, fontweight='bold',
         verticalalignment='center', family='sans-serif',
         bbox=dict(boxstyle='round', facecolor='lightcoral', alpha=0.7, pad=1))

plt.suptitle('When to Use Robust Statistics', fontsize=16, fontweight='bold', y=1.02)
plt.tight_layout()
plt.savefig('public/DS-5/when_to_use.png', dpi=300, bbox_inches='tight')
plt.close()

# 7. Classical vs Robust Z-Score Comparison
fig, axes = plt.subplots(2, 1, figsize=(14, 10))

# Compute both z-scores
data_z = np.array([10, 12, 13, 13, 14, 15, 100])
mean_z = np.mean(data_z)
sd_z = np.std(data_z, ddof=1)
median_z = np.median(data_z)
mad_z = np.median(np.abs(data_z - median_z))

classical_z = (data_z - mean_z) / sd_z
robust_z = 0.6745 * (data_z - median_z) / mad_z

# Top: Classical z-scores
x_pos = np.arange(len(data_z))
colors_classical = ['red' if abs(z) > 2.5 else 'blue' for z in classical_z]

bars1 = axes[0].bar(x_pos, classical_z, color=colors_classical, alpha=0.7, 
                   edgecolor='black', linewidth=1.5)
axes[0].set_xticks(x_pos)
axes[0].set_xticklabels([f'{x}' for x in data_z])
axes[0].set_ylabel('Classical Z-Score', fontsize=12, fontweight='bold')
axes[0].set_title('Classical Z-Scores: Mean/SD (Fragile to Outliers)', 
                 fontsize=13, fontweight='bold')
axes[0].axhline(0, color='black', linestyle='-', linewidth=1)
axes[0].axhline(2.5, color='red', linestyle='--', linewidth=2, alpha=0.7)
axes[0].axhline(-2.5, color='red', linestyle='--', linewidth=2, alpha=0.7)
axes[0].grid(True, alpha=0.3, axis='y')
axes[0].set_ylim(-1, 3.5)

# Add value labels
for i, (bar, z_val) in enumerate(zip(bars1, classical_z)):
    height = bar.get_height()
    axes[0].text(bar.get_x() + bar.get_width()/2., height,
                f'{z_val:.2f}', ha='center', va='bottom' if height > 0 else 'top',
                fontsize=9, fontweight='bold')

axes[0].annotate('Outlier barely flagged (+2.45)', 
                xy=(6, classical_z[6]), xytext=(4, classical_z[6] + 0.5),
                arrowprops=dict(arrowstyle='->', color='red', lw=2),
                fontsize=10, fontweight='bold', color='red',
                bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.7))

# Bottom: Robust z-scores
colors_robust = ['red' if abs(z) > 3 else 'blue' for z in robust_z]

bars2 = axes[1].bar(x_pos, robust_z, color=colors_robust, alpha=0.7, 
                   edgecolor='black', linewidth=1.5)
axes[1].set_xticks(x_pos)
axes[1].set_xticklabels([f'{x}' for x in data_z])
axes[1].set_ylabel('Robust Z-Score', fontsize=12, fontweight='bold')
axes[1].set_xlabel('Data Value', fontsize=12, fontweight='bold')
axes[1].set_title('Robust Z-Scores: Median/MAD (Resists Outliers)', 
                 fontsize=13, fontweight='bold')
axes[1].axhline(0, color='black', linestyle='-', linewidth=1)
axes[1].axhline(3, color='red', linestyle='--', linewidth=2, alpha=0.7)
axes[1].axhline(-3, color='red', linestyle='--', linewidth=2, alpha=0.7)
axes[1].grid(True, alpha=0.3, axis='y')
axes[1].set_ylim(-3, 60)

# Add value labels (scaled for visibility)
for i, (bar, z_val) in enumerate(zip(bars2, robust_z)):
    height = bar.get_height()
    if abs(z_val) > 10:
        axes[1].text(bar.get_x() + bar.get_width()/2., height,
                    f'{z_val:.1f}', ha='center', va='bottom',
                    fontsize=9, fontweight='bold')
    else:
        axes[1].text(bar.get_x() + bar.get_width()/2., height,
                    f'{z_val:.2f}', ha='center', va='bottom' if height > 0 else 'top',
                    fontsize=9, fontweight='bold')

axes[1].annotate('Outlier clearly flagged (+58.68) 🚨', 
                xy=(6, robust_z[6]), xytext=(3, robust_z[6] - 10),
                arrowprops=dict(arrowstyle='->', color='red', lw=2),
                fontsize=10, fontweight='bold', color='red',
                bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.7))

plt.suptitle('Classical vs Robust Z-Scores: Outlier Detection Power', 
             fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout()
plt.savefig('public/DS-5/zscore_comparison.png', dpi=300, bbox_inches='tight')
plt.close()

# 8. Recap Comparison Table Visualization
fig, ax = plt.subplots(figsize=(14, 8))

# Data from recap table
x_values = np.array([10, 12, 13, 14, 15, 100])
classical_z_vals = np.array([-0.50, -0.43, -0.40, -0.37, -0.34, 2.45])
robust_z_vals = np.array([-2.02, -0.67, 0.00, 0.67, 1.35, 58.68])

x_pos = np.arange(len(x_values))
width = 0.35

bars1 = ax.bar(x_pos - width/2, classical_z_vals, width, label='Classical z', 
              color='orange', alpha=0.7, edgecolor='black', linewidth=1.5)
bars2 = ax.bar(x_pos + width/2, robust_z_vals, width, label='Robust z', 
              color='green', alpha=0.7, edgecolor='black', linewidth=1.5)

ax.set_xticks(x_pos)
ax.set_xticklabels([f'{x}' for x in x_values])
ax.set_ylabel('Z-Score', fontsize=12, fontweight='bold')
ax.set_xlabel('Data Value', fontsize=12, fontweight='bold')
ax.set_title('Recap: Classical vs Robust Z-Scores Comparison', fontsize=14, fontweight='bold')
ax.axhline(0, color='black', linestyle='-', linewidth=1)
ax.axhline(2.5, color='red', linestyle='--', linewidth=2, alpha=0.5, label='Outlier threshold')
ax.axhline(-2.5, color='red', linestyle='--', linewidth=2, alpha=0.5)
ax.legend(fontsize=11)
ax.grid(True, alpha=0.3, axis='y')

# Add value labels
for bars in [bars1, bars2]:
    for i, bar in enumerate(bars):
        height = bar.get_height()
        if abs(height) > 10:
            label = f'{height:.1f}'
            va = 'bottom' if height > 0 else 'top'
        else:
            label = f'{height:.2f}'
            va = 'bottom' if height > 0 else 'top'
        ax.text(bar.get_x() + bar.get_width()/2., height, label,
                ha='center', va=va, fontsize=8, fontweight='bold')

# Highlight outlier
ax.annotate('Outlier: Robust z exposes it clearly', 
           xy=(5, robust_z_vals[5]), xytext=(4, robust_z_vals[5] - 15),
           arrowprops=dict(arrowstyle='->', color='red', lw=2),
           fontsize=11, fontweight='bold', color='red',
           bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.8))

plt.tight_layout()
plt.savefig('public/DS-5/recap_comparison.png', dpi=300, bbox_inches='tight')
plt.close()

print("All DS-5 images created successfully!")

