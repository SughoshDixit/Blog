from PIL import Image, ImageDraw, ImageFont
import os

# Create directory if it doesn't exist
os.makedirs('public/DS-16', exist_ok=True)

# Create image
width, height = 1200, 400
img = Image.new('RGB', (width, height), color='#f7f5f2')
draw = ImageDraw.Draw(img)

# Gradient background
for y in range(height):
    r = int(247 - (y / height) * 20)
    g = int(245 - (y / height) * 20)
    b = int(242 - (y / height) * 15)
    draw.rectangle([(0, y), (width, y+1)], fill=(r, g, b))

# Title
try:
    title_font = ImageFont.truetype("arial.ttf", 48)
    subtitle_font = ImageFont.truetype("arial.ttf", 28)
except:
    title_font = ImageFont.load_default()
    subtitle_font = ImageFont.load_default()

draw.text((50, 80), "Day 16: Knee/Elbow Detection", fill='#191919', font=title_font)
draw.text((50, 150), "Finding the Sweet Spot", fill='#1a8917', font=subtitle_font)

# Draw elbow curve visualization
curve_x_start = 600
curve_y_start = 100
curve_width = 500
curve_height = 200

# Draw axes
draw.line([(curve_x_start, curve_y_start), (curve_x_start, curve_y_start + curve_height)], fill='#333', width=2)
draw.line([(curve_x_start, curve_y_start + curve_height), (curve_x_start + curve_width, curve_y_start + curve_height)], fill='#333', width=2)

# Draw elbow curve
points = []
for i in range(curve_width):
    x = curve_x_start + i
    # Steep decline then gentle
    if i < curve_width * 0.3:
        y = curve_y_start + int((i / (curve_width * 0.3)) ** 1.5 * curve_height * 0.7)
    else:
        y = curve_y_start + int(curve_height * 0.7 + ((i - curve_width * 0.3) / (curve_width * 0.7)) * curve_height * 0.3)
    points.append((x, y))

for i in range(len(points) - 1):
    draw.line([points[i], points[i+1]], fill='#1a8917', width=3)

# Mark elbow point
elbow_x = curve_x_start + int(curve_width * 0.3)
elbow_y = curve_y_start + int(curve_height * 0.7)
draw.ellipse([elbow_x - 8, elbow_y - 8, elbow_x + 8, elbow_y + 8], fill='#ff6b6b', outline='#333', width=2)
draw.text((elbow_x - 30, elbow_y - 35), "ELBOW", fill='#ff6b6b', font=subtitle_font)

# Labels
draw.text((curve_x_start - 40, curve_y_start - 20), "Value", fill='#333', font=subtitle_font)
draw.text((curve_x_start + curve_width - 100, curve_y_start + curve_height + 10), "Percentile", fill='#333', font=subtitle_font)

# Save
img.save('public/DS-16/elbow_detection_intro.png')
print("Header image created: public/DS-16/elbow_detection_intro.png")

