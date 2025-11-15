from PIL import Image, ImageDraw, ImageFont
import os
import math

# Create directory if needed
os.makedirs('public/DS-15', exist_ok=True)

def create_percentile_ladder():
    """Create a percentile ladder visualization"""
    width, height = 1400, 900
    img = Image.new('RGB', (width, height), color='#ffffff')
    draw = ImageDraw.Draw(img)
    
    # Draw background
    draw.rectangle([0, 0, width, height], fill='#f9fafb')
    
    # Percentile ladder
    margin = 100
    ladder_x = margin
    ladder_y = margin
    ladder_width = 300
    ladder_height = height - 2 * margin
    
    # Draw ladder background
    draw.rounded_rectangle(
        [ladder_x, ladder_y, ladder_x + ladder_width, ladder_y + ladder_height],
        radius=20,
        fill='#1e40af',
        outline='#1e3a8a',
        width=4
    )
    
    # Percentiles and values
    percentiles = [
        (99, 850, '#fbbf24', 'Top 1%'),
        (90, 780, '#f59e0b', 'Top 10%'),
        (80, 720, '#ef4444', 'Top 20%'),
        (75, 680, '#dc2626', 'Q₃'),
        (50, 650, '#10b981', 'Median'),
        (25, 620, '#3b82f6', 'Q₁'),
        (10, 580, '#6366f1', 'Bottom 10%'),
        (1, 450, '#8b5cf6', 'Bottom 1%')
    ]
    
    try:
        label_font = ImageFont.truetype("arial.ttf", 20)
        value_font = ImageFont.truetype("arial.ttf", 18)
        title_font = ImageFont.truetype("arial.ttf", 28)
    except:
        label_font = ImageFont.load_default()
        value_font = ImageFont.load_default()
        title_font = ImageFont.load_default()
    
    # Draw title
    draw.text((width // 2, 40), 'Percentile Ladder: Credit Score Thresholds',
             fill='#111827', font=title_font, anchor='mt')
    
    # Draw rungs
    n_rungs = len(percentiles)
    spacing = ladder_height / (n_rungs + 1)
    
    for i, (p, val, color, label) in enumerate(percentiles):
        y_pos = ladder_y + (i + 1) * spacing
        
        # Draw rung line
        draw.line([(ladder_x + 20, y_pos), (ladder_x + ladder_width - 20, y_pos)],
                 fill=color, width=4)
        
        # Draw percentile label
        draw.text((ladder_x + 30, y_pos - 12), f'{p}th', fill='white', font=label_font)
        
        # Draw value
        draw.text((ladder_x + ladder_width - 30, y_pos - 10), f'{val}',
                 fill='white', font=value_font, anchor='rm')
        
        # Draw label on the right
        label_x = ladder_x + ladder_width + 30
        draw.text((label_x, y_pos - 10), label, fill='#111827', font=value_font, anchor='lm')
        
        # Draw small circle indicator
        draw.ellipse([ladder_x + ladder_width - 50, y_pos - 6,
                     ladder_x + ladder_width - 30, y_pos + 6],
                    fill=color, outline='white', width=2)
    
    # Add note
    note_y = ladder_y + ladder_height + 20
    draw.text((width // 2, note_y),
             'Pick your rung on the ladder = Pick your threshold!',
             fill='#6b7280', font=value_font, anchor='mt')
    
    img.save('public/DS-15/percentile_ladder.png', quality=95)
    print("Created: percentile_ladder.png")

def create_monotonicity_demo():
    """Create visualization showing monotonicity property"""
    width, height = 1400, 800
    img = Image.new('RGB', (width, height), color='#ffffff')
    draw = ImageDraw.Draw(img)
    
    # Draw background
    draw.rectangle([0, 0, width, height], fill='#f9fafb')
    
    # Draw axes
    margin = 100
    plot_width = width - 2 * margin
    plot_height = height - 2 * margin
    
    x_start = margin
    x_end = width - margin
    y_bottom = height - margin
    y_top = margin
    
    # Draw axes
    draw.line([(x_start, y_bottom), (x_end, y_bottom)], fill='#374151', width=3)
    draw.line([(x_start, y_top), (x_start, y_bottom)], fill='#374151', width=3)
    
    # Percentiles and thresholds
    percentiles = [10, 20, 30, 40, 50, 60, 70, 80, 90]
    thresholds = [10.5, 13.0, 17.0, 23.0, 30.0, 37.0, 42.0, 47.0, 52.0]
    
    # Draw curve
    points = []
    for i, (p, t) in enumerate(zip(percentiles, thresholds)):
        x = x_start + (i / (len(percentiles) - 1)) * plot_width
        y = y_bottom - ((t - 10) / (52 - 10)) * plot_height
        points.append((x, y))
    
    # Draw line connecting points
    for i in range(len(points) - 1):
        draw.line([points[i], points[i+1]], fill='#3b82f6', width=4)
    
    # Draw points
    for x, y in points:
        draw.ellipse([x - 6, y - 6, x + 6, y + 6],
                    fill='#10b981', outline='#ffffff', width=2)
    
    # Add labels
    try:
        title_font = ImageFont.truetype("arial.ttf", 28)
        label_font = ImageFont.truetype("arial.ttf", 18)
        value_font = ImageFont.truetype("arial.ttf", 14)
    except:
        title_font = ImageFont.load_default()
        label_font = ImageFont.load_default()
        value_font = ImageFont.load_default()
    
    draw.text((width // 2, 40), 'Monotonicity Property: Higher Percentile → Higher Threshold',
             fill='#111827', font=title_font, anchor='mt')
    
    # X-axis labels
    for i, p in enumerate(percentiles):
        x = x_start + (i / (len(percentiles) - 1)) * plot_width
        draw.text((x, y_bottom + 20), f'{p}%', fill='#374151', font=value_font, anchor='mt')
    
    # Y-axis labels
    for i in range(6):
        val = 10 + i * 8
        y = y_bottom - (i / 5) * plot_height
        draw.text((x_start - 20, y), f'{val}', fill='#374151', font=value_font, anchor='rm')
    
    # Add annotations
    draw.text((x_start, y_top - 30), 'Threshold Value', fill='#374151', font=label_font, anchor='lm')
    draw.text((width // 2, y_bottom + 60), 'Percentile', fill='#374151', font=label_font, anchor='mt')
    
    # Add arrow showing monotonicity
    arrow_x = x_start + plot_width * 0.7
    arrow_y = y_top + 100
    draw.line([(arrow_x, arrow_y), (arrow_x + 200, arrow_y)], fill='#10b981', width=4)
    draw.polygon([(arrow_x + 200, arrow_y),
                 (arrow_x + 185, arrow_y - 10),
                 (arrow_x + 185, arrow_y + 10)],
                fill='#10b981')
    draw.text((arrow_x + 100, arrow_y - 25), 'Always Increasing!',
             fill='#10b981', font=label_font, anchor='mm')
    
    img.save('public/DS-15/monotonicity_demo.png', quality=95)
    print("Created: monotonicity_demo.png")

def create_threshold_comparison():
    """Create comparison of different percentile thresholds"""
    width, height = 1400, 700
    img = Image.new('RGB', (width, height), color='#ffffff')
    draw = ImageDraw.Draw(img)
    
    # Draw background
    draw.rectangle([0, 0, width, height], fill='#f9fafb')
    
    # Threshold strategies
    strategies = [
        ('Top 20%', 80, 720, '#10b981'),
        ('Top 10%', 90, 780, '#3b82f6'),
        ('Top 50%', 50, 650, '#f59e0b')
    ]
    
    # Draw comparison boxes
    box_width = 350
    box_height = 400
    box_spacing = 50
    start_x = (width - (len(strategies) * box_width + (len(strategies) - 1) * box_spacing)) // 2
    start_y = 150
    
    try:
        title_font = ImageFont.truetype("arial.ttf", 28)
        strategy_font = ImageFont.truetype("arial.ttf", 24)
        value_font = ImageFont.truetype("arial.ttf", 20)
        label_font = ImageFont.truetype("arial.ttf", 18)
    except:
        title_font = ImageFont.load_default()
        strategy_font = ImageFont.load_default()
        value_font = ImageFont.load_default()
        label_font = ImageFont.load_default()
    
    draw.text((width // 2, 40), 'Different Threshold Strategies',
             fill='#111827', font=title_font, anchor='mt')
    
    for i, (strategy, percentile, threshold, color) in enumerate(strategies):
        box_x = start_x + i * (box_width + box_spacing)
        box_y = start_y
        
        # Draw box
        draw.rounded_rectangle(
            [box_x, box_y, box_x + box_width, box_y + box_height],
            radius=15,
            fill=color,
            outline='white',
            width=4
        )
        
        # Strategy name
        draw.text((box_x + box_width // 2, box_y + 40),
                 strategy, fill='white', font=strategy_font, anchor='mm')
        
        # Percentile
        draw.text((box_x + box_width // 2, box_y + 100),
                 f'{percentile}th Percentile', fill='white', font=label_font, anchor='mm')
        
        # Threshold value
        draw.text((box_x + box_width // 2, box_y + 150),
                 f'Threshold: {threshold}', fill='white', font=value_font, anchor='mm')
        
        # Rule
        draw.text((box_x + box_width // 2, box_y + 220),
                 'Score ≥ Threshold', fill='white', font=label_font, anchor='mm')
        draw.text((box_x + box_width // 2, box_y + 250),
                 '→ APPROVE ✅', fill='white', font=label_font, anchor='mm')
        
        # Approval rate
        approval_rate = 100 - percentile
        draw.text((box_x + box_width // 2, box_y + 320),
                 f'Approves: {approval_rate}%', fill='white', font=value_font, anchor='mm')
    
    img.save('public/DS-15/threshold_comparison.png', quality=95)
    print("Created: threshold_comparison.png")

if __name__ == '__main__':
    create_percentile_ladder()
    create_monotonicity_demo()
    create_threshold_comparison()
    print("\nAll DS-15 images created successfully!")

