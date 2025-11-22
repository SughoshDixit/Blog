from PIL import Image, ImageDraw, ImageFont
import os
import math

# Create directory if it doesn't exist
os.makedirs('public/DS-22', exist_ok=True)

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

# Helper function to draw Venn diagram
def draw_venn_2sets(draw, x_center, y_center, radius, spacing, counts, labels):
    """
    Draw 2-set Venn diagram with counts
    
    counts: dict with keys 'only_a', 'only_b', 'intersection'
    """
    circle_a_x = x_center - spacing // 2
    circle_b_x = x_center + spacing // 2
    
    # Draw circles
    draw.ellipse([circle_a_x - radius, y_center - radius,
                  circle_a_x + radius, y_center + radius],
                fill='#d1ecf1', outline='#17a2b8', width=3, alpha=128)
    draw.ellipse([circle_b_x - radius, y_center - radius,
                  circle_b_x + radius, y_center + radius],
                fill='#f8d7da', outline='#dc3545', width=3, alpha=128)
    
    # Draw intersection region (darker)
    # This is approximate - full implementation would use path clipping
    draw.ellipse([x_center - radius // 2, y_center - radius,
                  x_center + radius // 2, y_center + radius],
                fill='#e2e3e5', outline='#6c757d', width=2)
    
    # Labels
    draw.text((circle_a_x, y_center - radius - 25), labels['a'], fill='#17a2b8', font=font_medium, anchor='mm')
    draw.text((circle_b_x, y_center - radius - 25), labels['b'], fill='#dc3545', font=font_medium, anchor='mm')
    
    # Counts
    if 'only_a' in counts:
        draw.text((circle_a_x - radius // 2, y_center), str(counts['only_a']), 
                 fill='black', font=font_small, anchor='mm')
    if 'only_b' in counts:
        draw.text((circle_b_x + radius // 2, y_center), str(counts['only_b']), 
                 fill='black', font=font_small, anchor='mm')
    if 'intersection' in counts:
        draw.text((x_center, y_center), str(counts['intersection']), 
                 fill='black', font=font_medium, anchor='mm')

# --- Image 1: Basic Sets ---
def create_basic_sets():
    width, height = 800, 600
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Basic Sets: Set A and Set B", fill='black', font=font_large, anchor='mm')
    
    # Left: Set A
    x1 = 200
    y1 = 200
    radius = 100
    draw.ellipse([x1 - radius, y1 - radius, x1 + radius, y1 + radius],
                fill='#d1ecf1', outline='#17a2b8', width=3)
    draw.text((x1, y1 - radius - 25), "Set A", fill='#17a2b8', font=font_medium, anchor='mm')
    draw.text((x1, y1), "|A| = 1000", fill='black', font=font_medium, anchor='mm')
    
    # Right: Set B
    x2 = 600
    y2 = 200
    draw.ellipse([x2 - radius, y2 - radius, x2 + radius, y2 + radius],
                fill='#f8d7da', outline='#dc3545', width=3)
    draw.text((x2, y2 - radius - 25), "Set B", fill='#dc3545', font=font_medium, anchor='mm')
    draw.text((x2, y2), "|B| = 1200", fill='black', font=font_medium, anchor='mm')
    
    img.save('public/DS-22/basic_sets.png')
    print("Created: basic_sets.png")

# --- Image 2: Set Operations ---
def create_set_operations():
    width, height = 1000, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Set Operations: Intersection and Union", fill='black', font=font_large, anchor='mm')
    
    radius = 80
    spacing = 60
    
    # Top: Intersection
    top_y = 180
    x_center = width // 2
    circle_a_x = x_center - spacing // 2
    circle_b_x = x_center + spacing // 2
    
    # Draw overlapping circles
    draw.ellipse([circle_a_x - radius, top_y - radius, circle_a_x + radius, top_y + radius],
                fill='#d1ecf1', outline='#17a2b8', width=2)
    draw.ellipse([circle_b_x - radius, top_y - radius, circle_b_x + radius, top_y + radius],
                fill='#f8d7da', outline='#dc3545', width=2)
    
    # Highlight intersection
    draw.ellipse([x_center - radius // 2, top_y - radius, x_center + radius // 2, top_y + radius],
                fill='#fff3cd', outline='#ffc107', width=3)
    
    draw.text((circle_a_x, top_y - radius - 25), "A", fill='#17a2b8', font=font_medium, anchor='mm')
    draw.text((circle_b_x, top_y - radius - 25), "B", fill='#dc3545', font=font_medium, anchor='mm')
    draw.text((x_center, top_y), "A ∩ B", fill='black', font=font_medium, anchor='mm')
    draw.text((x_center, top_y - 120), "Intersection (Both)", fill='black', font=font_medium, anchor='mm')
    
    # Bottom: Union
    bottom_y = 480
    draw.ellipse([circle_a_x - radius, bottom_y - radius, circle_a_x + radius, bottom_y + radius],
                fill='#d1ecf1', outline='#17a2b8', width=2)
    draw.ellipse([circle_b_x - radius, bottom_y - radius, circle_b_x + radius, bottom_y + radius],
                fill='#f8d7da', outline='#dc3545', width=2)
    
    # Highlight union (both circles)
    draw.ellipse([circle_a_x - radius, bottom_y - radius, circle_a_x + radius, bottom_y + radius],
                fill='#d4edda', outline='#28a745', width=2)
    draw.ellipse([circle_b_x - radius, bottom_y - radius, circle_b_x + radius, bottom_y + radius],
                fill='#d4edda', outline='#28a745', width=2)
    
    draw.text((circle_a_x, bottom_y - radius - 25), "A", fill='#17a2b8', font=font_medium, anchor='mm')
    draw.text((circle_b_x, bottom_y - radius - 25), "B", fill='#dc3545', font=font_medium, anchor='mm')
    draw.text((x_center, bottom_y), "A ∪ B", fill='black', font=font_medium, anchor='mm')
    draw.text((x_center, bottom_y - 120), "Union (Either or Both)", fill='black', font=font_medium, anchor='mm')
    
    img.save('public/DS-22/set_operations.png')
    print("Created: set_operations.png")

# --- Image 3: Inclusion-Exclusion ---
def create_inclusion_exclusion():
    width, height = 900, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Inclusion-Exclusion Principle", fill='black', font=font_large, anchor='mm')
    
    # Venn diagram
    x_center = width // 2
    y_center = 300
    radius = 100
    spacing = 70
    
    circle_a_x = x_center - spacing // 2
    circle_b_x = x_center + spacing // 2
    
    # Draw circles
    draw.ellipse([circle_a_x - radius, y_center - radius, circle_a_x + radius, y_center + radius],
                fill='#d1ecf1', outline='#17a2b8', width=3)
    draw.ellipse([circle_b_x - radius, y_center - radius, circle_b_x + radius, y_center + radius],
                fill='#f8d7da', outline='#dc3545', width=3)
    
    # Labels
    draw.text((circle_a_x, y_center - radius - 25), "A", fill='#17a2b8', font=font_medium, anchor='mm')
    draw.text((circle_b_x, y_center - radius - 25), "B", fill='#dc3545', font=font_medium, anchor='mm')
    
    # Counts
    draw.text((circle_a_x - radius // 2, y_center), "300", fill='black', font=font_small, anchor='mm')  # Only A
    draw.text((x_center, y_center), "700", fill='black', font=font_medium, anchor='mm')  # Intersection
    draw.text((circle_b_x + radius // 2, y_center), "500", fill='black', font=font_small, anchor='mm')  # Only B
    
    # Formula
    formula_y = 500
    draw.text((x_center, formula_y), "|A ∪ B| = |A| + |B| - |A ∩ B|", 
             fill='black', font=font_medium, anchor='mm')
    draw.text((x_center, formula_y + 30), "|A ∪ B| = 1000 + 1200 - 700 = 1500", 
             fill='#28a745', font=font_medium, anchor='mm')
    
    img.save('public/DS-22/inclusion_exclusion.png')
    print("Created: inclusion_exclusion.png")

# --- Image 4: Basic Venn Diagram ---
def create_venn_basic():
    width, height = 800, 600
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Basic Venn Diagram", fill='black', font=font_large, anchor='mm')
    
    x_center = width // 2
    y_center = height // 2
    radius = 120
    spacing = 80
    
    circle_a_x = x_center - spacing // 2
    circle_b_x = x_center + spacing // 2
    
    # Draw circles with transparency effect (using lighter colors)
    draw.ellipse([circle_a_x - radius, y_center - radius, circle_a_x + radius, y_center + radius],
                fill='#d1ecf1', outline='#17a2b8', width=3)
    draw.ellipse([circle_b_x - radius, y_center - radius, circle_b_x + radius, y_center + radius],
                fill='#f8d7da', outline='#dc3545', width=3)
    
    # Labels
    draw.text((circle_a_x, y_center - radius - 30), "Set A", fill='#17a2b8', font=font_medium, anchor='mm')
    draw.text((circle_b_x, y_center - radius - 30), "Set B", fill='#dc3545', font=font_medium, anchor='mm')
    draw.text((x_center, y_center), "A ∩ B", fill='black', font=font_small, anchor='mm')
    
    img.save('public/DS-22/venn_basic.png')
    print("Created: venn_basic.png")

# --- Image 5: Venn Diagram with Counts ---
def create_venn_with_counts():
    width, height = 900, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Venn Diagram with Counts", fill='black', font=font_large, anchor='mm')
    
    x_center = width // 2
    y_center = 300
    radius = 120
    spacing = 80
    
    circle_a_x = x_center - spacing // 2
    circle_b_x = x_center + spacing // 2
    
    # Draw circles
    draw.ellipse([circle_a_x - radius, y_center - radius, circle_a_x + radius, y_center + radius],
                fill='#d1ecf1', outline='#17a2b8', width=3)
    draw.ellipse([circle_b_x - radius, y_center - radius, circle_b_x + radius, y_center + radius],
                fill='#f8d7da', outline='#dc3545', width=3)
    
    # Labels
    draw.text((circle_a_x, y_center - radius - 30), "Set A", fill='#17a2b8', font=font_medium, anchor='mm')
    draw.text((circle_b_x, y_center - radius - 30), "Set B", fill='#dc3545', font=font_medium, anchor='mm')
    
    # Counts
    draw.text((circle_a_x - radius // 2, y_center), "300", fill='black', font=font_medium, anchor='mm')  # Only A
    draw.text((x_center, y_center), "700\n(A ∩ B)", fill='black', font=font_medium, anchor='mm')  # Intersection
    draw.text((circle_b_x + radius // 2, y_center), "500", fill='black', font=font_medium, anchor='mm')  # Only B
    
    # Summary
    summary_y = 500
    draw.text((x_center, summary_y), "|A| = 1000, |B| = 1200, |A ∩ B| = 700", 
             fill='black', font=font_medium, anchor='mm')
    draw.text((x_center, summary_y + 30), "|A ∪ B| = 1500", 
             fill='#28a745', font=font_medium, anchor='mm')
    
    img.save('public/DS-22/venn_with_counts.png')
    print("Created: venn_with_counts.png")

# --- Image 6: Jaccard Index ---
def create_jaccard_index():
    width, height = 900, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Jaccard Index Calculation", fill='black', font=font_large, anchor='mm')
    
    # Venn diagram
    x_center = width // 2
    y_center = 250
    radius = 110
    spacing = 75
    
    circle_a_x = x_center - spacing // 2
    circle_b_x = x_center + spacing // 2
    
    # Draw circles
    draw.ellipse([circle_a_x - radius, y_center - radius, circle_a_x + radius, y_center + radius],
                fill='#d1ecf1', outline='#17a2b8', width=3)
    draw.ellipse([circle_b_x - radius, y_center - radius, circle_b_x + radius, y_center + radius],
                fill='#f8d7da', outline='#dc3545', width=3)
    
    # Highlight intersection
    draw.ellipse([x_center - radius // 2, y_center - radius, x_center + radius // 2, y_center + radius],
                fill='#fff3cd', outline='#ffc107', width=3)
    
    # Labels
    draw.text((circle_a_x, y_center - radius - 25), "A", fill='#17a2b8', font=font_medium, anchor='mm')
    draw.text((circle_b_x, y_center - radius - 25), "B", fill='#dc3545', font=font_medium, anchor='mm')
    draw.text((x_center, y_center), "700", fill='black', font=font_medium, anchor='mm')
    
    # Formula
    formula_y = 450
    draw.text((x_center, formula_y), "J(A, B) = |A ∩ B| / |A ∪ B|", 
             fill='black', font=font_medium, anchor='mm')
    draw.text((x_center, formula_y + 30), "J(A, B) = 700 / 1500 = 0.467", 
             fill='#28a745', font=font_medium, anchor='mm')
    draw.text((x_center, formula_y + 60), "Jaccard Index: 46.7%", 
             fill='#ffc107', font=font_medium, anchor='mm')
    
    img.save('public/DS-22/jaccard_index.png')
    print("Created: jaccard_index.png")

# --- Image 7: Jaccard vs Overlap ---
def create_jaccard_vs_overlap():
    width, height = 1000, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Jaccard Index vs Overlap Coefficient", fill='black', font=font_large, anchor='mm')
    
    # Left: Jaccard
    left_x = 250
    y_center = 300
    radius = 100
    spacing = 70
    
    # Venn diagram for Jaccard
    circle_a_x1 = left_x - spacing // 2
    circle_b_x1 = left_x + spacing // 2
    
    draw.ellipse([circle_a_x1 - radius, y_center - radius, circle_a_x1 + radius, y_center + radius],
                fill='#d1ecf1', outline='#17a2b8', width=2)
    draw.ellipse([circle_b_x1 - radius, y_center - radius, circle_b_x1 + radius, y_center + radius],
                fill='#f8d7da', outline='#dc3545', width=2)
    
    draw.text((left_x, y_center - radius - 25), "Jaccard Index", fill='black', font=font_medium, anchor='mm')
    draw.text((left_x, y_center + 150), "J = |A ∩ B| / |A ∪ B|", fill='black', font=font_small, anchor='mm')
    draw.text((left_x, y_center + 175), "Normalized by union", fill='#6c757d', font=font_tiny, anchor='mm')
    
    # Right: Overlap
    right_x = 750
    
    # Venn diagram for Overlap (smaller set emphasis)
    circle_a_x2 = right_x - spacing // 2
    circle_b_x2 = right_x + spacing // 2
    
    # Make one circle smaller to show min(|A|, |B|)
    draw.ellipse([circle_a_x2 - radius, y_center - radius, circle_a_x2 + radius, y_center + radius],
                fill='#d1ecf1', outline='#17a2b8', width=3)  # Smaller set
    draw.ellipse([circle_b_x2 - radius, y_center - radius, circle_b_x2 + radius, y_center + radius],
                fill='#f8d7da', outline='#dc3545', width=2)
    
    draw.text((right_x, y_center - radius - 25), "Overlap Coefficient", fill='black', font=font_medium, anchor='mm')
    draw.text((right_x, y_center + 150), "O = |A ∩ B| / min(|A|, |B|)", fill='black', font=font_small, anchor='mm')
    draw.text((right_x, y_center + 175), "Normalized by smaller set", fill='#6c757d', font=font_tiny, anchor='mm')
    
    img.save('public/DS-22/jaccard_vs_overlap.png')
    print("Created: jaccard_vs_overlap.png")

# --- Image 8: Venn Function Output ---
def create_venn_function_output():
    width, height = 900, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "show_venn_diagram Function Output", fill='black', font=font_large, anchor='mm')
    
    x_center = width // 2
    y_center = 280
    radius = 120
    spacing = 80
    
    circle_a_x = x_center - spacing // 2
    circle_b_x = x_center + spacing // 2
    
    # Draw circles
    draw.ellipse([circle_a_x - radius, y_center - radius, circle_a_x + radius, y_center + radius],
                fill='#d1ecf1', outline='#17a2b8', width=3)
    draw.ellipse([circle_b_x - radius, y_center - radius, circle_b_x + radius, y_center + radius],
                fill='#f8d7da', outline='#dc3545', width=3)
    
    # Highlight intersection
    draw.ellipse([x_center - radius // 2, y_center - radius, x_center + radius // 2, y_center + radius],
                fill='#fff3cd', outline='#ffc107', width=3)
    
    # Labels
    draw.text((circle_a_x, y_center - radius - 30), "Model A", fill='#17a2b8', font=font_medium, anchor='mm')
    draw.text((circle_b_x, y_center - radius - 30), "Model B", fill='#dc3545', font=font_medium, anchor='mm')
    
    # Counts
    draw.text((circle_a_x - radius // 2, y_center), "300", fill='black', font=font_small, anchor='mm')
    draw.text((x_center, y_center), "700", fill='black', font=font_medium, anchor='mm')
    draw.text((circle_b_x + radius // 2, y_center), "500", fill='black', font=font_small, anchor='mm')
    
    # Jaccard index
    jaccard_y = 480
    draw.text((x_center, jaccard_y), "Jaccard Index: 0.467 (46.7%)", 
             fill='#ffc107', font=font_medium, anchor='mm')
    
    # Summary stats
    stats_y = 540
    draw.text((x_center, stats_y), "|A| = 1000  |B| = 1200  |A ∩ B| = 700  |A ∪ B| = 1500", 
             fill='black', font=font_small, anchor='mm')
    
    img.save('public/DS-22/venn_function_output.png')
    print("Created: venn_function_output.png")

# --- Image 9: Exercise Solution ---
def create_exercise_solution():
    width, height = 900, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Exercise: Computing Jaccard and Overlap Coefficient", 
             fill='black', font=font_large, anchor='mm')
    
    # Input data
    input_y = 100
    draw.text((width//2, input_y), "Given: a = 1000, b = 1200, ab = 700", 
             fill='black', font=font_medium, anchor='mm')
    
    # Venn diagram
    x_center = width // 2
    y_center = 300
    radius = 110
    spacing = 75
    
    circle_a_x = x_center - spacing // 2
    circle_b_x = x_center + spacing // 2
    
    draw.ellipse([circle_a_x - radius, y_center - radius, circle_a_x + radius, y_center + radius],
                fill='#d1ecf1', outline='#17a2b8', width=3)
    draw.ellipse([circle_b_x - radius, y_center - radius, circle_b_x + radius, y_center + radius],
                fill='#f8d7da', outline='#dc3545', width=3)
    
    draw.text((circle_a_x, y_center - radius - 25), "A", fill='#17a2b8', font=font_medium, anchor='mm')
    draw.text((circle_b_x, y_center - radius - 25), "B", fill='#dc3545', font=font_medium, anchor='mm')
    draw.text((x_center, y_center), "700", fill='black', font=font_medium, anchor='mm')
    
    # Calculations
    calc_y = 470
    draw.text((x_center, calc_y), "Step 1: |A ∪ B| = 1000 + 1200 - 700 = 1500", 
             fill='black', font=font_small, anchor='mm')
    draw.text((x_center, calc_y + 25), "Step 2: J(A, B) = 700 / 1500 = 0.467 (46.7%)", 
             fill='#28a745', font=font_medium, anchor='mm')
    draw.text((x_center, calc_y + 50), "Step 3: Overlap(A, B) = 700 / min(1000, 1200) = 0.70 (70%)", 
             fill='#28a745', font=font_medium, anchor='mm')
    
    img.save('public/DS-22/exercise_solution.png')
    print("Created: exercise_solution.png")

# --- Image 10: Three-Set Venn ---
def create_venn_three_sets():
    width, height = 900, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Three-Set Venn Diagram", fill='black', font=font_large, anchor='mm')
    
    x_center = width // 2
    y_center = height // 2
    radius = 90
    
    # Three overlapping circles
    # Circle A (top-left)
    circle_a_x = x_center - 50
    circle_a_y = y_center - 50
    
    # Circle B (top-right)
    circle_b_x = x_center + 50
    circle_b_y = y_center - 50
    
    # Circle C (bottom)
    circle_c_x = x_center
    circle_c_y = y_center + 50
    
    # Draw circles
    draw.ellipse([circle_a_x - radius, circle_a_y - radius, circle_a_x + radius, circle_a_y + radius],
                fill='#d1ecf1', outline='#17a2b8', width=2)
    draw.ellipse([circle_b_x - radius, circle_b_y - radius, circle_b_x + radius, circle_b_y + radius],
                fill='#f8d7da', outline='#dc3545', width=2)
    draw.ellipse([circle_c_x - radius, circle_c_y - radius, circle_c_x + radius, circle_c_y + radius],
                fill='#d4edda', outline='#28a745', width=2)
    
    # Labels
    draw.text((circle_a_x, circle_a_y - radius - 20), "A", fill='#17a2b8', font=font_medium, anchor='mm')
    draw.text((circle_b_x, circle_b_y - radius - 20), "B", fill='#dc3545', font=font_medium, anchor='mm')
    draw.text((circle_c_x, circle_c_y + radius + 20), "C", fill='#28a745', font=font_medium, anchor='mm')
    
    # Center (all three)
    draw.text((x_center, y_center + 10), "A ∩ B ∩ C", fill='black', font=font_tiny, anchor='mm')
    
    # Formula
    formula_y = height - 60
    draw.text((x_center, formula_y), "|A ∪ B ∪ C| = |A| + |B| + |C| - |A ∩ B| - |A ∩ C| - |B ∩ C| + |A ∩ B ∩ C|", 
             fill='black', font=font_tiny, anchor='mm')
    
    img.save('public/DS-22/venn_three_sets.png')
    print("Created: venn_three_sets.png")

# --- Generate all images ---
print("Generating DS-22 images...")
create_basic_sets()
create_set_operations()
create_inclusion_exclusion()
create_venn_basic()
create_venn_with_counts()
create_jaccard_index()
create_jaccard_vs_overlap()
create_venn_function_output()
create_exercise_solution()
create_venn_three_sets()
print("\nAll images for DS-22 created successfully!")

