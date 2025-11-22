from PIL import Image, ImageDraw, ImageFont
import os

# Create directory if it doesn't exist
os.makedirs('public/DS-20', exist_ok=True)

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
    title_font = ImageFont.truetype("arial.ttf", 44)
    subtitle_font = ImageFont.truetype("arial.ttf", 26)
    small_font = ImageFont.truetype("arial.ttf", 18)
except:
    title_font = ImageFont.load_default()
    subtitle_font = ImageFont.load_default()
    small_font = ImageFont.load_default()

draw.text((50, 80), "Day 20: Two-Feature Decision Surfaces", fill='#191919', font=title_font)
draw.text((50, 140), "Rule Expressions & Partitions", fill='#1a8917', font=subtitle_font)

# Draw decision surface visualization - shifted further right
surface_x_start = 750  # Increased from 650
surface_y_start = 100  # Centered vertically
surface_size = 220  # Slightly smaller for better fit

# Draw coordinate axes
axis_length = surface_size
x0 = surface_x_start
y0 = surface_y_start + surface_size // 2
x1 = surface_x_start + axis_length
y1 = surface_y_start + surface_size // 2

# X-axis
draw.line([(x0, y1), (x1, y1)], fill='black', width=2)
# Y-axis
draw.line([(x0, surface_y_start), (x0, surface_y_start + surface_size)], fill='black', width=2)

# Draw threshold lines
threshold_x = surface_x_start + surface_size * 0.6
threshold_y = surface_y_start + surface_size * 0.4

# Vertical threshold line
draw.line([(threshold_x, surface_y_start), (threshold_x, surface_y_start + surface_size)], 
         fill='#dc3545', width=3)
# Horizontal threshold line
draw.line([(surface_x_start, threshold_y), (surface_x_start + surface_size, threshold_y)], 
         fill='#dc3545', width=3)

# Shade top-right quadrant (AND region)
draw.rectangle([threshold_x, surface_y_start, surface_x_start + surface_size, threshold_y], 
              fill='#d4edda', outline='#28a745', width=2)

# Labels - adjusted positions
draw.text((surface_x_start + surface_size // 2, surface_y_start + surface_size + 15), "Feature X", 
         fill='black', font=small_font, anchor='mm')
draw.text((surface_x_start - 25, surface_y_start + surface_size // 2), "Feature Y", 
         fill='black', font=small_font, anchor='mm')

# Draw grid lines (dashed effect)
for i in range(3):
    x = surface_x_start + (i + 1) * surface_size // 4
    draw.line([(x, surface_y_start), (x, surface_y_start + surface_size)], 
             fill='lightgray', width=1)
    y = surface_y_start + (i + 1) * surface_size // 4
    draw.line([(surface_x_start, y), (surface_x_start + surface_size, y)], 
             fill='lightgray', width=1)

# Save
img.save('public/DS-20/decision_surfaces_intro.png')
print("Header image created: public/DS-20/decision_surfaces_intro.png")

