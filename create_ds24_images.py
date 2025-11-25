from PIL import Image, ImageDraw, ImageFont
import os
import math

# Create directory if it doesn't exist
os.makedirs('public/DS-24', exist_ok=True)

try:
    font_large = ImageFont.truetype("arial.ttf", 22)
    font_medium = ImageFont.truetype("arial.ttf", 16)
    font_small = ImageFont.truetype("arial.ttf", 12)
    font_tiny = ImageFont.truetype("arial.ttf", 10)
except:
    font_large = ImageFont.load_default()
    font_medium = ImageFont.load_default()
    font_small = ImageFont.load_default()
    font_tiny = ImageFont.load_default()

# Colors
BLUE = '#17a2b8'
RED = '#dc3545'
GREEN = '#28a745'
YELLOW = '#ffc107'
PURPLE = '#6f42c1'
ORANGE = '#fd7e14'
GRAY = '#6c757d'
DARK_GRAY = '#343a40'
LIGHT_BLUE = '#d1ecf1'
LIGHT_RED = '#f8d7da'
LIGHT_GREEN = '#d4edda'
LIGHT_YELLOW = '#fff3cd'
LIGHT_PURPLE = '#e2d5f1'

# --- Image 1: Prior by Tier ---
def create_prior_by_segment():
    width, height = 900, 600
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Prior Probabilities by Priority Tier", fill='black', font=font_large, anchor='mm')
    
    # Bar chart
    segments = [
        ("Critical", 0.30, RED),
        ("High", 0.10, ORANGE),
        ("Standard", 0.02, YELLOW),
        ("Baseline", 0.001, GREEN),
    ]
    
    bar_width = 120
    max_height = 350
    start_x = 150
    base_y = 480
    
    for i, (label, prior, color) in enumerate(segments):
        x = start_x + i * 170
        
        # Scale height (use log scale for visibility)
        if prior > 0:
            bar_height = max(20, int(max_height * (math.log10(prior * 1000) + 1) / 4))
        else:
            bar_height = 20
        
        # Draw bar
        draw.rectangle([(x, base_y - bar_height), (x + bar_width, base_y)],
                       fill=color, outline=DARK_GRAY, width=2)
        
        # Segment label
        draw.text((x + bar_width//2, base_y + 25), label, fill='black', font=font_medium, anchor='mm')
        
        # Prior value
        draw.text((x + bar_width//2, base_y - bar_height - 15), f"π₁ = {prior:.1%}", 
                  fill=color, font=font_small, anchor='mm')
        
        # Interpretation
        interpretations = ["1 in 3", "1 in 10", "1 in 50", "1 in 1000"]
        draw.text((x + bar_width//2, base_y - bar_height - 35), interpretations[i], 
                  fill=GRAY, font=font_tiny, anchor='mm')
    
    # Y-axis label
    draw.text((60, base_y - max_height//2), "Anomaly Rate", fill='black', font=font_medium, anchor='mm')
    
    # Legend
    legend_y = 550
    draw.text((width//2, legend_y), "Higher prior → Higher base expectation of anomalies", 
              fill=GRAY, font=font_medium, anchor='mm')
    
    img.save('public/DS-24/prior_by_segment.png')
    print("Created: prior_by_segment.png")

# --- Image 2: Cost by Tier ---
def create_cost_by_segment():
    width, height = 950, 650
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Misclassification Costs by Priority Tier", fill='black', font=font_large, anchor='mm')
    
    # Table-style visualization
    segments = [
        ("Critical", 10000, 50, 200, RED),
        ("High", 5000, 100, 50, ORANGE),
        ("Standard", 1000, 200, 5, YELLOW),
        ("Baseline", 500, 500, 1, GREEN),
    ]
    
    table_x = 120
    table_y = 100
    row_height = 80
    col_widths = [100, 180, 180, 180, 200]
    
    # Headers
    headers = ["Tier", "C₁₀ (Miss)", "C₀₁ (False+)", "Ratio", "Implication"]
    x = table_x
    for i, header in enumerate(headers):
        draw.rectangle([(x, table_y), (x + col_widths[i], table_y + 40)],
                       fill=LIGHT_BLUE, outline='black', width=1)
        draw.text((x + col_widths[i]//2, table_y + 20), header, 
                  fill='black', font=font_small, anchor='mm')
        x += col_widths[i]
    
    # Data rows
    implications = ["Be aggressive!", "Favor catching", "More balanced", "Standard"]
    
    for row_idx, (segment, c10, c01, ratio, color) in enumerate(segments):
        y = table_y + 40 + row_idx * row_height
        x = table_x
        
        # Segment
        draw.rectangle([(x, y), (x + col_widths[0], y + row_height)],
                       fill=color, outline='black', width=1)
        draw.text((x + col_widths[0]//2, y + row_height//2), segment, 
                  fill='white', font=font_medium, anchor='mm')
        x += col_widths[0]
        
        # C10
        draw.rectangle([(x, y), (x + col_widths[1], y + row_height)],
                       fill='white', outline='black', width=1)
        draw.text((x + col_widths[1]//2, y + row_height//2), f"${c10:,}", 
                  fill=RED, font=font_medium, anchor='mm')
        x += col_widths[1]
        
        # C01
        draw.rectangle([(x, y), (x + col_widths[2], y + row_height)],
                       fill='white', outline='black', width=1)
        draw.text((x + col_widths[2]//2, y + row_height//2), f"${c01}", 
                  fill=BLUE, font=font_medium, anchor='mm')
        x += col_widths[2]
        
        # Ratio
        draw.rectangle([(x, y), (x + col_widths[3], y + row_height)],
                       fill=LIGHT_YELLOW, outline='black', width=1)
        draw.text((x + col_widths[3]//2, y + row_height//2), f"{ratio}:1", 
                  fill=ORANGE, font=font_medium, anchor='mm')
        x += col_widths[3]
        
        # Implication
        draw.rectangle([(x, y), (x + col_widths[4], y + row_height)],
                       fill='white', outline='black', width=1)
        draw.text((x + col_widths[4]//2, y + row_height//2), implications[row_idx], 
                  fill=GRAY, font=font_small, anchor='mm')
    
    # Key insight
    insight_y = 550
    draw.rectangle([(width//2 - 300, insight_y), (width//2 + 300, insight_y + 50)],
                   fill=LIGHT_PURPLE, outline=PURPLE, width=2)
    draw.text((width//2, insight_y + 25), "Higher C₁₀/C₀₁ ratio → Lower threshold → More aggressive flagging", 
              fill=PURPLE, font=font_medium, anchor='mm')
    
    img.save('public/DS-24/cost_by_segment.png')
    print("Created: cost_by_segment.png")

# --- Image 3: Bayes Threshold ---
def create_bayes_threshold():
    width, height = 900, 650
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Bayes Optimal Threshold", fill='black', font=font_large, anchor='mm')
    
    # Formula box
    formula_y = 100
    draw.rectangle([(width//2 - 280, formula_y), (width//2 + 280, formula_y + 80)],
                   fill=LIGHT_GREEN, outline=GREEN, width=3)
    draw.text((width//2, formula_y + 25), "τ* = C₀₁ / (C₀₁ + C₁₀)", 
              fill=GREEN, font=font_large, anchor='mm')
    draw.text((width//2, formula_y + 55), "or: τ* = 1 / (1 + (C₁₀/C₀₁))", 
              fill=GRAY, font=font_medium, anchor='mm')
    
    # Visual: threshold on probability line
    line_y = 280
    line_x = 100
    line_width = 700
    
    draw.line([(line_x, line_y), (line_x + line_width, line_y)], fill='black', width=3)
    draw.text((line_x, line_y + 25), "0", fill='black', font=font_medium, anchor='mm')
    draw.text((line_x + line_width, line_y + 25), "1", fill='black', font=font_medium, anchor='mm')
    draw.text((line_x + line_width//2, line_y + 50), "P(Anomaly | x)", fill='black', font=font_medium, anchor='mm')
    
    # Show different thresholds
    thresholds = [
        (0.5, "Standard\nτ = 0.50", GRAY, -60),
        (0.02, "Critical\nτ = 0.02", RED, -80),
        (0.167, "Standard\nτ = 0.17", YELLOW, -60),
    ]
    
    for tau, label, color, offset in thresholds:
        x = line_x + int(line_width * tau)
        draw.line([(x, line_y - 40), (x, line_y + 10)], fill=color, width=3)
        draw.text((x, line_y + offset), label, fill=color, font=font_tiny, anchor='mm')
    
    # Regions
    critical_x = line_x + int(line_width * 0.02)
    draw.rectangle([(critical_x, line_y - 25), (line_x + line_width, line_y - 5)],
                   fill=LIGHT_RED, outline=RED, width=1)
    draw.text(((critical_x + line_x + line_width)//2, line_y - 15), "Critical flags all of this", 
              fill=RED, font=font_tiny, anchor='mm')
    
    # Examples
    example_y = 400
    draw.text((width//2, example_y), "Example Calculations:", fill='black', font=font_medium, anchor='mm')
    
    examples = [
        ("Critical: C₀₁=$50, C₁₀=$10,000", "τ* = 50/(50+10000) = 0.005", RED),
        ("High: C₀₁=$100, C₁₀=$5,000", "τ* = 100/(100+5000) = 0.020", ORANGE),
        ("Baseline: C₀₁=$500, C₁₀=$500", "τ* = 500/(500+500) = 0.500", GREEN),
    ]
    
    for i, (desc, calc, color) in enumerate(examples):
        y = example_y + 35 + i * 50
        draw.text((200, y), desc, fill='black', font=font_small, anchor='lm')
        draw.text((550, y), "→", fill=GRAY, font=font_medium, anchor='mm')
        draw.text((700, y), calc, fill=color, font=font_small, anchor='mm')
    
    img.save('public/DS-24/bayes_threshold.png')
    print("Created: bayes_threshold.png")

# --- Image 4: Per-Tier Thresholds ---
def create_per_risk_thresholds():
    width, height = 900, 650
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Per-Tier Thresholds: Labeling Impact", fill='black', font=font_large, anchor='mm')
    
    # Four horizontal bars showing different thresholds
    segments = [
        ("Critical", 0.005, RED, "Flag if P > 0.5%"),
        ("High", 0.020, ORANGE, "Flag if P > 2%"),
        ("Standard", 0.167, YELLOW, "Flag if P > 16.7%"),
        ("Baseline", 0.500, GREEN, "Flag if P > 50%"),
    ]
    
    bar_width = 600
    bar_height = 50
    start_x = 200
    start_y = 100
    
    for i, (label, threshold, color, desc) in enumerate(segments):
        y = start_y + i * 120
        
        # Label
        draw.text((start_x - 50, y + bar_height//2), label, fill=color, font=font_medium, anchor='rm')
        
        # Full bar background
        draw.rectangle([(start_x, y), (start_x + bar_width, y + bar_height)],
                       fill='#f0f0f0', outline='black', width=1)
        
        # Threshold position
        t_x = start_x + int(bar_width * threshold)
        
        # Passed region (before threshold)
        draw.rectangle([(start_x, y), (t_x, y + bar_height)],
                       fill=LIGHT_BLUE, outline=None)
        
        # Flagged region (after threshold)
        draw.rectangle([(t_x, y), (start_x + bar_width, y + bar_height)],
                       fill=color, outline=None)
        
        # Threshold marker
        draw.line([(t_x, y - 10), (t_x, y + bar_height + 10)], fill='black', width=3)
        
        # Threshold value
        draw.text((t_x, y - 20), f"τ = {threshold:.3f}", fill='black', font=font_tiny, anchor='mm')
        
        # Description
        draw.text((start_x + bar_width + 20, y + bar_height//2), desc, 
                  fill=GRAY, font=font_small, anchor='lm')
    
    # Scale
    scale_y = start_y + 4 * 120
    draw.text((start_x, scale_y), "0", fill='black', font=font_small, anchor='mm')
    draw.text((start_x + bar_width, scale_y), "1", fill='black', font=font_small, anchor='mm')
    draw.text((start_x + bar_width//2, scale_y + 20), "P(Anomaly | x)", fill='black', font=font_medium, anchor='mm')
    
    # Key insight
    insight_y = 590
    draw.text((width//2, insight_y), "Lower threshold → More events flagged (higher recall, lower precision)", 
              fill=PURPLE, font=font_medium, anchor='mm')
    
    img.save('public/DS-24/per_risk_thresholds.png')
    print("Created: per_risk_thresholds.png")

# --- Image 5: PR Curve with Costs ---
def create_pr_curve_costs():
    width, height = 900, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "PR Curve: Operating Points at Different Costs", fill='black', font=font_large, anchor='mm')
    
    # Axes
    margin = 100
    graph_width = 600
    graph_height = 450
    origin_x = margin
    origin_y = margin + graph_height
    
    # Draw axes
    draw.line([(origin_x, origin_y), (origin_x + graph_width, origin_y)], fill='black', width=2)
    draw.line([(origin_x, origin_y), (origin_x, origin_y - graph_height)], fill='black', width=2)
    
    # Labels
    draw.text((origin_x + graph_width//2, origin_y + 40), "Recall", fill='black', font=font_medium, anchor='mm')
    draw.text((origin_x - 50, origin_y - graph_height//2), "Precision", fill='black', font=font_medium, anchor='mm')
    
    # Axis ticks
    for i in range(0, 11, 2):
        x = origin_x + int(graph_width * i / 10)
        draw.line([(x, origin_y), (x, origin_y + 5)], fill='black', width=1)
        draw.text((x, origin_y + 15), f"{i/10:.1f}", fill='black', font=font_tiny, anchor='mm')
        
        y = origin_y - int(graph_height * i / 10)
        draw.line([(origin_x - 5, y), (origin_x, y)], fill='black', width=1)
        draw.text((origin_x - 20, y), f"{i/10:.1f}", fill='black', font=font_tiny, anchor='mm')
    
    # Draw PR curve (simulated)
    pr_points = [
        (0.0, 1.0), (0.2, 0.95), (0.4, 0.85), (0.5, 0.78),
        (0.6, 0.68), (0.7, 0.55), (0.8, 0.42), (0.9, 0.32), (1.0, 0.25)
    ]
    
    for i in range(len(pr_points) - 1):
        r1, p1 = pr_points[i]
        r2, p2 = pr_points[i + 1]
        x1 = origin_x + int(graph_width * r1)
        y1 = origin_y - int(graph_height * p1)
        x2 = origin_x + int(graph_width * r2)
        y2 = origin_y - int(graph_height * p2)
        draw.line([(x1, y1), (x2, y2)], fill=BLUE, width=3)
    
    # Operating points
    operating_points = [
        (0.40, 0.85, "Conservative\nτ=0.50", GRAY, -40, -20),
        (0.75, 0.48, "Balanced\nτ=0.09", ORANGE, 0, 30),
        (0.95, 0.28, "Aggressive\nτ=0.01", RED, 30, 10),
    ]
    
    for recall, precision, label, color, dx, dy in operating_points:
        x = origin_x + int(graph_width * recall)
        y = origin_y - int(graph_height * precision)
        
        # Point
        draw.ellipse([x - 8, y - 8, x + 8, y + 8], fill=color, outline='white', width=2)
        
        # Label
        draw.text((x + dx, y + dy), label, fill=color, font=font_tiny, anchor='mm')
    
    # Legend
    legend_x = 720
    legend_y = 150
    draw.rectangle([(legend_x, legend_y), (legend_x + 150, legend_y + 120)],
                   fill='white', outline='black', width=1)
    draw.text((legend_x + 75, legend_y + 15), "Cost Ratio", fill='black', font=font_small, anchor='mm')
    
    legend_items = [
        ("1:1", GRAY),
        ("10:1", ORANGE),
        ("100:1", RED),
    ]
    
    for i, (ratio, color) in enumerate(legend_items):
        y = legend_y + 40 + i * 25
        draw.ellipse([legend_x + 15, y - 5, legend_x + 25, y + 5], fill=color)
        draw.text((legend_x + 35, y), f"C₁₀/C₀₁ = {ratio}", fill='black', font=font_tiny, anchor='lm')
    
    img.save('public/DS-24/pr_curve_costs.png')
    print("Created: pr_curve_costs.png")

# --- Image 6: Iso-Cost Lines ---
def create_iso_cost_lines():
    width, height = 900, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Iso-Cost Lines in ROC Space", fill='black', font=font_large, anchor='mm')
    
    # Axes (ROC space)
    margin = 120
    graph_size = 450
    origin_x = margin
    origin_y = margin + graph_size
    
    # Draw axes
    draw.line([(origin_x, origin_y), (origin_x + graph_size, origin_y)], fill='black', width=2)
    draw.line([(origin_x, origin_y), (origin_x, origin_y - graph_size)], fill='black', width=2)
    
    # Labels
    draw.text((origin_x + graph_size//2, origin_y + 40), "FPR (False Positive Rate)", 
              fill='black', font=font_medium, anchor='mm')
    draw.text((origin_x - 60, origin_y - graph_size//2), "TPR", fill='black', font=font_medium, anchor='mm')
    
    # Draw ROC curve (simulated)
    roc_points = [
        (0.0, 0.0), (0.05, 0.40), (0.10, 0.60), (0.15, 0.72),
        (0.25, 0.82), (0.40, 0.90), (0.60, 0.95), (1.0, 1.0)
    ]
    
    for i in range(len(roc_points) - 1):
        fpr1, tpr1 = roc_points[i]
        fpr2, tpr2 = roc_points[i + 1]
        x1 = origin_x + int(graph_size * fpr1)
        y1 = origin_y - int(graph_size * tpr1)
        x2 = origin_x + int(graph_size * fpr2)
        y2 = origin_y - int(graph_size * tpr2)
        draw.line([(x1, y1), (x2, y2)], fill=BLUE, width=3)
    
    # Diagonal (random classifier)
    draw.line([(origin_x, origin_y), (origin_x + graph_size, origin_y - graph_size)],
              fill=GRAY, width=1)
    
    # Iso-cost lines with different slopes
    iso_lines = [
        (0.1, RED, "Critical: steep"),      # Low slope (C₁₀ >> C₀₁)
        (1.0, ORANGE, "Standard: 45°"),     # Equal costs
        (5.0, GREEN, "Baseline: shallow"),  # High slope (C₀₁ >> C₁₀)
    ]
    
    for slope, color, label in iso_lines:
        # Draw iso-cost line through optimal point
        if slope < 1:
            # Steep line
            x1 = origin_x
            y1 = origin_y - int(graph_size * 0.4)
            x2 = origin_x + int(graph_size * 0.3)
            y2 = origin_y - graph_size
        elif slope > 1:
            # Shallow line
            x1 = origin_x
            y1 = origin_y - int(graph_size * 0.9)
            x2 = origin_x + graph_size
            y2 = origin_y - int(graph_size * 0.5)
        else:
            # 45 degree
            x1 = origin_x
            y1 = origin_y - int(graph_size * 0.7)
            x2 = origin_x + int(graph_size * 0.7)
            y2 = origin_y
        
        draw.line([(x1, y1), (x2, y2)], fill=color, width=2)
    
    # Legend
    legend_x = 620
    legend_y = 150
    draw.rectangle([(legend_x, legend_y), (legend_x + 230, legend_y + 130)],
                   fill='white', outline='black', width=1)
    draw.text((legend_x + 115, legend_y + 15), "Iso-Cost Line Slopes", fill='black', font=font_small, anchor='mm')
    
    for i, (slope, color, label) in enumerate(iso_lines):
        y = legend_y + 40 + i * 28
        draw.line([(legend_x + 10, y), (legend_x + 40, y)], fill=color, width=2)
        draw.text((legend_x + 50, y), label, fill='black', font=font_tiny, anchor='lm')
    
    # Explanation
    explain_y = 630
    draw.text((width//2, explain_y), "Slope = (C₀₁ · π₀) / (C₁₀ · π₁)", 
              fill=PURPLE, font=font_medium, anchor='mm')
    draw.text((width//2, explain_y + 25), "Optimal point: where ROC curve is tangent to iso-cost line", 
              fill=GRAY, font=font_small, anchor='mm')
    
    img.save('public/DS-24/iso_cost_lines.png')
    print("Created: iso_cost_lines.png")

# --- Image 7: Baseline Handling ---
def create_nr_handling():
    width, height = 900, 650
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Baseline Tier Handling: Special Case Strategies", fill='black', font=font_large, anchor='mm')
    
    # Three strategies
    strategies = [
        ("Strategy 1", "High Threshold", "τ = 0.90", "Only flag very high scores", ORANGE),
        ("Strategy 2", "Bypass", "Skip scoring", "Auto-approve all Baseline", GREEN),
        ("Strategy 3", "Monitor Only", "Score but don't flag", "Track for analysis", BLUE),
    ]
    
    box_width = 250
    box_height = 180
    start_x = 80
    start_y = 100
    
    for i, (name, title, rule, desc, color) in enumerate(strategies):
        x = start_x + i * 280
        y = start_y
        
        # Box
        draw.rectangle([(x, y), (x + box_width, y + box_height)],
                       fill='white', outline=color, width=3)
        
        # Header
        draw.rectangle([(x, y), (x + box_width, y + 40)],
                       fill=color, outline=color, width=1)
        draw.text((x + box_width//2, y + 20), name, fill='white', font=font_medium, anchor='mm')
        
        # Title
        draw.text((x + box_width//2, y + 60), title, fill='black', font=font_medium, anchor='mm')
        
        # Rule
        draw.text((x + box_width//2, y + 95), rule, fill=color, font=font_small, anchor='mm')
        
        # Description
        draw.text((x + box_width//2, y + 130), desc, fill=GRAY, font=font_tiny, anchor='mm')
        
        # Icon/visual
        icon_y = y + 160
        if i == 0:  # High threshold
            draw.rectangle([(x + 50, icon_y), (x + 200, icon_y + 15)], fill='#f0f0f0', outline='black')
            draw.rectangle([(x + 180, icon_y), (x + 200, icon_y + 15)], fill=ORANGE, outline=None)
        elif i == 1:  # Bypass
            draw.text((x + box_width//2, icon_y + 7), "→ ✓", fill=GREEN, font=font_medium, anchor='mm')
        else:  # Monitor
            draw.text((x + box_width//2, icon_y + 7), "👁️ 📊", fill=BLUE, font=font_medium, anchor='mm')
    
    # Why Baseline is special
    special_y = 350
    draw.rectangle([(100, special_y), (width - 100, special_y + 120)],
                   fill=LIGHT_GREEN, outline=GREEN, width=2)
    draw.text((width//2, special_y + 20), "Why Baseline Tier is Special:", fill=GREEN, font=font_medium, anchor='mm')
    
    reasons = [
        "• Very low prior: π₁ ≈ 0.001 (1 in 1000 is anomaly)",
        "• Equal or inverted costs: C₀₁ ≥ C₁₀ (false positives hurt more)",
        "• Business rules: Pre-verified, trusted entities",
    ]
    
    for i, reason in enumerate(reasons):
        draw.text((150, special_y + 50 + i * 22), reason, fill='black', font=font_small, anchor='lm')
    
    # Impact
    impact_y = 520
    draw.rectangle([(width//2 - 300, impact_y), (width//2 + 300, impact_y + 70)],
                   fill=LIGHT_YELLOW, outline=YELLOW, width=2)
    draw.text((width//2, impact_y + 20), "Impact on Labeling Geometry:", fill=ORANGE, font=font_medium, anchor='mm')
    draw.text((width//2, impact_y + 45), "Different Baseline rules create discontinuities in decision boundaries", 
              fill=GRAY, font=font_small, anchor='mm')
    
    img.save('public/DS-24/nr_handling.png')
    print("Created: nr_handling.png")

# --- Image 8: Gaussian Threshold ---
def create_gaussian_threshold():
    width, height = 950, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Gaussian Score Distributions: Optimal Threshold", fill='black', font=font_large, anchor='mm')
    
    # Draw two Gaussian curves
    center_y = 350
    curve_height = 200
    curve_width = 600
    start_x = 150
    
    # Parameters
    mu0, mu1 = 0.3, 0.7  # Means
    sigma = 0.15
    
    # Draw curves
    points_class0 = []
    points_class1 = []
    
    for i in range(curve_width):
        x = start_x + i
        t = i / curve_width  # 0 to 1
        
        # Gaussian values
        g0 = math.exp(-((t - mu0) ** 2) / (2 * sigma ** 2))
        g1 = math.exp(-((t - mu1) ** 2) / (2 * sigma ** 2))
        
        y0 = center_y - int(curve_height * g0)
        y1 = center_y - int(curve_height * g1)
        
        points_class0.append((x, y0))
        points_class1.append((x, y1))
    
    # Draw as lines
    for i in range(len(points_class0) - 1):
        draw.line([points_class0[i], points_class0[i + 1]], fill=BLUE, width=3)
        draw.line([points_class1[i], points_class1[i + 1]], fill=RED, width=3)
    
    # Baseline
    draw.line([(start_x, center_y), (start_x + curve_width, center_y)], fill='black', width=1)
    
    # Labels for curves
    draw.text((start_x + int(curve_width * mu0), center_y - curve_height - 20), 
              "Class 0 (Normal)", fill=BLUE, font=font_small, anchor='mm')
    draw.text((start_x + int(curve_width * mu0), center_y - curve_height - 5), 
              f"N(μ₀={mu0}, σ²)", fill=BLUE, font=font_tiny, anchor='mm')
    
    draw.text((start_x + int(curve_width * mu1), center_y - curve_height - 20), 
              "Class 1 (Anomaly)", fill=RED, font=font_small, anchor='mm')
    draw.text((start_x + int(curve_width * mu1), center_y - curve_height - 5), 
              f"N(μ₁={mu1}, σ²)", fill=RED, font=font_tiny, anchor='mm')
    
    # Thresholds
    midpoint = (mu0 + mu1) / 2
    midpoint_x = start_x + int(curve_width * midpoint)
    
    # Standard threshold (midpoint)
    draw.line([(midpoint_x, center_y - curve_height - 30), (midpoint_x, center_y + 20)], 
              fill=GRAY, width=2)
    draw.text((midpoint_x, center_y + 35), "Midpoint\n(μ₀+μ₁)/2", fill=GRAY, font=font_tiny, anchor='mm')
    
    # Cost-adjusted threshold (shifted left)
    adjusted_x = midpoint_x - 50
    draw.line([(adjusted_x, center_y - curve_height - 30), (adjusted_x, center_y + 20)], 
              fill=PURPLE, width=3)
    draw.text((adjusted_x, center_y + 55), "τ* (cost-adjusted)\nC₁₀ > C₀₁", fill=PURPLE, font=font_tiny, anchor='mm')
    
    # Formula
    formula_y = 480
    draw.rectangle([(width//2 - 350, formula_y), (width//2 + 350, formula_y + 80)],
                   fill=LIGHT_PURPLE, outline=PURPLE, width=2)
    draw.text((width//2, formula_y + 20), "τ* = (μ₁ + μ₀)/2 + σ² · ln[(C₀₁/C₁₀) · (π₀/π₁)] / (μ₁ - μ₀)", 
              fill=PURPLE, font=font_medium, anchor='mm')
    draw.text((width//2, formula_y + 50), "Midpoint + Adjustment based on costs and priors", 
              fill=GRAY, font=font_small, anchor='mm')
    
    # Interpretation
    interp_y = 600
    draw.text((width//2, interp_y), "When C₁₀ > C₀₁ (missing anomaly is worse): threshold shifts LEFT → more flagging", 
              fill=RED, font=font_small, anchor='mm')
    draw.text((width//2, interp_y + 25), "When C₀₁ > C₁₀ (false alarms are worse): threshold shifts RIGHT → less flagging", 
              fill=BLUE, font=font_small, anchor='mm')
    
    img.save('public/DS-24/gaussian_threshold.png')
    print("Created: gaussian_threshold.png")

# --- Generate all images ---
print("Generating DS-24 images...")
create_prior_by_segment()
create_cost_by_segment()
create_bayes_threshold()
create_per_risk_thresholds()
create_pr_curve_costs()
create_iso_cost_lines()
create_nr_handling()
create_gaussian_threshold()
print("\nAll images for DS-24 created successfully!")
