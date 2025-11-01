import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Rectangle
import seaborn as sns
import os

# Set style
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

# Create DS-4 directory if it doesn't exist
os.makedirs('public/DS-4', exist_ok=True)

# 1. Percentile Rank Concept - Main visualization
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

# Left: Raw data distribution
data = np.array([10, 7, 12, 15, 8, 20, 9, 18])
sorted_data = np.sort(data)
n = len(data)
ranks = np.arange(1, n + 1) / n

ax1.hist(data, bins=10, alpha=0.7, color='skyblue', edgecolor='black')
ax1.axvline(sorted_data[3], color='red', linestyle='--', linewidth=2, label=f'Value 12 (rank={ranks[3]:.2f})')
ax1.set_xlabel('Feature Value', fontsize=12, fontweight='bold')
ax1.set_ylabel('Frequency', fontsize=12, fontweight='bold')
ax1.set_title('Raw Data Distribution', fontsize=14, fontweight='bold')
ax1.legend()
ax1.grid(True, alpha=0.3)

# Right: Percentile rank mapping
ax2.plot(sorted_data, ranks, 'o-', linewidth=2, markersize=8, color='purple')
ax2.fill_between(sorted_data, 0, ranks, alpha=0.3, color='purple')
ax2.axhline(ranks[3], color='red', linestyle='--', linewidth=2)
ax2.axvline(sorted_data[3], color='red', linestyle='--', linewidth=2)
ax2.set_xlabel('Feature Value', fontsize=12, fontweight='bold')
ax2.set_ylabel('Percentile Rank [0,1]', fontsize=12, fontweight='bold')
ax2.set_title('Percentile Rank Mapping (ECDF)', fontsize=14, fontweight='bold')
ax2.set_ylim(0, 1.1)
ax2.grid(True, alpha=0.3)
ax2.text(sorted_data[3] + 1, ranks[3] + 0.1, f'rank = {ranks[3]:.2f}', 
         fontsize=10, color='red', fontweight='bold')

plt.suptitle('Percentile Rank: From Raw Values to [0,1] Scale', fontsize=16, fontweight='bold', y=1.02)
plt.tight_layout()
plt.savefig('public/DS-4/percentile_rank_concept.png', dpi=300, bbox_inches='tight')
plt.close()

# 2. Rank Properties - Monotonicity and Invariance
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# Monotonicity
x_values = np.array([7, 8, 9, 10, 12, 15, 18, 20])
x_sorted = np.sort(x_values)
n = len(x_values)
ranks_mono = np.arange(1, n + 1) / n

axes[0, 0].plot(x_sorted, ranks_mono, 'o-', linewidth=2, markersize=8, color='blue')
axes[0, 0].set_xlabel('x (sorted)', fontsize=11, fontweight='bold')
axes[0, 0].set_ylabel('Rank', fontsize=11, fontweight='bold')
axes[0, 0].set_title('Monotonicity: If xᵢ ≤ xⱼ, then rankᵢ ≤ rankⱼ', fontsize=12, fontweight='bold')
axes[0, 0].grid(True, alpha=0.3)
axes[0, 0].annotate('Always increasing', xy=(12, 0.6), fontsize=10, 
                    bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.5))

# Invariance to monotone transforms
y_values = 3 * x_values + 2  # Linear transform
y_sorted = np.sort(y_values)
ranks_y = np.arange(1, n + 1) / n

axes[0, 1].plot(x_sorted, ranks_mono, 'o-', linewidth=2, markersize=8, label='Original X', color='blue')
axes[0, 1].plot(y_sorted, ranks_y, 's-', linewidth=2, markersize=8, label='Y = 3X + 2', color='red')
axes[0, 1].set_xlabel('Value (different scales)', fontsize=11, fontweight='bold')
axes[0, 1].set_ylabel('Rank (same!)', fontsize=11, fontweight='bold')
axes[0, 1].set_title('Invariance: Ranks unchanged by monotone transform', fontsize=12, fontweight='bold')
axes[0, 1].legend()
axes[0, 1].grid(True, alpha=0.3)

# Scale comparison
scales = ['Original', '×2', '×3 + 5', '×10']
rank_values = [ranks_mono[3], ranks_mono[3], ranks_mono[3], ranks_mono[3]]

axes[1, 0].bar(scales, rank_values, color=['blue', 'green', 'orange', 'purple'], alpha=0.7)
axes[1, 0].set_ylabel('Percentile Rank', fontsize=11, fontweight='bold')
axes[1, 0].set_title('Rank stays the same across scales', fontsize=12, fontweight='bold')
axes[1, 0].set_ylim(0, 1)
axes[1, 0].grid(True, alpha=0.3, axis='y')

# Properties summary
axes[1, 1].axis('off')
props_text = """
Key Properties:

✓ Monotonicity: Order-preserving
✓ Invariance: Stable under monotone transforms
✓ Scale-free: [0,1] regardless of original units
✓ Interpretable: Fraction of data at/below value
"""
axes[1, 1].text(0.1, 0.5, props_text, fontsize=12, fontweight='bold',
                verticalalignment='center', family='monospace',
                bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.7))

plt.suptitle('Properties of Percentile Ranks', fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout()
plt.savefig('public/DS-4/rank_properties.png', dpi=300, bbox_inches='tight')
plt.close()

# 3. Combining Ranks - Min vs Max
fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# Create a grid of rank combinations
rA = np.linspace(0, 1, 50)
rB = np.linspace(0, 1, 50)
RA, RB = np.meshgrid(rA, rB)
RAND = np.minimum(RA, RB)
ROR = np.maximum(RA, RB)

# Min (AND-like)
im1 = axes[0].contourf(RA, RB, RAND, levels=20, cmap='viridis')
axes[0].set_xlabel('rA (Feature A rank)', fontsize=12, fontweight='bold')
axes[0].set_ylabel('rB (Feature B rank)', fontsize=12, fontweight='bold')
axes[0].set_title('Conservative: rAND = min(rA, rB)', fontsize=14, fontweight='bold')
plt.colorbar(im1, ax=axes[0], label='Combined Rank')
axes[0].plot([0, 1], [0, 1], 'r--', linewidth=2, label='Diagonal')
axes[0].legend()

# Max (OR-like)
im2 = axes[1].contourf(RA, RB, ROR, levels=20, cmap='plasma')
axes[1].set_xlabel('rA (Feature A rank)', fontsize=12, fontweight='bold')
axes[1].set_ylabel('rB (Feature B rank)', fontsize=12, fontweight='bold')
axes[1].set_title('Liberal: rOR = max(rA, rB)', fontsize=14, fontweight='bold')
plt.colorbar(im2, ax=axes[1], label='Combined Rank')
axes[1].plot([0, 1], [0, 1], 'r--', linewidth=2, label='Diagonal')
axes[1].legend()

plt.suptitle('Combining Percentile Ranks: AND vs OR Logic', fontsize=16, fontweight='bold', y=1.02)
plt.tight_layout()
plt.savefig('public/DS-4/combining_ranks.png', dpi=300, bbox_inches='tight')
plt.close()

# 4. Stratification Concept
fig, axes = plt.subplots(2, 1, figsize=(12, 10))

# Top: Distribution of combined ranks
n_samples = 1000
rAND_samples = np.random.beta(2, 2, n_samples)  # Beta distribution for example

axes[0].hist(rAND_samples, bins=50, alpha=0.7, color='skyblue', edgecolor='black')
axes[0].axvline(0.2, color='red', linestyle='--', linewidth=2, label='Cut at 0.2')
axes[0].axvline(0.5, color='orange', linestyle='--', linewidth=2, label='Cut at 0.5')
axes[0].axvline(0.8, color='purple', linestyle='--', linewidth=2, label='Cut at 0.8')
axes[0].set_xlabel('Combined Rank (rAND)', fontsize=12, fontweight='bold')
axes[0].set_ylabel('Frequency', fontsize=12, fontweight='bold')
axes[0].set_title('Distribution of Combined Ranks', fontsize=14, fontweight='bold')
axes[0].legend()
axes[0].grid(True, alpha=0.3)

# Bottom: Stratification visualization
strata_labels = ['Stratum 1\n[0.0, 0.2)', 'Stratum 2\n[0.2, 0.5)', 
                 'Stratum 3\n[0.5, 0.8)', 'Stratum 4\n[0.8, 1.0]']
strata_counts = [
    np.sum((rAND_samples >= 0.0) & (rAND_samples < 0.2)),
    np.sum((rAND_samples >= 0.2) & (rAND_samples < 0.5)),
    np.sum((rAND_samples >= 0.5) & (rAND_samples < 0.8)),
    np.sum((rAND_samples >= 0.8) & (rAND_samples <= 1.0))
]
colors = ['#FFB6C1', '#87CEEB', '#DDA0DD', '#FFE4B5']

bars = axes[1].bar(strata_labels, strata_counts, color=colors, edgecolor='black', linewidth=2)
axes[1].set_ylabel('Number of Observations', fontsize=12, fontweight='bold')
axes[1].set_title('Stratification into Four Strata', fontsize=14, fontweight='bold')
axes[1].grid(True, alpha=0.3, axis='y')

# Add count labels on bars
for bar, count in zip(bars, strata_counts):
    height = bar.get_height()
    axes[1].text(bar.get_x() + bar.get_width()/2., height,
                f'{count}\n({count/n_samples*100:.1f}%)',
                ha='center', va='bottom', fontsize=11, fontweight='bold')

plt.suptitle('Stratification: Dividing Population into Rank-Based Groups', fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout()
plt.savefig('public/DS-4/stratification_concept.png', dpi=300, bbox_inches='tight')
plt.close()

# 5. Solved Example Visualization
fig = plt.figure(figsize=(16, 10))

# Create grid layout
gs = fig.add_gridspec(3, 3, hspace=0.3, wspace=0.3)

# Data from solved example
ids = np.array([1, 2, 3, 4, 5, 6, 7, 8])
A = np.array([10, 7, 12, 15, 8, 20, 9, 18])
B = np.array([5, 3, 9, 4, 8, 6, 2, 10])
rA = np.array([0.50, 0.12, 0.62, 0.75, 0.25, 1.00, 0.38, 0.88])
rB = np.array([0.50, 0.25, 0.88, 0.38, 0.75, 0.62, 0.12, 1.00])
rAND = np.minimum(rA, rB)
rOR = np.maximum(rA, rB)

# Plot 1: Feature A
ax1 = fig.add_subplot(gs[0, 0])
ax1.bar(ids, A, color='steelblue', alpha=0.7, edgecolor='black')
ax1.set_xlabel('ID', fontsize=10, fontweight='bold')
ax1.set_ylabel('Feature A', fontsize=10, fontweight='bold')
ax1.set_title('Feature A Values', fontsize=11, fontweight='bold')
ax1.grid(True, alpha=0.3, axis='y')

# Plot 2: Feature B
ax2 = fig.add_subplot(gs[0, 1])
ax2.bar(ids, B, color='coral', alpha=0.7, edgecolor='black')
ax2.set_xlabel('ID', fontsize=10, fontweight='bold')
ax2.set_ylabel('Feature B', fontsize=10, fontweight='bold')
ax2.set_title('Feature B Values', fontsize=11, fontweight='bold')
ax2.grid(True, alpha=0.3, axis='y')

# Plot 3: Ranks A and B
ax3 = fig.add_subplot(gs[0, 2])
x_pos = np.arange(len(ids))
width = 0.35
ax3.bar(x_pos - width/2, rA, width, label='rA', color='blue', alpha=0.7, edgecolor='black')
ax3.bar(x_pos + width/2, rB, width, label='rB', color='red', alpha=0.7, edgecolor='black')
ax3.set_xlabel('ID', fontsize=10, fontweight='bold')
ax3.set_ylabel('Percentile Rank', fontsize=10, fontweight='bold')
ax3.set_title('Percentile Ranks: rA and rB', fontsize=11, fontweight='bold')
ax3.set_xticks(x_pos)
ax3.set_xticklabels(ids)
ax3.legend()
ax3.grid(True, alpha=0.3, axis='y')
ax3.set_ylim(0, 1.1)

# Plot 4: Combined ranks comparison
ax4 = fig.add_subplot(gs[1, :])
x_pos = np.arange(len(ids))
width = 0.35
bars1 = ax4.bar(x_pos - width/2, rAND, width, label='rAND = min(rA, rB)', 
                color='purple', alpha=0.7, edgecolor='black')
bars2 = ax4.bar(x_pos + width/2, rOR, width, label='rOR = max(rA, rB)', 
                color='orange', alpha=0.7, edgecolor='black')
ax4.set_xlabel('ID', fontsize=11, fontweight='bold')
ax4.set_ylabel('Combined Rank', fontsize=11, fontweight='bold')
ax4.set_title('Combined Ranks: Conservative (min) vs Liberal (max)', fontsize=12, fontweight='bold')
ax4.set_xticks(x_pos)
ax4.set_xticklabels(ids)
ax4.legend()
ax4.grid(True, alpha=0.3, axis='y')
ax4.set_ylim(0, 1.1)

# Add value labels
for bars in [bars1, bars2]:
    for bar in bars:
        height = bar.get_height()
        ax4.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:.2f}', ha='center', va='bottom', fontsize=8)

# Plot 5: Stratification
ax5 = fig.add_subplot(gs[2, :])
# Define strata
strata_cuts = [0.0, 0.2, 0.5, 0.8, 1.0]
strata_colors = ['#FFB6C1', '#87CEEB', '#DDA0DD', '#FFE4B5']
strata_names = ['Stratum 1\n[0, 0.2)', 'Stratum 2\n[0.2, 0.5)', 
                'Stratum 3\n[0.5, 0.8)', 'Stratum 4\n[0.8, 1.0]']

# Assign observations to strata
strata_assignments = []
strata_ids = [[], [], [], []]
for i, rand_val in enumerate(rAND):
    if rand_val < 0.2:
        strata_assignments.append(0)
        strata_ids[0].append(ids[i])
    elif rand_val < 0.5:
        strata_assignments.append(1)
        strata_ids[1].append(ids[i])
    elif rand_val < 0.8:
        strata_assignments.append(2)
        strata_ids[2].append(ids[i])
    else:
        strata_assignments.append(3)
        strata_ids[3].append(ids[i])

# Create bar chart
y_pos = np.arange(len(ids))
colors_list = [strata_colors[s] for s in strata_assignments]
bars = ax5.barh(y_pos, rAND, color=colors_list, edgecolor='black', linewidth=1.5)

# Add stratum boundaries
for cut in [0.2, 0.5, 0.8]:
    ax5.axvline(cut, color='red', linestyle='--', linewidth=2, alpha=0.7)

ax5.set_yticks(y_pos)
ax5.set_yticklabels([f'ID {id_val}' for id_val in ids])
ax5.set_xlabel('rAND (Combined Rank)', fontsize=11, fontweight='bold')
ax5.set_title('Stratification: Observations grouped by rAND', fontsize=12, fontweight='bold')
ax5.set_xlim(0, 1.1)
ax5.grid(True, alpha=0.3, axis='x')

# Add legend
from matplotlib.patches import Patch
legend_elements = [Patch(facecolor=color, edgecolor='black', label=name) 
                   for color, name in zip(strata_colors, strata_names)]
ax5.legend(handles=legend_elements, loc='lower right', fontsize=9)

# Add ID labels in strata
for stratum_idx, stratum_id_list in enumerate(strata_ids):
    if stratum_id_list:
        ax5.text(0.05 + stratum_idx * 0.2, len(ids) - 0.5, 
                f'IDs: {", ".join(map(str, stratum_id_list))}', 
                fontsize=9, fontweight='bold',
                bbox=dict(boxstyle='round', facecolor=strata_colors[stratum_idx], alpha=0.5))

plt.suptitle('Solved Example: From Raw Features to Strata', fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout()
plt.savefig('public/DS-4/solved_example.png', dpi=300, bbox_inches='tight')
plt.close()

# 6. Min vs Max Comparison
fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# Example comparison
example_cases = [
    ('Case 1', 0.7, 0.4, min(0.7, 0.4), max(0.7, 0.4)),
    ('Case 2', 0.9, 0.3, min(0.9, 0.3), max(0.9, 0.3)),
    ('Case 3', 0.6, 0.6, min(0.6, 0.6), max(0.6, 0.6)),
    ('Case 4', 0.2, 0.8, min(0.2, 0.8), max(0.2, 0.8)),
]

cases = [ex[0] for ex in example_cases]
rA_vals = [ex[1] for ex in example_cases]
rB_vals = [ex[2] for ex in example_cases]
min_vals = [ex[3] for ex in example_cases]
max_vals = [ex[4] for ex in example_cases]

x_pos = np.arange(len(cases))
width = 0.35

bars1 = axes[0].bar(x_pos - width/2, min_vals, width, label='min(rA, rB)', 
                   color='purple', alpha=0.7, edgecolor='black')
bars2 = axes[0].bar(x_pos + width/2, max_vals, width, label='max(rA, rB)', 
                   color='orange', alpha=0.7, edgecolor='black')
axes[0].set_xlabel('Case', fontsize=12, fontweight='bold')
axes[0].set_ylabel('Combined Rank', fontsize=12, fontweight='bold')
axes[0].set_title('Conservative (min) is always ≤ Liberal (max)', fontsize=13, fontweight='bold')
axes[0].set_xticks(x_pos)
axes[0].set_xticklabels(cases)
axes[0].legend()
axes[0].grid(True, alpha=0.3, axis='y')
axes[0].set_ylim(0, 1.1)

# Add value labels
for bars in [bars1, bars2]:
    for bar in bars:
        height = bar.get_height()
        axes[0].text(bar.get_x() + bar.get_width()/2., height,
                    f'{height:.2f}', ha='center', va='bottom', fontsize=9)

# Visualization of why min is conservative
axes[1].scatter(rA_vals, rB_vals, s=200, c=min_vals, cmap='viridis', 
               edgecolors='black', linewidth=2, alpha=0.7)
for i, (ra, rb, case) in enumerate(zip(rA_vals, rB_vals, cases)):
    axes[1].annotate(case, (ra, rb), xytext=(5, 5), textcoords='offset points', 
                    fontsize=10, fontweight='bold')
    
axes[1].plot([0, 1], [0, 1], 'r--', linewidth=2, label='rA = rB')
axes[1].set_xlabel('rA', fontsize=12, fontweight='bold')
axes[1].set_ylabel('rB', fontsize=12, fontweight='bold')
axes[1].set_title('Min takes the lower value (below diagonal)', fontsize=13, fontweight='bold')
axes[1].legend()
axes[1].grid(True, alpha=0.3)
axes[1].set_xlim(0, 1)
axes[1].set_ylim(0, 1)
cbar = plt.colorbar(axes[1].collections[0], ax=axes[1])
cbar.set_label('min(rA, rB)', fontsize=11, fontweight='bold')

plt.suptitle('Why "min of ranks" is Conservative', fontsize=16, fontweight='bold', y=1.02)
plt.tight_layout()
plt.savefig('public/DS-4/min_max_comparison.png', dpi=300, bbox_inches='tight')
plt.close()

# 7. Visual Heatmaps
fig, axes = plt.subplots(2, 2, figsize=(14, 12))

# Data from solved example
ids = np.array([1, 2, 3, 4, 5, 6, 7, 8])
rA = np.array([0.50, 0.12, 0.62, 0.75, 0.25, 1.00, 0.38, 0.88])
rB = np.array([0.50, 0.25, 0.88, 0.38, 0.75, 0.62, 0.12, 1.00])
rAND = np.minimum(rA, rB)

# Plot 1: rA heatmap
ax1 = axes[0, 0]
im1 = ax1.barh(ids, rA, color='blue', alpha=0.7, edgecolor='black')
ax1.set_yticks(ids)
ax1.set_yticklabels([f'ID {id_val}' for id_val in ids])
ax1.set_xlabel('Rank Value', fontsize=11, fontweight='bold')
ax1.set_title('rA (Feature A Ranks)', fontsize=12, fontweight='bold')
ax1.set_xlim(0, 1.1)
ax1.grid(True, alpha=0.3, axis='x')
for i, (id_val, rank) in enumerate(zip(ids, rA)):
    ax1.text(rank + 0.02, id_val, f'{rank:.2f}', va='center', fontsize=9, fontweight='bold')

# Plot 2: rB heatmap
ax2 = axes[0, 1]
im2 = ax2.barh(ids, rB, color='red', alpha=0.7, edgecolor='black')
ax2.set_yticks(ids)
ax2.set_yticklabels([f'ID {id_val}' for id_val in ids])
ax2.set_xlabel('Rank Value', fontsize=11, fontweight='bold')
ax2.set_title('rB (Feature B Ranks)', fontsize=12, fontweight='bold')
ax2.set_xlim(0, 1.1)
ax2.grid(True, alpha=0.3, axis='x')
for i, (id_val, rank) in enumerate(zip(ids, rB)):
    ax2.text(rank + 0.02, id_val, f'{rank:.2f}', va='center', fontsize=9, fontweight='bold')

# Plot 3: rAND heatmap (the "AND valley")
ax3 = axes[1, 0]
im3 = ax3.barh(ids, rAND, color='purple', alpha=0.7, edgecolor='black')
ax3.set_yticks(ids)
ax3.set_yticklabels([f'ID {id_val}' for id_val in ids])
ax3.set_xlabel('Combined Rank', fontsize=11, fontweight='bold')
ax3.set_title('rAND = min(rA, rB) - The "AND Valley"', fontsize=12, fontweight='bold')
ax3.set_xlim(0, 1.1)
ax3.grid(True, alpha=0.3, axis='x')
for i, (id_val, rank) in enumerate(zip(ids, rAND)):
    ax3.text(rank + 0.02, id_val, f'{rank:.2f}', va='center', fontsize=9, fontweight='bold')

# Plot 4: Stratification colored by stratum
ax4 = axes[1, 1]
strata_colors_map = {0: '#FFB6C1', 1: '#87CEEB', 2: '#DDA0DD', 3: '#FFE4B5'}
strata_colors_list = []
for rand_val in rAND:
    if rand_val < 0.2:
        strata_colors_list.append(strata_colors_map[0])
    elif rand_val < 0.5:
        strata_colors_list.append(strata_colors_map[1])
    elif rand_val < 0.8:
        strata_colors_list.append(strata_colors_map[2])
    else:
        strata_colors_list.append(strata_colors_map[3])

bars = ax4.barh(ids, rAND, color=strata_colors_list, edgecolor='black', linewidth=1.5)
# Add stratum boundaries
for cut in [0.2, 0.5, 0.8]:
    ax4.axvline(cut, color='red', linestyle='--', linewidth=2, alpha=0.7)

ax4.set_yticks(ids)
ax4.set_yticklabels([f'ID {id_val}' for id_val in ids])
ax4.set_xlabel('rAND Value', fontsize=11, fontweight='bold')
ax4.set_title('Stratification: Colored by Stratum', fontsize=12, fontweight='bold')
ax4.set_xlim(0, 1.1)
ax4.grid(True, alpha=0.3, axis='x')

# Add legend
legend_elements = [
    Patch(facecolor='#FFB6C1', edgecolor='black', label='Stratum 1 [0, 0.2)'),
    Patch(facecolor='#87CEEB', edgecolor='black', label='Stratum 2 [0.2, 0.5)'),
    Patch(facecolor='#DDA0DD', edgecolor='black', label='Stratum 3 [0.5, 0.8)'),
    Patch(facecolor='#FFE4B5', edgecolor='black', label='Stratum 4 [0.8, 1.0]'),
]
ax4.legend(handles=legend_elements, loc='lower right', fontsize=9)

plt.suptitle('Visual Heatmaps: Individual Ranks and Combined Score', fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout()
plt.savefig('public/DS-4/visual_heatmaps.png', dpi=300, bbox_inches='tight')
plt.close()

print("All DS-4 images created successfully!")

