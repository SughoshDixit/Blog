from PIL import Image, ImageDraw, ImageFont
import os
import math

# Create directory if it doesn't exist
os.makedirs('public/DS-19', exist_ok=True)

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

# --- Image 1: Confusion Matrix ---
def create_confusion_matrix():
    width, height = 800, 600
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    # Title
    draw.text((width//2, 30), "Confusion Matrix", fill='black', font=font_large, anchor='mm')
    
    # Matrix parameters
    matrix_size = 300
    matrix_x_start = (width - matrix_size) // 2
    matrix_y_start = 150
    cell_size = matrix_size // 2
    cell_padding = 10
    
    # Colors
    colors = {
        'TP': '#d4edda',  # Light green
        'FP': '#f8d7da',  # Light red
        'TN': '#d1ecf1',  # Light blue
        'FN': '#fff3cd'   # Light yellow
    }
    
    # Labels
    labels = [
        [('TP', colors['TP'], 'True\nPositive'), ('FP', colors['FP'], 'False\nPositive')],
        [('FN', colors['FN'], 'False\nNegative'), ('TN', colors['TN'], 'True\nNegative')]
    ]
    
    # Draw matrix
    for row in range(2):
        for col in range(2):
            x0 = matrix_x_start + col * cell_size
            y0 = matrix_y_start + row * cell_size
            x1 = x0 + cell_size
            y1 = y0 + cell_size
            
            label, color, description = labels[row][col]
            
            # Draw cell
            draw.rectangle([x0 + cell_padding, y0 + cell_padding, 
                          x1 - cell_padding, y1 - cell_padding], 
                         fill=color, outline='black', width=3)
            
            # Draw label
            draw.text((x0 + cell_size // 2, y0 + cell_size // 2 - 15), label, 
                     fill='black', font=font_medium, anchor='mm', fontweight='bold')
            draw.text((x0 + cell_size // 2, y0 + cell_size // 2 + 10), description, 
                     fill='black', font=font_tiny, anchor='mm')
    
    # Column headers
    draw.text((matrix_x_start + cell_size // 2, matrix_y_start - 40), "Predicted\nPositive", 
              fill='black', font=font_small, anchor='mm')
    draw.text((matrix_x_start + cell_size * 1.5, matrix_y_start - 40), "Predicted\nNegative", 
              fill='black', font=font_small, anchor='mm')
    
    # Row headers
    draw.text((matrix_x_start - 60, matrix_y_start + cell_size // 2), "Actual\nPositive", 
              fill='black', font=font_small, anchor='mm')
    draw.text((matrix_x_start - 60, matrix_y_start + cell_size * 1.5), "Actual\nNegative", 
              fill='black', font=font_small, anchor='mm')
    
    # Arrows
    draw.line([(matrix_x_start - 30, matrix_y_start), (matrix_x_start - 10, matrix_y_start)], 
             fill='black', width=2)
    draw.line([(matrix_x_start, matrix_y_start - 30), (matrix_x_start, matrix_y_start - 10)], 
             fill='black', width=2)
    
    img.save('public/DS-19/confusion_matrix.png')
    print("Created: confusion_matrix.png")

# --- Image 2: PR Trade-off ---
def create_pr_tradeoff():
    width, height = 1000, 600
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    # Title
    draw.text((width//2, 30), "Precision-Recall Trade-off", fill='black', font=font_large, anchor='mm')
    
    # Plot area
    plot_margin = 100
    plot_width = width - 2 * plot_margin
    plot_height = height - 2 * plot_margin
    plot_x_start = plot_margin
    plot_y_start = plot_margin
    
    # Draw axes
    draw.line([(plot_x_start, plot_y_start), (plot_x_start, plot_y_start + plot_height)], 
             fill='black', width=3)
    draw.line([(plot_x_start, plot_y_start + plot_height), 
              (plot_x_start + plot_width, plot_y_start + plot_height)], fill='black', width=3)
    
    # Labels
    draw.text((plot_x_start - 30, plot_y_start), "Precision", fill='black', font=font_medium, anchor='mm')
    draw.text((plot_x_start + plot_width // 2, plot_y_start + plot_height + 40), "Recall", 
             fill='black', font=font_medium, anchor='mm')
    
    # Draw two scenarios
    # Scenario 1: High Precision, Low Recall
    scenario1_x = plot_x_start + plot_width * 0.2
    scenario1_y = plot_y_start + plot_height * 0.2
    draw.ellipse([scenario1_x - 15, scenario1_y - 15, scenario1_x + 15, scenario1_y + 15], 
                fill='#28a745', outline='black', width=2)
    draw.text((scenario1_x, scenario1_y + 30), "High P\nLow R", fill='black', font=font_small, anchor='mm')
    
    # Scenario 2: Low Precision, High Recall
    scenario2_x = plot_x_start + plot_width * 0.8
    scenario2_y = plot_y_start + plot_height * 0.8
    draw.ellipse([scenario2_x - 15, scenario2_y - 15, scenario2_x + 15, scenario2_y + 15], 
                fill='#dc3545', outline='black', width=2)
    draw.text((scenario2_x, scenario2_y + 30), "Low P\nHigh R", fill='black', font=font_small, anchor='mm')
    
    # Draw arrow showing trade-off
    draw.line([(scenario1_x, scenario1_y), (scenario2_x, scenario2_y)], 
             fill='gray', width=2)
    draw.text((plot_x_start + plot_width // 2, plot_y_start + plot_height // 2), 
             "Trade-off", fill='gray', font=font_medium, anchor='mm')
    
    # Axis ticks
    for i in range(6):
        x = plot_x_start + (i * plot_width // 5)
        y = plot_y_start + plot_height
        draw.line([(x, y), (x, y + 5)], fill='black', width=2)
        draw.text((x, y + 15), f"{i/5:.1f}", fill='black', font=font_tiny, anchor='mm')
        
        y_val = plot_y_start + plot_height - (i * plot_height // 5)
        draw.line([(plot_x_start - 5, y_val), (plot_x_start, y_val)], fill='black', width=2)
        draw.text((plot_x_start - 15, y_val), f"{1 - i/5:.1f}", fill='black', font=font_tiny, anchor='rm')
    
    img.save('public/DS-19/pr_tradeoff.png')
    print("Created: pr_tradeoff.png")

# --- Image 3: PR Curve ---
def create_pr_curve():
    width, height = 1000, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    # Title
    draw.text((width//2, 30), "Precision-Recall Curve", fill='black', font=font_large, anchor='mm')
    
    # Plot area
    plot_margin = 100
    plot_width = width - 2 * plot_margin
    plot_height = height - 2 * plot_margin
    plot_x_start = plot_margin
    plot_y_start = plot_margin
    
    # Draw axes
    draw.line([(plot_x_start, plot_y_start), (plot_x_start, plot_y_start + plot_height)], 
             fill='black', width=3)
    draw.line([(plot_x_start, plot_y_start + plot_height), 
              (plot_x_start + plot_width, plot_y_start + plot_height)], fill='black', width=3)
    
    # Labels
    draw.text((plot_x_start - 30, plot_y_start), "Precision", fill='black', font=font_medium, anchor='mm')
    draw.text((plot_x_start + plot_width // 2, plot_y_start + plot_height + 40), "Recall", 
             fill='black', font=font_medium, anchor='mm')
    
    # Draw PR curve (simulated)
    points = []
    num_points = 50
    for i in range(num_points):
        recall = i / (num_points - 1)
        # Simulate PR curve: precision decreases as recall increases
        precision = 1.0 - (recall ** 1.5) * 0.6
        
        x = plot_x_start + recall * plot_width
        y = plot_y_start + plot_height - (precision * plot_height)
        points.append((int(x), int(y)))
    
    # Draw curve
    for i in range(len(points) - 1):
        draw.line([points[i], points[i+1]], fill='#28a745', width=3)
    
    # Draw threshold points
    thresholds = [0.3, 0.5, 0.7]
    colors = ['#ffc107', '#fd7e14', '#dc3545']
    for threshold, color in zip(thresholds, colors):
        recall = threshold
        precision = 1.0 - (recall ** 1.5) * 0.6
        
        x = plot_x_start + recall * plot_width
        y = plot_y_start + plot_height - (precision * plot_height)
        
        draw.ellipse([x - 8, y - 8, x + 8, y + 8], fill=color, outline='black', width=2)
        draw.text((x, y - 20), f"T={threshold}", fill='black', font=font_tiny, anchor='mm')
    
    # Axis ticks
    for i in range(6):
        x = plot_x_start + (i * plot_width // 5)
        y = plot_y_start + plot_height
        draw.line([(x, y), (x, y + 5)], fill='black', width=2)
        draw.text((x, y + 15), f"{i/5:.1f}", fill='black', font=font_tiny, anchor='mm')
        
        y_val = plot_y_start + plot_height - (i * plot_height // 5)
        draw.line([(plot_x_start - 5, y_val), (plot_x_start, y_val)], fill='black', width=2)
        draw.text((plot_x_start - 15, y_val), f"{1 - i/5:.1f}", fill='black', font=font_tiny, anchor='rm')
    
    img.save('public/DS-19/pr_curve.png')
    print("Created: pr_curve.png")

# --- Image 4: PR Curve with F1 Points ---
def create_pr_curve_f1():
    width, height = 1000, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    # Title
    draw.text((width//2, 30), "PR Curve with F1 Score Points", fill='black', font=font_large, anchor='mm')
    
    # Plot area
    plot_margin = 100
    plot_width = width - 2 * plot_margin
    plot_height = height - 2 * plot_margin
    plot_x_start = plot_margin
    plot_y_start = plot_margin
    
    # Draw axes
    draw.line([(plot_x_start, plot_y_start), (plot_x_start, plot_y_start + plot_height)], 
             fill='black', width=3)
    draw.line([(plot_x_start, plot_y_start + plot_height), 
              (plot_x_start + plot_width, plot_y_start + plot_height)], fill='black', width=3)
    
    # Labels
    draw.text((plot_x_start - 30, plot_y_start), "Precision", fill='black', font=font_medium, anchor='mm')
    draw.text((plot_x_start + plot_width // 2, plot_y_start + plot_height + 40), "Recall", 
             fill='black', font=font_medium, anchor='mm')
    
    # Draw PR curve
    points = []
    num_points = 50
    for i in range(num_points):
        recall = i / (num_points - 1)
        precision = 1.0 - (recall ** 1.5) * 0.6
        x = plot_x_start + recall * plot_width
        y = plot_y_start + plot_height - (precision * plot_height)
        points.append((int(x), int(y)))
    
    for i in range(len(points) - 1):
        draw.line([points[i], points[i+1]], fill='#28a745', width=3)
    
    # Draw F1 isoclines (contours of constant F1)
    f1_values = [0.3, 0.5, 0.7, 0.9]
    for f1 in f1_values:
        # F1 = 2PR/(P+R), so for constant F1: P = F1*R / (2*R - F1)
        f1_points = []
        for r in range(1, 100):
            recall = r / 100
            if 2 * recall - f1 > 0:
                precision = (f1 * recall) / (2 * recall - f1)
                if 0 <= precision <= 1:
                    x = plot_x_start + recall * plot_width
                    y = plot_y_start + plot_height - (precision * plot_height)
                    f1_points.append((int(x), int(y)))
        
        if len(f1_points) > 1:
            for i in range(len(f1_points) - 1):
                draw.line([f1_points[i], f1_points[i+1]], fill='#6c757d', width=1)
    
    # Highlight optimal F1 point
    optimal_recall = 0.6
    optimal_precision = 1.0 - (optimal_recall ** 1.5) * 0.6
    optimal_x = plot_x_start + optimal_recall * plot_width
    optimal_y = plot_y_start + plot_height - (optimal_precision * plot_height)
    
    draw.ellipse([optimal_x - 12, optimal_y - 12, optimal_x + 12, optimal_y + 12], 
                fill='#ffc107', outline='black', width=3)
    draw.text((optimal_x, optimal_y - 25), "Optimal F1", fill='black', font=font_small, anchor='mm')
    
    # Axis ticks
    for i in range(6):
        x = plot_x_start + (i * plot_width // 5)
        y = plot_y_start + plot_height
        draw.line([(x, y), (x, y + 5)], fill='black', width=2)
        draw.text((x, y + 15), f"{i/5:.1f}", fill='black', font=font_tiny, anchor='mm')
        
        y_val = plot_y_start + plot_height - (i * plot_height // 5)
        draw.line([(plot_x_start - 5, y_val), (plot_x_start, y_val)], fill='black', width=2)
        draw.text((plot_x_start - 15, y_val), f"{1 - i/5:.1f}", fill='black', font=font_tiny, anchor='rm')
    
    img.save('public/DS-19/pr_curve_f1.png')
    print("Created: pr_curve_f1.png")

# --- Generate all images ---
print("Generating DS-19 images...")
create_confusion_matrix()
create_pr_tradeoff()
create_pr_curve()
create_pr_curve_f1()
print("\nAll images for DS-19 created successfully!")

