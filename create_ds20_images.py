from PIL import Image, ImageDraw, ImageFont
import os
import math

# Create directory if it doesn't exist
os.makedirs('public/DS-20', exist_ok=True)

try:
    font_large = ImageFont.truetype("arial.ttf", 20)
    font_medium = ImageFont.truetype("arial.ttf", 16)
    font_small = ImageFont.truetype("arial.ttf", 12)
    font_tiny = ImageFont.truetype("arial.ttf", 10)
except:
    font_large = ImageFont.load_default()
    font_medium = ImageFont.load_default()
    font_small = ImageFont.load_default()
    font_tiny = ImageFont.load_default()

# Helper function to draw axes
def draw_axes(draw, x_start, y_start, width, height, x_label="Feature X", y_label="Feature Y"):
    # X-axis
    draw.line([(x_start, y_start + height), (x_start + width, y_start + height)], fill='black', width=2)
    # Y-axis
    draw.line([(x_start, y_start), (x_start, y_start + height)], fill='black', width=2)
    # Labels
    draw.text((x_start + width // 2, y_start + height + 25), x_label, fill='black', font=font_small, anchor='mm')
    draw.text((x_start - 35, y_start + height // 2), y_label, fill='black', font=font_small, anchor='mm')

# --- Image 1: Basic Decision Surface ---
def create_decision_surface_basic():
    width, height = 800, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Basic Decision Surface", fill='black', font=font_large, anchor='mm')
    
    plot_margin = 100
    plot_size = 500
    plot_x = (width - plot_size) // 2
    plot_y = 120
    
    draw_axes(draw, plot_x, plot_y, plot_size, plot_size)
    
    # Thresholds
    threshold_x = plot_x + plot_size * 0.6
    threshold_y = plot_y + plot_size * 0.4
    
    # Draw threshold lines
    draw.line([(threshold_x, plot_y), (threshold_x, plot_y + plot_size)], fill='#dc3545', width=3)
    draw.line([(plot_x, threshold_y), (plot_x + plot_size, threshold_y)], fill='#dc3545', width=3)
    
    # Shade positive region (top-right)
    draw.rectangle([threshold_x, plot_y, plot_x + plot_size, threshold_y], 
                  fill='#d4edda', outline='#28a745', width=2)
    
    # Labels
    draw.text((threshold_x + 10, plot_y + 10), "x ≥ a", fill='#dc3545', font=font_small)
    draw.text((plot_x + 10, threshold_y - 20), "y ≥ b", fill='#dc3545', font=font_small)
    draw.text((plot_x + plot_size * 0.8, plot_y + plot_size * 0.2), "Positive\nRegion", 
             fill='#155724', font=font_small, anchor='mm')
    
    img.save('public/DS-20/decision_surface_basic.png')
    print("Created: decision_surface_basic.png")

# --- Image 2: Half-Spaces ---
def create_half_spaces():
    width, height = 1000, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Half-Spaces: Building Blocks", fill='black', font=font_large, anchor='mm')
    
    plot_size = 400
    plot_y = 120
    
    # Left plot: x ≥ a
    plot1_x = 100
    draw_axes(draw, plot1_x, plot_y, plot_size, plot_size, "x", "y")
    threshold_x1 = plot1_x + plot_size * 0.5
    draw.line([(threshold_x1, plot_y), (threshold_x1, plot_y + plot_size)], fill='#dc3545', width=3)
    draw.rectangle([threshold_x1, plot_y, plot1_x + plot_size, plot_y + plot_size], 
                  fill='#d4edda', outline='#28a745', width=2)
    draw.text((plot1_x + plot_size // 2, plot_y - 30), "x ≥ a (Vertical Half-Space)", 
             fill='black', font=font_medium, anchor='mm')
    
    # Right plot: y ≥ b
    plot2_x = 550
    draw_axes(draw, plot2_x, plot_y, plot_size, plot_size, "x", "y")
    threshold_y2 = plot_y + plot_size * 0.5
    draw.line([(plot2_x, threshold_y2), (plot2_x + plot_size, threshold_y2)], fill='#dc3545', width=3)
    draw.rectangle([plot2_x, plot_y, plot2_x + plot_size, threshold_y2], 
                  fill='#d4edda', outline='#28a745', width=2)
    draw.text((plot2_x + plot_size // 2, plot_y - 30), "y ≥ b (Horizontal Half-Space)", 
             fill='black', font=font_medium, anchor='mm')
    
    img.save('public/DS-20/half_spaces.png')
    print("Created: half_spaces.png")

# --- Image 3: Half-Space Combinations ---
def create_half_space_combinations():
    width, height = 1000, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Combining Half-Spaces", fill='black', font=font_large, anchor='mm')
    
    plot_size = 400
    plot_y = 120
    
    # Left plot: AND
    plot1_x = 100
    draw_axes(draw, plot1_x, plot_y, plot_size, plot_size, "x", "y")
    threshold_x1 = plot1_x + plot_size * 0.6
    threshold_y1 = plot_y + plot_size * 0.4
    draw.line([(threshold_x1, plot_y), (threshold_x1, plot_y + plot_size)], fill='#dc3545', width=3)
    draw.line([(plot1_x, threshold_y1), (plot1_x + plot_size, threshold_y1)], fill='#dc3545', width=3)
    draw.rectangle([threshold_x1, plot_y, plot1_x + plot_size, threshold_y1], 
                  fill='#d4edda', outline='#28a745', width=2)
    draw.text((plot1_x + plot_size // 2, plot_y - 30), "AND: x ≥ a AND y ≥ b", 
             fill='black', font=font_medium, anchor='mm')
    
    # Right plot: OR
    plot2_x = 550
    draw_axes(draw, plot2_x, plot_y, plot_size, plot_size, "x", "y")
    threshold_x2 = plot2_x + plot_size * 0.6
    threshold_y2 = plot_y + plot_size * 0.4
    draw.line([(threshold_x2, plot_y), (threshold_x2, plot_y + plot_size)], fill='#dc3545', width=3)
    draw.line([(plot2_x, threshold_y2), (plot2_x + plot_size, threshold_y2)], fill='#dc3545', width=3)
    # Shade L-shaped region
    draw.rectangle([threshold_x2, plot_y, plot2_x + plot_size, plot_y + plot_size], 
                  fill='#d4edda', outline='#28a745', width=2)
    draw.rectangle([plot2_x, plot_y, threshold_x2, threshold_y2], 
                  fill='#d4edda', outline='#28a745', width=2)
    draw.text((plot2_x + plot_size // 2, plot_y - 30), "OR: x ≥ a OR y ≥ b", 
             fill='black', font=font_medium, anchor='mm')
    
    img.save('public/DS-20/half_space_combinations.png')
    print("Created: half_space_combinations.png")

# --- Image 4: Quadrant Partition ---
def create_quadrant_partition():
    width, height = 800, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Quadrant Partition from Orthogonal Cuts", fill='black', font=font_large, anchor='mm')
    
    plot_margin = 100
    plot_size = 500
    plot_x = (width - plot_size) // 2
    plot_y = 120
    
    draw_axes(draw, plot_x, plot_y, plot_size, plot_size)
    
    # Thresholds
    threshold_x = plot_x + plot_size * 0.6
    threshold_y = plot_y + plot_size * 0.4
    
    # Draw threshold lines
    draw.line([(threshold_x, plot_y), (threshold_x, plot_y + plot_size)], fill='#dc3545', width=3)
    draw.line([(plot_x, threshold_y), (plot_x + plot_size, threshold_y)], fill='#dc3545', width=3)
    
    # Label quadrants
    q1_x = threshold_x + (plot_x + plot_size - threshold_x) // 2
    q1_y = plot_y + (threshold_y - plot_y) // 2
    draw.text((q1_x, q1_y), "Q1\nHigh Risk", fill='#155724', font=font_small, anchor='mm')
    
    q2_x = plot_x + (threshold_x - plot_x) // 2
    q2_y = q1_y
    draw.text((q2_x, q2_y), "Q2\nLow Risk", fill='#856404', font=font_small, anchor='mm')
    
    q3_x = q2_x
    q3_y = threshold_y + (plot_y + plot_size - threshold_y) // 2
    draw.text((q3_x, q3_y), "Q3\nLow Risk", fill='#856404', font=font_small, anchor='mm')
    
    q4_x = q1_x
    q4_y = q3_y
    draw.text((q4_x, q4_y), "Q4\nLow Risk", fill='#856404', font=font_small, anchor='mm')
    
    # Shade Q1
    draw.rectangle([threshold_x, plot_y, plot_x + plot_size, threshold_y], 
                  fill='#d4edda', outline='#28a745', width=2)
    
    img.save('public/DS-20/quadrant_partition.png')
    print("Created: quadrant_partition.png")

# --- Image 5: AND Rule Surface ---
def create_and_rule_surface():
    width, height = 800, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "AND Rule Decision Surface", fill='black', font=font_large, anchor='mm')
    
    plot_margin = 100
    plot_size = 500
    plot_x = (width - plot_size) // 2
    plot_y = 120
    
    draw_axes(draw, plot_x, plot_y, plot_size, plot_size)
    
    # Thresholds
    threshold_x = plot_x + plot_size * 0.6
    threshold_y = plot_y + plot_size * 0.4
    
    # Draw threshold lines
    draw.line([(threshold_x, plot_y), (threshold_x, plot_y + plot_size)], fill='#dc3545', width=3)
    draw.line([(plot_x, threshold_y), (plot_x + plot_size, threshold_y)], fill='#dc3545', width=3)
    
    # Shade positive region
    draw.rectangle([threshold_x, plot_y, plot_x + plot_size, threshold_y], 
                  fill='#d4edda', outline='#28a745', width=3)
    
    # Add some data points
    import random
    random.seed(42)
    for _ in range(30):
        x = plot_x + random.random() * plot_size
        y = plot_y + random.random() * plot_size
        if x >= threshold_x and y <= threshold_y:
            draw.ellipse([x-4, y-4, x+4, y+4], fill='#28a745', outline='black')
        else:
            draw.ellipse([x-4, y-4, x+4, y+4], fill='#dc3545', outline='black')
    
    draw.text((plot_x + plot_size // 2, plot_y - 30), "Rule: x ≥ a AND y ≥ b", 
             fill='black', font=font_medium, anchor='mm')
    
    img.save('public/DS-20/and_rule_surface.png')
    print("Created: and_rule_surface.png")

# --- Image 6: OR Rule Surface ---
def create_or_rule_surface():
    width, height = 800, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "OR Rule Decision Surface", fill='black', font=font_large, anchor='mm')
    
    plot_margin = 100
    plot_size = 500
    plot_x = (width - plot_size) // 2
    plot_y = 120
    
    draw_axes(draw, plot_x, plot_y, plot_size, plot_size)
    
    # Thresholds
    threshold_x = plot_x + plot_size * 0.6
    threshold_y = plot_y + plot_size * 0.4
    
    # Draw threshold lines
    draw.line([(threshold_x, plot_y), (threshold_x, plot_y + plot_size)], fill='#dc3545', width=3)
    draw.line([(plot_x, threshold_y), (plot_x + plot_size, threshold_y)], fill='#dc3545', width=3)
    
    # Shade L-shaped region (OR)
    draw.rectangle([threshold_x, plot_y, plot_x + plot_size, plot_y + plot_size], 
                  fill='#d4edda', outline='#28a745', width=3)
    draw.rectangle([plot_x, plot_y, threshold_x, threshold_y], 
                  fill='#d4edda', outline='#28a745', width=3)
    
    # Add some data points
    import random
    random.seed(42)
    for _ in range(30):
        x = plot_x + random.random() * plot_size
        y = plot_y + random.random() * plot_size
        if x >= threshold_x or y <= threshold_y:
            draw.ellipse([x-4, y-4, x+4, y+4], fill='#28a745', outline='black')
        else:
            draw.ellipse([x-4, y-4, x+4, y+4], fill='#dc3545', outline='black')
    
    draw.text((plot_x + plot_size // 2, plot_y - 30), "Rule: x ≥ a OR y ≥ b", 
             fill='black', font=font_medium, anchor='mm')
    
    img.save('public/DS-20/or_rule_surface.png')
    print("Created: or_rule_surface.png")

# --- Image 7: Complex Rule Surface ---
def create_complex_rule_surface():
    width, height = 800, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Complex Rule: (x ≥ a AND y ≥ b) OR (x ≥ c AND y ≥ d)", 
             fill='black', font=font_large, anchor='mm')
    
    plot_margin = 100
    plot_size = 500
    plot_x = (width - plot_size) // 2
    plot_y = 120
    
    draw_axes(draw, plot_x, plot_y, plot_size, plot_size)
    
    # Two sets of thresholds
    threshold_x1 = plot_x + plot_size * 0.3
    threshold_y1 = plot_y + plot_size * 0.2
    threshold_x2 = plot_x + plot_size * 0.7
    threshold_y2 = plot_y + plot_size * 0.6
    
    # Draw threshold lines
    draw.line([(threshold_x1, plot_y), (threshold_x1, plot_y + plot_size)], fill='#dc3545', width=2)
    draw.line([(plot_x, threshold_y1), (plot_x + plot_size, threshold_y1)], fill='#dc3545', width=2)
    draw.line([(threshold_x2, plot_y), (threshold_x2, plot_y + plot_size)], fill='#17a2b8', width=2)
    draw.line([(plot_x, threshold_y2), (plot_x + plot_size, threshold_y2)], fill='#17a2b8', width=2)
    
    # Shade two rectangular regions (OR)
    draw.rectangle([threshold_x1, plot_y, plot_x + plot_size, threshold_y1], 
                  fill='#d4edda', outline='#28a745', width=2)
    draw.rectangle([threshold_x2, plot_y, plot_x + plot_size, threshold_y2], 
                  fill='#d4edda', outline='#28a745', width=2)
    
    img.save('public/DS-20/complex_rule_surface.png')
    print("Created: complex_rule_surface.png")

# --- Image 8: Lattice Ordering ---
def create_lattice_ordering():
    width, height = 1000, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Lattice Ordering: Stricter vs Looser Rules", fill='black', font=font_large, anchor='mm')
    
    plot_size = 350
    plot_y = 120
    
    # Left plot: Stricter rule
    plot1_x = 100
    draw_axes(draw, plot1_x, plot_y, plot_size, plot_size, "x", "y")
    threshold_x1 = plot1_x + plot_size * 0.7
    threshold_y1 = plot_y + plot_size * 0.5
    draw.line([(threshold_x1, plot_y), (threshold_x1, plot_y + plot_size)], fill='#dc3545', width=3)
    draw.line([(plot1_x, threshold_y1), (plot1_x + plot_size, threshold_y1)], fill='#dc3545', width=3)
    draw.rectangle([threshold_x1, plot_y, plot1_x + plot_size, threshold_y1], 
                  fill='#d4edda', outline='#28a745', width=2)
    draw.text((plot1_x + plot_size // 2, plot_y - 30), "Stricter: x ≥ 0.7 AND y ≥ 0.5", 
             fill='black', font=font_medium, anchor='mm')
    
    # Right plot: Looser rule
    plot2_x = 550
    draw_axes(draw, plot2_x, plot_y, plot_size, plot_size, "x", "y")
    threshold_x2 = plot2_x + plot_size * 0.4
    threshold_y2 = plot_y + plot_size * 0.3
    draw.line([(threshold_x2, plot_y), (threshold_x2, plot_y + plot_size)], fill='#dc3545', width=3)
    draw.line([(plot2_x, threshold_y2), (plot2_x + plot_size, threshold_y2)], fill='#dc3545', width=3)
    draw.rectangle([threshold_x2, plot_y, plot2_x + plot_size, threshold_y2], 
                  fill='#d4edda', outline='#28a745', width=2)
    draw.text((plot2_x + plot_size // 2, plot_y - 30), "Looser: x ≥ 0.4 AND y ≥ 0.3", 
             fill='black', font=font_medium, anchor='mm')
    
    # Arrow showing relationship
    arrow_x = plot1_x + plot_size + 50
    arrow_y = plot_y + plot_size // 2
    draw.line([(arrow_x, arrow_y), (arrow_x + 100, arrow_y)], fill='black', width=3)
    draw.polygon([(arrow_x + 100, arrow_y), (arrow_x + 85, arrow_y - 8), (arrow_x + 85, arrow_y + 8)], 
                fill='black')
    draw.text((arrow_x + 50, arrow_y - 30), "Stricter\n⊂ Looser", fill='black', font=font_small, anchor='mm')
    
    img.save('public/DS-20/lattice_ordering.png')
    print("Created: lattice_ordering.png")

# --- Image 9: ATL/BTL Scatter ---
def create_atl_btl_scatter():
    width, height = 800, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "ATL/BTL Scatter Plot with Decision Surface", fill='black', font=font_large, anchor='mm')
    
    plot_margin = 100
    plot_size = 500
    plot_x = (width - plot_size) // 2
    plot_y = 120
    
    draw_axes(draw, plot_x, plot_y, plot_size, plot_size)
    
    # Thresholds
    threshold_x = plot_x + plot_size * 0.6
    threshold_y = plot_y + plot_size * 0.4
    
    # Draw threshold lines
    draw.line([(threshold_x, plot_y), (threshold_x, plot_y + plot_size)], fill='#dc3545', width=3)
    draw.line([(plot_x, threshold_y), (plot_x + plot_size, threshold_y)], fill='#dc3545', width=3)
    
    # Shade ATL region
    draw.rectangle([threshold_x, plot_y, plot_x + plot_size, threshold_y], 
                  fill='#d4edda', outline='#28a745', width=2)
    
    # Add data points
    import random
    random.seed(42)
    for _ in range(50):
        x = plot_x + random.random() * plot_size
        y = plot_y + random.random() * plot_size
        if x >= threshold_x and y <= threshold_y:
            # ATL (Above The Line)
            draw.ellipse([x-5, y-5, x+5, y+5], fill='#28a745', outline='black', width=1)
        else:
            # BTL (Below The Line)
            draw.ellipse([x-5, y-5, x+5, y+5], fill='#dc3545', outline='black', width=1)
    
    # Legend
    draw.ellipse([plot_x + 20, plot_y + plot_size + 40, plot_x + 35, plot_y + plot_size + 55], 
                fill='#28a745', outline='black')
    draw.text((plot_x + 50, plot_y + plot_size + 47), "ATL (Positive)", fill='black', font=font_small, anchor='lm')
    draw.ellipse([plot_x + 150, plot_y + plot_size + 40, plot_x + 165, plot_y + plot_size + 55], 
                fill='#dc3545', outline='black')
    draw.text((plot_x + 180, plot_y + plot_size + 47), "BTL (Negative)", fill='black', font=font_small, anchor='lm')
    
    img.save('public/DS-20/atl_btl_scatter.png')
    print("Created: atl_btl_scatter.png")

# --- Image 10: Label Flip Region ---
def create_label_flip_region():
    width, height = 800, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Points That Flip Label When Threshold Increases", 
             fill='black', font=font_large, anchor='mm')
    
    plot_margin = 100
    plot_size = 500
    plot_x = (width - plot_size) // 2
    plot_y = 120
    
    draw_axes(draw, plot_x, plot_y, plot_size, plot_size)
    
    # Old and new thresholds
    threshold_x_old = plot_x + plot_size * 0.4
    threshold_x_new = plot_x + plot_size * 0.7
    threshold_y = plot_y + plot_size * 0.4
    
    # Draw threshold lines
    draw.line([(threshold_x_old, plot_y), (threshold_x_old, plot_y + plot_size)], 
             fill='#ffc107', width=3)  # Old threshold
    draw.line([(threshold_x_new, plot_y), (threshold_x_new, plot_y + plot_size)], 
             fill='#dc3545', width=3)  # New threshold
    draw.line([(plot_x, threshold_y), (plot_x + plot_size, threshold_y)], 
             fill='#17a2b8', width=3)  # Y threshold
    
    # Shade flip region (strip between old and new threshold, above y threshold)
    draw.rectangle([threshold_x_old, plot_y, threshold_x_new, threshold_y], 
                  fill='#fff3cd', outline='#ffc107', width=3)
    
    # Labels
    draw.text((threshold_x_old, plot_y - 20), "a (old)", fill='#ffc107', font=font_small, anchor='mm')
    draw.text((threshold_x_new, plot_y - 20), "a' (new)", fill='#dc3545', font=font_small, anchor='mm')
    draw.text((plot_x - 20, threshold_y), "b", fill='#17a2b8', font=font_small, anchor='mm')
    draw.text((threshold_x_old + (threshold_x_new - threshold_x_old) // 2, plot_y + (threshold_y - plot_y) // 2), 
             "Flip Region\n(a ≤ x < a' AND y ≥ b)", fill='#856404', font=font_small, anchor='mm')
    
    img.save('public/DS-20/label_flip_region.png')
    print("Created: label_flip_region.png")

# --- Image 11: Multiple Threshold Changes ---
def create_multiple_threshold_changes():
    width, height = 800, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Multiple Threshold Changes", fill='black', font=font_large, anchor='mm')
    
    plot_margin = 100
    plot_size = 500
    plot_x = (width - plot_size) // 2
    plot_y = 120
    
    draw_axes(draw, plot_x, plot_y, plot_size, plot_size)
    
    # Old and new thresholds
    threshold_x_old = plot_x + plot_size * 0.4
    threshold_x_new = plot_x + plot_size * 0.7
    threshold_y_old = plot_y + plot_size * 0.5
    threshold_y_new = plot_y + plot_size * 0.3
    
    # Draw threshold lines
    draw.line([(threshold_x_old, plot_y), (threshold_x_old, plot_y + plot_size)], fill='#ffc107', width=2)
    draw.line([(threshold_x_new, plot_y), (threshold_x_new, plot_y + plot_size)], fill='#dc3545', width=3)
    draw.line([(plot_x, threshold_y_old), (plot_x + plot_size, threshold_y_old)], fill='#ffc107', width=2)
    draw.line([(plot_x, threshold_y_new), (plot_x + plot_size, threshold_y_new)], fill='#17a2b8', width=3)
    
    # Shade lost region
    draw.rectangle([threshold_x_old, plot_y, threshold_x_new, threshold_y_old], 
                  fill='#fff3cd', outline='#ffc107', width=2)
    # Shade gained region
    draw.rectangle([threshold_x_new, threshold_y_new, plot_x + plot_size, threshold_y_old], 
                  fill='#d1ecf1', outline='#17a2b8', width=2)
    
    img.save('public/DS-20/multiple_threshold_changes.png')
    print("Created: multiple_threshold_changes.png")

# --- Image 12: Fraud Detection Surface ---
def create_fraud_detection_surface():
    width, height = 800, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Fraud Detection: amount ≥ $1000 AND age < 30 days", 
             fill='black', font=font_large, anchor='mm')
    
    plot_margin = 100
    plot_size = 500
    plot_x = (width - plot_size) // 2
    plot_y = 120
    
    draw_axes(draw, plot_x, plot_y, plot_size, plot_size, "Amount ($)", "Age (days)")
    
    threshold_x = plot_x + plot_size * 0.6
    threshold_y = plot_y + plot_size * 0.3
    
    draw.line([(threshold_x, plot_y), (threshold_x, plot_y + plot_size)], fill='#dc3545', width=3)
    draw.line([(plot_x, threshold_y), (plot_x + plot_size, threshold_y)], fill='#dc3545', width=3)
    
    # Shade bottom-right (fraud region)
    draw.rectangle([threshold_x, threshold_y, plot_x + plot_size, plot_y + plot_size], 
                  fill='#f8d7da', outline='#dc3545', width=3)
    
    draw.text((plot_x + plot_size * 0.8, plot_y + plot_size * 0.65), "Fraud\nRegion", 
             fill='#721c24', font=font_small, anchor='mm')
    
    img.save('public/DS-20/fraud_detection_surface.png')
    print("Created: fraud_detection_surface.png")

# --- Image 13: Credit Approval Surface ---
def create_credit_approval_surface():
    width, height = 800, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Credit Approval: score ≥ 700 OR income ≥ $50,000", 
             fill='black', font=font_large, anchor='mm')
    
    plot_margin = 100
    plot_size = 500
    plot_x = (width - plot_size) // 2
    plot_y = 120
    
    draw_axes(draw, plot_x, plot_y, plot_size, plot_size, "Credit Score", "Income ($)")
    
    threshold_x = plot_x + plot_size * 0.7
    threshold_y = plot_y + plot_size * 0.5
    
    draw.line([(threshold_x, plot_y), (threshold_x, plot_y + plot_size)], fill='#dc3545', width=3)
    draw.line([(plot_x, threshold_y), (plot_x + plot_size, threshold_y)], fill='#dc3545', width=3)
    
    # Shade L-shaped region (OR)
    draw.rectangle([threshold_x, plot_y, plot_x + plot_size, plot_y + plot_size], 
                  fill='#d4edda', outline='#28a745', width=3)
    draw.rectangle([plot_x, plot_y, threshold_x, threshold_y], 
                  fill='#d4edda', outline='#28a745', width=3)
    
    draw.text((plot_x + plot_size * 0.85, plot_y + plot_size * 0.25), "Approve", 
             fill='#155724', font=font_medium, anchor='mm')
    
    img.save('public/DS-20/credit_approval_surface.png')
    print("Created: credit_approval_surface.png")

# --- Image 14: Quality Control Surface ---
def create_quality_control_surface():
    width, height = 800, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Quality Control: defects ≥ 5 AND time ≥ 8 hours", 
             fill='black', font=font_large, anchor='mm')
    
    plot_margin = 100
    plot_size = 500
    plot_x = (width - plot_size) // 2
    plot_y = 120
    
    draw_axes(draw, plot_x, plot_y, plot_size, plot_size, "Defect Count", "Time (hours)")
    
    threshold_x = plot_x + plot_size * 0.5
    threshold_y = plot_y + plot_size * 0.6
    
    draw.line([(threshold_x, plot_y), (threshold_x, plot_y + plot_size)], fill='#dc3545', width=3)
    draw.line([(plot_x, threshold_y), (plot_x + plot_size, threshold_y)], fill='#dc3545', width=3)
    
    # Shade top-right (reject region)
    draw.rectangle([threshold_x, plot_y, plot_x + plot_size, threshold_y], 
                  fill='#f8d7da', outline='#dc3545', width=3)
    
    draw.text((plot_x + plot_size * 0.75, plot_y + plot_size * 0.3), "Reject\nRegion", 
             fill='#721c24', font=font_small, anchor='mm')
    
    img.save('public/DS-20/quality_control_surface.png')
    print("Created: quality_control_surface.png")

# --- Generate all images ---
print("Generating DS-20 images...")
create_decision_surface_basic()
create_half_spaces()
create_half_space_combinations()
create_quadrant_partition()
create_and_rule_surface()
create_or_rule_surface()
create_complex_rule_surface()
create_lattice_ordering()
create_atl_btl_scatter()
create_label_flip_region()
create_multiple_threshold_changes()
create_fraud_detection_surface()
create_credit_approval_surface()
create_quality_control_surface()
print("\nAll images for DS-20 created successfully!")

