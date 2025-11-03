"""
High-quality placeholder images for DS-6 using PIL/Pillow
Skewness and Kurtosis visualizations
"""
try:
    from PIL import Image, ImageDraw, ImageFont
    import os
    import math
except ImportError:
    print("PIL/Pillow not found. Install with: pip install Pillow")
    exit(1)

# Create DS-6 directory if it doesn't exist
os.makedirs('public/DS-6', exist_ok=True)

# Image dimensions - wider for better readability, maintaining aspect ratio
# Using 16:9 ratio for consistency with other DS images
WIDTH, HEIGHT = 1920, 1080

def get_font(size):
    """Try to get a nice font"""
    try:
        return ImageFont.truetype("arial.ttf", size)
    except:
        try:
            return ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size)
        except:
            return ImageFont.load_default()

def skewness_kurtosis_concept():
    """Main header image: Skewness & Kurtosis concept with improved visualizations"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='#f8f9fa')
    draw = ImageDraw.Draw(img)
    font_title = get_font(52)
    font_subtitle = get_font(30)
    font_label = get_font(24)
    
    # Title with better styling
    title_bg = (WIDTH//2, 50, WIDTH//2, 110)
    draw.rectangle([0, 0, WIDTH, 120], fill='#2d3748', outline='#1a202c', width=2)
    draw.text((WIDTH//2, 80), 'Skewness & Kurtosis: Understanding Distribution Shape', 
              fill='white', font=font_title, anchor='mm')
    
    # Create four quadrants with better spacing
    margin = 80
    quadrant_width = (WIDTH - 3 * margin) // 2
    quadrant_height = (HEIGHT - 140) // 2
    
    # Top-left: Normal distribution
    tl_x = margin
    tl_y = 140
    draw_improved_distribution(draw, tl_x, tl_y, quadrant_width, quadrant_height, 
                            'Normal Distribution', 'Symmetric, Normal\nSkewness ≈ 0\nKurtosis = 3.0',
                            '#4299e1', symmetric=True)
    
    # Top-right: Right-skewed
    tr_x = WIDTH - margin - quadrant_width
    draw_improved_distribution(draw, tr_x, tl_y, quadrant_width, quadrant_height,
                            'Right-Skewed', 'Positive Skewness\nSkewness > 0\nLong tail →',
                            '#f56565', symmetric=False, right_skew=True)
    
    # Bottom-left: Left-skewed
    bl_y = tl_y + quadrant_height + 30
    draw_improved_distribution(draw, tl_x, bl_y, quadrant_width, quadrant_height,
                            'Left-Skewed', 'Negative Skewness\nSkewness < 0\nLong tail ←',
                            '#48bb78', symmetric=False, right_skew=False)
    
    # Bottom-right: Heavy-tailed
    draw_improved_distribution(draw, tr_x, bl_y, quadrant_width, quadrant_height,
                            'Heavy-Tailed', 'High Kurtosis\nKurtosis > 3\nFat tails, many extremes',
                            '#9f7aea', symmetric=True, heavy_tails=True)
    
    img.save('public/DS-6/skewness_kurtosis_concept.png', quality=100, optimize=False)
    print('Created skewness_kurtosis_concept.png')

def draw_improved_distribution(draw, x, y, w, h, title, subtitle, color, symmetric=True, right_skew=False, heavy_tails=False):
    """Draw an improved distribution visualization with smooth curves"""
    font_title = get_font(28)
    font_sub = get_font(20)
    font_small = get_font(18)
    
    # Draw container with shadow effect
    shadow_offset = 4
    draw.rectangle([x + shadow_offset, y + shadow_offset, x + w + shadow_offset, y + h + shadow_offset],
                  fill='#e2e8f0', outline='#cbd5e0', width=1)
    draw.rectangle([x, y, x + w, y + h], fill='white', outline='#4a5568', width=2)
    
    # Draw title
    title_bg_height = 45
    draw.rectangle([x, y, x + w, y + title_bg_height], fill='#2d3748', outline='#1a202c', width=1)
    draw.text((x + w//2, y + title_bg_height//2), title, fill='white', font=font_title, anchor='mm')
    
    # Draw subtitle
    subtitle_y = y + title_bg_height + 15
    lines = subtitle.split('\n')
    for i, line in enumerate(lines):
        if i == 0:
            draw.text((x + w//2, subtitle_y + i * 22), line, fill='#2d3748', font=font_sub, anchor='mm')
        else:
            draw.text((x + w//2, subtitle_y + i * 22), line, fill='#718096', font=font_small, anchor='mm')
    
    # Draw smooth distribution curve using bezier or multiple points
    plot_area_top = subtitle_y + len(lines) * 22 + 20
    plot_area_bottom = y + h - 20
    plot_area_height = plot_area_bottom - plot_area_top
    plot_area_left = x + 30
    plot_area_right = x + w - 30
    plot_area_width = plot_area_right - plot_area_left
    
    # Draw axes
    axis_color = '#cbd5e0'
    # X-axis
    draw.line([plot_area_left, plot_area_bottom, plot_area_right, plot_area_bottom], 
              fill=axis_color, width=2)
    # Y-axis
    draw.line([plot_area_left, plot_area_top, plot_area_left, plot_area_bottom], 
              fill=axis_color, width=2)
    
    # Generate smooth curve points
    num_points = 100
    points = []
    
    for i in range(num_points + 1):
        t = i / num_points
        
        if symmetric:
            if heavy_tails:
                # Heavy-tailed: wider distribution, thicker tails
                # Using a t-distribution-like shape
                x_val = t * 2 - 1  # -1 to 1
                y_val = max(0, 1 - abs(x_val) ** 1.2)  # Slower drop for heavy tails
                y_val = y_val ** 0.7  # Make it wider
            else:
                # Normal: smooth bell curve
                x_val = t * 2 - 1  # -1 to 1
                y_val = math.exp(-(x_val ** 2) * 2)  # Gaussian-like
        else:
            if right_skew:
                # Right-skewed: peak on left, tail on right
                x_val = t
                y_val = math.exp(-x_val * 3) * (1 - x_val * 0.3)
            else:
                # Left-skewed: peak on right, tail on left
                x_val = 1 - t
                y_val = math.exp(-x_val * 3) * (1 - x_val * 0.3)
        
        px = plot_area_left + t * plot_area_width
        py = plot_area_bottom - y_val * plot_area_height * 0.8
        
        points.append((px, py))
    
    # Draw filled area under curve using polygon
    fill_points = [(plot_area_left, plot_area_bottom)]
    for point in points:
        fill_points.append(point)
    fill_points.append((plot_area_right, plot_area_bottom))
    
    # Draw filled area with semi-transparent color (approximate by using lighter shade)
    # Extract color components and create lighter version
    color_rgb = Image.new('RGB', (1, 1), color).getpixel((0, 0))
    light_color = tuple(min(255, c + 40) for c in color_rgb)
    
    # Draw filled polygon
    draw.polygon(fill_points, fill=light_color, outline=None)
    
    # Draw the curve outline with thicker line
    for i in range(len(points) - 1):
        draw.line([points[i][0], points[i][1], points[i+1][0], points[i+1][1]], 
                 fill=color, width=4)
    
    # Add mean/median lines for skewed distributions
    if not symmetric:
        if right_skew:
            mean_x = plot_area_left + plot_area_width * 0.25
            median_x = plot_area_left + plot_area_width * 0.15
        else:
            mean_x = plot_area_left + plot_area_width * 0.75
            median_x = plot_area_left + plot_area_width * 0.85
        
        # Draw mean and median lines
        draw.line([mean_x, plot_area_top, mean_x, plot_area_bottom], 
                 fill='#f59e0b', width=3)
        draw.line([median_x, plot_area_top, median_x, plot_area_bottom], 
                 fill='#059669', width=3)
        
        # Add arrow indicators
        arrow_size = 6
        # Mean arrow
        draw.polygon([
            (mean_x, plot_area_top + 5),
            (mean_x - arrow_size, plot_area_top + 5 + arrow_size),
            (mean_x + arrow_size, plot_area_top + 5 + arrow_size)
        ], fill='#f59e0b')
        
        # Median arrow
        draw.polygon([
            (median_x, plot_area_top + 5),
            (median_x - arrow_size, plot_area_top + 5 + arrow_size),
            (median_x + arrow_size, plot_area_top + 5 + arrow_size)
        ], fill='#059669')
        
        # Labels
        draw.text((mean_x, plot_area_bottom + 10), 'Mean', fill='#f59e0b', font=font_small, anchor='mm')
        draw.text((median_x, plot_area_bottom + 10), 'Median', fill='#059669', font=font_small, anchor='mm')

def draw_simple_distribution(draw, x, y, w, h, title, subtitle, color, symmetric=True, right_skew=False, heavy_tails=False):
    """Draw a simple distribution visualization"""
    font_title = get_font(24)
    font_sub = get_font(18)
    
    # Draw border
    draw.rectangle([x, y, x + w, y + h], outline='black', width=2)
    
    # Draw title
    draw.text((x + w//2, y + 20), title, fill='black', font=font_title, anchor='mm')
    
    # Draw subtitle
    subtitle_y = y + 50
    lines = subtitle.split('\n')
    for i, line in enumerate(lines):
        draw.text((x + w//2, subtitle_y + i * 25), line, fill='darkgray', font=font_sub, anchor='mm')
    
    # Draw histogram-like bars
    bar_count = 20
    bar_width = w // (bar_count + 2)
    bar_start_x = x + w // (bar_count + 2)
    bar_bottom = y + h - 60
    
    for i in range(bar_count):
        bar_x = bar_start_x + i * (w - 2 * bar_start_x) // bar_count
        
        if symmetric:
            # Bell curve shape
            center = bar_count / 2
            distance = abs(i - center)
            height_factor = max(0, 1 - (distance / center) ** 2)
            if heavy_tails:
                # Make tails heavier
                height_factor = max(0, 1 - (distance / center) ** 1.5)
        else:
            # Skewed shape
            if right_skew:
                # More bars on left, fewer on right
                height_factor = max(0, 1 - (i / bar_count) ** 1.5)
            else:
                # More bars on right, fewer on left
                height_factor = max(0, 1 - ((bar_count - i) / bar_count) ** 1.5)
        
        bar_height = int(h * 0.3 * height_factor)
        bar_y = bar_bottom - bar_height
        
        # Color gradient
        r, g, b = Image.new('RGB', (1, 1), color).getpixel((0, 0))
        draw.rectangle([bar_x, bar_y, bar_x + bar_width - 2, bar_bottom],
                      fill=color, outline='darkgray', width=1)

def shape_features_overview():
    """Shape features overview"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(48)
    font_text = get_font(26)
    
    draw.text((WIDTH//2, 60), 'Shape Features: Beyond Mean & Variance', 
              fill='black', font=font_title, anchor='mm')
    
    # Three sections
    section_width = (WIDTH - 200) // 3
    
    # Mean & Variance
    draw_info_box(draw, 100, 180, section_width, 600, 
                 'Mean & Variance', '📍 Location & 📏 Spread',
                 'skyblue', 'The mean tells where\nyour data live.\n\nThe variance tells\nhow spread out\nthey are.')
    
    # Skewness
    draw_info_box(draw, 100 + section_width + 50, 180, section_width, 600,
                 'Skewness', '🎢 Tilt or Lean\n(Asymmetry)',
                 'lightcoral', 'Mean > Median → Right skew\n\nMean < Median → Left skew\n\nMeasures direction\nand strength of tilt.')
    
    # Kurtosis
    draw_info_box(draw, 100 + 2 * (section_width + 50), 180, section_width, 600,
                 'Kurtosis', '🪶 Tail Weight\n(Extremes)',
                 'plum', 'High kurtosis → Heavy tails\n(many extremes)\n\nLow kurtosis → Light tails\n(few extremes)')
    
    img.save('public/DS-6/shape_features_overview.png', quality=100, optimize=False)
    print('Created shape_features_overview.png')

def draw_info_box(draw, x, y, w, h, title, subtitle, bg_color, text):
    """Draw an information box"""
    font_title = get_font(32)
    font_sub = get_font(24)
    font_text = get_font(22)
    
    # Background
    r, g, b = Image.new('RGB', (1, 1), bg_color).getpixel((0, 0))
    draw.rectangle([x, y, x + w, y + h], fill=bg_color, outline='black', width=3)
    
    # Title
    draw.text((x + w//2, y + 30), title, fill='black', font=font_title, anchor='mm')
    
    # Subtitle
    draw.text((x + w//2, y + 80), subtitle, fill='darkblue', font=font_sub, anchor='mm')
    
    # Text
    lines = text.split('\n')
    text_y = y + 140
    for line in lines:
        if line.strip():
            draw.text((x + w//2, text_y), line, fill='black', font=font_text, anchor='mm')
            text_y += 35

def skewness_visualization():
    """Skewness visualization"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(48)
    font_sub = get_font(28)
    
    draw.text((WIDTH//2, 60), 'Skewness: Direction and Strength of Tilt', 
              fill='black', font=font_title, anchor='mm')
    
    # Three distributions side by side
    section_width = (WIDTH - 200) // 3
    margin = 50
    
    # Right-skewed
    draw_skew_distribution(draw, margin, 180, section_width, 600,
                          '➡️ Positive Skew\n(Right)', 'Skewness > 0',
                          'lightcoral', right_skew=True)
    
    # Symmetric
    draw_skew_distribution(draw, margin + section_width + 50, 180, section_width, 600,
                          '🔁 Symmetric\n(Near Zero)', 'Skewness ≈ 0',
                          'lightblue', right_skew=False, symmetric=True)
    
    # Left-skewed
    draw_skew_distribution(draw, margin + 2 * (section_width + 50), 180, section_width, 600,
                          '⬅️ Negative Skew\n(Left)', 'Skewness < 0',
                          'lightgreen', right_skew=False, symmetric=False)
    
    img.save('public/DS-6/skewness_visualization.png', quality=100, optimize=False)
    print('Created skewness_visualization.png')

def draw_skew_distribution(draw, x, y, w, h, title, subtitle, color, right_skew=True, symmetric=False):
    """Draw a skewed distribution"""
    font_title = get_font(26)
    font_sub = get_font(20)
    
    # Border
    draw.rectangle([x, y, x + w, y + h], outline='black', width=2)
    
    # Title and subtitle
    draw.text((x + w//2, y + 30), title, fill='black', font=font_title, anchor='mm')
    draw.text((x + w//2, y + 70), subtitle, fill='darkgray', font=font_sub, anchor='mm')
    
    # Draw histogram
    bar_count = 15
    bar_width = (w - 40) // bar_count
    bar_start_x = x + 20
    bar_bottom = y + h - 40
    
    for i in range(bar_count):
        bar_x = bar_start_x + i * bar_width
        
        if symmetric:
            center = bar_count / 2
            distance = abs(i - center)
            height_factor = max(0, 1 - (distance / center) ** 2)
        else:
            if right_skew:
                # More on left
                height_factor = max(0, 1 - (i / bar_count) ** 1.2)
            else:
                # More on right
                height_factor = max(0, 1 - ((bar_count - i) / bar_count) ** 1.2)
        
        bar_height = int(h * 0.4 * height_factor)
        bar_y = bar_bottom - bar_height
        
        draw.rectangle([bar_x, bar_y, bar_x + bar_width - 2, bar_bottom],
                      fill=color, outline='darkgray', width=1)
    
    # Add arrow for tail direction
    if right_skew:
        arrow_x = bar_start_x + (bar_count - 1) * bar_width
        draw_arrow(draw, arrow_x + bar_width, bar_bottom - 20, arrow_x + bar_width + 30, bar_bottom - 20, 'red')
    elif not symmetric:
        arrow_x = bar_start_x
        draw_arrow(draw, arrow_x - 30, bar_bottom - 20, arrow_x, bar_bottom - 20, 'green')

def draw_arrow(draw, x1, y1, x2, y2, color):
    """Draw an arrow"""
    draw.line([x1, y1, x2, y2], fill=color, width=3)
    # Arrowhead
    angle = math.atan2(y2 - y1, x2 - x1)
    arrow_length = 10
    arrow_angle = math.pi / 6
    draw.line([x2, y2, 
              x2 - arrow_length * math.cos(angle - arrow_angle),
              y2 - arrow_length * math.sin(angle - arrow_angle)],
             fill=color, width=3)
    draw.line([x2, y2,
              x2 - arrow_length * math.cos(angle + arrow_angle),
              y2 - arrow_length * math.sin(angle + arrow_angle)],
             fill=color, width=3)

def kurtosis_visualization():
    """Kurtosis visualization"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(48)
    
    draw.text((WIDTH//2, 60), 'Kurtosis: Tail Weight and Extremes', 
              fill='black', font=font_title, anchor='mm')
    
    # Three distributions
    section_width = (WIDTH - 200) // 3
    
    # Light tails
    draw_kurtosis_dist(draw, 100, 180, section_width, 600,
                      '🔻 Light Tails\n(Low Kurtosis)', 'Excess Kurtosis < 0',
                      'cyan', heavy=False)
    
    # Normal tails
    draw_kurtosis_dist(draw, 100 + section_width + 50, 180, section_width, 600,
                      '⚖️ Normal Tails', 'Excess Kurtosis ≈ 0',
                      'lightblue', heavy=False, normal=True)
    
    # Heavy tails
    draw_kurtosis_dist(draw, 100 + 2 * (section_width + 50), 180, section_width, 600,
                      '🔺 Heavy Tails\n(High Kurtosis)', 'Excess Kurtosis > 0',
                      'purple', heavy=True)
    
    img.save('public/DS-6/kurtosis_visualization.png', quality=100, optimize=False)
    print('Created kurtosis_visualization.png')

def draw_kurtosis_dist(draw, x, y, w, h, title, subtitle, color, heavy=False, normal=False):
    """Draw kurtosis distribution"""
    font_title = get_font(26)
    font_sub = get_font(20)
    
    draw.rectangle([x, y, x + w, y + h], outline='black', width=2)
    draw.text((x + w//2, y + 30), title, fill='black', font=font_title, anchor='mm')
    draw.text((x + w//2, y + 70), subtitle, fill='darkgray', font=font_sub, anchor='mm')
    
    # Histogram
    bar_count = 20
    bar_width = (w - 40) // bar_count
    bar_start_x = x + 20
    bar_bottom = y + h - 40
    
    for i in range(bar_count):
        bar_x = bar_start_x + i * bar_width
        
        if normal or not heavy:
            # Normal or light tails - sharper drop
            center = bar_count / 2
            distance = abs(i - center)
            if normal:
                height_factor = max(0, 1 - (distance / center) ** 2)
            else:
                height_factor = max(0, 1 - (distance / center) ** 2.5)
        else:
            # Heavy tails - slower drop
            center = bar_count / 2
            distance = abs(i - center)
            height_factor = max(0.1, 1 - (distance / center) ** 1.2)
            if distance > center * 0.7:  # Make tails thicker
                height_factor = min(height_factor * 1.5, 0.3)
        
        bar_height = int(h * 0.4 * height_factor)
        bar_y = bar_bottom - bar_height
        
        bar_color = color
        if heavy and (i < 3 or i > bar_count - 4):
            bar_color = 'red'  # Highlight extremes
        
        draw.rectangle([bar_x, bar_y, bar_x + bar_width - 2, bar_bottom],
                      fill=bar_color, outline='darkgray', width=1)

def why_shape_matters():
    """Why shape matters"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(48)
    font_text = get_font(24)
    
    draw.text((WIDTH//2, 60), 'Why Shape Matters: Practical Implications', 
              fill='black', font=font_title, anchor='mm')
    
    # Four quadrants
    qw = (WIDTH - 150) // 2
    qh = (HEIGHT - 200) // 2
    
    # Outlier Detection
    draw_info_box(draw, 50, 150, qw - 25, qh, 
                 'Outlier Detection', 'Right-skew + Heavy tails\n→ Use Median/MAD',
                 'lightcoral', '• Classical z-score fails\n• Robust z-score works\n• Shape guides method choice')
    
    # Binning
    draw_info_box(draw, WIDTH - qw + 25, 150, qw - 25, qh,
                 'Binning & Percentiles', 'Skewed data\n→ Prefer quantile bins',
                 'skyblue', '• Equal-width bins distort\n• Quantiles preserve shape\n• Better stratification')
    
    # Modeling
    draw_info_box(draw, 50, 150 + qh + 50, qw - 25, qh,
                 'Modeling Implications', 'Shape guides transforms',
                 'lightgreen', '• Skewness → log/sqrt transforms\n• High kurtosis → robust methods\n• Better model selection')
    
    # Use Cases
    draw_info_box(draw, WIDTH - qw + 25, 150 + qh + 50, qw - 25, qh,
                 'Key Applications', 'Shape diagnostics guide:',
                 'plum', '• Feature selection\n• Outlier handling\n• Transform choices\n• Model selection')
    
    img.save('public/DS-6/why_shape_matters.png', quality=100, optimize=False)
    print('Created why_shape_matters.png')

def three_shapes_comparison():
    """Three shapes with same mean and variance"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(48)
    
    draw.text((WIDTH//2, 60), 'Three Shapes, Same Mean & Variance: Different Stories', 
              fill='black', font=font_title, anchor='mm')
    
    section_width = (WIDTH - 200) // 3
    
    # Symmetric light-tailed
    draw_shape_comparison(draw, 100, 180, section_width, 600,
                         '⚪ Symmetric\nLight-Tailed', 
                         'Skewness ≈ 0\nExcess Kurtosis < 0\nBell-shaped, few extremes',
                         'lightblue')
    
    # Symmetric heavy-tailed
    draw_shape_comparison(draw, 100 + section_width + 50, 180, section_width, 600,
                         '🟣 Symmetric\nHeavy-Tailed',
                         'Skewness ≈ 0\nExcess Kurtosis > 0\nFrequent highs and lows',
                         'purple')
    
    # Right-skewed
    draw_shape_comparison(draw, 100 + 2 * (section_width + 50), 180, section_width, 600,
                         '🟠 Right-Skewed',
                         'Skewness > 0\nExcess Kurtosis > 0\nMany small, few big',
                         'orange')
    
    img.save('public/DS-6/three_shapes_comparison.png', quality=100, optimize=False)
    print('Created three_shapes_comparison.png')

def draw_shape_comparison(draw, x, y, w, h, title, subtitle, color):
    """Draw shape comparison"""
    font_title = get_font(28)
    font_sub = get_font(20)
    
    draw.rectangle([x, y, x + w, y + h], outline='black', width=2)
    draw.text((x + w//2, y + 30), title, fill='black', font=font_title, anchor='mm')
    
    lines = subtitle.split('\n')
    for i, line in enumerate(lines):
        draw.text((x + w//2, y + 80 + i * 25), line, fill='darkgray', font=font_sub, anchor='mm')
    
    # Draw distribution
    bar_count = 18
    bar_width = (w - 40) // bar_count
    bar_start_x = x + 20
    bar_bottom = y + h - 40
    
    for i in range(bar_count):
        bar_x = bar_start_x + i * bar_width
        center = bar_count / 2
        
        if 'Symmetric' in title:
            if 'Light' in title:
                # Sharp drop
                distance = abs(i - center)
                height_factor = max(0, 1 - (distance / center) ** 2.5)
            else:
                # Heavy tails
                distance = abs(i - center)
                height_factor = max(0.15, 1 - (distance / center) ** 1.3)
        else:
            # Right-skewed
            height_factor = max(0, 1 - (i / bar_count) ** 1.2)
        
        bar_height = int(h * 0.45 * height_factor)
        bar_y = bar_bottom - bar_height
        
        draw.rectangle([bar_x, bar_y, bar_x + bar_width - 2, bar_bottom],
                      fill=color, outline='darkgray', width=1)

def histogram_cheat_sheet():
    """Histogram cheat sheet"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(48)
    
    draw.text((WIDTH//2, 60), 'Histogram Cheat Sheet: Visual Cues', 
              fill='black', font=font_title, anchor='mm')
    
    # Four quadrants
    qw = (WIDTH - 150) // 2
    qh = (HEIGHT - 200) // 2
    
    # Positive skew
    draw_hist_example(draw, 50, 150, qw - 25, qh,
                     '➡️ Positive Skew\n(Right)', 'Tail longer on right',
                     'lightcoral', right_skew=True)
    
    # Negative skew
    draw_hist_example(draw, WIDTH - qw + 25, 150, qw - 25, qh,
                     '⬅️ Negative Skew\n(Left)', 'Tail longer on left',
                     'lightgreen', right_skew=False)
    
    # High kurtosis
    draw_hist_example(draw, 50, 150 + qh + 50, qw - 25, qh,
                     '🦘 High Kurtosis\n(Fat Tails)', 'Heavy extremes',
                     'purple', kurtosis_high=True)
    
    # Low kurtosis
    draw_hist_example(draw, WIDTH - qw + 25, 150 + qh + 50, qw - 25, qh,
                     '🍞 Low Kurtosis\n(Slim Tails)', 'Few extremes',
                     'cyan', kurtosis_high=False)
    
    img.save('public/DS-6/histogram_cheat_sheet.png', quality=100, optimize=False)
    print('Created histogram_cheat_sheet.png')

def draw_hist_example(draw, x, y, w, h, title, subtitle, color, right_skew=None, kurtosis_high=None):
    """Draw histogram example"""
    font_title = get_font(26)
    font_sub = get_font(20)
    
    draw.rectangle([x, y, x + w, y + h], outline='black', width=2)
    draw.text((x + w//2, y + 25), title, fill='black', font=font_title, anchor='mm')
    draw.text((x + w//2, y + 60), subtitle, fill='darkgray', font=font_sub, anchor='mm')
    
    # Histogram
    bar_count = 15
    bar_width = (w - 40) // bar_count
    bar_start_x = x + 20
    bar_bottom = y + h - 40
    
    for i in range(bar_count):
        bar_x = bar_start_x + i * bar_width
        
        if right_skew is not None:
            if right_skew:
                height_factor = max(0, 1 - (i / bar_count) ** 1.2)
            else:
                height_factor = max(0, 1 - ((bar_count - i) / bar_count) ** 1.2)
        else:
            center = bar_count / 2
            distance = abs(i - center)
            if kurtosis_high:
                height_factor = max(0.2, 1 - (distance / center) ** 1.2)
            else:
                height_factor = max(0, 1 - (distance / center) ** 3)
        
        bar_height = int(h * 0.4 * height_factor)
        bar_y = bar_bottom - bar_height
        
        bar_color = color
        if kurtosis_high and (i < 2 or i > bar_count - 3):
            bar_color = 'red'
        
        draw.rectangle([bar_x, bar_y, bar_x + bar_width - 2, bar_bottom],
                      fill=bar_color, outline='darkgray', width=1)

def typical_ranges():
    """Typical ranges"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(48)
    font_text = get_font(24)
    
    draw.text((WIDTH//2, 60), 'Typical Ranges: Quick Reference', 
              fill='black', font=font_title, anchor='mm')
    
    # Two sections
    section_width = (WIDTH - 150) // 2
    
    # Skewness
    draw.text((section_width // 2, 150), 'Skewness', 
              fill='black', font=get_font(36), anchor='mm')
    
    skew_ranges = [
        ('|skew| < 0.5', 'roughly symmetric', 'lightblue'),
        ('0.5 - 1.0', 'mild skew', 'yellow'),
        ('|skew| > 1.0', 'strong skew', 'orange'),
    ]
    
    y_pos = 220
    for range_val, desc, color in skew_ranges:
        r, g, b = Image.new('RGB', (1, 1), color).getpixel((0, 0))
        draw.rectangle([50, y_pos - 20, section_width - 50, y_pos + 40],
                      fill=color, outline='black', width=2)
        draw.text((section_width // 2, y_pos), f'{range_val}\n{desc}', 
                 fill='black', font=font_text, anchor='mm')
        y_pos += 90
    
    # Excess Kurtosis
    draw.text((section_width + section_width // 2, 150), 'Excess Kurtosis', 
              fill='black', font=get_font(36), anchor='mm')
    
    kurt_ranges = [
        ('< 0', 'lighter tails than Normal', 'cyan'),
        ('≈ 0', 'about Normal', 'lightblue'),
        ('> 0', 'heavier tails than Normal', 'purple'),
    ]
    
    y_pos = 220
    for range_val, desc, color in kurt_ranges:
        r, g, b = Image.new('RGB', (1, 1), color).getpixel((0, 0))
        draw.rectangle([section_width + 50, y_pos - 20, WIDTH - 50, y_pos + 40],
                      fill=color, outline='black', width=2)
        draw.text((section_width + section_width // 2, y_pos), f'{range_val}\n{desc}', 
                 fill='black', font=font_text, anchor='mm')
        y_pos += 90
    
    # Footer
    draw.text((WIDTH//2, HEIGHT - 60), 'Use these as guides, not laws. Context is king. 👑', 
              fill='darkgray', font=get_font(22), anchor='mm')
    
    img.save('public/DS-6/typical_ranges.png', quality=100, optimize=False)
    print('Created typical_ranges.png')

def tiny_examples():
    """Tiny examples"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(48)
    font_text = get_font(28)
    
    draw.text((WIDTH//2, 60), 'Tiny Examples: Same Spread, Different Story', 
              fill='black', font=font_title, anchor='mm')
    
    # Two examples side by side
    section_width = (WIDTH - 150) // 2
    
    # Right-skewed
    data1 = [1, 1, 2, 2, 3, 4, 10]
    mean1 = sum(data1) / len(data1)
    median1 = sorted(data1)[len(data1)//2]
    
    draw_example(draw, 75, 180, section_width - 25, 600,
                'Right-Skewed: [1, 1, 2, 2, 3, 4, 10]',
                f'Mean ({mean1:.2f}) > Median ({median1:.1f}) → skew > 0',
                data1, 'lightcoral')
    
    # Heavy tails
    data2 = [-10, -2, -1, 0, 1, 2, 10]
    mean2 = sum(data2) / len(data2)
    
    draw_example(draw, WIDTH - section_width + 50, 180, section_width - 25, 600,
                'Heavy Tails: [-10, -2, -1, 0, 1, 2, 10]',
                'More extremes → high kurtosis',
                data2, 'purple')
    
    img.save('public/DS-6/tiny_examples.png', quality=100, optimize=False)
    print('Created tiny_examples.png')

def draw_example(draw, x, y, w, h, title, subtitle, data, color):
    """Draw a tiny example"""
    font_title = get_font(26)
    font_sub = get_font(20)
    
    draw.rectangle([x, y, x + w, y + h], outline='black', width=2)
    draw.text((x + w//2, y + 30), title, fill='black', font=font_title, anchor='mm')
    draw.text((x + w//2, y + 70), subtitle, fill='darkgray', font=font_sub, anchor='mm')
    
    # Draw bars
    max_val = max(abs(min(data)), max(data))
    bar_width = (w - 100) // len(data)
    bar_start_x = x + 50
    bar_bottom = y + h - 100
    
    for i, val in enumerate(data):
        bar_x = bar_start_x + i * bar_width
        bar_height = abs(val) * (h - 200) / max_val if max_val > 0 else 0
        bar_y = bar_bottom - bar_height
        
        draw.rectangle([bar_x, bar_y, bar_x + bar_width - 5, bar_bottom],
                      fill=color, outline='black', width=2)
        draw.text((bar_x + bar_width//2, bar_bottom + 10), str(val),
                 fill='black', font=get_font(18), anchor='mm')

def after_measuring_shape():
    """After measuring shape"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(48)
    
    draw.text((WIDTH//2, 60), 'After Measuring Shape: Next Steps', 
              fill='black', font=font_title, anchor='mm')
    
    # Four sections
    qw = (WIDTH - 150) // 2
    qh = (HEIGHT - 200) // 2
    
    draw_info_box(draw, 50, 150, qw - 25, qh,
                 'If Skewed', 'Use log/sqrt transforms\n(for positive data)',
                 'lightcoral', '• Stabilize variance\n• Normalize distribution\n• Improve model fit')
    
    draw_info_box(draw, WIDTH - qw + 25, 150, qw - 25, qh,
                 'Heavy Tails', 'Relax outlier cutoffs\nor use percentiles',
                 'purple', '• Use 5th/95th percentiles\n• Adjust thresholds\n• Expect extremes')
    
    draw_info_box(draw, 50, 150 + qh + 50, qw - 25, qh,
                 'Robust Methods', 'Use Median/MAD, quantile loss',
                 'lightgreen', '• Median/MAD stability\n• Quantile regressions\n• Resist distortion')
    
    draw_info_box(draw, WIDTH - qw + 25, 150 + qh + 50, qw - 25, qh,
                 'Re-check', 'After cleaning/transforming',
                 'skyblue', '• Shape diagnostics guide workflow\n• Re-evaluate after changes\n• Continuous monitoring')
    
    img.save('public/DS-6/after_measuring_shape.png', quality=100, optimize=False)
    print('Created after_measuring_shape.png')

def visual_ideas():
    """Visual ideas"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(48)
    
    draw.text((WIDTH//2, 60), 'Visual Ideas: Three Histograms Side by Side', 
              fill='black', font=font_title, anchor='mm')
    
    section_width = (WIDTH - 200) // 3
    
    # Symmetric light-tailed
    draw_shape_comparison(draw, 100, 180, section_width, 600,
                         '1️⃣ Symmetric\nLight-Tailed', 
                         'Skewness ≈ 0\nKurtosis ↓',
                         'lightblue')
    
    # Symmetric heavy-tailed
    draw_shape_comparison(draw, 100 + section_width + 50, 180, section_width, 600,
                         '2️⃣ Symmetric\nHeavy-Tailed',
                         'Skewness ≈ 0\nKurtosis ↑',
                         'purple')
    
    # Right-skewed
    draw_shape_comparison(draw, 100 + 2 * (section_width + 50), 180, section_width, 600,
                         '3️⃣ Right-Skewed',
                         'Skewness > 0\nLong tail →',
                         'orange')
    
    img.save('public/DS-6/visual_ideas.png', quality=100, optimize=False)
    print('Created visual_ideas.png')

def shape_checklist():
    """Shape checklist"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(48)
    font_text = get_font(32)
    
    draw.text((WIDTH//2, 60), 'Shape Checklist', 
              fill='black', font=font_title, anchor='mm')
    
    checklist_items = [
        '☑️ Compute skewness & kurtosis for key features',
        '☑️ Visualize histograms or ECDFs',
        '☑️ If |skew| > 0.5 → transform or use robust methods',
        '☑️ If excess kurtosis > 0 → expect extremes and adjust thresholds',
        '☑️ Re-evaluate after cleaning',
    ]
    
    y_start = 200
    y_spacing = 90
    
    for i, item in enumerate(checklist_items):
        y_pos = y_start + i * y_spacing
        color = ['blue', 'green', 'orange', 'purple', 'red'][i]
        
        r, g, b = Image.new('RGB', (1, 1), 'lightyellow').getpixel((0, 0))
        draw.rectangle([100, y_pos - 25, WIDTH - 100, y_pos + 45],
                      fill='lightyellow', outline=color, width=3)
        draw.text((WIDTH//2, y_pos), item, fill='black', font=font_text, anchor='mm')
    
    # Summary
    summary = 'Remember: Shape matters. Once you see it, you can\'t unsee it. 🎨📊'
    draw.text((WIDTH//2, HEIGHT - 80), summary, 
             fill='darkblue', font=get_font(26), anchor='mm',
             bbox=dict(boxstyle='round', facecolor='lightyellow', pad=10))
    
    img.save('public/DS-6/shape_checklist.png', quality=100, optimize=False)
    print('Created shape_checklist.png')

# Run all functions
if __name__ == '__main__':
    print('Creating DS-6 images...')
    skewness_kurtosis_concept()
    shape_features_overview()
    skewness_visualization()
    kurtosis_visualization()
    why_shape_matters()
    three_shapes_comparison()
    histogram_cheat_sheet()
    typical_ranges()
    tiny_examples()
    after_measuring_shape()
    visual_ideas()
    shape_checklist()
    print('All DS-6 images created successfully!')

