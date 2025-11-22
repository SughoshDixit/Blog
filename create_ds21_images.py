from PIL import Image, ImageDraw, ImageFont
import os

# Create directory if it doesn't exist
os.makedirs('public/DS-21', exist_ok=True)

try:
    font_large = ImageFont.truetype("arial.ttf", 20)
    font_medium = ImageFont.truetype("arial.ttf", 16)
    font_small = ImageFont.truetype("arial.ttf", 12)
    font_tiny = ImageFont.truetype("arial.ttf", 10)
except:
    font_large = ImageFont.load_default()
    font_medium = ImageFont.load_default()
    font_small = ImageFont.load_default()
    font_tiny = ImageFont.load_default()

# Helper function to draw table
def draw_table(draw, x_start, y_start, headers, rows, cell_width=100, cell_height=40, title=""):
    if title:
        draw.text((x_start, y_start - 30), title, fill='black', font=font_medium, anchor='lm')
    
    num_cols = len(headers)
    num_rows = len(rows)
    
    # Header row
    for col, header in enumerate(headers):
        x = x_start + col * cell_width
        y = y_start
        draw.rectangle([x, y, x + cell_width, y + cell_height], 
                      fill='#e9ecef', outline='black', width=2)
        draw.text((x + cell_width // 2, y + cell_height // 2), header, 
                 fill='black', font=font_small, anchor='mm')
    
    # Data rows
    for row_idx, row_data in enumerate(rows):
        y = y_start + (row_idx + 1) * cell_height
        for col, cell_value in enumerate(row_data):
            x = x_start + col * cell_width
            fill_color = '#ffffff' if row_idx % 2 == 0 else '#f8f9fa'
            draw.rectangle([x, y, x + cell_width, y + cell_height], 
                          fill=fill_color, outline='black', width=1)
            draw.text((x + cell_width // 2, y + cell_height // 2), str(cell_value), 
                     fill='black', font=font_small, anchor='mm')

# --- Image 1: Basic Contingency Table ---
def create_basic_contingency_table():
    width, height = 800, 600
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    x_start = 200
    y_start = 150
    
    headers = ['', 'Alerted', 'Not Alerted', 'Total']
    rows = [
        ['Fraud Detected', '600', '50', '650'],
        ['No Fraud', '1,400', '9,950', '11,350'],
        ['Total', '2,000', '10,000', '12,000']
    ]
    
    draw_table(draw, x_start, y_start, headers, rows, cell_width=120, cell_height=50, 
              title="Basic Contingency Table: Fraud Detection")
    
    # Highlight key cells
    highlight_cells = [(1, 0), (1, 1)]  # Fraud Detected row
    for row, col in highlight_cells:
        x = x_start + (col + 1) * 120
        y = y_start + (row + 1) * 50
        draw.rectangle([x, y, x + 120, y + 50], 
                      fill='#d4edda', outline='#28a745', width=3)
        draw.text((x + 120 // 2, y + 50 // 2), rows[row][col+1], 
                 fill='#155724', font=font_small, anchor='mm')
    
    img.save('public/DS-21/basic_contingency_table.png')
    print("Created: basic_contingency_table.png")

# --- Image 2: Contingency Rates ---
def create_contingency_rates():
    width, height = 1000, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Rates in Contingency Tables", fill='black', font=font_large, anchor='mm')
    
    # Left: Row rates
    x1 = 100
    y1 = 100
    headers1 = ['', 'Alerted', 'Not Alerted', 'Row Rate']
    rows1 = [
        ['Fraud', '600', '50', '30.0%'],
        ['No Fraud', '1,400', '9,950', '0.5%']
    ]
    draw_table(draw, x1, y1, headers1, rows1, cell_width=100, cell_height=50)
    draw.text((x1 + 200, y1 - 30), "Row Rates (Conditional on Outcome)", 
             fill='black', font=font_medium, anchor='lm')
    
    # Right: Column rates
    x2 = 550
    y2 = 100
    headers2 = ['', 'Alerted', 'Not Alerted']
    rows2 = [
        ['Fraud', '30.0%', '0.5%'],
        ['No Fraud', '70.0%', '99.5%']
    ]
    draw_table(draw, x2, y2, headers2, rows2, cell_width=100, cell_height=50)
    draw.text((x2 + 150, y2 - 30), "Column Rates (Conditional on Alert Status)", 
             fill='black', font=font_medium, anchor='lm')
    
    img.save('public/DS-21/contingency_rates.png')
    print("Created: contingency_rates.png")

# --- Image 3: Bin-Wise Uplift ---
def create_binwise_uplift():
    width, height = 900, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Bin-Wise Uplift Analysis", fill='black', font=font_large, anchor='mm')
    
    x_start = 150
    y_start = 100
    
    headers = ['Amount Bin', 'Alerted', 'Not Alerted', 'Uplift']
    rows = [
        ['$0-$100', '90% (100)', '1% (1,000)', '89 pp'],
        ['$100-$500', '50% (400)', '4% (5,000)', '46 pp'],
        ['$500+', '62% (500)', '6% (4,000)', '56 pp']
    ]
    
    draw_table(draw, x_start, y_start, headers, rows, cell_width=150, cell_height=60)
    
    # Color code by uplift
    uplift_colors = ['#d4edda', '#fff3cd', '#d1ecf1']  # Green, yellow, blue
    for i, row in enumerate(rows):
        y = y_start + (i + 1) * 60
        x = x_start + 3 * 150  # Uplift column
        draw.rectangle([x, y, x + 150, y + 60], 
                      fill=uplift_colors[i], outline='black', width=2)
        draw.text((x + 150 // 2, y + 60 // 2), row[3], 
                 fill='black', font=font_medium, anchor='mm')
    
    img.save('public/DS-21/binwise_uplift.png')
    print("Created: binwise_uplift.png")

# --- Image 4: Marginalization ---
def create_marginalization():
    width, height = 1000, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Marginalization: Aggregating Across Dimensions", 
             fill='black', font=font_large, anchor='mm')
    
    # Left: 2D table
    x1 = 100
    y1 = 100
    headers1 = ['Amount Bin', 'Alerted', 'Not Alerted', 'Total']
    rows1 = [
        ['$0-$100', '100', '1,000', '1,100'],
        ['$100-$500', '400', '5,000', '5,400'],
        ['$500+', '500', '4,000', '4,500']
    ]
    draw_table(draw, x1, y1, headers1, rows1, cell_width=120, cell_height=50)
    draw.text((x1 + 240, y1 - 30), "2D Table (Before Marginalization)", 
             fill='black', font=font_medium, anchor='lm')
    
    # Arrow
    arrow_x = x1 + 480
    arrow_y = y1 + 100
    draw.line([(arrow_x, arrow_y), (arrow_x + 80, arrow_y)], fill='black', width=3)
    draw.polygon([(arrow_x + 80, arrow_y), (arrow_x + 65, arrow_y - 8), (arrow_x + 65, arrow_y + 8)], 
                fill='black')
    draw.text((arrow_x + 40, arrow_y - 25), "Sum", fill='black', font=font_small, anchor='mm')
    
    # Right: 1D marginal
    x2 = 650
    y2 = 100
    headers2 = ['Amount Bin', 'Total']
    rows2 = [
        ['$0-$100', '1,100'],
        ['$100-$500', '5,400'],
        ['$500+', '4,500'],
        ['Total', '11,000']
    ]
    draw_table(draw, x2, y2, headers2, rows2, cell_width=150, cell_height=50)
    draw.text((x2 + 150, y2 - 30), "1D Marginal (After Marginalization)", 
             fill='black', font=font_medium, anchor='lm')
    
    # Warning text
    draw.text((width//2, height - 80), 
             "⚠️ Warning: Marginalization loses bin-wise effectiveness information!", 
             fill='#dc3545', font=font_medium, anchor='mm')
    
    img.save('public/DS-21/marginalization.png')
    print("Created: marginalization.png")

# --- Image 5: Simpson's Paradox ---
def create_simpsons_paradox():
    width, height = 1000, 800
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Simpson's Paradox: When Aggregation Misleads", 
             fill='black', font=font_large, anchor='mm')
    
    # Hospital A
    x1 = 100
    y1 = 100
    draw.text((x1 + 200, y1 - 30), "Hospital A (Low Severity)", 
             fill='black', font=font_medium, anchor='lm')
    headers1 = ['Treatment', 'Success', 'Total', 'Rate']
    rows1 = [
        ['Treatment 1', '90', '100', '90%'],
        ['Treatment 2', '80', '100', '80%']
    ]
    draw_table(draw, x1, y1, headers1, rows1, cell_width=100, cell_height=50)
    
    # Hospital B
    y2 = 300
    draw.text((x1 + 200, y2 - 30), "Hospital B (High Severity)", 
             fill='black', font=font_medium, anchor='lm')
    rows2 = [
        ['Treatment 1', '50', '100', '50%'],
        ['Treatment 2', '60', '100', '60%']
    ]
    draw_table(draw, x1, y2, headers1, rows2, cell_width=100, cell_height=50)
    
    # Aggregated
    x2 = 550
    y3 = 200
    draw.text((x2 + 200, y3 - 30), "Aggregated (Both Hospitals)", 
             fill='#dc3545', font=font_medium, anchor='lm')
    rows3 = [
        ['Treatment 1', '140', '200', '70%'],
        ['Treatment 2', '140', '200', '70%']
    ]
    draw_table(draw, x2, y3, headers1, rows3, cell_width=100, cell_height=50)
    
    # Warning
    draw.text((width//2, height - 60), 
             "⚠️ Aggregated view hides that Treatment 1 is better for low severity,", 
             fill='#dc3545', font=font_small, anchor='mm')
    draw.text((width//2, height - 40), 
             "and Treatment 2 is better for high severity!", 
             fill='#dc3545', font=font_small, anchor='mm')
    
    img.save('public/DS-21/simpsons_paradox.png')
    print("Created: simpsons_paradox.png")

# --- Image 6: Side-by-Side Heatmaps ---
def create_heatmaps_alerts_effectiveness():
    width, height = 1000, 600
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Side-by-Side Heatmaps: Alerts vs Effectiveness", 
             fill='black', font=font_large, anchor='mm')
    
    # Left heatmap: Alert counts
    heatmap_x1 = 100
    heatmap_y = 100
    heatmap_width = 300
    heatmap_height = 400
    
    draw.text((heatmap_x1 + heatmap_width // 2, heatmap_y - 30), "Alert Counts", 
             fill='black', font=font_medium, anchor='mm')
    
    bins = ['$0-$100', '$100-$500', '$500+']
    alert_counts = [100, 400, 500]
    max_alerts = max(alert_counts)
    
    for i, (bin_name, count) in enumerate(zip(bins, alert_counts)):
        y = heatmap_y + i * (heatmap_height // 3)
        height_cell = heatmap_height // 3
        
        # Color intensity based on count
        intensity = count / max_alerts
        r = int(255 * (1 - intensity * 0.5))
        g = int(200 + 55 * intensity)
        b = int(200 + 55 * intensity)
        
        draw.rectangle([heatmap_x1, y, heatmap_x1 + heatmap_width, y + height_cell], 
                      fill=(r, g, b), outline='black', width=2)
        draw.text((heatmap_x1 + heatmap_width // 2, y + height_cell // 2), 
                 f"{bin_name}\n{count}", fill='black', font=font_small, anchor='mm')
    
    # Right heatmap: Effectiveness rates
    heatmap_x2 = 550
    draw.text((heatmap_x2 + heatmap_width // 2, heatmap_y - 30), "Effectiveness Rates", 
             fill='black', font=font_medium, anchor='mm')
    
    effectiveness_rates = [90, 50, 62]
    max_rate = max(effectiveness_rates)
    
    for i, (bin_name, rate) in enumerate(zip(bins, effectiveness_rates)):
        y = heatmap_y + i * (heatmap_height // 3)
        height_cell = heatmap_height // 3
        
        # Color intensity based on rate
        intensity = rate / max_rate
        r = int(200 + 55 * intensity)
        g = int(255 * (1 - intensity * 0.3))
        b = int(200 + 55 * intensity)
        
        draw.rectangle([heatmap_x2, y, heatmap_x2 + heatmap_width, y + height_cell], 
                      fill=(r, g, b), outline='black', width=2)
        draw.text((heatmap_x2 + heatmap_width // 2, y + height_cell // 2), 
                 f"{bin_name}\n{rate}%", fill='black', font=font_small, anchor='mm')
    
    img.save('public/DS-21/heatmaps_alerts_effectiveness.png')
    print("Created: heatmaps_alerts_effectiveness.png")

# --- Image 7: Problematic Bin ---
def create_problematic_bin():
    width, height = 900, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Exercise: Identifying Problematic Bins", 
             fill='black', font=font_large, anchor='mm')
    
    x_start = 150
    y_start = 100
    
    # Month 1
    draw.text((x_start + 200, y_start - 30), "Month 1", fill='black', font=font_medium, anchor='lm')
    headers = ['Bin', 'Alerts', 'Effective', 'Rate']
    rows1 = [
        ['Bin A', '100', '80', '80%'],
        ['Bin B', '200', '120', '60%'],
        ['Bin C', '300', '150', '50%']
    ]
    draw_table(draw, x_start, y_start, headers, rows1, cell_width=100, cell_height=50)
    
    # Month 2
    y_start2 = 350
    draw.text((x_start + 200, y_start2 - 30), "Month 2", fill='black', font=font_medium, anchor='lm')
    rows2 = [
        ['Bin A', '120', '90', '75%'],  # Alerts ↑, Rate ↓
        ['Bin B', '250', '180', '72%'],  # Alerts ↑, Rate ↑
        ['Bin C', '350', '200', '57%']   # Alerts ↑, Rate ↑
    ]
    draw_table(draw, x_start, y_start2, headers, rows2, cell_width=100, cell_height=50)
    
    # Highlight problematic bin
    x_bin = x_start + 100
    y_bin = y_start2 + 50
    draw.rectangle([x_bin, y_bin, x_bin + 100, y_bin + 50], 
                  fill='#fff3cd', outline='#ffc107', width=4)
    draw.text((x_bin + 100 // 2, y_bin + 50 // 2), 'Bin A', 
             fill='#856404', font=font_medium, anchor='mm')
    
    # Arrow and annotation
    arrow_x = x_bin + 150
    arrow_y = y_bin + 25
    draw.line([(arrow_x, arrow_y), (arrow_x + 100, arrow_y)], fill='#dc3545', width=3)
    draw.text((arrow_x + 50, arrow_y - 20), "⚠️ Problematic!", 
             fill='#dc3545', font=font_medium, anchor='mm')
    draw.text((arrow_x + 50, arrow_y + 10), "Alerts ↑ (100→120)", 
             fill='#dc3545', font=font_small, anchor='mm')
    draw.text((arrow_x + 50, arrow_y + 30), "Rate ↓ (80%→75%)", 
             fill='#dc3545', font=font_small, anchor='mm')
    
    img.save('public/DS-21/problematic_bin.png')
    print("Created: problematic_bin.png")

# --- Generate all images ---
print("Generating DS-21 images...")
create_basic_contingency_table()
create_contingency_rates()
create_binwise_uplift()
create_marginalization()
create_simpsons_paradox()
create_heatmaps_alerts_effectiveness()
create_problematic_bin()
print("\nAll images for DS-21 created successfully!")

