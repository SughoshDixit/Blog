from PIL import Image, ImageDraw, ImageFont
import os

# Create directory if it doesn't exist
os.makedirs('public/DS-16', exist_ok=True)

try:
    font_large = ImageFont.truetype("arial.ttf", 24)
    font_medium = ImageFont.truetype("arial.ttf", 18)
    font_small = ImageFont.truetype("arial.ttf", 14)
except:
    font_large = ImageFont.load_default()
    font_medium = ImageFont.load_default()
    font_small = ImageFont.load_default()

# Image 1: Elbow Curve Visualization
def create_elbow_curve():
    width, height = 1600, 900
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    # Much larger margins to prevent label cutoff
    left_margin = 180
    right_margin = 150
    top_margin = 120
    bottom_margin = 150
    margin = left_margin
    
    plot_width = width - left_margin - right_margin
    plot_height = height - top_margin - bottom_margin
    
    # Draw axes
    draw.line([(margin, top_margin), (margin, height - bottom_margin)], fill='black', width=2)
    draw.line([(margin, height - bottom_margin), (width - right_margin, height - bottom_margin)], fill='black', width=2)
    
    # Generate curve points
    num_points = 200
    x_points = [i * plot_width / num_points for i in range(num_points)]
    y_points = []
    for x in x_points:
        if x < plot_width * 0.3:
            y = plot_height * (1 - (x / (plot_width * 0.3)) ** 1.5 * 0.7)
        else:
            y = plot_height * (0.3 + ((x - plot_width * 0.3) / (plot_width * 0.7)) * 0.2)
        y_points.append(top_margin + y)
    
    # Draw curve
    for i in range(len(x_points) - 1):
        x1 = margin + x_points[i]
        y1 = y_points[i]
        x2 = margin + x_points[i+1]
        y2 = y_points[i+1]
        draw.line([(x1, y1), (x2, y2)], fill='#1a8917', width=3)
    
    # Mark elbow
    elbow_idx = int(len(x_points) * 0.3)
    elbow_x = margin + x_points[elbow_idx]
    elbow_y = y_points[elbow_idx]
    draw.ellipse([elbow_x - 10, elbow_y - 10, elbow_x + 10, elbow_y + 10], 
                 fill='#ff6b6b', outline='black', width=2)
    
    # Labels - position axis labels far outside plot area
    draw.text((margin - 150, top_margin + plot_height//2 - 15), "Value", fill='black', font=font_medium)
    draw.text((width - right_margin - 120, height - bottom_margin + 40), "Percentile", fill='black', font=font_medium)
    # Position ELBOW label very far to the right and well above to avoid any curve overlap
    draw.text((elbow_x + 120, elbow_y - 120), "ELBOW", fill='#ff6b6b', font=font_medium)
    
    # Title
    draw.text((margin, 40), "Elbow Detection: Value vs Percentile", fill='#191919', font=font_large)
    
    img.save('public/DS-16/elbow_curve.png')
    print("Created: elbow_curve.png")

# Image 2: Slope and Delta-Slope Visualization
def create_slope_visualization():
    width, height = 1800, 1100  # Increased height to accommodate better spacing
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    margin = 180
    bar_width = 70
    spacing = 110
    
    # Simulated data
    percentiles = [10, 20, 30, 40, 50, 60, 70, 80, 90]
    slopes = [-1030, -340, -200, -100, -60, -40, -25, -17, -13]
    delta_slopes = [690, 140, 100, 40, 20, 15, 8, 4]
    
    # Draw slopes (top half)
    max_slope = max([abs(s) for s in slopes])
    y_base = margin + 240
    top_chart_height = 160
    
    draw.text((margin, margin + 30), "First Differences (Slopes)", fill='#191919', font=font_large)
    
    for i, (pct, slope) in enumerate(zip(percentiles, slopes)):
        x = margin + i * spacing + 80
        bar_height = int(abs(slope) / max_slope * top_chart_height)
        draw.rectangle([(x - bar_width//2, y_base - bar_height), 
                       (x + bar_width//2, y_base)], 
                      fill='#4a90e2', outline='black', width=1)
        # Position percentile labels much further below bars
        draw.text((x - 15, y_base + 70), f"{pct}%", fill='black', font=font_small)
        # Add ELBOW label for the first bar (10%) - position very far above bar, to the right
        if i == 0:
            draw.text((x + 50, y_base - bar_height - 120), "ELBOW!", fill='#ff6b6b', font=font_medium)
    
    # Draw delta slopes (bottom half)
    max_delta = max(delta_slopes)
    y_base2 = margin + 600  # Moved much further down to create more space
    bottom_chart_height = 160
    
    # Position title much higher to avoid overlap with bars - need large gap for tallest bar
    draw.text((margin, margin + 380), "Second Differences (ΔSlope)", fill='#191919', font=font_large)
    
    for i, (pct, delta) in enumerate(zip(percentiles[1:], delta_slopes)):
        x = margin + i * spacing + 80
        bar_height = int(delta / max_delta * bottom_chart_height)
        color = '#ff6b6b' if delta == max_delta else '#26c281'
        draw.rectangle([(x - bar_width//2, y_base2 - bar_height), 
                       (x + bar_width//2, y_base2)], 
                      fill=color, outline='black', width=2 if delta == max_delta else 1)
        # Position percentile labels much further below bars
        draw.text((x - 15, y_base2 + 70), f"{pct}%", fill='black', font=font_small)
        # Position ELBOW label very far above the tallest bar, to the right
        if delta == max_delta:
            draw.text((x + 50, y_base2 - bar_height - 130), "ELBOW!", fill='#ff6b6b', font=font_medium)
    
    img.save('public/DS-16/slope_visualization.png')
    print("Created: slope_visualization.png")

# Image 3: Multi-dimensional Elbow Segmentation
def create_2d_segmentation():
    width, height = 1600, 1100
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    left_margin = 200
    top_margin = 160
    margin = left_margin
    plot_size = 650
    
    # Draw grid
    draw.rectangle([(margin, top_margin), (margin + plot_size, top_margin + plot_size)], 
                   outline='black', width=2)
    
    # Draw threshold lines
    thresh_x = margin + int(plot_size * 0.85)
    thresh_y = top_margin + int(plot_size * 0.85)
    draw.line([(thresh_x, top_margin), (thresh_x, top_margin + plot_size)], 
              fill='#ff6b6b', width=2)
    draw.line([(margin, thresh_y), (margin + plot_size, thresh_y)], 
              fill='#ff6b6b', width=2)
    
    # Label segments - position text in true center of each segment, well away from threshold lines
    segment_size = plot_size // 2
    
    # High-High (top-right) - center in quadrant, away from threshold lines
    draw.rectangle([(thresh_x, top_margin), (margin + plot_size, thresh_y)], 
                   fill='#d4edda', outline='#26c281', width=2)
    # Calculate true center, offset from threshold lines
    text_x = thresh_x + (margin + plot_size - thresh_x) // 2 - 70
    text_y = top_margin + (thresh_y - top_margin) // 2 - 30
    draw.text((text_x, text_y), "High-High\n(500)", 
              fill='#155724', font=font_medium)
    
    # High-Low (bottom-right)
    draw.rectangle([(thresh_x, thresh_y), (margin + plot_size, top_margin + plot_size)], 
                   fill='#fff3cd', outline='#ffc107', width=2)
    text_x = thresh_x + (margin + plot_size - thresh_x) // 2 - 70
    text_y = thresh_y + (top_margin + plot_size - thresh_y) // 2 - 30
    draw.text((text_x, text_y), "High-Low\n(1800)", 
              fill='#856404', font=font_medium)
    
    # Low-High (top-left)
    draw.rectangle([(margin, top_margin), (thresh_x, thresh_y)], 
                   fill='#cfe2ff', outline='#0d6efd', width=2)
    text_x = margin + (thresh_x - margin) // 2 - 70
    text_y = top_margin + (thresh_y - top_margin) // 2 - 30
    draw.text((text_x, text_y), "Low-High\n(1200)", 
              fill='#084298', font=font_medium)
    
    # Low-Low (bottom-left)
    draw.rectangle([(margin, thresh_y), (thresh_x, top_margin + plot_size)], 
                   fill='#f8d7da', outline='#dc3545', width=2)
    text_x = margin + (thresh_x - margin) // 2 - 70
    text_y = thresh_y + (top_margin + plot_size - thresh_y) // 2 - 30
    draw.text((text_x, text_y), "Low-Low\n(6500)", 
              fill='#721c24', font=font_medium)
    
    # Axis labels - position very far away from plot edges
    draw.text((margin + plot_size//2 - 90, top_margin - 100), "Recency Score", 
              fill='black', font=font_medium)
    draw.text((margin - 180, top_margin + plot_size//2 - 10), "Monetary Value", 
              fill='black', font=font_medium)
    
    # Title
    draw.text((margin, 50), "2D Elbow-Based Segmentation", fill='#191919', font=font_large)
    
    img.save('public/DS-16/2d_segmentation.png')
    print("Created: 2d_segmentation.png")

# Create all images
create_elbow_curve()
create_slope_visualization()
create_2d_segmentation()
print("\nAll images created successfully!")

