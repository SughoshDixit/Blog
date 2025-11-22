from PIL import Image, ImageDraw, ImageFont
import os
import math

# Create directory if it doesn't exist
os.makedirs('public/DS-22', exist_ok=True)

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

# Draw Venn diagram visualization - centered and clean (no text)
venn_x_center = width // 2  # Centered horizontally
venn_y_center = height // 2  # Centered vertically
circle_radius = 80  # Larger circles since no text
circle_spacing = 50  # More spacing for clarity

# Draw two overlapping circles
# Circle A (left)
circle_a_x = venn_x_center - circle_spacing
draw.ellipse([circle_a_x - circle_radius, venn_y_center - circle_radius,
              circle_a_x + circle_radius, venn_y_center + circle_radius],
             fill='#d1ecf1', outline='#17a2b8', width=2)

# Circle B (right)
circle_b_x = venn_x_center + circle_spacing
draw.ellipse([circle_b_x - circle_radius, venn_y_center - circle_radius,
              circle_b_x + circle_radius, venn_y_center + circle_radius],
             fill='#f8d7da', outline='#dc3545', width=2)

# Labels - clear and well-positioned
try:
    label_font = ImageFont.truetype("arial.ttf", 18)
except:
    label_font = ImageFont.load_default()

# Position labels above circles
draw.text((circle_a_x, venn_y_center - circle_radius - 25), "A", fill='#17a2b8', font=label_font, anchor='mm')
draw.text((circle_b_x, venn_y_center - circle_radius - 25), "B", fill='#dc3545', font=label_font, anchor='mm')

# Intersection label (overlap)
try:
    intersection_font = ImageFont.truetype("arial.ttf", 14)
except:
    intersection_font = ImageFont.load_default()
draw.text((venn_x_center, venn_y_center), "A∩B", fill='black', font=intersection_font, anchor='mm')

# Save
img.save('public/DS-22/set_theory_intro.png')
print("Header image created: public/DS-22/set_theory_intro.png")

