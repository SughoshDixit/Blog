from PIL import Image, ImageDraw, ImageFont
import os

# Create directory if needed
os.makedirs('public/DS-12', exist_ok=True)

# Create image with 16:9 aspect ratio (1920x1080)
width, height = 1920, 1080
img = Image.new('RGB', (width, height), color='#6366f1')
draw = ImageDraw.Draw(img)

# Draw gradient background effect (purple/indigo gradient)
for i in range(height):
    r = int(99 + (139 - 99) * i / height)
    g = int(102 + (162 - 102) * i / height)
    b = int(241 + (250 - 241) * i / height)
    draw.line([(0, i), (width, i)], fill=(r, g, b))

# Design everything in the center region (safe zone: 15% margins on all sides)
safe_left = int(width * 0.15)
safe_right = int(width * 0.85)
safe_top = int(height * 0.15)
safe_bottom = int(height * 0.85)
center_x = width // 2
center_y = height // 2

# Draw title - centered, smaller font to fit in safe zone
title_font_size = 64
try:
    title_font = ImageFont.truetype("arial.ttf", title_font_size)
except:
    title_font = ImageFont.load_default()

title = "Binning and Deciles: Taming Continuous Chaos"
subtitle = "Day 12 - Transform Continuous Data into Meaningful Categories"

# Check title width and adjust if needed
title_bbox = draw.textbbox((0, 0), title, font=title_font)
title_width = title_bbox[2] - title_bbox[0]
max_title_width = safe_right - safe_left - 40

if title_width > max_title_width:
    title_font_size = int(64 * (max_title_width / title_width) * 0.9)
    try:
        title_font = ImageFont.truetype("arial.ttf", title_font_size)
    except:
        title_font = ImageFont.load_default()

# Draw white box for text background - centered in safe zone
box_padding = 30
title_bbox = draw.textbbox((0, 0), title, font=title_font)
title_width = title_bbox[2] - title_bbox[0]
title_height = title_bbox[3] - title_bbox[1]

subtitle_font_size = 32
try:
    subtitle_font_temp = ImageFont.truetype("arial.ttf", subtitle_font_size)
except:
    subtitle_font_temp = ImageFont.load_default()
subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font_temp)
subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
subtitle_height = subtitle_bbox[3] - subtitle_bbox[1]

content_width = max(title_width, subtitle_width) + 2*box_padding
content_height = title_height + subtitle_height + 60

box_x = center_x - content_width // 2
box_y = center_y - content_height // 2 - 150
box_width = content_width
box_height = content_height

# Ensure box is within safe zone
if box_x < safe_left:
    box_x = safe_left
if box_x + box_width > safe_right:
    box_width = safe_right - box_x

# Semi-transparent background
overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
overlay_draw = ImageDraw.Draw(overlay)
overlay_draw.rectangle(
    [box_x, box_y, box_x + box_width, box_y + box_height],
    fill=(255, 255, 255, 220),
    outline=(255, 255, 255, 255),
    width=4
)
img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
draw = ImageDraw.Draw(img)

# Draw title text - centered in box
draw.text(
    (center_x, box_y + title_height // 2 + 20),
    title,
    fill=(30, 30, 30),
    font=title_font,
    anchor='mm'
)

# Draw subtitle
try:
    subtitle_font = ImageFont.truetype("arial.ttf", subtitle_font_size)
except:
    subtitle_font = ImageFont.load_default()

draw.text(
    (center_x, box_y + title_height + 50),
    subtitle,
    fill=(60, 60, 60),
    font=subtitle_font,
    anchor='mm'
)

# Draw binning visualization - continuous data being binned
viz_center_x = center_x
viz_top = center_y + 100
viz_height = 300

# Draw continuous data points (scattered dots) on the left
data_points_y = []
data_points_x_left = viz_center_x - 300
for i in range(20):
    y = viz_top + 50 + i * 12
    data_points_y.append(y)
    # Draw small dots representing continuous data
    draw.ellipse([data_points_x_left - 3, y - 3, data_points_x_left + 3, y + 3], 
                 fill='white', outline='white', width=1)
    # Draw value labels
    value = 20 + i * 3
    try:
        label_font = ImageFont.truetype("arial.ttf", 14)
    except:
        label_font = ImageFont.load_default()
    draw.text((data_points_x_left - 25, y - 6), f'{value}', 
              fill='white', font=label_font, anchor='rm')

# Draw arrow pointing to bins
arrow_start_x = data_points_x_left + 50
arrow_end_x = viz_center_x - 150
arrow_y = viz_top + 150
draw.line([(arrow_start_x, arrow_y), (arrow_end_x, arrow_y)], 
          fill='white', width=6)
# Arrowhead
draw.polygon([(arrow_end_x, arrow_y), 
              (arrow_end_x - 15, arrow_y - 10),
              (arrow_end_x - 15, arrow_y + 10)], 
             fill='white')

# Draw bins (rectangles) on the right
bin_width = 120
bin_height = 60
bin_spacing = 10
num_bins = 4
bin_start_x = viz_center_x - 50

bin_labels = ['18-30', '31-40', '41-50', '51+']
bin_colors = ['#fbbf24', '#f59e0b', '#d97706', '#b45309']

for i in range(num_bins):
    bin_x = bin_start_x + i * (bin_width + bin_spacing)
    bin_y = viz_top + 80 + i * (bin_height + bin_spacing)
    
    # Draw bin rectangle
    draw.rectangle([bin_x, bin_y, bin_x + bin_width, bin_y + bin_height],
                   fill=bin_colors[i], outline='white', width=3)
    
    # Draw bin label
    try:
        bin_label_font = ImageFont.truetype("arial.ttf", 20)
    except:
        bin_label_font = ImageFont.load_default()
    draw.text((bin_x + bin_width // 2, bin_y + bin_height // 2),
              bin_labels[i], fill='white', font=bin_label_font, anchor='mm')
    
    # Draw count inside bin
    try:
        count_font = ImageFont.truetype("arial.ttf", 16)
    except:
        count_font = ImageFont.load_default()
    draw.text((bin_x + bin_width // 2, bin_y + bin_height // 2 + 20),
              f'n={5}', fill='white', font=count_font, anchor='mm')

# Draw labels
try:
    label_font = ImageFont.truetype("arial.ttf", 18)
except:
    label_font = ImageFont.load_default()

draw.text((data_points_x_left, viz_top - 20), 'Continuous Data', 
          fill='white', font=label_font, anchor='lm')
draw.text((bin_start_x, viz_top - 20), 'Binned Categories', 
          fill='white', font=label_font, anchor='lm')

# Save
img.save('public/DS-12/binning_intro.png', quality=95)
print("Header image created successfully: public/DS-12/binning_intro.png")

