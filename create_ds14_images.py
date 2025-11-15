from PIL import Image, ImageDraw, ImageFont
import os
import math

# Create directory if needed
os.makedirs('public/DS-14', exist_ok=True)

def create_power_curve_image():
    """Create a power curve visualization showing sample size vs power"""
    width, height = 1200, 800
    img = Image.new('RGB', (width, height), color='#ffffff')
    draw = ImageDraw.Draw(img)
    
    # Draw background
    draw.rectangle([0, 0, width, height], fill='#f9fafb')
    
    # Draw axes
    margin = 80
    plot_width = width - 2 * margin
    plot_height = height - 2 * margin
    
    # X-axis (Sample Size)
    x_start = margin
    x_end = width - margin
    y_axis = height - margin
    
    draw.line([(x_start, y_axis), (x_end, y_axis)], fill='#374151', width=2)
    draw.line([(x_start, margin), (x_start, y_axis)], fill='#374151', width=2)
    
    # Draw grid
    for i in range(6):
        x = x_start + (i * plot_width / 5)
        draw.line([(x, margin), (x, y_axis)], fill='#e5e7eb', width=1)
        # X-axis labels
        sample_size = i * 200
        try:
            font = ImageFont.truetype("arial.ttf", 16)
        except:
            font = ImageFont.load_default()
        draw.text((x, y_axis + 10), str(sample_size), fill='#374151', font=font, anchor='mt')
    
    for i in range(6):
        y = y_axis - (i * plot_height / 5)
        draw.line([(x_start, y), (x_end, y)], fill='#e5e7eb', width=1)
        # Y-axis labels
        power_pct = i * 20
        try:
            font = ImageFont.truetype("arial.ttf", 16)
        except:
            font = ImageFont.load_default()
        draw.text((x_start - 10, y), f"{power_pct}%", fill='#374151', font=font, anchor='rm')
    
    # Draw power curve (exponential-like curve)
    points = []
    for i in range(100):
        x = x_start + (i * plot_width / 100)
        # Power increases with sample size (logarithmic curve)
        sample_size = (i * plot_width / 100) / plot_width * 1000
        # Power formula approximation: 1 - (1-p)^n where p is defect rate
        p = 0.005  # 0.5% defect rate
        if sample_size > 0:
            power = 1 - (1 - p) ** sample_size
        else:
            power = 0
        y = y_axis - (power * plot_height)
        points.append((x, y))
    
    # Draw curve
    for i in range(len(points) - 1):
        draw.line([points[i], points[i+1]], fill='#3b82f6', width=3)
    
    # Highlight n=600 point
    n_600_x = x_start + (600 / 1000) * plot_width
    n_600_power = 1 - (1 - 0.005) ** 600
    n_600_y = y_axis - (n_600_power * plot_height)
    
    # Draw target line at 95% (dashed manually)
    target_y = y_axis - (0.95 * plot_height)
    dash_length = 10
    gap_length = 5
    x = x_start
    while x < x_end:
        draw.line([(x, target_y), (min(x + dash_length, x_end), target_y)], fill='#ef4444', width=2)
        x += dash_length + gap_length
    
    # Draw point at n=600
    draw.ellipse([n_600_x - 8, n_600_y - 8, n_600_x + 8, n_600_y + 8], 
                fill='#10b981', outline='#ffffff', width=2)
    
    # Add labels
    try:
        title_font = ImageFont.truetype("arial.ttf", 24)
        label_font = ImageFont.truetype("arial.ttf", 18)
    except:
        title_font = ImageFont.load_default()
        label_font = ImageFont.load_default()
    
    draw.text((width // 2, 30), 'Power Curve: Sample Size vs Detection Power', 
             fill='#111827', font=title_font, anchor='mt')
    draw.text((width // 2, y_axis + 50), 'Sample Size (n)', 
             fill='#374151', font=label_font, anchor='mt')
    draw.text((30, height // 2), 'Power (%)', 
             fill='#374151', font=label_font, anchor='mm')
    
    # Add annotation for n=600
    draw.text((n_600_x + 20, n_600_y - 20), 'n=600\n95% Power', 
             fill='#10b981', font=label_font)
    
    img.save('public/DS-14/power_curve.png', quality=95)
    print("Created: power_curve.png")

def create_hypergeometric_visualization():
    """Create visualization of hypergeometric sampling"""
    width, height = 1400, 900
    img = Image.new('RGB', (width, height), color='#ffffff')
    draw = ImageDraw.Draw(img)
    
    # Draw background
    draw.rectangle([0, 0, width, height], fill='#f9fafb')
    
    # Population box (left)
    pop_x = 100
    pop_y = 200
    pop_width = 400
    pop_height = 500
    
    draw.rounded_rectangle([pop_x, pop_y, pop_x + pop_width, pop_y + pop_height],
                          radius=20, fill='#3b82f6', outline='#1e40af', width=4)
    
    # Population label
    try:
        title_font = ImageFont.truetype("arial.ttf", 28)
        label_font = ImageFont.truetype("arial.ttf", 20)
    except:
        title_font = ImageFont.load_default()
        label_font = ImageFont.load_default()
    
    draw.text((pop_x + pop_width // 2, pop_y - 40), 'Population (N = 5,000)',
             fill='#111827', font=title_font, anchor='mt')
    
    # Draw items in population (mostly good, few defective)
    good_count = 0
    defective_count = 0
    
    for row in range(15):
        for col in range(20):
            if good_count < 280:  # Most are good
                x = pop_x + 20 + col * 18
                y = pop_y + 40 + row * 30
                if x < pop_x + pop_width - 20 and y < pop_y + pop_height - 20:
                    draw.ellipse([x - 6, y - 6, x + 6, y + 6],
                               fill='#10b981', outline='#ffffff', width=1)
                    good_count += 1
    
    # Add defective items (red)
    for i in range(8):
        x = pop_x + 30 + (i % 4) * 90
        y = pop_y + 450 + (i // 4) * 30
        draw.ellipse([x - 6, y - 6, x + 6, y + 6],
                    fill='#ef4444', outline='#ffffff', width=2)
        defective_count += 1
    
    # Sample box (middle)
    sample_x = 600
    sample_y = 300
    sample_width = 300
    sample_height = 300
    
    draw.rounded_rectangle([sample_x, sample_y, sample_x + sample_width, sample_y + sample_height],
                         radius=15, fill='#8b5cf6', outline='#6d28d9', width=4)
    
    draw.text((sample_x + sample_width // 2, sample_y - 40), 'Sample (n = 600)',
             fill='#111827', font=title_font, anchor='mt')
    
    # Draw sampled items
    for row in range(8):
        for col in range(10):
            if (row * 10 + col) < 75:  # Most are good
                x = sample_x + 20 + col * 26
                y = sample_y + 40 + row * 28
                if x < sample_x + sample_width - 20 and y < sample_y + sample_height - 20:
                    draw.ellipse([x - 5, y - 5, x + 5, y + 5],
                               fill='#10b981', outline='#ffffff', width=1)
    
    # Add one defective in sample
    draw.ellipse([sample_x + 150, sample_y + 200, sample_x + 160, sample_y + 210],
                fill='#ef4444', outline='#ffffff', width=2)
    
    # Result box (right)
    result_x = 1000
    result_y = 350
    result_width = 300
    result_height = 200
    
    draw.rounded_rectangle([result_x, result_y, result_x + result_width, result_y + result_height],
                         radius=15, fill='#10b981', outline='#059669', width=4)
    
    draw.text((result_x + result_width // 2, result_y - 40), 'Result',
             fill='#111827', font=title_font, anchor='mt')
    
    # Result text
    draw.text((result_x + result_width // 2, result_y + 50), 'Defect Found!',
             fill='#ffffff', font=label_font, anchor='mm')
    draw.text((result_x + result_width // 2, result_y + 100), 'Power = 95.1%',
             fill='#ffffff', font=label_font, anchor='mm')
    draw.text((result_x + result_width // 2, result_y + 150), 'Reject Batch',
             fill='#ffffff', font=label_font, anchor='mm')
    
    # Draw arrows
    # Arrow from population to sample
    arrow1_start = (pop_x + pop_width, pop_y + pop_height // 2)
    arrow1_end = (sample_x, pop_y + pop_height // 2)
    draw.line([arrow1_start, arrow1_end], fill='#6b7280', width=4)
    # Arrowhead
    draw.polygon([(arrow1_end[0], arrow1_end[1]),
                 (arrow1_end[0] - 15, arrow1_end[1] - 10),
                 (arrow1_end[0] - 15, arrow1_end[1] + 10)],
                fill='#6b7280')
    
    # Arrow from sample to result
    arrow2_start = (sample_x + sample_width, sample_y + sample_height // 2)
    arrow2_end = (result_x, sample_y + sample_height // 2)
    draw.line([arrow2_start, arrow2_end], fill='#6b7280', width=4)
    # Arrowhead
    draw.polygon([(arrow2_end[0], arrow2_end[1]),
                 (arrow2_end[0] - 15, arrow2_end[1] - 10),
                 (arrow2_end[0] - 15, arrow2_end[1] + 10)],
                fill='#6b7280')
    
    # Legend
    legend_y = pop_y + pop_height + 40
    legend_x = width // 2 - 150
    
    draw.ellipse([legend_x - 8, legend_y - 8, legend_x + 8, legend_y + 8],
                fill='#10b981', outline='#ffffff', width=2)
    draw.text((legend_x + 25, legend_y), 'Good Item', fill='#111827', font=label_font, anchor='lm')
    
    legend_x2 = width // 2 + 50
    draw.ellipse([legend_x2 - 8, legend_y - 8, legend_x2 + 8, legend_x2 + 8],
                fill='#ef4444', outline='#ffffff', width=2)
    draw.text((legend_x2 + 25, legend_y), 'Defective Item', fill='#111827', font=label_font, anchor='lm')
    
    img.save('public/DS-14/hypergeometric_visualization.png', quality=95)
    print("Created: hypergeometric_visualization.png")

def create_sample_size_comparison():
    """Create comparison of different sample sizes and their power"""
    width, height = 1400, 700
    img = Image.new('RGB', (width, height), color='#ffffff')
    draw = ImageDraw.Draw(img)
    
    # Draw background
    draw.rectangle([0, 0, width, height], fill='#f9fafb')
    
    # Sample sizes to compare
    sample_sizes = [100, 200, 300, 400, 500, 600]
    powers = [0.395, 0.634, 0.779, 0.866, 0.919, 0.951]
    
    # Bar chart
    bar_width = 180
    bar_spacing = 50
    chart_start_x = 150
    chart_bottom = height - 150
    chart_height = 400
    
    try:
        title_font = ImageFont.truetype("arial.ttf", 28)
        label_font = ImageFont.truetype("arial.ttf", 18)
        value_font = ImageFont.truetype("arial.ttf", 16)
    except:
        title_font = ImageFont.load_default()
        label_font = ImageFont.load_default()
        value_font = ImageFont.load_default()
    
    draw.text((width // 2, 40), 'Sample Size vs Power Comparison',
             fill='#111827', font=title_font, anchor='mt')
    
    # Draw bars
    for i, (n, power) in enumerate(zip(sample_sizes, powers)):
        x = chart_start_x + i * (bar_width + bar_spacing)
        bar_height = power * chart_height
        bar_top = chart_bottom - bar_height
        
        # Color based on power
        if power >= 0.95:
            color = '#10b981'  # Green for target
        elif power >= 0.80:
            color = '#3b82f6'  # Blue for good
        else:
            color = '#f59e0b'  # Orange for low
        
        draw.rectangle([x, bar_top, x + bar_width, chart_bottom],
                      fill=color, outline='#ffffff', width=2)
        
        # Label
        draw.text((x + bar_width // 2, chart_bottom + 20), f'n={n}',
                 fill='#374151', font=label_font, anchor='mt')
        
        # Power value on bar
        power_text = f'{power*100:.1f}%'
        draw.text((x + bar_width // 2, bar_top - 25), power_text,
                 fill='#111827', font=value_font, anchor='mb')
    
    # Y-axis label
    draw.text((50, height // 2), 'Power (%)', fill='#374151', font=label_font, anchor='mm')
    
    # Target line
    target_power = 0.95
    target_y = chart_bottom - (target_power * chart_height)
    draw.line([(chart_start_x - 30, target_y), 
              (chart_start_x + len(sample_sizes) * (bar_width + bar_spacing) - bar_spacing, target_y)],
             fill='#ef4444', width=2)
    draw.text((chart_start_x - 40, target_y), '95%', fill='#ef4444', font=value_font, anchor='rm')
    
    img.save('public/DS-14/sample_size_comparison.png', quality=95)
    print("Created: sample_size_comparison.png")

if __name__ == '__main__':
    create_power_curve_image()
    create_hypergeometric_visualization()
    create_sample_size_comparison()
    print("\nAll DS-14 images created successfully!")

