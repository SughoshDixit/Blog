import matplotlib.pyplot as plt
import numpy as np
from scipy import stats
import seaborn as sns
import os

# Set style
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

# Create DS-6 directory if it doesn't exist
os.makedirs('public/DS-6', exist_ok=True)

# 1. Skewness & Kurtosis Concept - Main header image
fig, axes = plt.subplots(2, 2, figsize=(16, 10))

# Generate example distributions
x = np.linspace(-5, 5, 1000)

# Symmetric, normal (low kurtosis)
normal_dist = stats.norm.pdf(x, 0, 1)
normal_skew = 0
normal_kurt = 3.0

# Right-skewed
right_skew_data = np.random.gamma(2, 1, 10000)
right_skew_hist, right_skew_bins = np.histogram(right_skew_data, bins=50, density=True)
right_skew_x = (right_skew_bins[:-1] + right_skew_bins[1:]) / 2

# Left-skewed
left_skew_data = np.random.beta(5, 2, 10000)
left_skew_hist, left_skew_bins = np.histogram(left_skew_data, bins=50, density=True)
left_skew_x = (left_skew_bins[:-1] + left_skew_bins[1:]) / 2

# Heavy-tailed (high kurtosis)
t_dist = stats.t.pdf(x, df=3)
t_skew = 0
t_kurt = 6.0  # Higher kurtosis

# Top-left: Normal distribution
axes[0, 0].plot(x, normal_dist, 'b-', linewidth=2.5, label='Normal')
axes[0, 0].set_title(f'Symmetric, Normal\nSkewness ≈ {normal_skew:.1f}, Kurtosis = {normal_kurt:.1f}', 
                     fontsize=12, fontweight='bold')
axes[0, 0].set_xlabel('Value', fontsize=11)
axes[0, 0].set_ylabel('Density', fontsize=11)
axes[0, 0].grid(True, alpha=0.3)
axes[0, 0].legend()

# Top-right: Right-skewed
axes[0, 1].plot(right_skew_x, right_skew_hist, 'r-', linewidth=2.5, label='Right-skewed')
axes[0, 1].set_title(f'Right-Skewed Distribution\nSkewness > 0, Long tail →', 
                    fontsize=12, fontweight='bold')
axes[0, 1].set_xlabel('Value', fontsize=11)
axes[0, 1].set_ylabel('Density', fontsize=11)
axes[0, 1].grid(True, alpha=0.3)
axes[0, 1].legend()

# Bottom-left: Left-skewed
axes[1, 0].plot(left_skew_x, left_skew_hist, 'g-', linewidth=2.5, label='Left-skewed')
axes[1, 0].set_title(f'Left-Skewed Distribution\nSkewness < 0, Long tail ←', 
                     fontsize=12, fontweight='bold')
axes[1, 0].set_xlabel('Value', fontsize=11)
axes[1, 0].set_ylabel('Density', fontsize=11)
axes[1, 0].grid(True, alpha=0.3)
axes[1, 0].legend()

# Bottom-right: Heavy-tailed
axes[1, 1].plot(x, t_dist, 'm-', linewidth=2.5, label='Heavy-tailed (t-dist)')
axes[1, 1].set_title(f'Heavy Tails (High Kurtosis)\nSkewness ≈ {t_skew:.1f}, Kurtosis = {t_kurt:.1f}', 
                     fontsize=12, fontweight='bold')
axes[1, 1].set_xlabel('Value', fontsize=11)
axes[1, 1].set_ylabel('Density', fontsize=11)
axes[1, 1].grid(True, alpha=0.3)
axes[1, 1].legend()

plt.suptitle('Skewness & Kurtosis: Understanding Distribution Shape', 
             fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout()
plt.savefig('public/DS-6/skewness_kurtosis_concept.png', dpi=300, bbox_inches='tight')
plt.close()

# 2. Shape Features Overview
fig, axes = plt.subplots(1, 3, figsize=(16, 6))

# Left: Mean and Variance
data_mean_var = np.random.normal(50, 10, 1000)
axes[0].hist(data_mean_var, bins=30, color='skyblue', alpha=0.7, edgecolor='black')
axes[0].axvline(np.mean(data_mean_var), color='red', linestyle='--', linewidth=2.5, 
               label=f'Mean = {np.mean(data_mean_var):.1f}')
axes[0].set_title('Mean & Variance\n📍 Location & 📏 Spread', fontsize=13, fontweight='bold')
axes[0].set_xlabel('Value', fontsize=11)
axes[0].set_ylabel('Frequency', fontsize=11)
axes[0].legend()
axes[0].grid(True, alpha=0.3)

# Middle: Skewness
data_skewed = np.random.gamma(2, 2, 1000)
axes[1].hist(data_skewed, bins=30, color='lightcoral', alpha=0.7, edgecolor='black')
mean_skew = np.mean(data_skewed)
median_skew = np.median(data_skewed)
axes[1].axvline(mean_skew, color='orange', linestyle='--', linewidth=2.5, 
               label=f'Mean = {mean_skew:.1f}')
axes[1].axvline(median_skew, color='green', linestyle='--', linewidth=2.5, 
               label=f'Median = {median_skew:.1f}')
axes[1].set_title('Skewness = Tilt/Lean\n🎢 Asymmetry', fontsize=13, fontweight='bold')
axes[1].set_xlabel('Value', fontsize=11)
axes[1].set_ylabel('Frequency', fontsize=11)
axes[1].legend()
axes[1].grid(True, alpha=0.3)
axes[1].annotate('Mean > Median\n→ Right skew', xy=(mean_skew, 50), 
                xytext=(mean_skew + 3, 80),
                arrowprops=dict(arrowstyle='->', color='orange', lw=2),
                fontsize=10, fontweight='bold', bbox=dict(boxstyle='round', 
                facecolor='yellow', alpha=0.7))

# Right: Kurtosis
data_normal = np.random.normal(50, 10, 1000)
data_heavy = np.random.t(3, 1000) * 10 + 50
axes[2].hist(data_normal, bins=30, alpha=0.5, label='Normal tails', 
            color='blue', edgecolor='black')
axes[2].hist(data_heavy, bins=30, alpha=0.5, label='Heavy tails', 
            color='purple', edgecolor='black')
axes[2].set_title('Kurtosis = Tail Weight\n🪶 Extremes', fontsize=13, fontweight='bold')
axes[2].set_xlabel('Value', fontsize=11)
axes[2].set_ylabel('Frequency', fontsize=11)
axes[2].legend()
axes[2].grid(True, alpha=0.3)

plt.suptitle('Shape Features: Beyond Mean & Variance', 
             fontsize=16, fontweight='bold', y=1.02)
plt.tight_layout()
plt.savefig('public/DS-6/shape_features_overview.png', dpi=300, bbox_inches='tight')
plt.close()

# 3. Skewness Visualization
fig, axes = plt.subplots(1, 3, figsize=(16, 6))

# Right-skewed
right_data = np.random.gamma(2, 2, 2000)
axes[0].hist(right_data, bins=40, color='red', alpha=0.7, edgecolor='black')
mean_r = np.mean(right_data)
median_r = np.median(right_data)
axes[0].axvline(mean_r, color='orange', linestyle='--', linewidth=3, 
               label=f'Mean = {mean_r:.2f}')
axes[0].axvline(median_r, color='green', linestyle='--', linewidth=3, 
               label=f'Median = {median_r:.2f}')
skew_r = stats.skew(right_data)
axes[0].set_title(f'➡️ Positive Skew (Right)\nSkewness ≈ {skew_r:.2f}', 
                 fontsize=13, fontweight='bold')
axes[0].set_xlabel('Value', fontsize=11)
axes[0].set_ylabel('Frequency', fontsize=11)
axes[0].legend()
axes[0].grid(True, alpha=0.3)
axes[0].annotate('Long tail →', xy=(np.percentile(right_data, 95), 100), 
                xytext=(np.percentile(right_data, 95) + 2, 120),
                arrowprops=dict(arrowstyle='->', color='red', lw=2),
                fontsize=11, fontweight='bold', color='red')

# Symmetric
sym_data = np.random.normal(50, 10, 2000)
axes[1].hist(sym_data, bins=40, color='blue', alpha=0.7, edgecolor='black')
mean_s = np.mean(sym_data)
median_s = np.median(sym_data)
axes[1].axvline(mean_s, color='orange', linestyle='--', linewidth=3, 
               label=f'Mean = {mean_s:.2f}')
axes[1].axvline(median_s, color='green', linestyle='--', linewidth=3, 
               label=f'Median = {median_s:.2f}')
skew_s = stats.skew(sym_data)
axes[1].set_title(f'🔁 Symmetric (Near Zero)\nSkewness ≈ {skew_s:.2f}', 
                 fontsize=13, fontweight='bold')
axes[1].set_xlabel('Value', fontsize=11)
axes[1].set_ylabel('Frequency', fontsize=11)
axes[1].legend()
axes[1].grid(True, alpha=0.3)

# Left-skewed
left_data = np.random.beta(5, 2, 2000) * 100
axes[2].hist(left_data, bins=40, color='green', alpha=0.7, edgecolor='black')
mean_l = np.mean(left_data)
median_l = np.median(left_data)
axes[2].axvline(mean_l, color='orange', linestyle='--', linewidth=3, 
               label=f'Mean = {mean_l:.2f}')
axes[2].axvline(median_l, color='green', linestyle='--', linewidth=3, 
               label=f'Median = {median_l:.2f}')
skew_l = stats.skew(left_data)
axes[2].set_title(f'⬅️ Negative Skew (Left)\nSkewness ≈ {skew_l:.2f}', 
                 fontsize=13, fontweight='bold')
axes[2].set_xlabel('Value', fontsize=11)
axes[2].set_ylabel('Frequency', fontsize=11)
axes[2].legend()
axes[2].grid(True, alpha=0.3)
axes[2].annotate('← Long tail', xy=(np.percentile(left_data, 5), 100), 
                xytext=(np.percentile(left_data, 5) - 10, 120),
                arrowprops=dict(arrowstyle='->', color='green', lw=2),
                fontsize=11, fontweight='bold', color='green')

plt.suptitle('Skewness: Direction and Strength of Tilt', 
             fontsize=16, fontweight='bold', y=1.02)
plt.tight_layout()
plt.savefig('public/DS-6/skewness_visualization.png', dpi=300, bbox_inches='tight')
plt.close()

# 4. Kurtosis Visualization
fig, axes = plt.subplots(1, 3, figsize=(16, 6))

# Light tails (low kurtosis)
light_data = np.random.uniform(30, 70, 2000)
axes[0].hist(light_data, bins=40, color='cyan', alpha=0.7, edgecolor='black')
kurt_light = stats.kurtosis(light_data)
axes[0].set_title(f'🔻 Light Tails (Low Kurtosis)\nExcess Kurtosis ≈ {kurt_light:.2f}', 
                 fontsize=13, fontweight='bold')
axes[0].set_xlabel('Value', fontsize=11)
axes[0].set_ylabel('Frequency', fontsize=11)
axes[0].grid(True, alpha=0.3)
axes[0].set_xlim(20, 80)

# Normal tails
normal_data = np.random.normal(50, 10, 2000)
axes[1].hist(normal_data, bins=40, color='blue', alpha=0.7, edgecolor='black')
kurt_normal = stats.kurtosis(normal_data)
axes[1].set_title(f'⚖️ Normal Tails\nExcess Kurtosis ≈ {kurt_normal:.2f}', 
                 fontsize=13, fontweight='bold')
axes[1].set_xlabel('Value', fontsize=11)
axes[1].set_ylabel('Frequency', fontsize=11)
axes[1].grid(True, alpha=0.3)

# Heavy tails (high kurtosis)
heavy_data = np.random.t(3, 2000) * 10 + 50
axes[2].hist(heavy_data, bins=40, color='purple', alpha=0.7, edgecolor='black')
kurt_heavy = stats.kurtosis(heavy_data)
axes[2].set_title(f'🔺 Heavy Tails (High Kurtosis)\nExcess Kurtosis ≈ {kurt_heavy:.2f}', 
                 fontsize=13, fontweight='bold')
axes[2].set_xlabel('Value', fontsize=11)
axes[2].set_ylabel('Frequency', fontsize=11)
axes[2].grid(True, alpha=0.3)
# Highlight extremes
extreme_threshold = np.percentile(np.abs(heavy_data - 50), 95)
extreme_mask = np.abs(heavy_data - 50) > extreme_threshold
axes[2].hist(heavy_data[extreme_mask], bins=40, color='red', alpha=0.9, 
            edgecolor='black', label='Extremes')
axes[2].legend()
axes[2].annotate('Many extremes\n(heavy tails)', 
                xy=(np.percentile(heavy_data, 95), 50), 
                xytext=(np.percentile(heavy_data, 95) + 5, 80),
                arrowprops=dict(arrowstyle='->', color='red', lw=2),
                fontsize=11, fontweight='bold', color='red',
                bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.7))

plt.suptitle('Kurtosis: Tail Weight and Extremes', 
             fontsize=16, fontweight='bold', y=1.02)
plt.tight_layout()
plt.savefig('public/DS-6/kurtosis_visualization.png', dpi=300, bbox_inches='tight')
plt.close()

# 5. Why Shape Matters
fig = plt.figure(figsize=(16, 10))
gs = fig.add_gridspec(2, 2, hspace=0.3, wspace=0.3)

# Outlier Detection
ax1 = fig.add_subplot(gs[0, 0])
skewed_data = np.random.gamma(2, 2, 1000)
skewed_data = np.append(skewed_data, [50])  # Add outlier
ax1.hist(skewed_data, bins=30, color='coral', alpha=0.7, edgecolor='black')
mean_od = np.mean(skewed_data)
median_od = np.median(skewed_data)
mad_od = np.median(np.abs(skewed_data - median_od))
ax1.axvline(mean_od, color='orange', linestyle='--', linewidth=2.5, 
           label=f'Mean = {mean_od:.1f}')
ax1.axvline(median_od, color='green', linestyle='--', linewidth=2.5, 
           label=f'Median = {median_od:.1f}')
ax1.set_title('Outlier Detection\nRight-skew + Heavy tails → Use Median/MAD', 
             fontsize=12, fontweight='bold')
ax1.set_xlabel('Value', fontsize=11)
ax1.set_ylabel('Frequency', fontsize=11)
ax1.legend()
ax1.grid(True, alpha=0.3)

# Binning
ax2 = fig.add_subplot(gs[0, 1])
skewed_bin = np.random.gamma(2, 2, 2000)
ax2.hist(skewed_bin, bins=30, color='skyblue', alpha=0.7, edgecolor='black')
ax2.set_title('Binning & Percentiles\nSkewed data → Prefer quantile bins', 
             fontsize=12, fontweight='bold')
ax2.set_xlabel('Value', fontsize=11)
ax2.set_ylabel('Frequency', fontsize=11)
ax2.grid(True, alpha=0.3)
# Show quantiles
q25, q50, q75 = np.percentile(skewed_bin, [25, 50, 75])
ax2.axvline(q25, color='red', linestyle=':', linewidth=2, label='Q1')
ax2.axvline(q50, color='green', linestyle=':', linewidth=2, label='Q2 (Median)')
ax2.axvline(q75, color='blue', linestyle=':', linewidth=2, label='Q3')
ax2.legend()

# Modeling Implications
ax3 = fig.add_subplot(gs[1, 0])
ax3.axis('off')
modeling_text = """
Modeling Implications:

✓ Skewness → Consider log/sqrt transforms
  for variance stability

✓ High kurtosis → Expect many extremes
  → Try quantile loss or robust regressions

✓ Shape diagnostics guide:
  • Feature selection
  • Outlier handling
  • Transform choices
  • Model selection
"""
ax3.text(0.1, 0.5, modeling_text, fontsize=13, fontweight='bold',
        verticalalignment='center', family='sans-serif',
        bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.7, pad=1))

# Use Cases Summary
ax4 = fig.add_subplot(gs[1, 1])
ax4.axis('off')
use_cases_text = """
Key Applications:

✓ Outlier Detection
  • Right-skew + heavy tails → robust stats
  
✓ Binning & Percentiles
  • Skewed → quantile bins
  
✓ Transformations
  • Right-skew → log transform
  
✓ Model Selection
  • Heavy tails → robust methods
"""
ax4.text(0.1, 0.5, use_cases_text, fontsize=13, fontweight='bold',
        verticalalignment='center', family='sans-serif',
        bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.7, pad=1))

plt.suptitle('Why Shape Matters: Practical Implications', 
             fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout()
plt.savefig('public/DS-6/why_shape_matters.png', dpi=300, bbox_inches='tight')
plt.close()

# 6. Three Shapes Comparison
fig, axes = plt.subplots(1, 3, figsize=(18, 6))

# Generate three distributions with same mean and variance
mean_target = 50
var_target = 100
std_target = np.sqrt(var_target)

# Symmetric light-tailed (normal)
normal_comp = np.random.normal(mean_target, std_target, 2000)
skew_n = stats.skew(normal_comp)
kurt_n = stats.kurtosis(normal_comp)

axes[0].hist(normal_comp, bins=40, color='lightblue', alpha=0.7, edgecolor='black')
axes[0].axvline(mean_target, color='red', linestyle='--', linewidth=2.5, 
               label=f'Mean = {mean_target}')
axes[0].set_title(f'⚪ Symmetric Light-Tailed\nSkewness ≈ {skew_n:.2f}, Excess Kurtosis ≈ {kurt_n:.2f}', 
                 fontsize=13, fontweight='bold')
axes[0].set_xlabel('Value', fontsize=11)
axes[0].set_ylabel('Frequency', fontsize=11)
axes[0].legend()
axes[0].grid(True, alpha=0.3)

# Symmetric heavy-tailed (t-distribution, scaled)
t_comp = np.random.t(3, 2000)
# Scale to match mean and variance
t_comp = t_comp / np.std(t_comp) * std_target + mean_target
skew_t = stats.skew(t_comp)
kurt_t = stats.kurtosis(t_comp)

axes[1].hist(t_comp, bins=40, color='purple', alpha=0.7, edgecolor='black')
axes[1].axvline(mean_target, color='red', linestyle='--', linewidth=2.5, 
               label=f'Mean = {mean_target:.1f}')
axes[1].set_title(f'🟣 Symmetric Heavy-Tailed\nSkewness ≈ {skew_t:.2f}, Excess Kurtosis ≈ {kurt_t:.2f}', 
                 fontsize=13, fontweight='bold')
axes[1].set_xlabel('Value', fontsize=11)
axes[1].set_ylabel('Frequency', fontsize=11)
axes[1].legend()
axes[1].grid(True, alpha=0.3)
axes[1].annotate('More extremes', xy=(np.percentile(t_comp, 95), 50), 
                xytext=(np.percentile(t_comp, 95) + 10, 80),
                arrowprops=dict(arrowstyle='->', color='red', lw=2),
                fontsize=10, fontweight='bold', color='red')

# Right-skewed
gamma_comp = np.random.gamma(4, 2.5, 2000)
# Scale to match mean and variance
gamma_comp = (gamma_comp - np.mean(gamma_comp)) / np.std(gamma_comp) * std_target + mean_target
skew_g = stats.skew(gamma_comp)
kurt_g = stats.kurtosis(gamma_comp)

axes[2].hist(gamma_comp, bins=40, color='orange', alpha=0.7, edgecolor='black')
axes[2].axvline(mean_target, color='red', linestyle='--', linewidth=2.5, 
               label=f'Mean = {mean_target:.1f}')
axes[2].set_title(f'🟠 Right-Skewed\nSkewness ≈ {skew_g:.2f}, Excess Kurtosis ≈ {kurt_g:.2f}', 
                 fontsize=13, fontweight='bold')
axes[2].set_xlabel('Value', fontsize=11)
axes[2].set_ylabel('Frequency', fontsize=11)
axes[2].legend()
axes[2].grid(True, alpha=0.3)
axes[2].annotate('Long tail →', xy=(np.percentile(gamma_comp, 95), 50), 
                xytext=(np.percentile(gamma_comp, 95) + 10, 80),
                arrowprops=dict(arrowstyle='->', color='orange', lw=2),
                fontsize=10, fontweight='bold', color='orange')

plt.suptitle('Three Shapes, Same Mean & Variance: Different Stories', 
             fontsize=16, fontweight='bold', y=1.02)
plt.tight_layout()
plt.savefig('public/DS-6/three_shapes_comparison.png', dpi=300, bbox_inches='tight')
plt.close()

# 7. Histogram Cheat Sheet
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# Right-skewed
data_r = np.random.gamma(2, 2, 2000)
axes[0, 0].hist(data_r, bins=40, color='red', alpha=0.7, edgecolor='black')
axes[0, 0].set_title('➡️ Positive Skew (Right)\nTail longer on right', 
                     fontsize=12, fontweight='bold')
axes[0, 0].set_xlabel('Value', fontsize=10)
axes[0, 0].set_ylabel('Frequency', fontsize=10)
axes[0, 0].grid(True, alpha=0.3)
axes[0, 0].annotate('→', xy=(np.percentile(data_r, 95), 100), 
                   fontsize=30, fontweight='bold', color='red',
                   ha='center', va='center')

# Left-skewed
data_l = np.random.beta(5, 2, 2000) * 100
axes[0, 1].hist(data_l, bins=40, color='green', alpha=0.7, edgecolor='black')
axes[0, 1].set_title('⬅️ Negative Skew (Left)\nTail longer on left', 
                     fontsize=12, fontweight='bold')
axes[0, 1].set_xlabel('Value', fontsize=10)
axes[0, 1].set_ylabel('Frequency', fontsize=10)
axes[0, 1].grid(True, alpha=0.3)
axes[0, 1].annotate('←', xy=(np.percentile(data_l, 5), 100), 
                   fontsize=30, fontweight='bold', color='green',
                   ha='center', va='center')

# Fat tails (high kurtosis)
data_fat = np.random.t(3, 2000) * 10 + 50
axes[1, 0].hist(data_fat, bins=40, color='purple', alpha=0.7, edgecolor='black')
axes[1, 0].set_title('🦘 High Kurtosis (Fat Tails)\nHeavy extremes', 
                     fontsize=12, fontweight='bold')
axes[1, 0].set_xlabel('Value', fontsize=10)
axes[1, 0].set_ylabel('Frequency', fontsize=10)
axes[1, 0].grid(True, alpha=0.3)
# Highlight tail areas
tail_low = np.percentile(data_fat, 5)
tail_high = np.percentile(data_fat, 95)
axes[1, 0].axvspan(tail_low - 5, tail_low + 5, alpha=0.3, color='red')
axes[1, 0].axvspan(tail_high - 5, tail_high + 5, alpha=0.3, color='red')

# Slim tails (low kurtosis)
data_slim = np.random.uniform(30, 70, 2000)
axes[1, 1].hist(data_slim, bins=40, color='cyan', alpha=0.7, edgecolor='black')
axes[1, 1].set_title('🍞 Low Kurtosis (Slim Tails)\nFew extremes', 
                     fontsize=12, fontweight='bold')
axes[1, 1].set_xlabel('Value', fontsize=10)
axes[1, 1].set_ylabel('Frequency', fontsize=10)
axes[1, 1].grid(True, alpha=0.3)

plt.suptitle('Histogram Cheat Sheet: Visual Cues', 
             fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout()
plt.savefig('public/DS-6/histogram_cheat_sheet.png', dpi=300, bbox_inches='tight')
plt.close()

# 8. Typical Ranges
fig, axes = plt.subplots(1, 2, figsize=(16, 6))

# Skewness ranges
ax1 = axes[0]
skew_examples = {
    'Roughly Symmetric': (0.2, 'lightblue'),
    'Mild Skew': (0.8, 'yellow'),
    'Strong Skew': (1.8, 'orange'),
    'Very Strong': (3.0, 'red')
}

x_skew = np.arange(len(skew_examples))
heights_skew = [v[0] for v in skew_examples.values()]
colors_skew = [v[1] for v in skew_examples.values()]
bars = ax1.bar(x_skew, heights_skew, color=colors_skew, alpha=0.7, 
              edgecolor='black', linewidth=1.5)
ax1.set_xticks(x_skew)
ax1.set_xticklabels(list(skew_examples.keys()), rotation=15, ha='right')
ax1.set_ylabel('|Skewness|', fontsize=12, fontweight='bold')
ax1.set_title('Skewness: Typical Ranges', fontsize=13, fontweight='bold')
ax1.axhline(0.5, color='blue', linestyle=':', linewidth=2, alpha=0.7, 
           label='Roughly symmetric threshold')
ax1.axhline(1.0, color='orange', linestyle=':', linewidth=2, alpha=0.7, 
           label='Strong skew threshold')
ax1.legend()
ax1.grid(True, alpha=0.3, axis='y')
# Add value labels
for i, (bar, val) in enumerate(zip(bars, heights_skew)):
    ax1.text(bar.get_x() + bar.get_width()/2., val,
            f'{val:.1f}', ha='center', va='bottom',
            fontsize=10, fontweight='bold')

# Excess Kurtosis ranges
ax2 = axes[1]
kurt_examples = {
    'Lighter than Normal': (-1.0, 'cyan'),
    'About Normal': (0.1, 'blue'),
    'Heavier than Normal': (2.0, 'purple'),
    'Very Heavy': (5.0, 'red')
}

x_kurt = np.arange(len(kurt_examples))
heights_kurt = [v[0] for v in kurt_examples.values()]
colors_kurt = [v[1] for v in kurt_examples.values()]
bars2 = ax2.bar(x_kurt, heights_kurt, color=colors_kurt, alpha=0.7, 
               edgecolor='black', linewidth=1.5)
ax2.set_xticks(x_kurt)
ax2.set_xticklabels(list(kurt_examples.keys()), rotation=15, ha='right')
ax2.set_ylabel('Excess Kurtosis', fontsize=12, fontweight='bold')
ax2.set_title('Excess Kurtosis: Typical Ranges', fontsize=13, fontweight='bold')
ax2.axhline(0, color='blue', linestyle=':', linewidth=2, alpha=0.7, 
           label='Normal threshold')
ax2.legend()
ax2.grid(True, alpha=0.3, axis='y')
# Add value labels
for i, (bar, val) in enumerate(zip(bars2, heights_kurt)):
    ax2.text(bar.get_x() + bar.get_width()/2., val,
            f'{val:.1f}', ha='center', va='bottom' if val > 0 else 'top',
            fontsize=10, fontweight='bold')

plt.suptitle('Typical Ranges: Quick Reference', 
             fontsize=16, fontweight='bold', y=1.02)
plt.tight_layout()
plt.savefig('public/DS-6/typical_ranges.png', dpi=300, bbox_inches='tight')
plt.close()

# 9. Tiny Examples
fig, axes = plt.subplots(1, 2, figsize=(16, 6))

# Right-skewed example
data_right = np.array([1, 1, 2, 2, 3, 4, 10])
mean_right = np.mean(data_right)
median_right = np.median(data_right)

axes[0].bar(range(len(data_right)), data_right, color='red', alpha=0.7, 
           edgecolor='black', linewidth=1.5)
axes[0].axhline(mean_right, color='orange', linestyle='--', linewidth=2.5, 
               label=f'Mean = {mean_right:.2f}')
axes[0].axhline(median_right, color='green', linestyle='--', linewidth=2.5, 
               label=f'Median = {median_right:.1f}')
axes[0].set_xticks(range(len(data_right)))
axes[0].set_xticklabels(data_right)
axes[0].set_ylabel('Value', fontsize=12, fontweight='bold')
axes[0].set_xlabel('Data Point', fontsize=12, fontweight='bold')
axes[0].set_title(f'Right-Skewed: [1, 1, 2, 2, 3, 4, 10]\nMean ({mean_right:.2f}) > Median ({median_right:.1f}) → skew > 0', 
                 fontsize=13, fontweight='bold')
axes[0].legend()
axes[0].grid(True, alpha=0.3, axis='y')
axes[0].annotate('Outlier', xy=(6, 10), xytext=(6, 9),
                arrowprops=dict(arrowstyle='->', color='red', lw=2),
                fontsize=11, fontweight='bold', color='red',
                bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.7))

# Heavy tails example
data_tails = np.array([-10, -2, -1, 0, 1, 2, 10])
mean_tails = np.mean(data_tails)
std_tails = np.std(data_tails, ddof=1)

axes[1].bar(range(len(data_tails)), data_tails, color='purple', alpha=0.7, 
           edgecolor='black', linewidth=1.5)
axes[1].axhline(mean_tails, color='orange', linestyle='--', linewidth=2.5, 
               label=f'Mean = {mean_tails:.2f}')
axes[1].axhline(mean_tails + std_tails, color='red', linestyle=':', linewidth=2, 
               label=f'Mean ± SD')
axes[1].axhline(mean_tails - std_tails, color='red', linestyle=':', linewidth=2)
axes[1].set_xticks(range(len(data_tails)))
axes[1].set_xticklabels(data_tails)
axes[1].set_ylabel('Value', fontsize=12, fontweight='bold')
axes[1].set_xlabel('Data Point', fontsize=12, fontweight='bold')
axes[1].set_title(f'Heavy Tails: [-10, -2, -1, 0, 1, 2, 10]\nMore extremes → high kurtosis', 
                 fontsize=13, fontweight='bold')
axes[1].legend()
axes[1].grid(True, alpha=0.3, axis='y')
axes[1].annotate('Extreme', xy=(0, -10), xytext=(0.5, -8.5),
                arrowprops=dict(arrowstyle='->', color='red', lw=2),
                fontsize=10, fontweight='bold', color='red')
axes[1].annotate('Extreme', xy=(6, 10), xytext=(5.5, 8.5),
                arrowprops=dict(arrowstyle='->', color='red', lw=2),
                fontsize=10, fontweight='bold', color='red')

plt.suptitle('Tiny Examples: Same Spread, Different Story', 
             fontsize=16, fontweight='bold', y=1.02)
plt.tight_layout()
plt.savefig('public/DS-6/tiny_examples.png', dpi=300, bbox_inches='tight')
plt.close()

# 10. After Measuring Shape
fig = plt.figure(figsize=(16, 10))
gs = fig.add_gridspec(2, 2, hspace=0.3, wspace=0.3)

# If skewed
ax1 = fig.add_subplot(gs[0, 0])
skewed_data = np.random.gamma(2, 2, 2000)
ax1.hist(skewed_data, bins=40, color='coral', alpha=0.7, edgecolor='black', label='Original')
# Log transform
log_data = np.log(skewed_data + 1)
ax1.hist(log_data * 10, bins=40, alpha=0.5, color='green', edgecolor='black', label='Log transform')
ax1.set_title('If Skewed → Use log/sqrt transforms\n(for positive data)', 
             fontsize=12, fontweight='bold')
ax1.set_xlabel('Value', fontsize=11)
ax1.set_ylabel('Frequency', fontsize=11)
ax1.legend()
ax1.grid(True, alpha=0.3)

# Heavy tails
ax2 = fig.add_subplot(gs[0, 1])
heavy_data = np.random.t(3, 2000) * 10 + 50
ax2.hist(heavy_data, bins=40, color='purple', alpha=0.7, edgecolor='black')
q5, q95 = np.percentile(heavy_data, [5, 95])
ax2.axvline(q5, color='red', linestyle='--', linewidth=2.5, label=f'5th percentile = {q5:.1f}')
ax2.axvline(q95, color='red', linestyle='--', linewidth=2.5, label=f'95th percentile = {q95:.1f}')
ax2.set_title('Heavy Tails → Relax outlier cutoffs\nor use percentiles (5th/95th)', 
             fontsize=12, fontweight='bold')
ax2.set_xlabel('Value', fontsize=11)
ax2.set_ylabel('Frequency', fontsize=11)
ax2.legend()
ax2.grid(True, alpha=0.3)

# Robust methods
ax3 = fig.add_subplot(gs[1, 0])
ax3.axis('off')
robust_text = """
Use Robust Methods:

✓ Median/MAD for stability
✓ Quantile loss functions
✓ Robust regressions
✓ Percentile-based thresholds

These resist distortion from:
• Outliers
• Heavy tails
• Skewness
"""
ax3.text(0.1, 0.5, robust_text, fontsize=13, fontweight='bold',
        verticalalignment='center', family='sans-serif',
        bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.7, pad=1))

# Re-check
ax4 = fig.add_subplot(gs[1, 1])
ax4.axis('off')
recheck_text = """
Re-check After:

✓ Cleaning data
✓ Transformations
✓ Outlier removal
✓ Feature engineering

Shape diagnostics should guide
your entire workflow, not just
initial exploration.
"""
ax4.text(0.1, 0.5, recheck_text, fontsize=13, fontweight='bold',
        verticalalignment='center', family='sans-serif',
        bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.7, pad=1))

plt.suptitle('After Measuring Shape: Next Steps', 
             fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout()
plt.savefig('public/DS-6/after_measuring_shape.png', dpi=300, bbox_inches='tight')
plt.close()

# 11. Visual Ideas
fig, axes = plt.subplots(1, 3, figsize=(18, 6))

# Symmetric light-tailed
data_sym = np.random.normal(50, 10, 2000)
axes[0].hist(data_sym, bins=40, color='lightblue', alpha=0.7, edgecolor='black')
skew_s = stats.skew(data_sym)
kurt_s = stats.kurtosis(data_sym)
axes[0].set_title(f'1️⃣ Symmetric Light-Tailed\nSkewness ≈ {skew_s:.2f}, Kurtosis ↓', 
                 fontsize=12, fontweight='bold')
axes[0].set_xlabel('Value', fontsize=11)
axes[0].set_ylabel('Frequency', fontsize=11)
axes[0].grid(True, alpha=0.3)

# Symmetric heavy-tailed
data_heavy = np.random.t(3, 2000) * 10 + 50
axes[1].hist(data_heavy, bins=40, color='purple', alpha=0.7, edgecolor='black')
skew_h = stats.skew(data_heavy)
kurt_h = stats.kurtosis(data_heavy)
axes[1].set_title(f'2️⃣ Symmetric Heavy-Tailed\nSkewness ≈ {skew_h:.2f}, Kurtosis ↑', 
                 fontsize=12, fontweight='bold')
axes[1].set_xlabel('Value', fontsize=11)
axes[1].set_ylabel('Frequency', fontsize=11)
axes[1].grid(True, alpha=0.3)
axes[1].annotate('Heavy tails', xy=(np.percentile(data_heavy, 95), 50), 
                fontsize=10, fontweight='bold', color='red',
                bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.7))

# Right-skewed
data_skew = np.random.gamma(2, 2, 2000)
axes[2].hist(data_skew, bins=40, color='orange', alpha=0.7, edgecolor='black')
skew_r = stats.skew(data_skew)
kurt_r = stats.kurtosis(data_skew)
axes[2].set_title(f'3️⃣ Right-Skewed\nSkewness > 0, Long tail →', 
                 fontsize=12, fontweight='bold')
axes[2].set_xlabel('Value', fontsize=11)
axes[2].set_ylabel('Frequency', fontsize=11)
axes[2].grid(True, alpha=0.3)
axes[2].annotate('Long tail →', xy=(np.percentile(data_skew, 95), 50), 
                fontsize=10, fontweight='bold', color='orange',
                bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.7))

plt.suptitle('Visual Ideas: Three Histograms Side by Side', 
             fontsize=16, fontweight='bold', y=1.02)
plt.tight_layout()
plt.savefig('public/DS-6/visual_ideas.png', dpi=300, bbox_inches='tight')
plt.close()

# 12. Shape Checklist
fig = plt.figure(figsize=(14, 10))

# Create a checklist visualization
ax = fig.add_subplot(1, 1, 1)
ax.axis('off')

checklist_items = [
    ('☑️', 'Compute skewness & kurtosis for key features', 'blue'),
    ('☑️', 'Visualize histograms or ECDFs', 'green'),
    ('☑️', 'If |skew| > 0.5 → transform or use robust methods', 'orange'),
    ('☑️', 'If excess kurtosis > 0 → expect extremes and adjust thresholds', 'purple'),
    ('☑️', 'Re-evaluate after cleaning', 'red'),
]

y_start = 0.8
y_spacing = 0.12

for i, (check, text, color) in enumerate(checklist_items):
    y_pos = y_start - i * y_spacing
    
    # Draw checkbox
    ax.text(0.1, y_pos, check, fontsize=24, fontweight='bold', color=color,
           verticalalignment='center')
    
    # Draw text
    ax.text(0.18, y_pos, text, fontsize=16, fontweight='bold',
           verticalalignment='center', family='sans-serif')

# Title
ax.text(0.5, 0.95, 'Shape Checklist', fontsize=24, fontweight='bold',
       ha='center', verticalalignment='center')

# Add summary box at bottom
summary_text = """
Remember: Shape matters. Once you see it, you can't unsee it. 🎨📊

Every dataset has a shape signature that guides:
• Outlier detection strategies
• Binning choices
• Transformation needs
• Model selection
"""
ax.text(0.5, 0.15, summary_text, fontsize=14, fontweight='bold',
       ha='center', verticalalignment='center',
       bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.8, pad=1))

plt.savefig('public/DS-6/shape_checklist.png', dpi=300, bbox_inches='tight')
plt.close()

print("All DS-6 images created successfully!")

