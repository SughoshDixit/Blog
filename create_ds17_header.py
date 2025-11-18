from PIL import Image, ImageDraw, ImageFont
import os

# Create directory if it doesn't exist
os.makedirs('public/DS-17', exist_ok=True)

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

# Subtitle
draw.text((50, 150), "Robust Ratios: Safe Division", fill='#1a8917', font=subtitle_font)

# Draw ratio visualization
# Left side: Unsafe ratio (exploding)
unsafe_x_start = 400
unsafe_y_start = 100
unsafe_width = 300
unsafe_height = 200

# Draw axes for unsafe ratio
draw.line([(unsafe_x_start, unsafe_y_start), (unsafe_x_start, unsafe_y_start + unsafe_height)], fill='#333', width=2)
draw.line([(unsafe_x_start, unsafe_y_start + unsafe_height), (unsafe_x_start + unsafe_width, unsafe_y_start + unsafe_height)], fill='#333', width=2)

# Draw unsafe ratio curve (exploding near zero)
unsafe_points = []
for i in range(unsafe_width):
    x = unsafe_x_start + i
    # Ratio explodes as denominator approaches zero
    den_val = 1.0 - (i / unsafe_width) * 0.95  # Denominator goes from 1 to 0.05
    if den_val > 0.1:
        y = unsafe_y_start + unsafe_height - int((1.0 / den_val) * 20)  # Normal ratio
    else:
        y = unsafe_y_start + 20  # Explodes to top
    y = max(unsafe_y_start + 20, min(unsafe_y_start + unsafe_height - 20, y))
    unsafe_points.append((x, y))

for i in range(len(unsafe_points) - 1):
    draw.line([unsafe_points[i], unsafe_points[i+1]], fill='#dc3545', width=3)

# Label unsafe
draw.text((unsafe_x_start + unsafe_width//2 - 40, unsafe_y_start - 30), "Unsafe", fill='#dc3545', font=subtitle_font)

# Right side: Safe ratio (clipped)
safe_x_start = 750
safe_y_start = 100
safe_width = 300
safe_height = 200

# Draw axes for safe ratio
draw.line([(safe_x_start, safe_y_start), (safe_x_start, safe_y_start + safe_height)], fill='#333', width=2)
draw.line([(safe_x_start, safe_y_start + safe_height), (safe_x_start + safe_width, safe_y_start + safe_height)], fill='#333', width=2)

# Draw safe ratio curve (clipped at maximum)
safe_points = []
clip_level = safe_y_start + 40  # Maximum ratio level
for i in range(safe_width):
    x = safe_x_start + i
    den_val = 1.0 - (i / safe_width) * 0.95
    if den_val > 0.1:
        y = safe_y_start + safe_height - int((1.0 / den_val) * 20)
    else:
        y = clip_level  # Clipped at maximum
    y = max(clip_level, min(safe_y_start + safe_height - 20, y))
    safe_points.append((x, y))

for i in range(len(safe_points) - 1):
    draw.line([safe_points[i], safe_points[i+1]], fill='#26c281', width=3)

# Draw clipping line (dashed manually)
dash_length = 5
gap_length = 5
x_pos = safe_x_start
while x_pos < safe_x_start + safe_width:
    end_x = min(x_pos + dash_length, safe_x_start + safe_width)
    draw.line([(x_pos, clip_level), (end_x, clip_level)], fill='#26c281', width=2)
    x_pos += dash_length + gap_length

# Label safe
draw.text((safe_x_start + safe_width//2 - 30, safe_y_start - 30), "Safe", fill='#26c281', font=subtitle_font)

# Axis labels
draw.text((unsafe_x_start - 50, unsafe_y_start + unsafe_height//2 - 15), "Ratio", fill='#333', font=subtitle_font)
draw.text((safe_x_start - 50, safe_y_start + safe_height//2 - 15), "Ratio", fill='#333', font=subtitle_font)
draw.text((unsafe_x_start + unsafe_width//2 - 50, unsafe_y_start + unsafe_height + 10), "Denominator", fill='#333', font=subtitle_font)
draw.text((safe_x_start + safe_width//2 - 50, safe_y_start + safe_height + 10), "Denominator", fill='#333', font=subtitle_font)

# Save
img.save('public/DS-17/robust_ratios.png')
print("Header image created: public/DS-17/robust_ratios.png")

