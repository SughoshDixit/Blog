import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Rectangle
import seaborn as sns

# Set style
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

# Create DS-1 directory if it doesn't exist
import os
os.makedirs('public/DS-1', exist_ok=True)

# 1. 3D Surfaces - min and max functions
fig = plt.figure(figsize=(12, 8))
ax = fig.add_subplot(111, projection='3d')

x = np.linspace(0, 1, 50)
y = np.linspace(0, 1, 50)
X, Y = np.meshgrid(x, y)
Z_min = np.minimum(X, Y)
Z_max = np.maximum(X, Y)

# Plot min surface
ax.plot_surface(X, Y, Z_min, alpha=0.7, cmap='viridis', label='min(x,y)')
ax.plot_surface(X, Y, Z_max, alpha=0.7, cmap='plasma', label='max(x,y)')

ax.set_xlabel('x')
ax.set_ylabel('y')
ax.set_zlabel('z')
ax.set_title('3D Surfaces: min(x,y) and max(x,y)', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('public/DS-1/3d_surfaces.png', dpi=300, bbox_inches='tight')
plt.close()

# 2. Heatmaps
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Min heatmap
im1 = ax1.imshow(Z_min, cmap='viridis', aspect='equal', origin='lower')
ax1.set_title('min(x,y) Heatmap', fontsize=12, fontweight='bold')
ax1.set_xlabel('x')
ax1.set_ylabel('y')
plt.colorbar(im1, ax=ax1)

# Max heatmap
im2 = ax2.imshow(Z_max, cmap='plasma', aspect='equal', origin='lower')
ax2.set_title('max(x,y) Heatmap', fontsize=12, fontweight='bold')
ax2.set_xlabel('x')
ax2.set_ylabel('y')
plt.colorbar(im2, ax=ax2)

plt.tight_layout()
plt.savefig('public/DS-1/heatmaps.png', dpi=300, bbox_inches='tight')
plt.close()

# 3. Truth Table Extension
fig, ax = plt.subplots(figsize=(10, 6))

# Create truth table data
data = np.array([
    [0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1]
])

labels = ['x', 'y', 'x∧y (min)', 'x∨y (max)', 'Boolean AND', 'Boolean OR']
x_labels = ['(0,0)', '(0,1)', '(1,0)', '(1,1)']

im = ax.imshow(data, cmap='RdYlBu', aspect='auto')
ax.set_xticks(range(len(x_labels)))
ax.set_xticklabels(x_labels)
ax.set_yticks(range(len(labels)))
ax.set_yticklabels(labels)

# Add text annotations
for i in range(len(labels)):
    for j in range(len(x_labels)):
        text = ax.text(j, i, str(data[i, j]), ha="center", va="center", color="black", fontweight='bold')

ax.set_title('Truth Table Extension: Boolean to Numeric', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('public/DS-1/truth_table_extension.png', dpi=300, bbox_inches='tight')
plt.close()

# 4. Properties Visualization
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# Commutativity
x = np.linspace(0, 1, 20)
y = np.linspace(0, 1, 20)
X, Y = np.meshgrid(x, y)
Z1 = np.minimum(X, Y)
Z2 = np.minimum(Y, X)

axes[0,0].imshow(Z1, cmap='viridis', aspect='equal', origin='lower')
axes[0,0].set_title('min(x,y)', fontweight='bold')
axes[0,0].set_xlabel('x')
axes[0,0].set_ylabel('y')

axes[0,1].imshow(Z2, cmap='viridis', aspect='equal', origin='lower')
axes[0,1].set_title('min(y,x)', fontweight='bold')
axes[0,1].set_xlabel('y')
axes[0,1].set_ylabel('x')

# Associativity example
x_vals = [0.3, 0.7, 0.5]
result1 = np.minimum(x_vals[0], np.minimum(x_vals[1], x_vals[2]))
result2 = np.minimum(np.minimum(x_vals[0], x_vals[1]), x_vals[2])

axes[1,0].bar(['min(x,min(y,z))', 'min(min(x,y),z)'], [result1, result2], color=['skyblue', 'lightcoral'])
axes[1,0].set_title('Associativity Example', fontweight='bold')
axes[1,0].set_ylabel('Value')

# Monotonicity
x_line = np.linspace(0, 1, 100)
y_fixed = 0.5
z_min = np.minimum(x_line, y_fixed)
z_max = np.maximum(x_line, y_fixed)

axes[1,1].plot(x_line, z_min, 'b-', label='min(x,0.5)', linewidth=2)
axes[1,1].plot(x_line, z_max, 'r-', label='max(x,0.5)', linewidth=2)
axes[1,1].set_title('Monotonicity', fontweight='bold')
axes[1,1].set_xlabel('x')
axes[1,1].set_ylabel('Value')
axes[1,1].legend()
axes[1,1].grid(True, alpha=0.3)

plt.suptitle('Properties of min and max functions', fontsize=16, fontweight='bold')
plt.tight_layout()
plt.savefig('public/DS-1/properties.png', dpi=300, bbox_inches='tight')
plt.close()

# 5. T-norms Comparison
fig, ax = plt.subplots(figsize=(10, 6))

x = np.linspace(0, 1, 100)
y_fixed = 0.6

# Different t-norms
godel_min = np.minimum(x, y_fixed)
product = x * y_fixed
lukasiewicz = np.maximum(0, x + y_fixed - 1)

ax.plot(x, godel_min, 'b-', label='Gödel (min)', linewidth=3)
ax.plot(x, product, 'r--', label='Product (x·y)', linewidth=3)
ax.plot(x, lukasiewicz, 'g:', label='Łukasiewicz', linewidth=3)

ax.set_xlabel('x', fontsize=12)
ax.set_ylabel('T(x, 0.6)', fontsize=12)
ax.set_title('Comparison of T-norms', fontsize=14, fontweight='bold')
ax.legend(fontsize=11)
ax.grid(True, alpha=0.3)
ax.set_xlim(0, 1)
ax.set_ylim(0, 1)

plt.tight_layout()
plt.savefig('public/DS-1/tnorms_comparison.png', dpi=300, bbox_inches='tight')
plt.close()

# 6. Worked Examples
fig, ax = plt.subplots(figsize=(10, 6))

# Example data
examples = [
    ('A=0.6, B=0.8, C=0.55', 0.6, 'max(min(0.6,0.8), 0.55)'),
    ('A=0.6, B=0.2, C=0.55', 0.55, 'max(min(0.6,0.2), 0.55)'),
    ('A=0.7, B=0.65, C=0.9', 0.65, 'min(0.7,0.65,0.9)'),
    ('A=0.7, B=0.65, C=0.1', 0.1, 'min(0.7,0.65,0.1)')
]

y_pos = np.arange(len(examples))
values = [ex[1] for ex in examples]
colors = ['skyblue', 'lightcoral', 'lightgreen', 'gold']

bars = ax.barh(y_pos, values, color=colors)
ax.set_yticks(y_pos)
ax.set_yticklabels([ex[0] for ex in examples])
ax.set_xlabel('Result Value', fontsize=12)
ax.set_title('Worked Examples: (A AND B) OR C', fontsize=14, fontweight='bold')

# Add value labels on bars
for i, (bar, value, formula) in enumerate(zip(bars, values, [ex[2] for ex in examples])):
    ax.text(bar.get_width() + 0.01, bar.get_y() + bar.get_height()/2, 
            f'{value}\n{formula}', ha='left', va='center', fontsize=9)

ax.set_xlim(0, 1)
ax.grid(True, alpha=0.3, axis='x')

plt.tight_layout()
plt.savefig('public/DS-1/worked_examples.png', dpi=300, bbox_inches='tight')
plt.close()

print("All DS-1 images created successfully!")
