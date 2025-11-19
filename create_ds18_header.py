from PIL import Image, ImageDraw, ImageFont
import os

# Create directory if it doesn't exist
os.makedirs('public/DS-18', exist_ok=True)

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

draw.text((50, 80), "Day 18: Time & Recurrence Math", fill='#191919', font=title_font)
draw.text((50, 150), "When Calendars Attack Your Data", fill='#1a8917', font=subtitle_font)

# Draw calendar visualization - shifted to the right
cal_x_start = 800  # Increased from 700
cal_y_start = 100
cell_size = 35  # Slightly smaller cells
cal_width = 7 * cell_size
cal_height = 5 * cell_size

# Draw calendar grid
for row in range(5):
    for col in range(7):
        x0 = cal_x_start + col * cell_size
        y0 = cal_y_start + row * cell_size
        x1 = x0 + cell_size
        y1 = y0 + cell_size
        
        # Highlight some cells to represent recurrence
        if (row + col) % 4 == 0:
            draw.rectangle([x0, y0, x1, y1], fill='#d4edda', outline='#26c281', width=1)
        else:
            draw.rectangle([x0, y0, x1, y1], fill='white', outline='lightgray')

# Draw some numbers in the calendar
days = 1
for row in range(5):
    for col in range(7):
        if days > 31: break
        x = cal_x_start + col * cell_size + cell_size / 2
        y = cal_y_start + row * cell_size + cell_size / 2
        draw.text((x, y), str(days), fill='black', font=subtitle_font, anchor='mm')
        days += 1

# Draw a clock icon - shifted to the right
clock_x_center = 720  # Positioned between text and calendar
clock_y_center = 230
draw.ellipse([clock_x_center - 30, clock_y_center - 30, clock_x_center + 30, clock_y_center + 30], fill=None, outline='black', width=4)
draw.line([clock_x_center, clock_y_center, clock_x_center, clock_y_center - 20], fill='black', width=3)
draw.line([clock_x_center, clock_y_center, clock_x_center + 15, clock_y_center], fill='black', width=3)

# Save
img.save('public/DS-18/time_recurrence_intro.png')
print("Header image created: public/DS-18/time_recurrence_intro.png")
