from PIL import Image, ImageDraw, ImageFont
import os

# Create directory if it doesn't exist
os.makedirs('public/DS-23', exist_ok=True)

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
ACCENT = '#16213e'

def create_header_image():
    width, height = 1200, 630
    img = Image.new('RGB', (width, height), color=DARK_BG)
    draw = ImageDraw.Draw(img)
    
    # Gradient background effect (simple stripes)
    for i in range(0, width, 4):
        alpha = int(20 + (i / width) * 30)
        color = f'#{alpha:02x}{alpha:02x}{alpha + 20:02x}'
        draw.line([(i, 0), (i, height)], fill=color, width=2)
    
    # Title
    draw.text((width//2, 80), "Day 23", fill=YELLOW, font=font_title, anchor='mm')
    draw.text((width//2, 140), "Label Post-Processing", fill='white', font=font_subtitle, anchor='mm')
    draw.text((width//2, 175), "Partitioning Flagged vs Passed Mathematically", fill='#aaaaaa', font=font_medium, anchor='mm')
    
    # Visual: Score line with Flagged/Passed partition
    line_y = 320
    line_x = 150
    line_width = width - 300
    
    # Score bar background
    draw.rectangle([(line_x, line_y - 30), (line_x + line_width, line_y + 30)], 
                   fill='#2a2a4a', outline='#4a4a6a', width=2)
    
    # Passed region
    threshold_x = line_x + int(line_width * 0.5)
    draw.rectangle([(line_x + 2, line_y - 28), (threshold_x, line_y + 28)], 
                   fill='#3d5a80', outline=None)
    
    # Flagged region
    draw.rectangle([(threshold_x, line_y - 28), (line_x + line_width - 2, line_y + 28)], 
                   fill='#2d6a4f', outline=None)
    
    # Threshold marker
    draw.line([(threshold_x, line_y - 50), (threshold_x, line_y + 50)], fill=YELLOW, width=4)
    draw.text((threshold_x, line_y - 70), "Threshold", fill=YELLOW, font=font_small, anchor='mm')
    
    # Labels
    draw.text((line_x + (threshold_x - line_x)//2, line_y), "Passed", fill='#98c1d9', font=font_medium, anchor='mm')
    draw.text((threshold_x + (line_x + line_width - threshold_x)//2, line_y), "Flagged", fill='#52b788', font=font_medium, anchor='mm')
    
    # Indicator function notation
    draw.text((width//2, line_y + 90), "𝟙{score ≥ threshold}", fill='#888888', font=font_medium, anchor='mm')
    
    # Priority levels indicators
    levels_y = 450
    levels = [
        ("Low Priority", 30, GREEN),
        ("Medium Priority", 50, YELLOW),
        ("High Priority", 70, RED),
    ]
    
    level_width = 200
    start_x = (width - 3 * level_width) // 2
    
    for i, (label, threshold, color) in enumerate(levels):
        x = start_x + i * level_width + level_width // 2
        draw.rectangle([(x - 80, levels_y), (x + 80, levels_y + 50)], 
                       fill='#2a2a4a', outline=color, width=2)
        draw.text((x, levels_y + 15), label, fill=color, font=font_small, anchor='mm')
        draw.text((x, levels_y + 35), f"t = {threshold}", fill='#888888', font=font_small, anchor='mm')
    
    # Decorative elements
    # Tag icons
    for i in range(5):
        x = 80 + i * 50
        y = 550 + (i % 2) * 20
        draw.rectangle([(x, y), (x + 30, y + 15)], fill=GREEN if i % 2 == 0 else RED, outline=None)
        draw.text((x + 15, y + 7), "🏷️", fill='white', font=font_small, anchor='mm')
    
    for i in range(5):
        x = width - 80 - i * 50
        y = 550 + (i % 2) * 20
        draw.rectangle([(x - 30, y), (x, y + 15)], fill=RED if i % 2 == 0 else GREEN, outline=None)
    
    # Bottom accent
    draw.rectangle([(0, height - 5), (width, height)], fill=PURPLE)
    
    img.save('public/DS-23/label_postprocessing_intro.png')
    print("Created: label_postprocessing_intro.png (header)")

print("Generating DS-23 header image...")
create_header_image()
print("Header image created successfully!")
