"""
Diverse placeholder images for DS-4
Uses only PIL/Pillow which is more commonly available
"""
try:
    from PIL import Image, ImageDraw, ImageFont
    import os
    import math
except ImportError:
    print("PIL/Pillow not found. Install with: pip install Pillow")
    exit(1)

# Create DS-4 directory if it doesn't exist
os.makedirs('public/DS-4', exist_ok=True)

# Image dimensions
WIDTH, HEIGHT = 1200, 800

def get_font(size):
    """Try to get a nice font"""
    try:
        return ImageFont.truetype("arial.ttf", size)
    except:
        try:
            return ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size)
        except:
            return ImageFont.load_default()

def draw_bar_chart(draw, x, y, width, height, values, colors):
    """Draw a simple bar chart"""
    bar_width = width // len(values)
    for i, (val, color) in enumerate(zip(values, colors)):
        bar_height = int(height * val)
        bar_x = x + i * bar_width + bar_width // 4
        bar_y = y + height - bar_height
        draw.rectangle([bar_x, bar_y, bar_x + bar_width // 2, y + height], 
                      fill=color, outline='#333', width=2)

def draw_line_graph(draw, x, y, width, height, points, color):
    """Draw a simple line graph"""
    if len(points) < 2:
        return
    point_coords = []
    for i, p in enumerate(points):
        px = x + int(i * width / (len(points) - 1))
        py = y + height - int(p * height)
        point_coords.append((px, py))
    for i in range(len(point_coords) - 1):
        draw.line([point_coords[i], point_coords[i+1]], fill=color, width=4)

def percentile_rank_concept():
    """Create percentile rank concept visualization"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='#1a1a2e')
    draw = ImageDraw.Draw(img)
    font_lg = get_font(48)
    font_md = get_font(32)
    
    # Title
    draw.text((WIDTH//2 - 250, 30), "Percentile Rank Concept", fill='#f0f0f0', font=font_lg)
    
    # Left side: Raw values
    draw.rectangle([50, 120, 550, 720], fill='#16213e', outline='#0f3460', width=3)
    draw.text((200, 140), "Raw Values", fill='#e94560', font=font_md)
    
    # Bar chart for raw values
    values = [0.7, 0.3, 0.9, 0.4, 0.6, 0.8, 0.2, 0.5]
    colors = ['#e94560', '#0f3460', '#533483', '#e94560', '#0f3460', '#533483', '#e94560', '#0f3460']
    draw_bar_chart(draw, 80, 200, 440, 480, values, colors)
    
    # Arrow pointing right
    arrow_y = HEIGHT // 2
    draw.polygon([(560, arrow_y-30), (560, arrow_y+30), (610, arrow_y)], fill='#e94560')
    draw.rectangle([560, arrow_y-5, 610, arrow_y+5], fill='#e94560')
    
    # Right side: Percentile ranks [0,1]
    draw.rectangle([650, 120, 1150, 720], fill='#0f3460', outline='#533483', width=3)
    draw.text((800, 140), "Percentile Ranks [0,1]", fill='#533483', font=font_md)
    
    # Line graph showing percentile ranks
    rank_points = [0.12, 0.25, 0.38, 0.50, 0.62, 0.75, 0.88, 1.00]
    draw_line_graph(draw, 680, 200, 440, 480, rank_points, '#533483')
    
    # Grid lines
    for i in range(5):
        y = 200 + i * 120
        draw.line([680, y, 1120, y], fill='#16213e', width=1)
    
    img.save('public/DS-4/percentile_rank_concept.png')
    print('Created percentile_rank_concept.png')

def rank_properties():
    """Create rank properties visualization"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='#f8f9fa')
    draw = ImageDraw.Draw(img)
    font_lg = get_font(42)
    font_md = get_font(28)
    
    # Gradient-like background
    for i in range(HEIGHT):
        r = int(248 + (i / HEIGHT) * 7)
        g = int(249 + (i / HEIGHT) * 6)
        b = int(250 + (i / HEIGHT) * 5)
        draw.line([(0, i), (WIDTH, i)], fill=(r, g, b))
    
    draw.text((WIDTH//2 - 220, 40), "Properties of Percentile Ranks", fill='#2c3e50', font=font_lg)
    
    # Monotonicity visualization (top left)
    draw.rectangle([50, 120, 550, 360], fill='#ffffff', outline='#3498db', width=3)
    draw.text((180, 140), "Monotonicity", fill='#3498db', font=font_md)
    
    # Increasing line
    points = [0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9, 1.0]
    draw_line_graph(draw, 80, 200, 440, 120, points, '#3498db')
    draw.text((80, 330), "✓ Always increasing", fill='#27ae60', font=get_font(24))
    
    # Invariance visualization (top right)
    draw.rectangle([650, 120, 1150, 360], fill='#ffffff', outline='#e74c3c', width=3)
    draw.text((770, 140), "Invariance", fill='#e74c3c', font=font_md)
    
    # Two overlapping lines showing same ranks
    points1 = [0.2, 0.35, 0.5, 0.65, 0.75, 0.85, 0.9, 1.0]
    points2 = [0.2, 0.35, 0.5, 0.65, 0.75, 0.85, 0.9, 1.0]
    draw_line_graph(draw, 680, 180, 440, 140, points1, '#e74c3c')
    draw_line_graph(draw, 680, 220, 440, 140, points2, '#f39c12')
    draw.text((680, 330), "✓ Ranks unchanged", fill='#27ae60', font=get_font(24))
    
    # Properties list (bottom)
    draw.rectangle([50, 400, 1150, 720], fill='#ffffff', outline='#9b59b6', width=3)
    draw.text((WIDTH//2 - 150, 420), "Key Properties", fill='#9b59b6', font=font_md)
    
    properties = [
        "✓ Monotonicity: Order-preserving",
        "✓ Invariance: Stable under monotone transforms",
        "✓ Scale-free: [0,1] regardless of original units",
        "✓ Interpretable: Fraction of data at/below value"
    ]
    y_pos = 480
    for prop in properties:
        draw.text((80, y_pos), prop, fill='#2c3e50', font=get_font(26))
        y_pos += 50
    
    img.save('public/DS-4/rank_properties.png')
    print('Created rank_properties.png')

def combining_ranks():
    """Create combining ranks visualization"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='#0a192f')
    draw = ImageDraw.Draw(img)
    font_lg = get_font(46)
    font_md = get_font(30)
    
    draw.text((WIDTH//2 - 180, 30), "Combining Percentile Ranks", fill='#64ffda', font=font_lg)
    
    # Left: MIN (AND-like) - Conservative
    draw.rectangle([50, 120, 575, 720], fill='#172a45', outline='#64ffda', width=3)
    draw.text((200, 140), "MIN (AND) - Conservative", fill='#64ffda', font=font_md)
    
    # Heatmap for min
    cell_size = 60
    start_x, start_y = 80, 200
    for i in range(8):
        for j in range(8):
            rA_val = i / 7.0
            rB_val = j / 7.0
            min_val = min(rA_val, rB_val)
            # Color intensity based on min value
            intensity = int(100 + min_val * 155)
            color = (0, intensity, intensity // 2)
            x = start_x + i * cell_size
            y = start_y + j * cell_size
            draw.rectangle([x, y, x+cell_size-2, y+cell_size-2], fill=color)
    
    draw.text((80, 700), "rAND = min(rA, rB)", fill='#64ffda', font=get_font(24))
    
    # Right: MAX (OR-like) - Liberal
    draw.rectangle([625, 120, 1150, 720], fill='#172a45', outline='#ff6b6b', width=3)
    draw.text((750, 140), "MAX (OR) - Liberal", fill='#ff6b6b', font=font_md)
    
    # Heatmap for max
    for i in range(8):
        for j in range(8):
            rA_val = i / 7.0
            rB_val = j / 7.0
            max_val = max(rA_val, rB_val)
            # Color intensity based on max value
            intensity = int(100 + max_val * 155)
            color = (intensity, intensity // 2, intensity // 2)
            x = start_x + 575 + i * cell_size
            y = start_y + j * cell_size
            draw.rectangle([x, y, x+cell_size-2, y+cell_size-2], fill=color)
    
    draw.text((655, 700), "rOR = max(rA, rB)", fill='#ff6b6b', font=get_font(24))
    
    img.save('public/DS-4/combining_ranks.png')
    print('Created combining_ranks.png')

def stratification_concept():
    """Create stratification concept visualization"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='#fefefe')
    draw = ImageDraw.Draw(img)
    font_lg = get_font(44)
    font_md = get_font(28)
    
    # Title
    draw.text((WIDTH//2 - 200, 30), "Stratification Concept", fill='#2d3436', font=font_lg)
    
    # Distribution curve (top)
    draw.rectangle([50, 100, 1150, 380], fill='#dfe6e9', outline='#636e72', width=2)
    draw.text((WIDTH//2 - 120, 120), "Distribution of Combined Ranks", fill='#2d3436', font=font_md)
    
    # Draw a bell curve-like distribution
    center_x = WIDTH // 2
    for i in range(1100):
        x = 50 + i
        # Bell curve approximation
        normalized_x = (x - center_x) / 550
        height = int(200 * math.exp(-normalized_x * normalized_x * 2))
        draw.line([(x, 350), (x, 350 - height)], fill='#00b894', width=2)
    
    # Stratification cuts
    cuts = [0.2, 0.5, 0.8]
    cut_colors = ['#e17055', '#fdcb6e', '#a29bfe']
    for i, (cut, color) in enumerate(zip(cuts, cut_colors)):
        x = 50 + int(cut * 1100)
        draw.line([(x, 100), (x, 380)], fill=color, width=4)
        draw.text((x - 20, 390), f"{cut}", fill=color, font=get_font(24))
    
    # Strata visualization (bottom)
    draw.rectangle([50, 420, 1150, 720], fill='#ffffff', outline='#2d3436', width=2)
    draw.text((WIDTH//2 - 100, 440), "Four Strata", fill='#2d3436', font=font_md)
    
    strata_colors = ['#ff6b6b', '#4ecdc4', '#95e1d3', '#f38181']
    strata_labels = ['Stratum 1\n[0.0, 0.2)', 'Stratum 2\n[0.2, 0.5)', 
                     'Stratum 3\n[0.5, 0.8)', 'Stratum 4\n[0.8, 1.0]']
    strata_counts = [150, 200, 180, 70]
    
    bar_width = 240
    start_x = 80
    for i, (color, label, count) in enumerate(zip(strata_colors, strata_labels, strata_counts)):
        x = start_x + i * (bar_width + 20)
        bar_height = int((count / max(strata_counts)) * 200)
        draw.rectangle([x, 550 - bar_height, x + bar_width, 550], 
                      fill=color, outline='#2d3436', width=2)
        draw.text((x + 60, 560), label, fill='#2d3436', font=get_font(22))
        draw.text((x + 80, 670), f"n={count}", fill='#636e72', font=get_font(20))
    
    img.save('public/DS-4/stratification_concept.png')
    print('Created stratification_concept.png')

def solved_example():
    """Create solved example visualization"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='#1e1e2e')
    draw = ImageDraw.Draw(img)
    font_lg = get_font(40)
    font_md = get_font(26)
    
    draw.text((WIDTH//2 - 140, 20), "Solved Example", fill='#89b4fa', font=font_lg)
    
    # Step 1: Raw features
    draw.rectangle([30, 80, 580, 380], fill='#313244', outline='#89b4fa', width=2)
    draw.text((200, 100), "Step 1: Raw Features", fill='#89b4fa', font=font_md)
    
    # Feature A bars
    feature_a = [10, 7, 12, 15, 8, 20, 9, 18]
    colors_a = ['#a6e3a1'] * 8
    for i, (val, color) in enumerate(zip(feature_a, colors_a)):
        bar_height = int((val / 20) * 200)
        x = 60 + i * 60
        draw.rectangle([x, 300 - bar_height, x + 45, 300], 
                      fill=color, outline='#89b4fa', width=1)
        draw.text((x + 15, 310), f"{val}", fill='#cdd6f4', font=get_font(18))
    
    # Feature B bars
    feature_b = [5, 3, 9, 4, 8, 6, 2, 10]
    colors_b = ['#f38ba8'] * 8
    for i, (val, color) in enumerate(zip(feature_b, colors_b)):
        bar_height = int((val / 10) * 200)
        x = 60 + i * 60
        draw.rectangle([x, 350 - bar_height, x + 45, 350], 
                      fill=color, outline='#f38ba8', width=1)
        draw.text((x + 15, 360), f"{val}", fill='#cdd6f4', font=get_font(18))
    
    # Step 2: Combined ranks
    draw.rectangle([620, 80, 1170, 380], fill='#313244', outline='#cba6f7', width=2)
    draw.text((820, 100), "Step 2: Combined Ranks", fill='#cba6f7', font=font_md)
    
    # rAND visualization
    rand_values = [0.50, 0.12, 0.62, 0.38, 0.25, 0.62, 0.12, 0.88]
    for i, val in enumerate(rand_values):
        bar_height = int(val * 200)
        x = 650 + i * 60
        # Color by stratum
        if val < 0.2:
            color = '#ff6b6b'
        elif val < 0.5:
            color = '#4ecdc4'
        elif val < 0.8:
            color = '#95e1d3'
        else:
            color = '#f38181'
        draw.rectangle([x, 300 - bar_height, x + 45, 300], 
                      fill=color, outline='#cba6f7', width=1)
        draw.text((x + 10, 310), f"{val:.2f}", fill='#cdd6f4', font=get_font(16))
    
    # Step 3: Strata (bottom)
    draw.rectangle([30, 400, 1170, 760], fill='#313244', outline='#fab387', width=2)
    draw.text((WIDTH//2 - 120, 420), "Step 3: Final Strata", fill='#fab387', font=font_md)
    
    # Show IDs in each stratum
    strata_data = [
        ([2, 7], '#ff6b6b', 'Stratum 1 [0, 0.2)'),
        ([5, 4], '#4ecdc4', 'Stratum 2 [0.2, 0.5)'),
        ([1, 3, 6], '#95e1d3', 'Stratum 3 [0.5, 0.8)'),
        ([8], '#f38181', 'Stratum 4 [0.8, 1.0)')
    ]
    
    y_pos = 480
    for ids, color, label in strata_data:
        draw.text((60, y_pos), label, fill=color, font=get_font(24))
        ids_str = ', '.join([f"ID {id}" for id in ids])
        draw.text((60, y_pos + 40), ids_str, fill='#cdd6f4', font=get_font(22))
        y_pos += 70
    
    img.save('public/DS-4/solved_example.png')
    print('Created solved_example.png')

def min_max_comparison():
    """Create min vs max comparison visualization"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='#fdf6e3')
    draw = ImageDraw.Draw(img)
    font_lg = get_font(42)
    font_md = get_font(28)
    
    draw.text((WIDTH//2 - 200, 30), "Min vs Max: Conservative vs Liberal", fill='#586e75', font=font_lg)
    
    # Left side: MIN comparison
    draw.rectangle([50, 100, 575, 720], fill='#eee8d5', outline='#859900', width=3)
    draw.text((220, 120), "MIN (Conservative)", fill='#859900', font=font_md)
    
    # Example cases
    cases = [
        ("rA=0.7\nrB=0.4", 0.4, '#859900'),
        ("rA=0.9\nrB=0.3", 0.3, '#859900'),
        ("rA=0.6\nrB=0.6", 0.6, '#859900'),
        ("rA=0.2\nrB=0.8", 0.2, '#859900')
    ]
    
    y_start = 180
    for i, (label, result, color) in enumerate(cases):
        y = y_start + i * 120
        # Draw case box
        draw.rectangle([80, y, 520, y + 100], fill='#fdf6e3', outline=color, width=2)
        draw.text((100, y + 10), label, fill='#586e75', font=get_font(22))
        draw.text((100, y + 60), f"min → {result:.1f}", fill=color, font=get_font(24))
    
    # Right side: MAX comparison
    draw.rectangle([625, 100, 1150, 720], fill='#eee8d5', outline='#dc322f', width=3)
    draw.text((860, 120), "MAX (Liberal)", fill='#dc322f', font=font_md)
    
    cases_max = [
        ("rA=0.7\nrB=0.4", 0.7, '#dc322f'),
        ("rA=0.9\nrB=0.3", 0.9, '#dc322f'),
        ("rA=0.6\nrB=0.6", 0.6, '#dc322f'),
        ("rA=0.2\nrB=0.8", 0.8, '#dc322f')
    ]
    
    for i, (label, result, color) in enumerate(cases_max):
        y = y_start + i * 120
        draw.rectangle([655, y, 1095, y + 100], fill='#fdf6e3', outline=color, width=2)
        draw.text((675, y + 10), label, fill='#586e75', font=get_font(22))
        draw.text((675, y + 60), f"max → {result:.1f}", fill=color, font=get_font(24))
    
    # Key insight at bottom
    draw.rectangle([50, 560, 1150, 650], fill='#073642', outline='#268bd2', width=3)
    insight = "Key Insight: MIN is always ≤ MAX (Conservative approach is more restrictive)"
    draw.text((WIDTH//2 - 380, 580), insight, fill='#268bd2', font=get_font(26))
    
    img.save('public/DS-4/min_max_comparison.png')
    print('Created min_max_comparison.png')

def visual_heatmaps():
    """Create visual heatmaps visualization"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='#0d1117')
    draw = ImageDraw.Draw(img)
    font_lg = get_font(40)
    font_md = get_font(26)
    
    draw.text((WIDTH//2 - 150, 20), "Visual Heatmaps", fill='#58a6ff', font=font_lg)
    
    # Top row: Individual ranks
    # rA heatmap
    draw.rectangle([30, 80, 570, 380], fill='#161b22', outline='#58a6ff', width=2)
    draw.text((230, 100), "rA (Feature A Ranks)", fill='#58a6ff', font=font_md)
    
    rA_values = [0.50, 0.12, 0.62, 0.75, 0.25, 1.00, 0.38, 0.88]
    bar_width = 60
    start_x = 60
    for i, val in enumerate(rA_values):
        bar_height = int(val * 200)
        x = start_x + i * bar_width
        intensity = int(50 + val * 205)
        color = (0, 100, intensity)
        draw.rectangle([x, 250 - bar_height, x + 50, 250], fill=color, outline='#58a6ff', width=1)
        draw.text((x + 15, 260), f"{val:.2f}", fill='#c9d1d9', font=get_font(18))
    
    # rB heatmap
    draw.rectangle([630, 80, 1170, 380], fill='#161b22', outline='#f85149', width=2)
    draw.text((830, 100), "rB (Feature B Ranks)", fill='#f85149', font=font_md)
    
    rB_values = [0.50, 0.25, 0.88, 0.38, 0.75, 0.62, 0.12, 1.00]
    for i, val in enumerate(rB_values):
        bar_height = int(val * 200)
        x = start_x + 600 + i * bar_width
        intensity = int(50 + val * 205)
        color = (intensity, 50, 50)
        draw.rectangle([x, 250 - bar_height, x + 50, 250], fill=color, outline='#f85149', width=1)
        draw.text((x + 15, 260), f"{val:.2f}", fill='#c9d1d9', font=get_font(18))
    
    # Bottom: Combined rAND heatmap
    draw.rectangle([30, 420, 1170, 760], fill='#161b22', outline='#a5a5ff', width=2)
    draw.text((WIDTH//2 - 180, 440), "rAND = min(rA, rB) - The AND Valley", fill='#a5a5ff', font=font_md)
    
    rand_values = [0.50, 0.12, 0.62, 0.38, 0.25, 0.62, 0.12, 0.88]
    y_mid = 590
    for i, val in enumerate(rand_values):
        bar_height = int(val * 200)
        x = start_x + i * bar_width
        # Color by stratum
        if val < 0.2:
            color = '#ff6b6b'
        elif val < 0.5:
            color = '#4ecdc4'
        elif val < 0.8:
            color = '#95e1d3'
        else:
            color = '#f38181'
        draw.rectangle([x, y_mid - bar_height, x + 50, y_mid + bar_height], 
                      fill=color, outline='#a5a5ff', width=2)
        draw.text((x + 10, y_mid + 80), f"{val:.2f}", fill='#c9d1d9', font=get_font(18))
        
        # ID labels
        draw.text((x + 18, y_mid + 120), f"ID{i+1}", fill='#c9d1d9', font=get_font(16))
    
    img.save('public/DS-4/visual_heatmaps.png')
    print('Created visual_heatmaps.png')

# Create all images
percentile_rank_concept()
rank_properties()
combining_ranks()
stratification_concept()
solved_example()
min_max_comparison()
visual_heatmaps()

print("\nAll DS-4 diverse placeholder images created successfully!")

