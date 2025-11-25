from PIL import Image, ImageDraw, ImageFont
import os
import math

# Create directory if it doesn't exist
os.makedirs('public/DS-24', exist_ok=True)

try:
    font_title = ImageFont.truetype("arial.ttf", 36)
    font_subtitle = ImageFont.truetype("arial.ttf", 20)
    font_medium = ImageFont.truetype("arial.ttf", 16)
    font_small = ImageFont.truetype("arial.ttf", 12)
except:
    font_title = ImageFont.load_default()
    font_subtitle = ImageFont.load_default()
    font_medium = ImageFont.load_default()
    font_small = ImageFont.load_default()

# Colors
BLUE = '#17a2b8'
RED = '#dc3545'
GREEN = '#28a745'
YELLOW = '#ffc107'
PURPLE = '#6f42c1'
ORANGE = '#fd7e14'
DARK_BG = '#1a1a2e'

def create_header_image():
    width, height = 1200, 630
    img = Image.new('RGB', (width, height), color=DARK_BG)
    draw = ImageDraw.Draw(img)
    
    # Gradient background effect
    for i in range(0, width, 4):
        alpha = int(25 + (i / width) * 25)
        color = f'#{alpha:02x}{alpha + 5:02x}{alpha + 15:02x}'
        draw.line([(i, 0), (i, height)], fill=color, width=2)
    
    # Title
    draw.text((width//2, 70), "Day 24", fill=YELLOW, font=font_title, anchor='mm')
    draw.text((width//2, 130), "Risk Segmentation", fill='white', font=font_subtitle, anchor='mm')
    draw.text((width//2, 165), "HR/MR/RR/NR as Priors and Costs", fill='#aaaaaa', font=font_medium, anchor='mm')
    
    # Four risk level boxes
    segments = [
        ("HR", "High Risk", RED, "π₁ = 30%"),
        ("MR", "Medium Risk", ORANGE, "π₁ = 10%"),
        ("RR", "Regular Risk", YELLOW, "π₁ = 2%"),
        ("NR", "No Risk", GREEN, "π₁ = 0.1%"),
    ]
    
    box_width = 200
    box_height = 100
    start_x = (width - 4 * box_width - 3 * 40) // 2
    box_y = 230
    
    for i, (abbrev, name, color, prior) in enumerate(segments):
        x = start_x + i * (box_width + 40)
        
        # Box
        draw.rectangle([(x, box_y), (x + box_width, box_y + box_height)],
                       fill='#2a2a4a', outline=color, width=3)
        
        # Abbreviation
        draw.text((x + box_width//2, box_y + 25), abbrev, fill=color, font=font_subtitle, anchor='mm')
        
        # Name
        draw.text((x + box_width//2, box_y + 55), name, fill='white', font=font_small, anchor='mm')
        
        # Prior
        draw.text((x + box_width//2, box_y + 80), prior, fill='#888888', font=font_small, anchor='mm')
    
    # Balance scale visual
    scale_y = 420
    scale_center = width // 2
    
    # Scale base
    draw.polygon([(scale_center - 20, scale_y + 60), (scale_center + 20, scale_y + 60), 
                  (scale_center, scale_y + 80)], fill='#4a4a6a')
    draw.line([(scale_center, scale_y), (scale_center, scale_y + 60)], fill='#6a6a8a', width=4)
    
    # Balance arm (tilted)
    arm_tilt = 15
    draw.line([(scale_center - 150, scale_y + arm_tilt), (scale_center + 150, scale_y - arm_tilt)], 
              fill='#8a8aaa', width=6)
    
    # Left pan (C₁₀ - heavier)
    left_x = scale_center - 150
    draw.ellipse([left_x - 40, scale_y + arm_tilt + 20, left_x + 40, scale_y + arm_tilt + 50],
                 fill=RED, outline='white', width=2)
    draw.text((left_x, scale_y + arm_tilt + 35), "C₁₀", fill='white', font=font_small, anchor='mm')
    
    # Right pan (C₀₁ - lighter)
    right_x = scale_center + 150
    draw.ellipse([right_x - 40, scale_y - arm_tilt + 20, right_x + 40, scale_y - arm_tilt + 50],
                 fill=BLUE, outline='white', width=2)
    draw.text((right_x, scale_y - arm_tilt + 35), "C₀₁", fill='white', font=font_small, anchor='mm')
    
    # Formula
    draw.text((width//2, 530), "τ* = C₀₁ / (C₀₁ + C₁₀)", fill='#888888', font=font_medium, anchor='mm')
    draw.text((width//2, 560), "Cost-Sensitive Thresholding", fill='#666666', font=font_small, anchor='mm')
    
    # Bottom accent
    draw.rectangle([(0, height - 5), (width, height)], fill=PURPLE)
    
    img.save('public/DS-24/risk_segmentation_intro.png')
    print("Created: risk_segmentation_intro.png (header)")

print("Generating DS-24 header image...")
create_header_image()
print("Header image created successfully!")

