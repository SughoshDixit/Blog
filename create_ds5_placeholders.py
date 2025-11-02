"""
High-quality images for DS-5 using PIL/Pillow
Proper aspect ratios and sizing
"""
try:
    from PIL import Image, ImageDraw, ImageFont
    import os
    import math
except ImportError:
    print("PIL/Pillow not found. Install with: pip install Pillow")
    exit(1)

# Create DS-5 directory if it doesn't exist
os.makedirs('public/DS-5', exist_ok=True)

# Image dimensions - wider for better readability
WIDTH, HEIGHT = 1600, 900

def get_font(size):
    """Try to get a nice font"""
    try:
        return ImageFont.truetype("arial.ttf", size)
    except:
        try:
            return ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size)
        except:
            return ImageFont.load_default()

def median_mad_concept():
    """Main header image: Median & MAD concept"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(50)
    font_subtitle = get_font(36)
    font_text = get_font(28)
    font_label = get_font(24)
    
    # Title
    title_y = 50
    draw.text((WIDTH//2, title_y), 'Median & MAD: Robust Location and Scale', 
              fill='black', font=font_title, anchor='mm')
    
    # Data visualization area
    data = [10, 12, 13, 13, 14, 15, 100]
    median = 13
    mean = 25.29
    
    # Top plot area - larger for better visibility
    y_top = 200
    plot_width = WIDTH - 300
    plot_height = 280
    plot_x = 150
    
    # Draw data points with better spacing
    x_min, x_max = 0, 105
    scale = plot_width / (x_max - x_min)
    
    for i, val in enumerate(data):
        x_pos = plot_x + (val - x_min) * scale
        y_pos = y_top + plot_height // 2
        color = 'red' if val == 100 else 'blue'
        radius = 18 if val != 100 else 30
        draw.ellipse([x_pos - radius, y_pos - radius, x_pos + radius, y_pos + radius],
                    fill=color, outline='black', width=3)
        draw.text((x_pos, y_pos + radius + 8), str(val), fill='black', 
                 font=font_label, anchor='mm')
    
    # Draw median line
    median_x = plot_x + (median - x_min) * scale
    draw.line([median_x, y_top, median_x, y_top + plot_height], 
             fill='green', width=6)
    draw.text((median_x, y_top - 25), f'Median = {median}', 
             fill='green', font=font_text, anchor='mm', fontweight='bold')
    
    # Draw mean line
    mean_x = plot_x + (mean - x_min) * scale
    draw.line([mean_x, y_top, mean_x, y_top + plot_height], 
             fill='orange', width=6)
    draw.text((mean_x, y_top + plot_height + 25), f'Mean = {mean:.1f}', 
             fill='orange', font=font_text, anchor='mm')
    
    # Bottom: MAD calculation
    y_bottom = y_top + plot_height + 120
    draw.text((WIDTH//2, y_bottom - 30), 'MAD Calculation: Median(|xᵢ - median|) = 1', 
             fill='black', font=font_subtitle, anchor='mm')
    
    deviations = [abs(x - median) for x in data]
    sorted_deviations = sorted(deviations)
    mad = sorted_deviations[len(sorted_deviations)//2]
    
    bar_width = 80
    bar_spacing = 25
    bar_start_x = (WIDTH - (len(sorted_deviations) * (bar_width + bar_spacing))) // 2
    
    for i, dev in enumerate(sorted_deviations):
        bar_x = bar_start_x + i * (bar_width + bar_spacing)
        bar_height = min(dev * 20, 250)
        bar_y = y_bottom + 180 - bar_height
        color = 'darkred' if i == len(sorted_deviations)//2 else 'lightcoral'
        draw.rectangle([bar_x, bar_y, bar_x + bar_width, y_bottom + 180],
                      fill=color, outline='black', width=3)
        draw.text((bar_x + bar_width//2, bar_y - 25), str(int(dev)), 
                 fill='black', font=font_label, anchor='mm')
        draw.text((bar_x + bar_width//2, y_bottom + 200), f'{int(dev)}', 
                 fill='black', font=font_label, anchor='mm')
    
    img.save('public/DS-5/median_mad_concept.png', quality=95)
    print('Created median_mad_concept.png')

def why_robust():
    """Why robust statistics matter"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(48)
    font_subtitle = get_font(32)
    font_text = get_font(26)
    
    draw.text((WIDTH//2, 60), 'Why Robust Statistics Matter', 
             fill='black', font=font_title, anchor='mm')
    
    # Left: Fragile
    left_x = WIDTH // 4
    draw.text((left_x, 180), '⚠️ Mean/SD are Fragile', 
             fill='red', font=font_subtitle, anchor='mm')
    
    # Right: Robust
    right_x = 3 * WIDTH // 4
    draw.text((right_x, 180), '🧱 Median/MAD are Robust', 
             fill='green', font=font_subtitle, anchor='mm')
    
    # Add example text boxes with better formatting
    fragile_text = """• Single outlier shifts mean
• SD inflates dramatically
• Sensitive to extremes
• Not reliable for anomalies"""
    draw.text((left_x, 320), fragile_text, fill='black', font=font_text, anchor='mm')
    
    robust_text = """• Outlier resistant
• MAD stays stable
• Focus on central data
• Reliable for anomalies"""
    draw.text((right_x, 320), robust_text, fill='black', font=font_text, anchor='mm')
    
    # Visual representation
    # Left side - fragile
    fragile_data = [10, 12, 13, 13, 14, 15]
    fragile_x_start = left_x - 200
    for i, val in enumerate(fragile_data):
        x_pos = fragile_x_start + i * 40
        y_pos = 500
        draw.ellipse([x_pos - 15, y_pos - 15, x_pos + 15, y_pos + 15],
                    fill='blue', outline='black', width=2)
    # Add outlier
    draw.ellipse([fragile_x_start + 6 * 40 - 20, 500 - 20, fragile_x_start + 6 * 40 + 20, 500 + 20],
                fill='red', outline='black', width=3)
    draw.text((fragile_x_start + 3 * 40, 550), 'Mean shifts →', 
             fill='red', font=font_text, anchor='mm')
    
    # Right side - robust
    robust_data = [10, 12, 13, 13, 14, 15]
    robust_x_start = right_x - 200
    for i, val in enumerate(robust_data):
        x_pos = robust_x_start + i * 40
        y_pos = 500
        draw.ellipse([x_pos - 15, y_pos - 15, x_pos + 15, y_pos + 15],
                    fill='blue', outline='black', width=2)
    # Add outlier
    draw.ellipse([robust_x_start + 6 * 40 - 20, 500 - 20, robust_x_start + 6 * 40 + 20, 500 + 20],
                fill='red', outline='black', width=3)
    # Median line stays stable
    median_x = robust_x_start + 2.5 * 40
    draw.line([median_x, 480, median_x, 520], fill='green', width=5)
    draw.text((robust_x_start + 3 * 40, 550), 'Median stable ✓', 
             fill='green', font=font_text, anchor='mm')
    
    img.save('public/DS-5/why_robust.png', quality=95)
    print('Created why_robust.png')

def key_definitions():
    """Key definitions visualization"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(48)
    font_subtitle = get_font(30)
    font_text = get_font(26)
    
    draw.text((WIDTH//2, 50), 'Key Definitions: Median, MAD, and Robust Z-Score', 
             fill='black', font=font_title, anchor='mm')
    
    y_start = 150
    spacing = 220
    
    # Median
    draw.text((WIDTH//2, y_start), 'Median = Middle value after sorting', 
             fill='green', font=font_subtitle, anchor='mm')
    draw.text((WIDTH//2, y_start + 50), 
             'Example: [10, 12, 13, 13, 14, 15, 100] → Median = 13', 
             fill='black', font=font_text, anchor='mm')
    
    # Visual example for median
    median_data = [10, 12, 13, 13, 14, 15, 100]
    vis_x_start = WIDTH//2 - 200
    vis_y = y_start + 100
    for i, val in enumerate(median_data):
        x_pos = vis_x_start + i * 50
        color = 'red' if val == 100 else 'blue'
        radius = 20 if val != 100 else 25
        draw.ellipse([x_pos - radius, vis_y - radius, x_pos + radius, vis_y + radius],
                    fill=color, outline='black', width=2)
        draw.text((x_pos, vis_y + radius + 8), str(val), fill='black', font=font_text, anchor='mm')
    # Highlight median
    median_x = vis_x_start + 3 * 50
    draw.line([median_x, vis_y - 30, median_x, vis_y + 30], fill='green', width=4)
    
    # MAD
    draw.text((WIDTH//2, y_start + spacing), 'MAD = Median(|xᵢ - median|)', 
             fill='darkred', font=font_subtitle, anchor='mm')
    draw.text((WIDTH//2, y_start + spacing + 50), 
             'Example: Deviations = [3, 1, 0, 0, 1, 2, 87] → MAD = 1', 
             fill='black', font=font_text, anchor='mm')
    
    # Robust z-score
    draw.text((WIDTH//2, y_start + 2*spacing), 'Robust Z-Score = 0.6745 × (x - median) / MAD', 
             fill='blue', font=font_subtitle, anchor='mm')
    draw.text((WIDTH//2, y_start + 2*spacing + 50), 
             'Scaling factor 0.6745 aligns with classical z-scores for Normal data', 
             fill='black', font=font_text, anchor='mm')
    
    img.save('public/DS-5/key_definitions.png', quality=95)
    print('Created key_definitions.png')

def worked_example():
    """Worked example visualization"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(46)
    font_subtitle = get_font(32)
    font_text = get_font(26)
    font_table = get_font(24)
    
    draw.text((WIDTH//2, 40), 'Worked Example: Computing Median, MAD, and Robust Z-Scores', 
             fill='black', font=font_title, anchor='mm')
    
    # Steps
    steps = [
        ('Step 1: Find Median = 13', 150),
        ('Step 2: Find MAD = 1', 250),
        ('Step 3: Compute Robust Z-Scores', 350)
    ]
    
    for step_text, y_pos in steps:
        draw.text((WIDTH//2, y_pos), step_text, 
                 fill='black', font=font_subtitle, anchor='mm')
    
    # Z-scores table
    data = [10, 12, 13, 14, 15, 100]
    z_scores = [-2.02, -0.67, 0.00, 0.67, 1.35, 58.68]
    
    table_y = 480
    table_start_x = WIDTH // 2 - 350
    table_width = 700
    
    # Table header
    draw.rectangle([table_start_x - 10, table_y - 40, table_start_x + table_width + 10, table_y + 20],
                   fill='lightgray', outline='black', width=2)
    draw.text((table_start_x + 100, table_y - 10), 'x', fill='black', font=font_subtitle, anchor='mm')
    draw.text((table_start_x + 350, table_y - 10), 'Robust z', fill='black', font=font_subtitle, anchor='mm')
    
    # Table rows
    for i, (val, z) in enumerate(zip(data, z_scores)):
        row_y = table_y + 50 + i * 45
        color = 'lightblue' if i % 2 == 0 else 'white'
        draw.rectangle([table_start_x - 10, row_y - 20, table_start_x + table_width + 10, row_y + 20],
                      fill=color, outline='black', width=1)
        color_text = 'red' if abs(z) > 3 else 'black'
        draw.text((table_start_x + 100, row_y), f'x = {val}', 
                 fill='black', font=font_table, anchor='mm')
        draw.text((table_start_x + 350, row_y), f'z = {z:.2f}', 
                 fill=color_text, font=font_table, anchor='mm')
    
    img.save('public/DS-5/worked_example.png', quality=95)
    print('Created worked_example.png')

def mean_vs_median():
    """Mean vs Median comparison"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(48)
    font_subtitle = get_font(32)
    font_text = get_font(28)
    
    draw.text((WIDTH//2, 50), 'Mean vs Median: Robustness Comparison', 
             fill='black', font=font_title, anchor='mm')
    
    # Comparison text
    comparison_y = 200
    draw.text((WIDTH//2, comparison_y), 'Mean = 25.29 (pulled by outlier)', 
             fill='orange', font=font_subtitle, anchor='mm')
    draw.text((WIDTH//2, comparison_y + 60), 'Median = 13.0 (stays stable)', 
             fill='green', font=font_subtitle, anchor='mm')
    
    draw.text((WIDTH//2, comparison_y + 140), 
             'The outlier (100) shifts the mean dramatically', 
             fill='black', font=font_text, anchor='mm')
    draw.text((WIDTH//2, comparison_y + 180), 
             'but leaves the median unchanged.', 
             fill='black', font=font_text, anchor='mm')
    
    # Visual representation
    vis_y = 500
    data_points = [10, 12, 13, 13, 14, 15, 100]
    vis_x_start = WIDTH//2 - 300
    scale = 400 / 105
    
    for i, val in enumerate(data_points):
        x_pos = vis_x_start + val * scale
        color = 'red' if val == 100 else 'blue'
        radius = 20 if val != 100 else 28
        draw.ellipse([x_pos - radius, vis_y - radius, x_pos + radius, vis_y + radius],
                    fill=color, outline='black', width=3)
        draw.text((x_pos, vis_y + radius + 10), str(val), fill='black', font=font_text, anchor='mm')
    
    # Mean line
    mean_x = vis_x_start + 25.29 * scale
    draw.line([mean_x, vis_y - 50, mean_x, vis_y + 50], fill='orange', width=6)
    draw.text((mean_x, vis_y - 70), 'Mean', fill='orange', font=font_text, anchor='mm')
    
    # Median line
    median_x = vis_x_start + 13 * scale
    draw.line([median_x, vis_y - 50, median_x, vis_y + 50], fill='green', width=6)
    draw.text((median_x, vis_y - 70), 'Median', fill='green', font=font_text, anchor='mm')
    
    img.save('public/DS-5/mean_vs_median.png', quality=95)
    print('Created mean_vs_median.png')

def when_to_use():
    """When to use robust statistics"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(48)
    font_subtitle = get_font(28)
    font_text = get_font(26)
    
    draw.text((WIDTH//2, 50), 'When to Use Robust Statistics', 
             fill='black', font=font_title, anchor='mm')
    
    # Use cases
    use_cases = """✅ Use when:
• Data have outliers or long tails
• Need stable estimates
• Building anomaly detectors
• Data are skewed"""
    
    avoid_cases = """🚫 Avoid when:
• Data are clean and symmetric
• Close to Normal distribution
• Need maximum efficiency"""
    
    y_pos = 250
    draw.text((WIDTH//4, y_pos), use_cases, 
             fill='black', font=font_text, anchor='mm')
    draw.text((3*WIDTH//4, y_pos), avoid_cases, 
             fill='black', font=font_text, anchor='mm')
    
    # Visual icons
    # Left side - checkmark area
    check_y = 500
    for i in range(4):
        x_pos = WIDTH//4 - 150 + i * 80
        draw.text((x_pos, check_y), '✓', fill='green', font=get_font(40), anchor='mm')
    
    # Right side - X area
    for i in range(3):
        x_pos = 3*WIDTH//4 - 100 + i * 80
        draw.text((x_pos, check_y), '✗', fill='red', font=get_font(40), anchor='mm')
    
    img.save('public/DS-5/when_to_use.png', quality=95)
    print('Created when_to_use.png')

def zscore_comparison():
    """Classical vs Robust Z-Score comparison"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(44)
    font_subtitle = get_font(30)
    font_text = get_font(26)
    font_table = get_font(24)
    
    draw.text((WIDTH//2, 40), 'Classical vs Robust Z-Scores: Outlier Detection Power', 
             fill='black', font=font_title, anchor='mm')
    
    # Comparison table
    data = [10, 12, 13, 14, 15, 100]
    classical_z = [-0.50, -0.43, -0.40, -0.37, -0.34, 2.45]
    robust_z = [-2.02, -0.67, 0.00, 0.67, 1.35, 58.68]
    
    # Left column header
    draw.text((WIDTH//4, 120), 'Classical z', fill='orange', font=font_subtitle, anchor='mm')
    # Right column header
    draw.text((3*WIDTH//4, 120), 'Robust z', fill='green', font=font_subtitle, anchor='mm')
    
    table_y = 180
    table_width = 400
    
    for i, (val, cz, rz) in enumerate(zip(data, classical_z, robust_z)):
        row_y = table_y + i * 55
        
        # Left side - Classical
        left_x = WIDTH//4
        bg_color = 'lightgray' if i % 2 == 0 else 'white'
        draw.rectangle([left_x - table_width//2 - 10, row_y - 20, 
                      left_x + table_width//2 + 10, row_y + 25],
                     fill=bg_color, outline='black', width=1)
        draw.text((left_x - 100, row_y), f'x={val}:', fill='black', font=font_table, anchor='mm')
        draw.text((left_x + 100, row_y), f'{cz:.2f}', 
                 fill='black' if abs(cz) < 2.5 else 'red', 
                 font=font_table, anchor='mm')
        
        # Right side - Robust
        right_x = 3*WIDTH//4
        draw.rectangle([right_x - table_width//2 - 10, row_y - 20, 
                      right_x + table_width//2 + 10, row_y + 25],
                     fill=bg_color, outline='black', width=1)
        draw.text((right_x - 100, row_y), f'x={val}:', fill='black', font=font_table, anchor='mm')
        draw.text((right_x + 100, row_y), f'{rz:.2f}', 
                 fill='black' if abs(rz) < 3 else 'red', 
                 font=font_table, anchor='mm')
    
    # Highlight outlier
    highlight_y = table_y + 6 * 55 + 40
    draw.text((WIDTH//2, highlight_y), 
             'Outlier (100): Robust z exposes it clearly (+58.68) 🚨', 
             fill='red', font=font_subtitle, anchor='mm')
    
    img.save('public/DS-5/zscore_comparison.png', quality=95)
    print('Created zscore_comparison.png')

def recap_comparison():
    """Recap comparison table"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(46)
    font_text = get_font(26)
    font_table = get_font(24)
    
    draw.text((WIDTH//2, 50), 'Recap: Classical vs Robust Z-Scores Comparison', 
             fill='black', font=font_title, anchor='mm')
    
    # Table header
    header_y = 150
    table_start_x = WIDTH // 2 - 400
    table_width = 800
    
    # Header background
    draw.rectangle([table_start_x - 10, header_y - 30, table_start_x + table_width + 10, header_y + 30],
                 fill='lightblue', outline='black', width=2)
    
    draw.text((table_start_x + 100, header_y), 'x', fill='black', font=font_text, anchor='mm')
    draw.text((table_start_x + 250, header_y), 'Classical z', fill='orange', font=font_text, anchor='mm')
    draw.text((table_start_x + 450, header_y), 'Robust z', fill='green', font=font_text, anchor='mm')
    
    data = [10, 12, 13, 14, 15, 100]
    classical_z = [-0.50, -0.43, -0.40, -0.37, -0.34, 2.45]
    robust_z = [-2.02, -0.67, 0.00, 0.67, 1.35, 58.68]
    
    table_y = 220
    for i, (val, cz, rz) in enumerate(zip(data, classical_z, robust_z)):
        y_pos = table_y + i * 50
        
        # Row background
        bg_color = 'lightgray' if i % 2 == 0 else 'white'
        draw.rectangle([table_start_x - 10, y_pos - 20, table_start_x + table_width + 10, y_pos + 20],
                      fill=bg_color, outline='black', width=1)
        
        draw.text((table_start_x + 100, y_pos), str(val), fill='black', font=font_table, anchor='mm')
        draw.text((table_start_x + 250, y_pos), f'{cz:.2f}', 
                 fill='black' if abs(cz) < 2.5 else 'red', 
                 font=font_table, anchor='mm')
        draw.text((table_start_x + 450, y_pos), f'{rz:.2f}', 
                 fill='black' if abs(rz) < 3 else 'red', 
                 font=font_table, anchor='mm')
    
    draw.text((WIDTH//2, table_y + 6*50 + 50), 
             'Robust z tells the truth — and the truth is loud. 📣', 
             fill='black', font=font_text, anchor='mm')
    
    img.save('public/DS-5/recap_comparison.png', quality=95)
    print('Created recap_comparison.png')

# Create all images
print("Creating DS-5 images with improved quality...")
median_mad_concept()
why_robust()
key_definitions()
worked_example()
mean_vs_median()
when_to_use()
zscore_comparison()
recap_comparison()

print("\nAll DS-5 images created successfully with proper sizing and aspect ratios!")
print("Images are saved at 1600x900 resolution for better quality.")
