"""
High-quality placeholder images for DS-7 using PIL/Pillow
Boxplots, IQR, and Tukey Fences visualizations
"""
try:
    from PIL import Image, ImageDraw, ImageFont
    import os
    import math
except ImportError:
    print("PIL/Pillow not found. Install with: pip install Pillow")
    exit(1)

# Create DS-7 directory if it doesn't exist
os.makedirs('public/DS-7', exist_ok=True)

# Image dimensions - wider for better readability
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

def boxplot_anatomy():
    """Boxplot anatomy with detailed labels"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(48)
    font_label = get_font(28)
    font_small = get_font(22)
    
    # Title
    draw.rectangle([0, 0, WIDTH, 100], fill='#1e3a5f', outline='#0f172a', width=2)
    draw.text((WIDTH//2, 50), 'The Anatomy of a Boxplot', 
              fill='white', font=font_title, anchor='mm')
    
    # Draw boxplot diagram
    center_x = WIDTH // 2
    box_y = 200
    box_height = 300
    box_width = 100
    
    # Box (Q1 to Q3)
    q1_y = box_y + 150
    q3_y = box_y + 50
    median_y = box_y + 100
    
    # Draw box
    draw.rectangle([center_x - box_width//2, q3_y, center_x + box_width//2, q1_y],
                  fill='lightblue', outline='black', width=3)
    
    # Median line
    draw.line([center_x - box_width//2, median_y, center_x + box_width//2, median_y],
             fill='red', width=4)
    
    # Whiskers
    whisker_top = box_y
    whisker_bottom = box_y + box_height
    draw.line([center_x, q3_y, center_x, whisker_top], fill='green', width=3)
    draw.line([center_x, q1_y, center_x, whisker_bottom], fill='green', width=3)
    
    # Caps
    cap_width = 30
    draw.line([center_x - cap_width//2, whisker_top, center_x + cap_width//2, whisker_top],
             fill='green', width=3)
    draw.line([center_x - cap_width//2, whisker_bottom, center_x + cap_width//2, whisker_bottom],
             fill='green', width=3)
    
    # Outliers
    outlier_y = box_y - 50
    draw.ellipse([center_x - 15, outlier_y - 15, center_x + 15, outlier_y + 15],
                fill='red', outline='black', width=2)
    draw.ellipse([center_x - 15, outlier_y - 80, center_x + 15, outlier_y - 50],
                fill='red', outline='black', width=2)
    
    # Labels
    label_x = center_x + box_width//2 + 40
    draw.text((label_x, q3_y), 'Q₃ (75th percentile)', fill='black', font=font_label)
    draw.text((label_x, median_y - 10), 'Median (Q₂)', fill='red', font=font_label)
    draw.text((label_x, q1_y), 'Q₁ (25th percentile)', fill='black', font=font_label)
    draw.text((label_x, whisker_top - 10), 'Upper Fence', fill='blue', font=font_label)
    draw.text((label_x, whisker_bottom - 10), 'Lower Fence', fill='blue', font=font_label)
    draw.text((label_x, outlier_y - 10), 'Outliers (•)', fill='red', font=font_label)
    
    # Box label
    draw.text((center_x, (q1_y + q3_y)//2), 'Box (Q₁ → Q₃)', 
             fill='black', font=font_small, anchor='mm')
    
    # ASCII representation
    ascii_y = box_y + box_height + 80
    ascii_text = """     *       *        <- Outliers
 |-------------------|  <- Fences
     |-----------|       <- Box (Q1–Q3)
         |               <- Median"""
    draw.text((WIDTH//2, ascii_y), ascii_text, fill='#333', font=font_small, anchor='mm')
    
    img.save('public/DS-7/boxplot_anatomy.png', quality=100, optimize=False)
    print('Created boxplot_anatomy.png')

def step_by_step_example():
    """Step-by-step example visualization"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(44)
    font_step = get_font(32)
    font_text = get_font(24)
    
    # Title
    draw.rectangle([0, 0, WIDTH, 90], fill='#1e3a5f', outline='#0f172a', width=2)
    draw.text((WIDTH//2, 45), 'Step-by-Step: Building a Boxplot with Tukey Fences', 
              fill='white', font=font_title, anchor='mm')
    
    # Dataset
    data = [3, 4, 5, 6, 7, 8, 9, 15, 30]
    q1, q2, q3 = 4.5, 7, 9
    iqr = 4.5
    lower_fence = -2.25
    upper_fence = 15.75
    
    y_start = 120
    step_height = 150
    
    # Step 1-2: Quartiles
    step_y = y_start
    draw.rectangle([40, step_y, WIDTH - 40, step_y + step_height], 
                  fill='#f0f9ff', outline='#1e3a5f', width=2)
    draw.text((60, step_y + 20), 'Step 1-2: Find Quartiles', 
             fill='#1e3a5f', font=font_step)
    draw.text((60, step_y + 60), f'Q₁ = {q1}, Q₂ (Median) = {q2}, Q₃ = {q3}', 
             fill='black', font=font_text)
    
    # Step 3: IQR
    step_y += step_height + 20
    draw.rectangle([40, step_y, WIDTH - 40, step_y + step_height], 
                  fill='#fef3c7', outline='#1e3a5f', width=2)
    draw.text((60, step_y + 20), 'Step 3: Compute IQR', 
             fill='#1e3a5f', font=font_step)
    draw.text((60, step_y + 60), f'IQR = Q₃ - Q₁ = {q3} - {q1} = {iqr}', 
             fill='black', font=font_text)
    
    # Step 4: Fences
    step_y += step_height + 20
    draw.rectangle([40, step_y, WIDTH - 40, step_y + step_height], 
                  fill='#dbeafe', outline='#1e3a5f', width=2)
    draw.text((60, step_y + 20), 'Step 4: Compute Tukey Fences', 
             fill='#1e3a5f', font=font_step)
    draw.text((60, step_y + 60), f'Lower Fence = {q1} - 1.5 × {iqr} = {lower_fence}', 
             fill='black', font=font_text)
    draw.text((60, step_y + 90), f'Upper Fence = {q3} + 1.5 × {iqr} = {upper_fence}', 
             fill='black', font=font_text)
    
    # Step 5: Outliers
    step_y += step_height + 20
    draw.rectangle([40, step_y, WIDTH - 40, step_y + step_height], 
                  fill='#fee2e2', outline='#1e3a5f', width=2)
    draw.text((60, step_y + 20), 'Step 5: Identify Outliers', 
             fill='#1e3a5f', font=font_step)
    draw.text((60, step_y + 60), f'30 > {upper_fence} → 30 is an OUTLIER!', 
             fill='red', font=font_text)
    
    img.save('public/DS-7/step_by_step_example.png', quality=100, optimize=False)
    print('Created step_by_step_example.png')

def fence_variants():
    """Mild vs Extreme Fences visualization"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(44)
    font_subtitle = get_font(32)
    font_text = get_font(24)
    
    # Title
    draw.rectangle([0, 0, WIDTH, 90], fill='#1e3a5f', outline='#0f172a', width=2)
    draw.text((WIDTH//2, 45), 'Mild vs Extreme Fences: Two Layers of Scrutiny', 
              fill='white', font=font_title, anchor='mm')
    
    # Left panel: Mild outliers
    left_x = 60
    panel_width = (WIDTH - 180) // 2
    panel_height = HEIGHT - 150
    panel_y = 120
    
    draw.rectangle([left_x, panel_y, left_x + panel_width, panel_y + panel_height],
                  fill='#fff7ed', outline='#1e3a5f', width=3)
    draw.text((left_x + panel_width//2, panel_y + 30), 'Mild Outliers: 1.5 × IQR',
             fill='#1e3a5f', font=font_subtitle, anchor='mm')
    
    # Draw boxplot for mild
    box_x = left_x + panel_width//2
    box_y = panel_y + 120
    draw.rectangle([box_x - 50, box_y, box_x + 50, box_y + 200],
                  fill='lightblue', outline='black', width=2)
    draw.line([box_x - 50, box_y + 100, box_x + 50, box_y + 100],
             fill='red', width=3)
    
    # Mild outlier
    outlier_y = box_y - 60
    draw.ellipse([box_x - 20, outlier_y - 20, box_x + 20, outlier_y + 20],
                fill='orange', outline='black', width=2)
    draw.text((box_x, outlier_y - 50), 'Mild Outlier (○)', 
             fill='orange', font=font_text, anchor='mm')
    draw.text((box_x, box_y + 250), 'Inner Fence = Q₁ - 1.5×IQR', 
             fill='black', font=font_text, anchor='mm')
    
    # Right panel: Extreme outliers
    right_x = left_x + panel_width + 60
    draw.rectangle([right_x, panel_y, right_x + panel_width, panel_y + panel_height],
                  fill='#fef2f2', outline='#1e3a5f', width=3)
    draw.text((right_x + panel_width//2, panel_y + 30), 'Extreme Outliers: 3 × IQR',
             fill='#1e3a5f', font=font_subtitle, anchor='mm')
    
    # Draw boxplot for extreme
    box_x2 = right_x + panel_width//2
    draw.rectangle([box_x2 - 50, box_y, box_x2 + 50, box_y + 200],
                  fill='lightblue', outline='black', width=2)
    draw.line([box_x2 - 50, box_y + 100, box_x2 + 50, box_y + 100],
             fill='red', width=3)
    
    # Extreme outlier
    draw.polygon([(box_x2, outlier_y - 30), (box_x2 - 25, outlier_y + 10), 
                 (box_x2 + 25, outlier_y + 10)], fill='red', outline='black', width=2)
    draw.text((box_x2, outlier_y - 60), 'Extreme Outlier (★)', 
             fill='red', font=font_text, anchor='mm')
    draw.text((box_x2, box_y + 250), 'Outer Fence = Q₁ - 3×IQR', 
             fill='black', font=font_text, anchor='mm')
    
    # Table
    table_y = panel_y + panel_height - 200
    table_data = [
        ['Fence Type', 'k-value', 'Meaning', 'Symbol'],
        ['Inner Fence', '1.5 × IQR', 'Mild outlier', '○ open circle'],
        ['Outer Fence', '3 × IQR', 'Extreme outlier', '★ star']
    ]
    
    cell_width = panel_width // 4
    for i, row in enumerate(table_data):
        for j, cell in enumerate(row):
            x = left_x + j * cell_width
            y = table_y + i * 40
            fill_color = '#1e3a5f' if i == 0 else 'white'
            text_color = 'white' if i == 0 else 'black'
            draw.rectangle([x, y, x + cell_width, y + 40],
                          fill=fill_color, outline='black', width=1)
            draw.text((x + cell_width//2, y + 20), cell,
                     fill=text_color, font=font_text, anchor='mm')
    
    img.save('public/DS-7/fence_variants.png', quality=100, optimize=False)
    print('Created fence_variants.png')

def iqr_robustness():
    """IQR Robustness visualization"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(44)
    font_subtitle = get_font(32)
    font_text = get_font(24)
    
    # Title
    draw.rectangle([0, 0, WIDTH, 90], fill='#1e3a5f', outline='#0f172a', width=2)
    draw.text((WIDTH//2, 45), 'Why IQR Is Robust: Focuses on the Calm Middle', 
              fill='white', font=font_title, anchor='mm')
    
    # Top section: Comparison
    top_y = 120
    section_height = 400
    
    # IQR stays stable
    draw.rectangle([60, top_y, WIDTH//2 - 30, top_y + section_height],
                  fill='#d1fae5', outline='#1e3a5f', width=2)
    draw.text((WIDTH//4, top_y + 30), 'IQR: Stable & Robust',
             fill='#1e3a5f', font=font_subtitle, anchor='mm')
    draw.text((WIDTH//4, top_y + 80), '• Only looks at middle 50%',
             fill='black', font=font_text, anchor='mm')
    draw.text((WIDTH//4, top_y + 120), '• Resistant to outliers',
             fill='black', font=font_text, anchor='mm')
    draw.text((WIDTH//4, top_y + 160), '• Focuses on calm middle',
             fill='black', font=font_text, anchor='mm')
    
    # Visual: IQR box
    box_x = WIDTH//4
    box_y_vis = top_y + 220
    draw.rectangle([box_x - 80, box_y_vis, box_x + 80, box_y_vis + 150],
                  fill='lightgreen', outline='black', width=3)
    draw.text((box_x, box_y_vis + 75), 'IQR\n(Middle 50%)',
             fill='black', font=font_text, anchor='mm')
    
    # SD gets inflated
    draw.rectangle([WIDTH//2 + 30, top_y, WIDTH - 60, top_y + section_height],
                  fill='#fee2e2', outline='#1e3a5f', width=2)
    draw.text((3*WIDTH//4, top_y + 30), 'SD: Sensitive to Outliers',
             fill='#1e3a5f', font=font_subtitle, anchor='mm')
    draw.text((3*WIDTH//4, top_y + 80), '• Squares every deviation',
             fill='black', font=font_text, anchor='mm')
    draw.text((3*WIDTH//4, top_y + 120), '• Magnifies extremes',
             fill='black', font=font_text, anchor='mm')
    draw.text((3*WIDTH//4, top_y + 160), '• Gets distorted by outliers',
             fill='black', font=font_text, anchor='mm')
    
    # Visual: SD range (wider)
    box_x2 = 3*WIDTH//4
    draw.rectangle([box_x2 - 150, box_y_vis, box_x2 + 150, box_y_vis + 150],
                  fill='lightcoral', outline='black', width=3)
    draw.text((box_x2, box_y_vis + 75), 'SD\n(Inflated)',
             fill='black', font=font_text, anchor='mm')
    
    # Bottom section: Key insight
    bottom_y = top_y + section_height + 40
    draw.rectangle([60, bottom_y, WIDTH - 60, bottom_y + 200],
                  fill='#fef3c7', outline='#1e3a5f', width=3)
    draw.text((WIDTH//2, bottom_y + 40), 'Key Insight',
             fill='#1e3a5f', font=font_subtitle, anchor='mm')
    draw.text((WIDTH//2, bottom_y + 100), 
             'If one value shoots off to ∞, IQR barely moves.',
             fill='black', font=font_text, anchor='mm')
    draw.text((WIDTH//2, bottom_y + 140),
             'IQR + Tukey fences focus on the calm middle, not the noisy edges.',
             fill='black', font=font_text, anchor='mm')
    
    img.save('public/DS-7/iqr_robustness.png', quality=100, optimize=False)
    print('Created iqr_robustness.png')

def data_science_connections():
    """Data Science Connections visualization"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(44)
    font_subtitle = get_font(32)
    font_text = get_font(26)
    
    # Title
    draw.rectangle([0, 0, WIDTH, 90], fill='#1e3a5f', outline='#0f172a', width=2)
    draw.text((WIDTH//2, 45), 'How Boxplot Fences Connect to Data Science', 
              fill='white', font=font_title, anchor='mm')
    
    # Content boxes
    y_start = 120
    box_height = 140
    spacing = 30
    
    connections = [
        ('1. iqr_outliers Functions', 
         'Python/R libraries use 1.5×IQR rule\nQuick outlier detection baseline',
         '#dbeafe'),
        ('2. Feature Capping/Winsorizing',
         'Cap values at 1.5× or 3× IQR\nReduces impact of extremes\nCommon in preprocessing pipelines',
         '#fef3c7'),
        ('3. Anomaly Detection',
         'IQR acts as simple baseline score\nFast and interpretable\nNo assumptions about distribution',
         '#d1fae5'),
        ('4. EDA (Exploratory Data Analysis)',
         'Visual outlier identification\nFirst step in data cleaning\nBuilt into every boxplot',
         '#fee2e2')
    ]
    
    for i, (title, desc, color) in enumerate(connections):
        y = y_start + i * (box_height + spacing)
        draw.rectangle([60, y, WIDTH - 60, y + box_height],
                      fill=color, outline='#1e3a5f', width=2)
        draw.text((80, y + 25), title, fill='#1e3a5f', font=font_subtitle)
        
        # Multi-line description
        lines = desc.split('\n')
        for j, line in enumerate(lines):
            draw.text((80, y + 70 + j * 25), line, fill='black', font=font_text)
    
    # Bottom highlight
    bottom_y = y_start + len(connections) * (box_height + spacing) + 30
    draw.rectangle([60, bottom_y, WIDTH - 60, bottom_y + 100],
                  fill='#1e3a5f', outline='#0f172a', width=2)
    draw.text((WIDTH//2, bottom_y + 50),
             'Key Advantage: Nonparametric, robust, visual, and explainable!',
             fill='white', font=font_subtitle, anchor='mm')
    
    img.save('public/DS-7/data_science_connections.png', quality=100, optimize=False)
    print('Created data_science_connections.png')

def boxplot_examples():
    """Boxplot Examples: Symmetric vs Skewed"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(44)
    font_subtitle = get_font(32)
    font_text = get_font(24)
    
    # Title
    draw.rectangle([0, 0, WIDTH, 90], fill='#1e3a5f', outline='#0f172a', width=2)
    draw.text((WIDTH//2, 45), 'Boxplot Examples: Symmetric vs Skewed Data', 
              fill='white', font=font_title, anchor='mm')
    
    # Left: Symmetric
    left_x = 60
    panel_width = (WIDTH - 180) // 2
    panel_height = HEIGHT - 150
    panel_y = 120
    
    draw.rectangle([left_x, panel_y, left_x + panel_width, panel_y + panel_height],
                  fill='#f0f9ff', outline='#1e3a5f', width=3)
    draw.text((left_x + panel_width//2, panel_y + 30), 'Symmetric Data → Balanced Box',
             fill='#1e3a5f', font=font_subtitle, anchor='mm')
    
    # Draw symmetric boxplot
    box_x = left_x + panel_width//2
    box_y = panel_y + 150
    box_height = 300
    
    # Symmetric box (centered)
    q1_y = box_y + 100
    q3_y = box_y
    median_y = box_y + 50
    
    draw.rectangle([box_x - 60, q3_y, box_x + 60, q1_y],
                  fill='lightblue', outline='black', width=3)
    draw.line([box_x - 60, median_y, box_x + 60, median_y],
             fill='red', width=4)
    
    # Equal whiskers
    draw.line([box_x, q3_y, box_x, box_y - 80], fill='green', width=3)
    draw.line([box_x, q1_y, box_x, box_y + box_height - 80], fill='green', width=3)
    
    draw.text((box_x, box_y + box_height - 40), 
             'Median near center\nEqual whiskers',
             fill='black', font=font_text, anchor='mm')
    
    # Right: Right-skewed
    right_x = left_x + panel_width + 60
    draw.rectangle([right_x, panel_y, right_x + panel_width, panel_y + panel_height],
                  fill='#fff7ed', outline='#1e3a5f', width=3)
    draw.text((right_x + panel_width//2, panel_y + 30), 
             'Right-Skewed Data → Longer Upper Whisker',
             fill='#1e3a5f', font=font_subtitle, anchor='mm')
    
    # Draw skewed boxplot
    box_x2 = right_x + panel_width//2
    
    # Skewed box (median left of center)
    q1_y2 = box_y + 80
    q3_y2 = box_y - 20
    median_y2 = box_y + 20
    
    draw.rectangle([box_x2 - 60, q3_y2, box_x2 + 60, q1_y2],
                  fill='lightcoral', outline='black', width=3)
    draw.line([box_x2 - 60, median_y2, box_x2 + 60, median_y2],
             fill='red', width=4)
    
    # Unequal whiskers (longer upper)
    draw.line([box_x2, q3_y2, box_x2, box_y - 150], fill='green', width=3)  # Long upper
    draw.line([box_x2, q1_y2, box_x2, box_y + box_height - 120], fill='green', width=3)  # Shorter lower
    
    # Outlier on right
    draw.ellipse([box_x2 - 15, box_y - 180, box_x2 + 15, box_y - 150],
                fill='red', outline='black', width=2)
    
    draw.text((box_x2, box_y + box_height - 40),
             'Median left of center\nLong upper whisker\nOutliers on right',
             fill='black', font=font_text, anchor='mm')
    
    img.save('public/DS-7/boxplot_examples.png', quality=100, optimize=False)
    print('Created boxplot_examples.png')

def mini_exercise():
    """Mini Exercise Solution"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color='white')
    draw = ImageDraw.Draw(img)
    font_title = get_font(44)
    font_subtitle = get_font(32)
    font_text = get_font(26)
    font_small = get_font(22)
    
    # Title
    draw.rectangle([0, 0, WIDTH, 90], fill='#1e3a5f', outline='#0f172a', width=2)
    draw.text((WIDTH//2, 45), 'Mini Exercise Solution: Identifying Outliers', 
              fill='white', font=font_title, anchor='mm')
    
    # Dataset
    data = [5, 7, 8, 9, 10, 10, 11, 12, 14, 25]
    q1, q2, q3 = 8, 10, 11.5
    iqr = 3.5
    mild_upper = 16.75
    extreme_upper = 22
    
    # Top section: Calculations
    top_y = 120
    calc_height = 280
    
    draw.rectangle([60, top_y, WIDTH - 60, top_y + calc_height],
                  fill='#f0f9ff', outline='#1e3a5f', width=2)
    draw.text((WIDTH//2, top_y + 30), 'Dataset: [5, 7, 8, 9, 10, 10, 11, 12, 14, 25]',
             fill='#1e3a5f', font=font_subtitle, anchor='mm')
    
    calc_text = f"""Step 1: Find Q₁, Q₂, Q₃ and IQR
Q₁ = {q1}, Q₂ (Median) = {q2}, Q₃ = {q3}
IQR = Q₃ - Q₁ = {q3} - {q1} = {iqr}

Step 2: Compute fences for k = 1.5 and 3
Upper Fence (1.5×IQR) = Q₃ + 1.5×IQR = {q3} + 1.5×{iqr} = {mild_upper}
Upper Fence (3×IQR) = Q₃ + 3×IQR = {q3} + 3×{iqr} = {extreme_upper}

Step 3: Identify outliers
25 > {mild_upper} → 25 is an OUTLIER!"""
    
    draw.text((80, top_y + 80), calc_text, fill='black', font=font_text)
    
    # Bottom section: Visual
    bottom_y = top_y + calc_height + 40
    vis_height = HEIGHT - bottom_y - 40
    
    draw.rectangle([60, bottom_y, WIDTH - 60, bottom_y + vis_height],
                  fill='#fef3c7', outline='#1e3a5f', width=2)
    draw.text((WIDTH//2, bottom_y + 30), 'Solution: 25 is outside both fences → Outlier!',
             fill='#1e3a5f', font=font_subtitle, anchor='mm')
    
    # Draw boxplot
    box_x = WIDTH // 2
    box_y_vis = bottom_y + 120
    box_height_vis = 250
    
    q1_y_vis = box_y_vis + 100
    q3_y_vis = box_y_vis + 30
    median_y_vis = box_y_vis + 65
    
    draw.rectangle([box_x - 60, q3_y_vis, box_x + 60, q1_y_vis],
                  fill='lightblue', outline='black', width=3)
    draw.line([box_x - 60, median_y_vis, box_x + 60, median_y_vis],
             fill='red', width=4)
    
    # Fences
    fence_y = box_y_vis - 40
    draw.line([box_x - 100, fence_y, box_x + 100, fence_y],
             fill='orange', width=2)
    draw.text((box_x + 120, fence_y), f'1.5×IQR = {mild_upper}',
             fill='orange', font=font_small, anchor='lm')
    
    fence_y2 = box_y_vis - 80
    draw.line([box_x - 100, fence_y2, box_x + 100, fence_y2],
             fill='purple', width=2)
    draw.text((box_x + 120, fence_y2), f'3×IQR = {extreme_upper}',
             fill='purple', font=font_small, anchor='lm')
    
    # Outlier
    outlier_y = box_y_vis - 120
    draw.polygon([(box_x, outlier_y - 30), (box_x - 25, outlier_y + 10),
                 (box_x + 25, outlier_y + 10)], fill='red', outline='black', width=2)
    draw.text((box_x, outlier_y - 50), '25',
             fill='red', font=font_text, anchor='mm')
    draw.text((box_x, outlier_y - 80), 'OUTLIER!',
             fill='red', font=font_subtitle, anchor='mm')
    
    img.save('public/DS-7/mini_exercise.png', quality=100, optimize=False)
    print('Created mini_exercise.png')

# Create all images
if __name__ == '__main__':
    print('Creating DS-7 placeholder images...')
    boxplot_anatomy()
    step_by_step_example()
    fence_variants()
    iqr_robustness()
    data_science_connections()
    boxplot_examples()
    mini_exercise()
    print('\nAll DS-7 images created successfully!')

