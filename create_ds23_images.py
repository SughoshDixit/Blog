from PIL import Image, ImageDraw, ImageFont
import os

# Create directory if it doesn't exist
os.makedirs('public/DS-23', exist_ok=True)

try:
    font_large = ImageFont.truetype("arial.ttf", 22)
    font_medium = ImageFont.truetype("arial.ttf", 16)
    font_small = ImageFont.truetype("arial.ttf", 12)
    font_tiny = ImageFont.truetype("arial.ttf", 10)
except:
    font_large = ImageFont.load_default()
    font_medium = ImageFont.load_default()
    font_small = ImageFont.load_default()
    font_tiny = ImageFont.load_default()

# Colors
BLUE = '#17a2b8'
RED = '#dc3545'
GREEN = '#28a745'
YELLOW = '#ffc107'
PURPLE = '#6f42c1'
ORANGE = '#fd7e14'
GRAY = '#6c757d'
LIGHT_BLUE = '#d1ecf1'
LIGHT_RED = '#f8d7da'
LIGHT_GREEN = '#d4edda'
LIGHT_YELLOW = '#fff3cd'
LIGHT_PURPLE = '#e2d5f1'

# --- Image 1: Indicator Function ---
def create_indicator_function():
    width, height = 900, 600
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Indicator Function: 𝟙{x ≥ 50}", fill='black', font=font_large, anchor='mm')
    
    # Draw axes
    margin = 80
    graph_width = width - 2 * margin
    graph_height = 300
    origin_x = margin
    origin_y = 400
    
    # X-axis
    draw.line([(origin_x, origin_y), (origin_x + graph_width, origin_y)], fill='black', width=2)
    # Y-axis
    draw.line([(origin_x, origin_y), (origin_x, origin_y - graph_height)], fill='black', width=2)
    
    # Labels
    draw.text((origin_x + graph_width + 20, origin_y), "x", fill='black', font=font_medium, anchor='lm')
    draw.text((origin_x - 10, origin_y - graph_height - 20), "𝟙{x ≥ 50}", fill='black', font=font_medium, anchor='rm')
    
    # Threshold line
    threshold_x = origin_x + graph_width // 2
    draw.line([(threshold_x, origin_y + 10), (threshold_x, origin_y - graph_height - 10)], 
              fill=GRAY, width=1)
    draw.text((threshold_x, origin_y + 25), "50", fill='black', font=font_small, anchor='mm')
    
    # Draw step function
    # BTL region (0)
    draw.line([(origin_x, origin_y), (threshold_x, origin_y)], fill=RED, width=4)
    # ATL region (1)
    y_one = origin_y - graph_height + 50
    draw.line([(threshold_x, y_one), (origin_x + graph_width, y_one)], fill=GREEN, width=4)
    # Vertical step
    draw.line([(threshold_x, origin_y), (threshold_x, y_one)], fill=PURPLE, width=2)
    
    # Y-axis labels
    draw.text((origin_x - 15, origin_y), "0", fill='black', font=font_small, anchor='rm')
    draw.text((origin_x - 15, y_one), "1", fill='black', font=font_small, anchor='rm')
    
    # Annotations
    draw.text((origin_x + graph_width // 4, origin_y - 40), "BTL (x < 50)", fill=RED, font=font_medium, anchor='mm')
    draw.text((origin_x + 3 * graph_width // 4, y_one - 40), "ATL (x ≥ 50)", fill=GREEN, font=font_medium, anchor='mm')
    
    # Examples
    example_y = 520
    draw.text((width//2, example_y), "Examples:", fill='black', font=font_medium, anchor='mm')
    draw.text((width//2, example_y + 25), "x = 67: 𝟙{67 ≥ 50} = 1 ✓   |   x = 23: 𝟙{23 ≥ 50} = 0 ✗", 
              fill=GRAY, font=font_small, anchor='mm')
    
    img.save('public/DS-23/indicator_function.png')
    print("Created: indicator_function.png")

# --- Image 2: ATL vs BTL Indicator ---
def create_atl_btl_indicator():
    width, height = 900, 650
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "ATL vs BTL: Complementary Indicators", fill='black', font=font_large, anchor='mm')
    
    # Draw two graphs side by side
    margin = 60
    graph_width = 350
    graph_height = 200
    
    # Left graph: ATL
    left_x = margin
    left_y = 280
    
    draw.text((left_x + graph_width//2, 100), "ATL(x) = 𝟙{x ≥ t}", fill=GREEN, font=font_medium, anchor='mm')
    
    # Axes
    draw.line([(left_x, left_y), (left_x + graph_width, left_y)], fill='black', width=2)
    draw.line([(left_x, left_y), (left_x, left_y - graph_height)], fill='black', width=2)
    
    threshold_x = left_x + graph_width // 2
    draw.line([(left_x, left_y), (threshold_x, left_y)], fill=GRAY, width=3)
    draw.line([(threshold_x, left_y - graph_height + 30), (left_x + graph_width, left_y - graph_height + 30)], 
              fill=GREEN, width=4)
    draw.line([(threshold_x, left_y), (threshold_x, left_y - graph_height + 30)], fill=GREEN, width=2)
    draw.text((threshold_x, left_y + 20), "t", fill='black', font=font_small, anchor='mm')
    
    # Right graph: BTL
    right_x = width // 2 + 30
    right_y = 280
    
    draw.text((right_x + graph_width//2, 100), "BTL(x) = 1 - ATL(x)", fill=RED, font=font_medium, anchor='mm')
    
    # Axes
    draw.line([(right_x, right_y), (right_x + graph_width, right_y)], fill='black', width=2)
    draw.line([(right_x, right_y), (right_x, right_y - graph_height)], fill='black', width=2)
    
    threshold_x2 = right_x + graph_width // 2
    draw.line([(right_x, right_y - graph_height + 30), (threshold_x2, right_y - graph_height + 30)], 
              fill=RED, width=4)
    draw.line([(threshold_x2, right_y), (right_x + graph_width, right_y)], fill=GRAY, width=3)
    draw.line([(threshold_x2, right_y - graph_height + 30), (threshold_x2, right_y)], fill=RED, width=2)
    draw.text((threshold_x2, right_y + 20), "t", fill='black', font=font_small, anchor='mm')
    
    # Key property
    property_y = 380
    draw.rectangle([(width//2 - 200, property_y), (width//2 + 200, property_y + 60)], 
                   fill=LIGHT_YELLOW, outline=YELLOW, width=2)
    draw.text((width//2, property_y + 30), "ATL(x) + BTL(x) = 1  (for all x)", 
              fill='black', font=font_medium, anchor='mm')
    
    # Explanation
    explain_y = 480
    draw.text((width//2, explain_y), "Every event is either ATL or BTL — never both, never neither!", 
              fill=GRAY, font=font_medium, anchor='mm')
    
    # Visual partition
    bar_y = 550
    bar_width = 600
    bar_height = 40
    bar_x = (width - bar_width) // 2
    
    draw.rectangle([(bar_x, bar_y), (bar_x + bar_width//2, bar_y + bar_height)], 
                   fill=LIGHT_RED, outline=RED, width=2)
    draw.rectangle([(bar_x + bar_width//2, bar_y), (bar_x + bar_width, bar_y + bar_height)], 
                   fill=LIGHT_GREEN, outline=GREEN, width=2)
    draw.text((bar_x + bar_width//4, bar_y + bar_height//2), "BTL", fill=RED, font=font_medium, anchor='mm')
    draw.text((bar_x + 3*bar_width//4, bar_y + bar_height//2), "ATL", fill=GREEN, font=font_medium, anchor='mm')
    
    img.save('public/DS-23/atl_btl_indicator.png')
    print("Created: atl_btl_indicator.png")

# --- Image 3: Piecewise Partition ---
def create_piecewise_partition():
    width, height = 900, 650
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Piecewise Partition: Risk Levels", fill='black', font=font_large, anchor='mm')
    
    # Draw number line with partitions
    margin = 80
    line_y = 250
    line_width = width - 2 * margin
    
    # Main line
    draw.line([(margin, line_y), (margin + line_width, line_y)], fill='black', width=3)
    
    # Thresholds
    t1_x = margin + line_width // 3
    t2_x = margin + 2 * line_width // 3
    
    # Regions
    # Low (0-30)
    draw.rectangle([(margin, line_y - 60), (t1_x, line_y - 10)], fill=LIGHT_GREEN, outline=GREEN, width=2)
    draw.text(((margin + t1_x)//2, line_y - 35), "Low", fill=GREEN, font=font_medium, anchor='mm')
    
    # Medium (30-70)
    draw.rectangle([(t1_x, line_y - 60), (t2_x, line_y - 10)], fill=LIGHT_YELLOW, outline=YELLOW, width=2)
    draw.text(((t1_x + t2_x)//2, line_y - 35), "Medium", fill=ORANGE, font=font_medium, anchor='mm')
    
    # High (70+)
    draw.rectangle([(t2_x, line_y - 60), (margin + line_width, line_y - 10)], fill=LIGHT_RED, outline=RED, width=2)
    draw.text(((t2_x + margin + line_width)//2, line_y - 35), "High", fill=RED, font=font_medium, anchor='mm')
    
    # Threshold labels
    draw.line([(t1_x, line_y - 70), (t1_x, line_y + 30)], fill='black', width=2)
    draw.text((t1_x, line_y + 45), "30", fill='black', font=font_medium, anchor='mm')
    
    draw.line([(t2_x, line_y - 70), (t2_x, line_y + 30)], fill='black', width=2)
    draw.text((t2_x, line_y + 45), "70", fill='black', font=font_medium, anchor='mm')
    
    # Axis labels
    draw.text((margin, line_y + 45), "0", fill='black', font=font_medium, anchor='mm')
    draw.text((margin + line_width, line_y + 45), "100", fill='black', font=font_medium, anchor='mm')
    
    # Indicator functions
    func_y = 350
    draw.text((width//2, func_y), "Indicator Functions:", fill='black', font=font_medium, anchor='mm')
    draw.text((width//2, func_y + 30), "Low(x) = 𝟙{x < 30}", fill=GREEN, font=font_small, anchor='mm')
    draw.text((width//2, func_y + 55), "Medium(x) = 𝟙{30 ≤ x < 70}", fill=ORANGE, font=font_small, anchor='mm')
    draw.text((width//2, func_y + 80), "High(x) = 𝟙{x ≥ 70}", fill=RED, font=font_small, anchor='mm')
    
    # Partition property
    prop_y = 500
    draw.rectangle([(width//2 - 220, prop_y), (width//2 + 220, prop_y + 50)], 
                   fill=LIGHT_PURPLE, outline=PURPLE, width=2)
    draw.text((width//2, prop_y + 25), "Low(x) + Medium(x) + High(x) = 1  ∀x", 
              fill=PURPLE, font=font_medium, anchor='mm')
    
    # Examples
    example_y = 580
    draw.text((width//2, example_y), "x=25 → Low=1  |  x=45 → Medium=1  |  x=85 → High=1", 
              fill=GRAY, font=font_small, anchor='mm')
    
    img.save('public/DS-23/piecewise_partition.png')
    print("Created: piecewise_partition.png")

# --- Image 4: Risk-Level Conditioning ---
def create_risk_level_conditioning():
    width, height = 900, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Risk-Level Conditioning: Different Thresholds", fill='black', font=font_large, anchor='mm')
    
    # Three rows for three risk levels
    margin = 100
    row_height = 150
    bar_width = 600
    bar_x = (width - bar_width) // 2
    
    risk_levels = [
        ("Low Risk", 30, GREEN, LIGHT_GREEN),
        ("Medium Risk", 50, ORANGE, LIGHT_YELLOW),
        ("High Risk", 70, RED, LIGHT_RED)
    ]
    
    for i, (label, threshold, color, light_color) in enumerate(risk_levels):
        y = 120 + i * row_height
        
        # Label
        draw.text((bar_x - 10, y + 25), label, fill=color, font=font_medium, anchor='rm')
        
        # Bar
        draw.rectangle([(bar_x, y), (bar_x + bar_width, y + 50)], fill='white', outline='black', width=1)
        
        # Threshold position
        t_x = bar_x + int(bar_width * threshold / 100)
        
        # BTL region
        draw.rectangle([(bar_x, y), (t_x, y + 50)], fill=LIGHT_BLUE, outline=BLUE, width=1)
        
        # ATL region
        draw.rectangle([(t_x, y), (bar_x + bar_width, y + 50)], fill=light_color, outline=color, width=2)
        
        # Threshold marker
        draw.line([(t_x, y - 10), (t_x, y + 60)], fill='black', width=3)
        draw.text((t_x, y + 75), f"t = {threshold}", fill='black', font=font_small, anchor='mm')
        
        # Labels
        draw.text(((bar_x + t_x)//2, y + 25), "BTL", fill=BLUE, font=font_small, anchor='mm')
        draw.text(((t_x + bar_x + bar_width)//2, y + 25), "ATL", fill=color, font=font_medium, anchor='mm')
    
    # Scale
    scale_y = 120 + 3 * row_height
    draw.text((bar_x, scale_y), "0", fill='black', font=font_small, anchor='mm')
    draw.text((bar_x + bar_width, scale_y), "100", fill='black', font=font_small, anchor='mm')
    draw.text((bar_x + bar_width//2, scale_y), "Score", fill='black', font=font_medium, anchor='mm')
    
    # Explanation
    explain_y = 600
    draw.rectangle([(width//2 - 300, explain_y - 10), (width//2 + 300, explain_y + 50)], 
                   fill=LIGHT_YELLOW, outline=YELLOW, width=2)
    draw.text((width//2, explain_y + 5), "Lower thresholds → More events flagged for review", 
              fill='black', font=font_small, anchor='mm')
    draw.text((width//2, explain_y + 28), "Higher thresholds → Focus on highest-risk events", 
              fill='black', font=font_small, anchor='mm')
    
    img.save('public/DS-23/risk_level_conditioning.png')
    print("Created: risk_level_conditioning.png")

# --- Image 5: Partition Function ---
def create_partition_function():
    width, height = 950, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "partition_events_by_thresholds: Application", fill='black', font=font_large, anchor='mm')
    
    # Input events table
    table_x = 80
    table_y = 80
    row_height = 35
    col_widths = [80, 80, 100, 100, 80]
    
    headers = ["Event", "Score", "Risk Level", "Threshold", "Tag"]
    events = [
        ("E1", "45", "Low", "30", "ATL"),
        ("E2", "55", "Medium", "50", "ATL"),
        ("E3", "65", "High", "70", "BTL"),
        ("E4", "35", "Low", "30", "ATL"),
        ("E5", "75", "High", "70", "ATL"),
    ]
    
    # Draw header
    x = table_x
    for i, header in enumerate(headers):
        draw.rectangle([(x, table_y), (x + col_widths[i], table_y + row_height)], 
                       fill=LIGHT_BLUE, outline='black', width=1)
        draw.text((x + col_widths[i]//2, table_y + row_height//2), header, 
                  fill='black', font=font_small, anchor='mm')
        x += col_widths[i]
    
    # Draw data rows
    for row_idx, event in enumerate(events):
        y = table_y + (row_idx + 1) * row_height
        x = table_x
        for col_idx, value in enumerate(event):
            if col_idx == 4:  # Tag column
                if value == "ATL":
                    fill_color = LIGHT_GREEN
                    text_color = GREEN
                else:
                    fill_color = LIGHT_RED
                    text_color = RED
            else:
                fill_color = 'white'
                text_color = 'black'
            
            draw.rectangle([(x, y), (x + col_widths[col_idx], y + row_height)], 
                           fill=fill_color, outline='black', width=1)
            draw.text((x + col_widths[col_idx]//2, y + row_height//2), value, 
                      fill=text_color, font=font_small, anchor='mm')
            x += col_widths[col_idx]
    
    # Logic explanation
    logic_x = 550
    logic_y = 100
    
    draw.text((logic_x + 150, logic_y), "Logic Applied:", fill='black', font=font_medium, anchor='mm')
    
    logic_items = [
        "E1: 45 ≥ 30 (Low) → ATL ✓",
        "E2: 55 ≥ 50 (Medium) → ATL ✓",
        "E3: 65 < 70 (High) → BTL ✗",
        "E4: 35 ≥ 30 (Low) → ATL ✓",
        "E5: 75 ≥ 70 (High) → ATL ✓",
    ]
    
    for i, item in enumerate(logic_items):
        color = GREEN if "ATL" in item else RED
        draw.text((logic_x, logic_y + 35 + i * 28), item, fill=color, font=font_small, anchor='lm')
    
    # Results summary
    summary_y = 380
    draw.rectangle([(width//2 - 200, summary_y), (width//2 + 200, summary_y + 100)], 
                   fill='white', outline='black', width=2)
    draw.text((width//2, summary_y + 20), "Results Summary", fill='black', font=font_medium, anchor='mm')
    draw.text((width//2, summary_y + 50), "ATL: 4 events (80%)", fill=GREEN, font=font_medium, anchor='mm')
    draw.text((width//2, summary_y + 75), "BTL: 1 event (20%)", fill=RED, font=font_medium, anchor='mm')
    
    # Visual bar
    bar_y = 520
    bar_width = 400
    bar_height = 40
    bar_x = (width - bar_width) // 2
    
    atl_width = int(bar_width * 0.8)
    draw.rectangle([(bar_x, bar_y), (bar_x + atl_width, bar_y + bar_height)], 
                   fill=LIGHT_GREEN, outline=GREEN, width=2)
    draw.rectangle([(bar_x + atl_width, bar_y), (bar_x + bar_width, bar_y + bar_height)], 
                   fill=LIGHT_RED, outline=RED, width=2)
    draw.text((bar_x + atl_width//2, bar_y + bar_height//2), "ATL 80%", fill=GREEN, font=font_medium, anchor='mm')
    draw.text((bar_x + atl_width + (bar_width - atl_width)//2, bar_y + bar_height//2), "20%", 
              fill=RED, font=font_small, anchor='mm')
    
    img.save('public/DS-23/partition_function.png')
    print("Created: partition_function.png")

# --- Image 6: Before/After Proportions ---
def create_before_after_proportions():
    width, height = 1000, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Before/After Class Proportions by Risk Level", fill='black', font=font_large, anchor='mm')
    
    # Two side-by-side bar charts
    chart_width = 380
    chart_height = 250
    margin = 80
    
    # Before chart
    before_x = margin
    before_y = 100
    
    draw.text((before_x + chart_width//2, before_y), "BEFORE (Uniform t=50)", fill=GRAY, font=font_medium, anchor='mm')
    
    # Bars for before
    bar_data_before = [
        ("Low", 40, 60),      # ATL%, BTL%
        ("Medium", 45, 55),
        ("High", 53, 47),
    ]
    
    bar_width = 80
    bar_max_height = 180
    bar_start_y = before_y + 230
    
    for i, (label, atl, btl) in enumerate(bar_data_before):
        x = before_x + 50 + i * 110
        
        # ATL portion
        atl_height = int(bar_max_height * atl / 100)
        btl_height = int(bar_max_height * btl / 100)
        
        # BTL (bottom)
        draw.rectangle([(x, bar_start_y - btl_height), (x + bar_width, bar_start_y)], 
                       fill=LIGHT_RED, outline=RED, width=1)
        # ATL (top)
        draw.rectangle([(x, bar_start_y - btl_height - atl_height), (x + bar_width, bar_start_y - btl_height)], 
                       fill=LIGHT_GREEN, outline=GREEN, width=1)
        
        # Labels
        draw.text((x + bar_width//2, bar_start_y + 20), label, fill='black', font=font_small, anchor='mm')
        draw.text((x + bar_width//2, bar_start_y - btl_height - atl_height//2), f"{atl}%", 
                  fill=GREEN, font=font_tiny, anchor='mm')
        draw.text((x + bar_width//2, bar_start_y - btl_height//2), f"{btl}%", 
                  fill=RED, font=font_tiny, anchor='mm')
    
    # After chart
    after_x = width // 2 + 30
    after_y = 100
    
    draw.text((after_x + chart_width//2, after_y), "AFTER (Risk-Conditioned)", fill=PURPLE, font=font_medium, anchor='mm')
    
    bar_data_after = [
        ("Low", 70, 30),      # t=30: More ATL
        ("Medium", 45, 55),   # t=50: Same
        ("High", 33, 67),     # t=70: Less ATL
    ]
    
    for i, (label, atl, btl) in enumerate(bar_data_after):
        x = after_x + 50 + i * 110
        
        atl_height = int(bar_max_height * atl / 100)
        btl_height = int(bar_max_height * btl / 100)
        
        draw.rectangle([(x, bar_start_y - btl_height), (x + bar_width, bar_start_y)], 
                       fill=LIGHT_RED, outline=RED, width=1)
        draw.rectangle([(x, bar_start_y - btl_height - atl_height), (x + bar_width, bar_start_y - btl_height)], 
                       fill=LIGHT_GREEN, outline=GREEN, width=1)
        
        draw.text((x + bar_width//2, bar_start_y + 20), label, fill='black', font=font_small, anchor='mm')
        draw.text((x + bar_width//2, bar_start_y - btl_height - atl_height//2), f"{atl}%", 
                  fill=GREEN, font=font_tiny, anchor='mm')
        draw.text((x + bar_width//2, bar_start_y - btl_height//2), f"{btl}%", 
                  fill=RED, font=font_tiny, anchor='mm')
    
    # Arrow between charts
    arrow_x = width // 2
    arrow_y = 250
    draw.text((arrow_x, arrow_y), "→", fill=PURPLE, font=font_large, anchor='mm')
    
    # Legend
    legend_y = 450
    draw.rectangle([(width//2 - 60, legend_y), (width//2 - 40, legend_y + 20)], fill=LIGHT_GREEN, outline=GREEN)
    draw.text((width//2 - 35, legend_y + 10), "ATL", fill=GREEN, font=font_small, anchor='lm')
    draw.rectangle([(width//2 + 20, legend_y), (width//2 + 40, legend_y + 20)], fill=LIGHT_RED, outline=RED)
    draw.text((width//2 + 45, legend_y + 10), "BTL", fill=RED, font=font_small, anchor='lm')
    
    # Key insight
    insight_y = 520
    draw.rectangle([(width//2 - 350, insight_y), (width//2 + 350, insight_y + 80)], 
                   fill=LIGHT_YELLOW, outline=YELLOW, width=2)
    draw.text((width//2, insight_y + 20), "Key Insight:", fill='black', font=font_medium, anchor='mm')
    draw.text((width//2, insight_y + 45), "Risk-level conditioning redistributes review load", fill='black', font=font_small, anchor='mm')
    draw.text((width//2, insight_y + 65), "without changing total volume!", fill=GRAY, font=font_small, anchor='mm')
    
    img.save('public/DS-23/before_after_proportions.png')
    print("Created: before_after_proportions.png")

# --- Image 7: Monotonicity Proof ---
def create_monotonicity_proof():
    width, height = 950, 700
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    draw.text((width//2, 30), "Monotonicity: Conjunctive Clauses Shrink ATL", fill='black', font=font_large, anchor='mm')
    
    # Theorem statement
    theorem_y = 80
    draw.rectangle([(width//2 - 380, theorem_y), (width//2 + 380, theorem_y + 60)], 
                   fill=LIGHT_PURPLE, outline=PURPLE, width=2)
    draw.text((width//2, theorem_y + 15), "Theorem: If ATL₂ = ATL₁ ∧ (extra condition),", 
              fill=PURPLE, font=font_medium, anchor='mm')
    draw.text((width//2, theorem_y + 40), "then ATL₂(x) ≤ ATL₁(x) for all x", 
              fill=PURPLE, font=font_medium, anchor='mm')
    
    # Visual: Two overlapping sets
    set_y = 280
    set_radius = 100
    
    # ATL₁ (larger)
    atl1_x = width // 2
    draw.ellipse([atl1_x - set_radius - 40, set_y - set_radius, 
                  atl1_x + set_radius + 40, set_y + set_radius], 
                 fill=LIGHT_GREEN, outline=GREEN, width=3)
    draw.text((atl1_x, set_y - set_radius - 25), "ATL₁ = 𝟙{x ≥ t₁}", fill=GREEN, font=font_medium, anchor='mm')
    
    # ATL₂ (smaller, inside ATL₁)
    atl2_x = width // 2 + 30
    draw.ellipse([atl2_x - set_radius + 30, set_y - set_radius + 30, 
                  atl2_x + set_radius - 30, set_y + set_radius - 30], 
                 fill=LIGHT_YELLOW, outline=ORANGE, width=3)
    draw.text((atl2_x, set_y), "ATL₂", fill=ORANGE, font=font_medium, anchor='mm')
    draw.text((atl2_x, set_y + 20), "⊆ ATL₁", fill=ORANGE, font=font_small, anchor='mm')
    
    # Number line showing thresholds
    line_y = 450
    line_x = 150
    line_width = width - 300
    
    draw.line([(line_x, line_y), (line_x + line_width, line_y)], fill='black', width=2)
    
    # t₁ marker
    t1_x = line_x + line_width // 3
    draw.line([(t1_x, line_y - 30), (t1_x, line_y + 30)], fill=GREEN, width=3)
    draw.text((t1_x, line_y + 45), "t₁", fill=GREEN, font=font_medium, anchor='mm')
    
    # t₂ marker
    t2_x = line_x + 2 * line_width // 3
    draw.line([(t2_x, line_y - 30), (t2_x, line_y + 30)], fill=ORANGE, width=3)
    draw.text((t2_x, line_y + 45), "t₂ > t₁", fill=ORANGE, font=font_medium, anchor='mm')
    
    # Regions
    draw.text((line_x + line_width // 6, line_y - 50), "x < t₁", fill=GRAY, font=font_small, anchor='mm')
    draw.text(((t1_x + t2_x) // 2, line_y - 50), "t₁ ≤ x < t₂", fill=GREEN, font=font_small, anchor='mm')
    draw.text((line_x + 5 * line_width // 6, line_y - 50), "x ≥ t₂", fill=ORANGE, font=font_small, anchor='mm')
    
    # Case table
    table_y = 520
    draw.text((width//2, table_y), "Case Analysis:", fill='black', font=font_medium, anchor='mm')
    
    cases = [
        ("x < t₁", "ATL₁=0", "ATL₂=0", "0 ≤ 0 ✓"),
        ("t₁ ≤ x < t₂", "ATL₁=1", "ATL₂=0", "0 ≤ 1 ✓"),
        ("x ≥ t₂", "ATL₁=1", "ATL₂=1", "1 ≤ 1 ✓"),
    ]
    
    col_x = [width//2 - 250, width//2 - 100, width//2 + 50, width//2 + 200]
    for i, case in enumerate(cases):
        y = table_y + 30 + i * 25
        for j, val in enumerate(case):
            color = GREEN if "✓" in val else 'black'
            draw.text((col_x[j], y), val, fill=color, font=font_small, anchor='mm')
    
    # Conclusion
    conclusion_y = 640
    draw.rectangle([(width//2 - 280, conclusion_y), (width//2 + 280, conclusion_y + 40)], 
                   fill=LIGHT_GREEN, outline=GREEN, width=2)
    draw.text((width//2, conclusion_y + 20), "∴ ATL₂(x) ≤ ATL₁(x) for all x  — Monotonicity proved!", 
              fill=GREEN, font=font_medium, anchor='mm')
    
    img.save('public/DS-23/monotonicity_proof.png')
    print("Created: monotonicity_proof.png")

# --- Generate all images ---
print("Generating DS-23 images...")
create_indicator_function()
create_atl_btl_indicator()
create_piecewise_partition()
create_risk_level_conditioning()
create_partition_function()
create_before_after_proportions()
create_monotonicity_proof()
print("\nAll images for DS-23 created successfully!")

