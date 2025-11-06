from PIL import Image, ImageDraw, ImageFont
import os

# Create directory if needed
os.makedirs('public/DS-7', exist_ok=True)

# Create image with 16:9 aspect ratio (like DS-6: 1920x1080)
# But design content in the center to avoid cropping with object-cover
width, height = 1920, 1080
img = Image.new('RGB', (width, height), color='#667eea')
draw = ImageDraw.Draw(img)

# Draw gradient background effect
for i in range(height):
    r = int(102 + (118 - 102) * i / height)
    g = int(126 + (142 - 126) * i / height)
    b = int(234 + (250 - 234) * i / height)
    draw.line([(0, i), (width, i)], fill=(r, g, b))

# Design everything in the center region (safe zone: 20% margins on all sides)
# This ensures content won't be cropped by object-cover
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

title = "Boxplots, IQR, and Tukey Fences"
subtitle = "Day 7 - Simple, Robust, Nonparametric Outlier Detection"

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
box_y = center_y - content_height // 2 - 100
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

# Draw simple boxplot visualization - centered below text, in safe zone
plot_center_x = center_x
plot_top = center_y + 80
plot_height_box = 250

# Draw boxplot - centered
box_width_plot = 80
box_height_plot = 120
box_left = plot_center_x - box_width_plot // 2
box_right = plot_center_x + box_width_plot // 2
box_top_plot = plot_top
box_bottom_plot = plot_top + box_height_plot
median_y = plot_top + box_height_plot // 2

# Box
draw.rectangle([box_left, box_top_plot, box_right, box_bottom_plot], 
               fill=(255, 255, 255, 200), outline='white', width=4)

# Median line
draw.line([(box_left, median_y), (box_right, median_y)], 
          fill='#ff4444', width=5)

# Whiskers
whisker_top = plot_top - 60
whisker_bottom = box_bottom_plot + 60
draw.line([(plot_center_x, whisker_top), (plot_center_x, box_top_plot)], 
          fill='white', width=4)
draw.line([(plot_center_x, box_bottom_plot), (plot_center_x, whisker_bottom)], 
          fill='white', width=4)

# Caps
cap_width = 20
draw.line([(plot_center_x - cap_width, whisker_top), (plot_center_x + cap_width, whisker_top)], 
          fill='white', width=4)
draw.line([(plot_center_x - cap_width, whisker_bottom), (plot_center_x + cap_width, whisker_bottom)], 
          fill='white', width=4)

# Outliers (dots) - centered
outlier_size = 15
draw.ellipse([plot_center_x + box_width_plot//2 + 15, whisker_top - 30, 
              plot_center_x + box_width_plot//2 + 15 + outlier_size, whisker_top - 30 + outlier_size], 
             fill='#ff4444', outline='white', width=2)
draw.ellipse([plot_center_x + box_width_plot//2 + 15, whisker_bottom + 15, 
              plot_center_x + box_width_plot//2 + 15 + outlier_size, whisker_bottom + 15 + outlier_size], 
             fill='#ff4444', outline='white', width=2)

# Labels - centered around boxplot, in safe zone
label_font_size = 20
try:
    label_font = ImageFont.truetype("arial.ttf", label_font_size)
except:
    label_font = ImageFont.load_default()

# Labels to the left of boxplot
draw.text((box_left - 15, box_top_plot), 'Q₃', fill='white', font=label_font, anchor='rm')
draw.text((box_left - 15, median_y), 'Median', fill='#ff4444', font=label_font, anchor='rm')
draw.text((box_left - 15, box_bottom_plot), 'Q₁', fill='white', font=label_font, anchor='rm')

# Outlier label
draw.text((plot_center_x + box_width_plot//2 + 35, whisker_top - 25), 'Outlier', 
          fill='#ff4444', font=label_font)

# Save
img.save('public/DS-7/boxplot_concept.png', quality=95)
print("Header image created successfully!")

