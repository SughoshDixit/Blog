from PIL import Image, ImageDraw, ImageFont
import os

# Create directory if it doesn't exist
os.makedirs('public/DS-19', exist_ok=True)

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
    small_font = ImageFont.truetype("arial.ttf", 20)
except:
    title_font = ImageFont.load_default()
    subtitle_font = ImageFont.load_default()
    small_font = ImageFont.load_default()

draw.text((50, 80), "Day 19: Precision, Recall & F1", fill='#191919', font=title_font)
draw.text((50, 150), "Metrics as Objectives", fill='#1a8917', font=subtitle_font)

# Draw confusion matrix visualization
matrix_x_start = 700
matrix_y_start = 100
cell_size = 60
cell_padding = 5

# Draw 2x2 grid
colors = {
    'TP': '#d4edda',  # Green
    'FP': '#f8d7da',  # Red
    'TN': '#d1ecf1',  # Blue
    'FN': '#fff3cd'   # Yellow
}

labels = [
    [('TP', colors['TP']), ('FP', colors['FP'])],
    [('FN', colors['FN']), ('TN', colors['TN'])]
]

for row in range(2):
    for col in range(2):
        x0 = matrix_x_start + col * cell_size
        y0 = matrix_y_start + row * cell_size
        x1 = x0 + cell_size
        y1 = y0 + cell_size
        
        label, color = labels[row][col]
        draw.rectangle([x0 + cell_padding, y0 + cell_padding, 
                       x1 - cell_padding, y1 - cell_padding], 
                      fill=color, outline='black', width=2)
        draw.text((x0 + cell_size // 2, y0 + cell_size // 2), label, 
                 fill='black', font=small_font, anchor='mm')

# Draw PR curve icon
curve_x_start = 550
curve_y_start = 200
curve_width = 100
curve_height = 80

# Draw axes
draw.line([(curve_x_start, curve_y_start + curve_height), 
          (curve_x_start, curve_y_start)], fill='black', width=2)
draw.line([(curve_x_start, curve_y_start + curve_height), 
          (curve_x_start + curve_width, curve_y_start + curve_height)], fill='black', width=2)

# Draw curve (simplified)
import math
points = []
for i in range(curve_width):
    x = curve_x_start + i
    # Simulate PR curve shape
    t = i / curve_width
    y = curve_y_start + curve_height - (curve_height * (1 - t**0.5))
    points.append((x, int(y)))

for i in range(len(points) - 1):
    draw.line([points[i], points[i+1]], fill='#28a745', width=2)

# Labels
draw.text((curve_x_start - 30, curve_y_start), "P", fill='black', font=small_font)
draw.text((curve_x_start + curve_width + 10, curve_y_start + curve_height), "R", fill='black', font=small_font)

# Save
img.save('public/DS-19/precision_recall_intro.png')
print("Header image created: public/DS-19/precision_recall_intro.png")

