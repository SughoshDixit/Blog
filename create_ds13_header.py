from PIL import Image, ImageDraw, ImageFont
import os

# Create directory if needed
os.makedirs('public/DS-13', exist_ok=True)

# Create image with 16:9 aspect ratio (1920x1080)
width, height = 1920, 1080
img = Image.new('RGB', (width, height), color='#667eea')
draw = ImageDraw.Draw(img)

# Draw gradient background effect (purple/indigo gradient)
for i in range(height):
    r = int(102 + (118 - 102) * i / height)
    g = int(126 + (142 - 126) * i / height)
    b = int(234 + (250 - 234) * i / height)
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

title = "Stratified Sampling: The Smart Way to Sample"
subtitle = "Day 13 - Guarantee Coverage, Reduce Variance, Gain Insights"

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
box_y = center_y - content_height // 2 - 200
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

# Draw stratified sampling visualization
viz_center_x = center_x
viz_top = center_y + 120
viz_height = 300

# Draw three strata (groups) on the left
strata_colors = ['#3b82f6', '#8b5cf6', '#ec4899']  # Blue, Purple, Pink
strata_labels = ['Stratum 1', 'Stratum 2', 'Stratum 3']
strata_width = 200
strata_height = 80
strata_spacing = 20
strata_start_x = center_x - 400

for i in range(3):
    stratum_x = strata_start_x
    stratum_y = viz_top + i * (strata_height + strata_spacing)
    
    # Draw stratum rectangle
    draw.rectangle([stratum_x, stratum_y, stratum_x + strata_width, stratum_y + strata_height],
                   fill=strata_colors[i], outline='white', width=3)
    
    # Draw stratum label
    try:
        stratum_label_font = ImageFont.truetype("arial.ttf", 22)
    except:
        stratum_label_font = ImageFont.load_default()
    draw.text((stratum_x + strata_width // 2, stratum_y + 25),
              strata_labels[i], fill='white', font=stratum_label_font, anchor='mm')
    
    # Draw sample count
    try:
        count_font = ImageFont.truetype("arial.ttf", 18)
    except:
        count_font = ImageFont.load_default()
    draw.text((stratum_x + strata_width // 2, stratum_y + 55),
              f'Sample: {3+i}', fill='white', font=count_font, anchor='mm')
    
    # Draw small dots representing sampled individuals
    for j in range(3+i):
        dot_x = stratum_x + 20 + j * 25
        dot_y = stratum_y + 15
        if dot_x < stratum_x + strata_width - 20:
            draw.ellipse([dot_x - 4, dot_y - 4, dot_x + 4, dot_y + 4],
                        fill='white', outline='white', width=1)

# Draw arrow pointing to combined sample
arrow_start_x = strata_start_x + strata_width + 30
arrow_end_x = center_x + 150
arrow_y = viz_top + 120
draw.line([(arrow_start_x, arrow_y), (arrow_end_x, arrow_y)],
          fill='white', width=6)
# Arrowhead
draw.polygon([(arrow_end_x, arrow_y),
              (arrow_end_x - 15, arrow_y - 10),
              (arrow_end_x - 15, arrow_y + 10)],
             fill='white')

# Draw combined sample on the right
sample_box_x = center_x + 180
sample_box_y = viz_top + 40
sample_box_width = 250
sample_box_height = 160

# Draw combined sample box
draw.rectangle([sample_box_x, sample_box_y, 
                sample_box_x + sample_box_width, sample_box_y + sample_box_height],
               fill='#10b981', outline='white', width=4)

# Draw "Combined Sample" label
try:
    combined_label_font = ImageFont.truetype("arial.ttf", 24)
except:
    combined_label_font = ImageFont.load_default()
draw.text((sample_box_x + sample_box_width // 2, sample_box_y + 30),
          'Combined Sample', fill='white', font=combined_label_font, anchor='mm')

# Draw total sample count
try:
    total_font = ImageFont.truetype("arial.ttf", 36)
except:
    total_font = ImageFont.load_default()
draw.text((sample_box_x + sample_box_width // 2, sample_box_y + 80),
          'n = 12', fill='white', font=total_font, anchor='mm')

# Draw "Representative" label
try:
    rep_font = ImageFont.truetype("arial.ttf", 20)
except:
    rep_font = ImageFont.load_default()
draw.text((sample_box_x + sample_box_width // 2, sample_box_y + 130),
          '✓ Representative', fill='white', font=rep_font, anchor='mm')

# Draw labels
try:
    label_font = ImageFont.truetype("arial.ttf", 18)
except:
    label_font = ImageFont.load_default()

draw.text((strata_start_x, viz_top - 20), 'Population Strata',
          fill='white', font=label_font, anchor='lm')
draw.text((sample_box_x, viz_top - 20), 'Stratified Sample',
          fill='white', font=label_font, anchor='lm')

# Save
img.save('public/DS-13/stratified_sampling_intro.png', quality=95)
print("Header image created successfully: public/DS-13/stratified_sampling_intro.png")

