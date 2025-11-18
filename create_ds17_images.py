from PIL import Image, ImageDraw, ImageFont
import os

# Create directory if it doesn't exist
os.makedirs('public/DS-17', exist_ok=True)

try:
    font_large = ImageFont.truetype("arial.ttf", 24)
    font_medium = ImageFont.truetype("arial.ttf", 18)
    font_small = ImageFont.truetype("arial.ttf", 14)
except:
    font_large = ImageFont.load_default()
    font_medium = ImageFont.load_default()
    font_small = ImageFont.load_default()

# Image: Ratio Map Comparison (Before vs After)
def create_ratio_map_comparison():
    width, height = 1600, 800
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    margin = 150
    plot_width = 600
    plot_height = 500
    gap = 100
    
    # Left plot: Before (Unsafe)
    left_x = margin
    left_y = margin + 50
    
    # Draw axes
    draw.line([(left_x, left_y), (left_x, left_y + plot_height)], fill='black', width=2)
    draw.line([(left_x, left_y + plot_height), (left_x + plot_width, left_y + plot_height)], fill='black', width=2)
    
    # Draw unsafe ratio curve (exploding)
    unsafe_points = []
    for i in range(plot_width):
        x = left_x + i
        den_val = 1.0 - (i / plot_width) * 0.98  # Denominator from 1.0 to 0.02
        if den_val > 0.15:
            y = left_y + plot_height - int((1.0 / den_val) * 30)
        else:
            y = left_y + 30  # Explodes to top
        y = max(left_y + 30, min(left_y + plot_height - 30, y))
        unsafe_points.append((x, y))
    
    for i in range(len(unsafe_points) - 1):
        draw.line([unsafe_points[i], unsafe_points[i+1]], fill='#dc3545', width=4)
    
    # Label "Before"
    draw.text((left_x + plot_width//2 - 40, left_y - 40), "Before: Unsafe Ratio", fill='#dc3545', font=font_large)
    
    # Right plot: After (Safe)
    right_x = left_x + plot_width + gap
    right_y = left_y
    
    # Draw axes
    draw.line([(right_x, right_y), (right_x, right_y + plot_height)], fill='black', width=2)
    draw.line([(right_x, right_y + plot_height), (right_x + plot_width, right_y + plot_height)], fill='black', width=2)
    
    # Draw safe ratio curve (clipped)
    safe_points = []
    clip_level = right_y + 80  # Maximum ratio level
    for i in range(plot_width):
        x = right_x + i
        den_val = 1.0 - (i / plot_width) * 0.98
        if den_val > 0.15:
            y = right_y + plot_height - int((1.0 / den_val) * 30)
        else:
            y = clip_level  # Clipped at maximum
        y = max(clip_level, min(right_y + plot_height - 30, y))
        safe_points.append((x, y))
    
    for i in range(len(safe_points) - 1):
        draw.line([safe_points[i], safe_points[i+1]], fill='#26c281', width=4)
    
    # Draw clipping line (dashed)
    dash_length = 8
    gap_length = 5
    x_pos = right_x
    while x_pos < right_x + plot_width:
        end_x = min(x_pos + dash_length, right_x + plot_width)
        draw.line([(x_pos, clip_level), (end_x, clip_level)], fill='#26c281', width=3)
        x_pos += dash_length + gap_length
    
    # Label "After"
    draw.text((right_x + plot_width//2 - 35, right_y - 40), "After: Safe Ratio", fill='#26c281', font=font_large)
    
    # Axis labels
    draw.text((left_x - 80, left_y + plot_height//2 - 15), "Ratio", fill='black', font=font_medium)
    draw.text((right_x - 80, right_y + plot_height//2 - 15), "Ratio", fill='black', font=font_medium)
    draw.text((left_x + plot_width//2 - 60, left_y + plot_height + 20), "Denominator", fill='black', font=font_medium)
    draw.text((right_x + plot_width//2 - 60, right_y + plot_height + 20), "Denominator", fill='black', font=font_medium)
    
    # Title
    draw.text((width//2 - 200, 30), "Ratio Stability: Before vs After Clipping", fill='#191919', font=font_large)
    
    img.save('public/DS-17/ratio_map_comparison.png')
    print("Created: ratio_map_comparison.png")

# Create all images
create_ratio_map_comparison()
print("\nAll images created successfully!")

