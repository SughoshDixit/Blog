from PIL import Image, ImageDraw, ImageFont
import os

# Create directory if needed
os.makedirs('public/DS-14', exist_ok=True)

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

title = "Hypergeometric Distribution & Sample Size"
subtitle = "Day 14 - Finding Needles in Haystacks: Rare Event Detection"

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

# Draw hypergeometric distribution visualization
viz_center_x = center_x
viz_top = center_y + 120
viz_height = 300

# Draw population "urn" on the left
urn_x = center_x - 400
urn_y = viz_top
urn_width = 250
urn_height = 200

# Draw urn shape (rounded rectangle)
draw.rounded_rectangle(
    [urn_x, urn_y, urn_x + urn_width, urn_y + urn_height],
    radius=20,
    fill='#3b82f6',
    outline='white',
    width=4
)

# Draw "Population" label
try:
    urn_label_font = ImageFont.truetype("arial.ttf", 24)
except:
    urn_label_font = ImageFont.load_default()
draw.text(
    (urn_x + urn_width // 2, urn_y - 30),
    'Population (N = 5000)',
    fill='white',
    font=urn_label_font,
    anchor='mm'
)

# Draw good items (green circles) and defective items (red circles) in urn
# Most are good (green), few are defective (red)
good_count = 15
defective_count = 2

for i in range(good_count):
    row = i // 5
    col = i % 5
    circle_x = urn_x + 30 + col * 40
    circle_y = urn_y + 30 + row * 40
    draw.ellipse(
        [circle_x - 8, circle_y - 8, circle_x + 8, circle_y + 8],
        fill='#10b981',
        outline='white',
        width=2
    )

for i in range(defective_count):
    circle_x = urn_x + 50 + i * 40
    circle_y = urn_y + 110
    draw.ellipse(
        [circle_x - 8, circle_y - 8, circle_x + 8, circle_y + 8],
        fill='#ef4444',
        outline='white',
        width=2
    )

# Draw sample box in the middle
sample_x = center_x - 100
sample_y = viz_top + 20
sample_width = 200
sample_height = 160

draw.rounded_rectangle(
    [sample_x, sample_y, sample_x + sample_width, sample_y + sample_height],
    radius=15,
    fill='#8b5cf6',
    outline='white',
    width=4
)

# Draw "Sample" label
try:
    sample_label_font = ImageFont.truetype("arial.ttf", 22)
except:
    sample_label_font = ImageFont.load_default()
draw.text(
    (sample_x + sample_width // 2, sample_y - 25),
    'Sample (n = 600)',
    fill='white',
    font=sample_label_font,
    anchor='mm'
)

# Draw sampled items in sample box
sample_good = 4
sample_defective = 1

for i in range(sample_good):
    row = i // 2
    col = i % 2
    circle_x = sample_x + 40 + col * 60
    circle_y = sample_y + 40 + row * 50
    draw.ellipse(
        [circle_x - 10, circle_y - 10, circle_x + 10, circle_y + 10],
        fill='#10b981',
        outline='white',
        width=2
    )

# Draw defective item in sample
defective_x = sample_x + 100
defective_y = sample_y + 100
draw.ellipse(
    [defective_x - 10, defective_y - 10, defective_x + 10, defective_y + 10],
    fill='#ef4444',
    outline='white',
    width=2
)

# Draw arrow from urn to sample
arrow_start_x = urn_x + urn_width + 10
arrow_end_x = sample_x - 10
arrow_y = urn_y + urn_height // 2
draw.line(
    [(arrow_start_x, arrow_y), (arrow_end_x, arrow_y)],
    fill='white',
    width=6
)
# Arrowhead
draw.polygon(
    [(arrow_end_x, arrow_y),
     (arrow_end_x - 15, arrow_y - 10),
     (arrow_end_x - 15, arrow_y + 10)],
    fill='white'
)

# Draw "Without Replacement" label
try:
    arrow_label_font = ImageFont.truetype("arial.ttf", 18)
except:
    arrow_label_font = ImageFont.load_default()
draw.text(
    ((arrow_start_x + arrow_end_x) // 2, arrow_y - 25),
    'Without Replacement',
    fill='white',
    font=arrow_label_font,
    anchor='mm'
)

# Draw result box on the right
result_x = center_x + 200
result_y = viz_top + 40
result_width = 250
result_height = 120

draw.rounded_rectangle(
    [result_x, result_y, result_x + result_width, result_y + result_height],
    radius=15,
    fill='#10b981',
    outline='white',
    width=4
)

# Draw "Result" label
try:
    result_label_font = ImageFont.truetype("arial.ttf", 24)
except:
    result_label_font = ImageFont.load_default()
draw.text(
    (result_x + result_width // 2, result_y - 25),
    'Power = 95%',
    fill='white',
    font=result_label_font,
    anchor='mm'
)

# Draw "Detected!" text
try:
    detected_font = ImageFont.truetype("arial.ttf", 32)
except:
    detected_font = ImageFont.load_default()
draw.text(
    (result_x + result_width // 2, result_y + 40),
    '✓ Defect Found!',
    fill='white',
    font=detected_font,
    anchor='mm'
)

# Draw "Reject Batch" text
try:
    reject_font = ImageFont.truetype("arial.ttf", 20)
except:
    reject_font = ImageFont.load_default()
draw.text(
    (result_x + result_width // 2, result_y + 85),
    'Reject Batch',
    fill='white',
    font=reject_font,
    anchor='mm'
)

# Draw arrow from sample to result
arrow2_start_x = sample_x + sample_width + 10
arrow2_end_x = result_x - 10
arrow2_y = sample_y + sample_height // 2
draw.line(
    [(arrow2_start_x, arrow2_y), (arrow2_end_x, arrow2_y)],
    fill='white',
    width=6
)
# Arrowhead
draw.polygon(
    [(arrow2_end_x, arrow2_y),
     (arrow2_end_x - 15, arrow2_y - 10),
     (arrow2_end_x - 15, arrow2_y + 10)],
    fill='white'
)

# Draw legend at the bottom
legend_y = viz_top + viz_height - 20
legend_x = center_x - 200

# Good item legend
draw.ellipse(
    [legend_x - 8, legend_y - 8, legend_x + 8, legend_y + 8],
    fill='#10b981',
    outline='white',
    width=2
)
try:
    legend_font = ImageFont.truetype("arial.ttf", 18)
except:
    legend_font = ImageFont.load_default()
draw.text(
    (legend_x + 20, legend_y),
    'Good',
    fill='white',
    font=legend_font,
    anchor='lm'
)

# Defective item legend
legend_x2 = center_x + 50
draw.ellipse(
    [legend_x2 - 8, legend_y - 8, legend_x2 + 8, legend_y + 8],
    fill='#ef4444',
    outline='white',
    width=2
)
draw.text(
    (legend_x2 + 20, legend_y),
    'Defective',
    fill='white',
    font=legend_font,
    anchor='lm'
)

# Save
img.save('public/DS-14/hypergeometric_intro.png', quality=95)
print("Header image created successfully: public/DS-14/hypergeometric_intro.png")

