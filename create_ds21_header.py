from PIL import Image, ImageDraw, ImageFont
import os

# Create directory if it doesn't exist
os.makedirs('public/DS-21', exist_ok=True)

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
    title_font = ImageFont.truetype("arial.ttf", 42)
    subtitle_font = ImageFont.truetype("arial.ttf", 26)
    small_font = ImageFont.truetype("arial.ttf", 18)
except:
    title_font = ImageFont.load_default()
    subtitle_font = ImageFont.load_default()
    small_font = ImageFont.load_default()

draw.text((50, 80), "Day 21: Contingency Tables", fill='#191919', font=title_font)
draw.text((50, 140), "Bin-Wise Uplift & Effectiveness", fill='#1a8917', font=subtitle_font)

# Draw contingency table visualization
table_x_start = 750
table_y_start = 100
cell_width = 80
cell_height = 50

# Draw table grid
# Header row
draw.rectangle([table_x_start, table_y_start, table_x_start + cell_width * 3, table_y_start + cell_height], 
              fill='#e9ecef', outline='black', width=2)
draw.text((table_x_start + cell_width // 2, table_y_start + cell_height // 2), "Bin", 
         fill='black', font=small_font, anchor='mm')
draw.text((table_x_start + cell_width * 1.5, table_y_start + cell_height // 2), "Alert", 
         fill='black', font=small_font, anchor='mm')
draw.text((table_x_start + cell_width * 2.5, table_y_start + cell_height // 2), "Rate", 
         fill='black', font=small_font, anchor='mm')

# Data rows
colors = ['#d4edda', '#fff3cd', '#f8d7da']
for i in range(3):
    y_pos = table_y_start + cell_height * (i + 1)
    draw.rectangle([table_x_start, y_pos, table_x_start + cell_width * 3, y_pos + cell_height], 
                  fill=colors[i], outline='black', width=1)
    draw.text((table_x_start + cell_width // 2, y_pos + cell_height // 2), f"B{i+1}", 
             fill='black', font=small_font, anchor='mm')
    draw.text((table_x_start + cell_width * 1.5, y_pos + cell_height // 2), "100", 
             fill='black', font=small_font, anchor='mm')
    draw.text((table_x_start + cell_width * 2.5, y_pos + cell_height // 2), "80%", 
             fill='black', font=small_font, anchor='mm')

# Save
img.save('public/DS-21/contingency_uplift_intro.png')
print("Header image created: public/DS-21/contingency_uplift_intro.png")

