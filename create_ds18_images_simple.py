from PIL import Image, ImageDraw, ImageFont
from datetime import date, timedelta
import calendar
import os

# Create directory if it doesn't exist
os.makedirs('public/DS-18', exist_ok=True)

try:
    font_large = ImageFont.truetype("arial.ttf", 20)
    font_medium = ImageFont.truetype("arial.ttf", 16)
    font_small = ImageFont.truetype("arial.ttf", 12)
except:
    font_large = ImageFont.load_default()
    font_medium = ImageFont.load_default()
    font_small = ImageFont.load_default()

# --- Recurrence Enumeration Functions ---
def enumerate_weekly(start_date, end_date, weekday=0):
    current = start_date
    days_ahead = (weekday - current.weekday()) % 7
    current += timedelta(days=days_ahead)
    dates = []
    while current <= end_date:
        dates.append(current)
        current += timedelta(days=7)
    return dates

# --- Image 1: Recurrence Calendar ---
def create_recurrence_calendar():
    width, height = 1000, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    # Title
    title_y = 30
    draw.text((width//2, title_y), "March 2024 - Weekly Recurrence (Mondays)", 
              fill='black', font=font_large, anchor='mm')
    
    # Calendar parameters
    cal_x_start = 100
    cal_y_start = 100
    cell_size = 100
    cell_padding = 5
    
    # Day labels
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    for i, day in enumerate(days):
        x = cal_x_start + i * cell_size + cell_size // 2
        y = cal_y_start - 30
        draw.text((x, y), day, fill='black', font=font_medium, anchor='mm')
    
    # Get calendar data
    cal = calendar.monthcalendar(2024, 3)
    mondays = enumerate_weekly(date(2024, 3, 1), date(2024, 3, 31), weekday=0)
    
    # Draw calendar
    for week_idx, week in enumerate(cal):
        for day_idx, day in enumerate(week):
            if day == 0:
                continue
            
            x0 = cal_x_start + day_idx * cell_size
            y0 = cal_y_start + week_idx * cell_size
            x1 = x0 + cell_size
            y1 = y0 + cell_size
            
            current_date = date(2024, 3, day)
            is_recurrence = current_date in mondays
            
            # Draw cell
            fill_color = '#d4edda' if is_recurrence else '#f8f9fa'
            outline_color = '#28a745' if is_recurrence else '#dee2e6'
            line_width = 3 if is_recurrence else 1
            
            draw.rectangle([x0 + cell_padding, y0 + cell_padding, 
                          x1 - cell_padding, y1 - cell_padding], 
                         fill=fill_color, outline=outline_color, width=line_width)
            
            # Draw day number
            text_x = x0 + cell_size // 2
            text_y = y0 + cell_size // 2
            font = font_medium if is_recurrence else font_small
            draw.text((text_x, text_y), str(day), fill='black', font=font, anchor='mm')
    
    # Legend
    legend_y = height - 60
    draw.rectangle([cal_x_start, legend_y, cal_x_start + 30, legend_y + 20], 
                  fill='#d4edda', outline='#28a745', width=2)
    draw.text((cal_x_start + 40, legend_y + 10), "Recurrence Date", 
              fill='black', font=font_small, anchor='lm')
    
    img.save('public/DS-18/recurrence_calendar.png')
    print("Created: recurrence_calendar.png")

# --- Image 2: Seasonality Stripes ---
def create_seasonality_stripes():
    width, height = 1200, 400
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    # Title
    draw.text((width//2, 30), "Retail Sales Seasonality - 2024", 
              fill='black', font=font_large, anchor='mm')
    
    # Data
    monthly_data = [450, 420, 480, 500, 520, 550, 580, 560, 530, 600, 650, 900]
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    # Normalize data for color mapping
    min_val = min(monthly_data)
    max_val = max(monthly_data)
    
    # Stripe parameters
    stripe_width = width // 12
    stripe_y_start = 100
    stripe_height = 150
    
    # Color gradient (red to yellow to green)
    for i, (month, value) in enumerate(zip(months, monthly_data)):
        x0 = i * stripe_width
        x1 = x0 + stripe_width
        y0 = stripe_y_start
        y1 = y0 + stripe_height
        
        # Normalize value (0 to 1)
        normalized = (value - min_val) / (max_val - min_val)
        
        # Color mapping: red (low) -> yellow (mid) -> green (high)
        if normalized < 0.5:
            # Red to Yellow
            r = 255
            g = int(255 * normalized * 2)
            b = 0
        else:
            # Yellow to Green
            r = int(255 * (1 - (normalized - 0.5) * 2))
            g = 255
            b = 0
        
        # Draw stripe
        draw.rectangle([x0, y0, x1, y1], fill=(r, g, b))
        
        # Month label
        draw.text((x0 + stripe_width // 2, y0 - 25), month, 
                  fill='black', font=font_small, anchor='mm')
        
        # Value label
        text_color = 'white' if normalized < 0.3 else 'black'
        draw.text((x0 + stripe_width // 2, y0 + stripe_height // 2), 
                  str(value), fill=text_color, font=font_medium, anchor='mm')
    
    # Colorbar
    bar_y = stripe_y_start + stripe_height + 40
    bar_height = 20
    bar_width = width - 200
    bar_x_start = 100
    
    # Draw gradient
    for i in range(bar_width):
        normalized = i / bar_width
        if normalized < 0.5:
            r = 255
            g = int(255 * normalized * 2)
            b = 0
        else:
            r = int(255 * (1 - (normalized - 0.5) * 2))
            g = 255
            b = 0
        draw.line([(bar_x_start + i, bar_y), (bar_x_start + i, bar_y + bar_height)], 
                 fill=(r, g, b), width=1)
    
    # Labels
    draw.text((bar_x_start, bar_y + bar_height + 10), str(min_val), 
              fill='black', font=font_small, anchor='lm')
    draw.text((bar_x_start + bar_width, bar_y + bar_height + 10), str(max_val), 
              fill='black', font=font_small, anchor='rm')
    draw.text((bar_x_start + bar_width // 2, bar_y + bar_height + 10), "Sales Volume", 
              fill='black', font=font_small, anchor='mm')
    
    img.save('public/DS-18/seasonality_stripes.png')
    print("Created: seasonality_stripes.png")

# --- Image 3: Stationarity Comparison ---
def create_stationarity_comparison():
    width, height = 1200, 900
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    # Title
    draw.text((width//2, 20), "Stationary vs Non-Stationary Time Series", 
              fill='black', font=font_large, anchor='mm')
    
    # Plot parameters
    plot_margin = 100
    plot_width = width - 2 * plot_margin
    plot_height = (height - 100) // 2 - 50
    
    # --- Plot 1: Stationary ---
    plot1_y_start = 80
    plot1_y_end = plot1_y_start + plot_height
    
    # Draw axes
    draw.line([(plot_margin, plot1_y_start), (plot_margin, plot1_y_end)], fill='black', width=2)
    draw.line([(plot_margin, plot1_y_end), (width - plot_margin, plot1_y_end)], fill='black', width=2)
    
    # Labels
    draw.text((plot_margin - 20, (plot1_y_start + plot1_y_end) // 2), "Value", 
              fill='black', font=font_small, anchor='mm')
    draw.text((width // 2, plot1_y_end + 20), "Days", fill='black', font=font_small, anchor='mm')
    draw.text((width // 2, plot1_y_start - 20), "Stationary Time Series", 
              fill='black', font=font_medium, anchor='mm')
    
    # Mean line
    mean_y = plot1_y_start + plot_height // 2
    draw.line([(plot_margin, mean_y), (width - plot_margin, mean_y)], 
             fill='red', width=2)
    draw.text((width - plot_margin + 10, mean_y), "Mean = 100", 
              fill='red', font=font_small, anchor='lm')
    
    # Draw random data points (simplified)
    import random
    random.seed(42)
    num_points = 200
    prev_x = plot_margin
    prev_y = mean_y
    for i in range(1, num_points):
        x = plot_margin + (i * plot_width // num_points)
        y = mean_y + random.randint(-30, 30)
        draw.line([(prev_x, prev_y), (x, y)], fill='blue', width=1)
        prev_x, prev_y = x, y
    
    # --- Plot 2: Non-Stationary ---
    plot2_y_start = plot1_y_end + 50
    plot2_y_end = plot2_y_start + plot_height
    
    # Draw axes
    draw.line([(plot_margin, plot2_y_start), (plot_margin, plot2_y_end)], fill='black', width=2)
    draw.line([(plot_margin, plot2_y_end), (width - plot_margin, plot2_y_end)], fill='black', width=2)
    
    # Labels
    draw.text((plot_margin - 20, (plot2_y_start + plot2_y_end) // 2), "Value", 
              fill='black', font=font_small, anchor='mm')
    draw.text((width // 2, plot2_y_end + 20), "Days", fill='black', font=font_small, anchor='mm')
    draw.text((width // 2, plot2_y_start - 20), "Non-Stationary Time Series (Trend + Seasonality)", 
              fill='black', font=font_medium, anchor='mm')
    
    # Draw trend + seasonality
    import math
    random.seed(42)
    prev_x = plot_margin
    prev_y = plot2_y_start + plot_height // 2
    for i in range(1, num_points):
        x = plot_margin + (i * plot_width // num_points)
        # Trend: increasing
        trend = (i / num_points) * plot_height * 0.3
        # Seasonality: sine wave
        season = math.sin(i / num_points * 4 * math.pi) * plot_height * 0.2
        # Noise
        noise = random.randint(-15, 15)
        y = plot2_y_start + plot_height // 2 - trend - season + noise
        draw.line([(prev_x, prev_y), (x, y)], fill='green', width=1)
        prev_x, prev_y = x, y
    
    # Trend line
    trend_y_start = plot2_y_start + plot_height // 2
    trend_y_end = plot2_y_start + plot_height // 2 - plot_height * 0.3
    draw.line([(plot_margin, trend_y_start), (width - plot_margin, trend_y_end)], 
             fill='red', width=2, joint='curve')
    draw.text((width - plot_margin + 10, (trend_y_start + trend_y_end) // 2), "Trend", 
              fill='red', font=font_small, anchor='lm')
    
    img.save('public/DS-18/stationarity_comparison.png')
    print("Created: stationarity_comparison.png")

# --- Generate all images ---
print("Generating DS-18 images...")
create_recurrence_calendar()
create_seasonality_stripes()
create_stationarity_comparison()
print("\nAll images for DS-18 created successfully!")

