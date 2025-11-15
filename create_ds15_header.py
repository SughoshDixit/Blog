from PIL import Image, ImageDraw, ImageFont
import os

# Create directory if needed
os.makedirs('public/DS-15', exist_ok=True)

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

title = "Percentiles as Thresholds: Drawing Lines in the Sand"
subtitle = "Day 15 - Turn Any Feature Into Interpretable Decision Rules"

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

# Draw percentile ladder visualization
viz_center_x = center_x
viz_top = center_y + 120
viz_height = 300

# Draw a vertical "ladder" showing percentiles
ladder_x = center_x - 200
ladder_width = 400
ladder_height = 250

# Draw ladder background
draw.rounded_rectangle(
    [ladder_x, viz_top, ladder_x + ladder_width, viz_top + ladder_height],
    radius=15,
    fill='#1e40af',
    outline='white',
    width=3
)

# Draw percentile rungs
percentiles = [99, 90, 80, 75, 50, 25, 10, 1]
percentile_values = [850, 780, 720, 680, 650, 620, 580, 450]  # Credit scores
colors = ['#fbbf24', '#f59e0b', '#ef4444', '#dc2626', '#10b981', '#3b82f6', '#6366f1', '#8b5cf6']

try:
    label_font = ImageFont.truetype("arial.ttf", 18)
    value_font = ImageFont.truetype("arial.ttf", 16)
except:
    label_font = ImageFont.load_default()
    value_font = ImageFont.load_default()

for i, (p, val, color) in enumerate(zip(percentiles, percentile_values, colors)):
    y_pos = viz_top + 20 + i * 28
    
    # Draw rung line
    draw.line([(ladder_x + 20, y_pos), (ladder_x + ladder_width - 20, y_pos)],
             fill=color, width=3)
    
    # Draw percentile label
    draw.text((ladder_x + 30, y_pos - 8), f'{p}th', fill='white', font=label_font)
    
    # Draw value
    draw.text((ladder_x + ladder_width - 100, y_pos - 8), f'{val}', 
             fill='white', font=value_font, anchor='rm')
    
    # Draw small indicator
    draw.ellipse([ladder_x + ladder_width - 30, y_pos - 4, 
                 ladder_x + ladder_width - 20, y_pos + 4],
                fill=color, outline='white', width=1)

# Draw "Percentile Ladder" label
try:
    title_label_font = ImageFont.truetype("arial.ttf", 24)
except:
    title_label_font = ImageFont.load_default()
draw.text((ladder_x + ladder_width // 2, viz_top - 30),
         'Percentile Ladder', fill='white', font=title_label_font, anchor='mm')

# Draw decision arrows on the right
arrow_start_x = ladder_x + ladder_width + 50
arrow_end_x = center_x + 250
arrow_y = viz_top + 100

# Draw arrow
draw.line([(arrow_start_x, arrow_y), (arrow_end_x, arrow_y)],
         fill='white', width=6)
# Arrowhead
draw.polygon([(arrow_end_x, arrow_y),
             (arrow_end_x - 15, arrow_y - 10),
             (arrow_end_x - 15, arrow_y + 10)],
            fill='white')

# Draw decision box
decision_x = center_x + 280
decision_y = viz_top + 30
decision_width = 250
decision_height = 180

draw.rounded_rectangle(
    [decision_x, decision_y, decision_x + decision_width, decision_y + decision_height],
    radius=15,
    fill='#10b981',
    outline='white',
    width=4
)

# Decision text
try:
    decision_font = ImageFont.truetype("arial.ttf", 24)
    decision_small_font = ImageFont.truetype("arial.ttf", 18)
except:
    decision_font = ImageFont.load_default()
    decision_small_font = ImageFont.load_default()

draw.text((decision_x + decision_width // 2, decision_y + 30),
         'Decision Rule', fill='white', font=decision_font, anchor='mm')
draw.text((decision_x + decision_width // 2, decision_y + 80),
         'Score ≥ 720', fill='white', font=decision_small_font, anchor='mm')
draw.text((decision_x + decision_width // 2, decision_y + 110),
         '→ APPROVE', fill='white', font=decision_small_font, anchor='mm')
draw.text((decision_x + decision_width // 2, decision_y + 140),
         'Top 20%', fill='white', font=decision_small_font, anchor='mm')

# Save
img.save('public/DS-15/percentiles_thresholds_intro.png', quality=95)
print("Header image created successfully: public/DS-15/percentiles_thresholds_intro.png")

