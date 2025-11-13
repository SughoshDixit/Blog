from PIL import Image, ImageDraw, ImageFont
import os

# Create directory if needed
os.makedirs('public/BL-6', exist_ok=True)

# Create image with 16:9 aspect ratio (1920x1080)
width, height = 1920, 1080
img = Image.new('RGB', (width, height), color='#C8102E')  # Liverpool Red
draw = ImageDraw.Draw(img)

# Draw gradient background effect (red gradient)
for i in range(height):
    r = int(200 + (168 - 200) * i / height)
    g = int(16 + (10 - 16) * i / height)
    b = int(46 + (30 - 46) * i / height)
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

title = "Why Support Liverpool F.C?"
subtitle = "The Beautiful Game vs The Lazy Game"

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
    fill=(200, 16, 46),  # Liverpool Red
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
    fill=(100, 8, 23),  # Darker red
    font=subtitle_font,
    anchor='mm'
)

# Draw football vs cricket visualization
viz_center_x = center_x
viz_top = center_y + 120
viz_height = 300

# Draw football on the left
football_x = center_x - 250
football_y = viz_top + 50
football_radius = 60

# Draw football (circle with pentagon pattern)
draw.ellipse([football_x - football_radius, football_y - football_radius,
              football_x + football_radius, football_y + football_radius],
             fill='white', outline='black', width=3)

# Draw simple pentagon pattern on football
for i in range(5):
    angle = i * 72 * 3.14159 / 180
    x = football_x + int(20 * (1 if i % 2 == 0 else 0.6) * (1 if i < 2 else -1))
    y = football_y + int(20 * (1 if i % 2 == 0 else 0.6) * (1 if i < 3 else -1))
    draw.ellipse([x - 8, y - 8, x + 8, y + 8], fill='black')

# Draw "90 min" label below football
try:
    label_font = ImageFont.truetype("arial.ttf", 20)
except:
    label_font = ImageFont.load_default()
draw.text((football_x, football_y + football_radius + 20),
          '90 min', fill='white', font=label_font, anchor='mm')

# Draw arrow
arrow_start_x = football_x + football_radius + 30
arrow_end_x = center_x + 150
arrow_y = football_y
draw.line([(arrow_start_x, arrow_y), (arrow_end_x, arrow_y)],
          fill='white', width=6)
# Arrowhead
draw.polygon([(arrow_end_x, arrow_y),
              (arrow_end_x - 15, arrow_y - 10),
              (arrow_end_x - 15, arrow_y + 10)],
             fill='white')

# Draw cricket bat/ball on the right (crossed out)
cricket_x = center_x + 200
cricket_y = viz_top + 50

# Draw cricket bat
bat_width = 40
bat_height = 120
draw.rectangle([cricket_x - bat_width//2, cricket_y - bat_height//2,
                cricket_x + bat_width//2, cricket_y + bat_height//2],
               fill='#8B4513', outline='white', width=2)

# Draw cricket ball
ball_radius = 15
draw.ellipse([cricket_x - ball_radius, cricket_y - bat_height//2 - ball_radius - 10,
              cricket_x + ball_radius, cricket_y - bat_height//2 + ball_radius - 10],
             fill='red', outline='white', width=2)

# Draw X mark (crossed out)
draw.line([(cricket_x - 50, cricket_y - 50), (cricket_x + 50, cricket_y + 50)],
          fill='white', width=8)
draw.line([(cricket_x - 50, cricket_y + 50), (cricket_x + 50, cricket_y - 50)],
          fill='white', width=8)

# Draw "5 days" label
draw.text((cricket_x, cricket_y + bat_height//2 + 30),
          '5 days', fill='white', font=label_font, anchor='mm')

# Draw labels
try:
    header_font = ImageFont.truetype("arial.ttf", 24)
except:
    header_font = ImageFont.load_default()

draw.text((football_x, viz_top - 20), 'Football ⚽',
          fill='white', font=header_font, anchor='mm')
draw.text((cricket_x, viz_top - 20), 'Cricket 🏏',
          fill='white', font=header_font, anchor='mm')

# Draw "You'll Never Walk Alone" text at bottom
try:
    ynwa_font = ImageFont.truetype("arial.ttf", 36)
except:
    ynwa_font = ImageFont.load_default()
draw.text((center_x, height - 80),
          "You'll Never Walk Alone",
          fill='white', font=ynwa_font, anchor='mm')

# Save
img.save('public/BL-6/liverpool-header.jpg', quality=95)
print("Header image created successfully: public/BL-6/liverpool-header.jpg")

