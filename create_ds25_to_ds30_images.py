from PIL import Image, ImageDraw, ImageFont
import os
import math

# Create directories
for i in range(25, 31):
    os.makedirs(f'public/DS-{i}', exist_ok=True)

try:
    font_title = ImageFont.truetype("arial.ttf", 36)
    font_large = ImageFont.truetype("arial.ttf", 22)
    font_subtitle = ImageFont.truetype("arial.ttf", 20)
    font_medium = ImageFont.truetype("arial.ttf", 16)
    font_small = ImageFont.truetype("arial.ttf", 12)
    font_tiny = ImageFont.truetype("arial.ttf", 10)
except:
    font_title = ImageFont.load_default()
    font_large = ImageFont.load_default()
    font_subtitle = ImageFont.load_default()
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
DARK_BG = '#1a1a2e'
LIGHT_BLUE = '#d1ecf1'
LIGHT_RED = '#f8d7da'
LIGHT_GREEN = '#d4edda'
LIGHT_YELLOW = '#fff3cd'
LIGHT_PURPLE = '#e2d5f1'

def create_header(day, title, subtitle, accent_color):
    width, height = 1200, 630
    img = Image.new('RGB', (width, height), color=DARK_BG)
    draw = ImageDraw.Draw(img)
    
    # Gradient effect
    for i in range(0, width, 4):
        alpha = int(25 + (i / width) * 25)
        color = f'#{alpha:02x}{alpha + 5:02x}{alpha + 15:02x}'
        draw.line([(i, 0), (i, height)], fill=color, width=2)
    
    # Title
    draw.text((width//2, 80), f"Day {day}", fill=YELLOW, font=font_title, anchor='mm')
    draw.text((width//2, 150), title, fill='white', font=font_subtitle, anchor='mm')
    draw.text((width//2, 190), subtitle, fill='#aaaaaa', font=font_medium, anchor='mm')
    
    # Bottom accent
    draw.rectangle([(0, height - 5), (width, height)], fill=accent_color)
    
    return img, draw

# ============ DS-25 Images ============
def create_ds25_images():
    print("Creating DS-25 images...")
    
    # Header
    img, draw = create_header(25, "Configuration Pairing Logic", "Equivalence Classes and Consistency", PURPLE)
    
    # Bipartite graph visual
    left_x = 300
    right_x = 900
    y_positions = [300, 400, 500]
    
    pairs = [("Premium", "Standard"), ("Verified", "Unverified"), ("Enterprise", "Consumer")]
    colors = [BLUE, GREEN, ORANGE]
    
    for i, ((left, right), color) in enumerate(zip(pairs, colors)):
        y = y_positions[i]
        draw.ellipse([left_x - 60, y - 20, left_x + 60, y + 20], fill=color, outline='white', width=2)
        draw.text((left_x, y), left[:8], fill='white', font=font_tiny, anchor='mm')
        
        draw.ellipse([right_x - 60, y - 20, right_x + 60, y + 20], fill=color, outline='white', width=2)
        draw.text((right_x, y), right[:8], fill='white', font=font_tiny, anchor='mm')
        
        draw.line([(left_x + 60, y), (right_x - 60, y)], fill=color, width=3)
    
    img.save('public/DS-25/threshold_pairing_intro.png')
    
    # Equivalence classes
    img = Image.new('RGB', (900, 600), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Equivalence Classes", fill='black', font=font_large, anchor='mm')
    
    classes = [
        ("[Premium]", ["Premium", "Standard"], BLUE),
        ("[Verified]", ["Verified", "Unverified"], GREEN),
        ("[Enterprise]", ["Enterprise", "Consumer"], ORANGE),
    ]
    
    for i, (name, members, color) in enumerate(classes):
        x = 150 + i * 250
        y = 200
        draw.ellipse([x - 100, y - 80, x + 100, y + 120], fill=color, outline='black', width=2)
        draw.text((x, y - 50), name, fill='white', font=font_medium, anchor='mm')
        for j, member in enumerate(members):
            draw.text((x, y + j * 30), member, fill='white', font=font_small, anchor='mm')
    
    draw.text((450, 400), "Each class forms a partition of the segment space", fill=GRAY, font=font_medium, anchor='mm')
    img.save('public/DS-25/equivalence_classes.png')
    
    # Pairing consistency
    img = Image.new('RGB', (900, 500), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Pairing Consistency Requirements", fill='black', font=font_large, anchor='mm')
    
    requirements = [
        ("params(A) = params(B)", "Same parameters", GREEN),
        ("A ∩ B = ∅", "Mutually exclusive", BLUE),
        ("A ∪ B = Universe", "Collectively exhaustive", PURPLE),
    ]
    
    for i, (formula, desc, color) in enumerate(requirements):
        y = 120 + i * 100
        draw.rectangle([(100, y), (350, y + 60)], fill=color, outline='black', width=2)
        draw.text((225, y + 30), formula, fill='white', font=font_medium, anchor='mm')
        draw.text((550, y + 30), desc, fill='black', font=font_medium, anchor='lm')
    
    img.save('public/DS-25/pairing_consistency.png')
    
    # Mapping functions
    img = Image.new('RGB', (900, 500), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Mapping Functions: translate_bindings", fill='black', font=font_large, anchor='mm')
    
    draw.rectangle([(100, 100), (350, 200)], fill=LIGHT_BLUE, outline=BLUE, width=2)
    draw.text((225, 130), "Premium Config", fill=BLUE, font=font_medium, anchor='mm')
    draw.text((225, 160), "score: 0.30", fill='black', font=font_small, anchor='mm')
    
    draw.text((450, 150), "→ transform →", fill=GRAY, font=font_medium, anchor='mm')
    
    draw.rectangle([(550, 100), (800, 200)], fill=LIGHT_GREEN, outline=GREEN, width=2)
    draw.text((675, 130), "Standard Config", fill=GREEN, font=font_medium, anchor='mm')
    draw.text((675, 160), "score: 0.24", fill='black', font=font_small, anchor='mm')
    
    draw.text((450, 280), "Mapping: score × 0.8 = 0.24", fill=PURPLE, font=font_medium, anchor='mm')
    img.save('public/DS-25/mapping_functions.png')
    
    # Bipartite matching
    img = Image.new('RGB', (900, 550), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Bipartite Graph: Perfect Matching", fill='black', font=font_large, anchor='mm')
    
    left_nodes = [("Premium", 150), ("Verified", 250), ("Enterprise", 350)]
    right_nodes = [("Standard", 150), ("Unverified", 250), ("Consumer", 350)]
    
    for name, y in left_nodes:
        draw.ellipse([180, y, 280, y + 40], fill=BLUE, outline='black', width=2)
        draw.text((230, y + 20), name[:8], fill='white', font=font_small, anchor='mm')
    
    for name, y in right_nodes:
        draw.ellipse([620, y, 720, y + 40], fill=GREEN, outline='black', width=2)
        draw.text((670, y + 20), name[:8], fill='white', font=font_small, anchor='mm')
    
    for (_, y1), (_, y2) in zip(left_nodes, right_nodes):
        draw.line([(280, y1 + 20), (620, y2 + 20)], fill=PURPLE, width=3)
    
    draw.text((450, 450), "Perfect matching: every segment has exactly one pair", fill=GRAY, font=font_medium, anchor='mm')
    img.save('public/DS-25/bipartite_matching.png')
    
    # Validate pairs
    img = Image.new('RGB', (900, 500), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "validate_and_pair_segments", fill='black', font=font_large, anchor='mm')
    
    draw.rectangle([(100, 100), (400, 250)], fill=LIGHT_GREEN, outline=GREEN, width=2)
    draw.text((250, 120), "Valid Pairs ✓", fill=GREEN, font=font_medium, anchor='mm')
    draw.text((250, 160), "(Premium, Standard)", fill='black', font=font_small, anchor='mm')
    draw.text((250, 190), "(Verified, Unverified)", fill='black', font=font_small, anchor='mm')
    
    draw.rectangle([(500, 100), (800, 250)], fill=LIGHT_RED, outline=RED, width=2)
    draw.text((650, 120), "Errors ✗", fill=RED, font=font_medium, anchor='mm')
    draw.text((650, 160), "Missing: Unverified", fill='black', font=font_small, anchor='mm')
    draw.text((650, 190), "Param mismatch: ...", fill='black', font=font_small, anchor='mm')
    
    img.save('public/DS-25/validate_pairs.png')
    
    # Floor fill-in
    img = Image.new('RGB', (900, 500), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Floor Fill-In for Missing Values", fill='black', font=font_large, anchor='mm')
    
    draw.rectangle([(100, 100), (400, 200)], fill=LIGHT_BLUE, outline=BLUE, width=2)
    draw.text((250, 130), "Primary (Premium)", fill=BLUE, font=font_medium, anchor='mm')
    draw.text((250, 170), "score_low: 0.30", fill='black', font=font_small, anchor='mm')
    
    draw.rectangle([(500, 100), (800, 200)], fill=LIGHT_GREEN, outline=GREEN, width=2)
    draw.text((650, 130), "Complement (Standard)", fill=GREEN, font=font_medium, anchor='mm')
    draw.text((650, 170), "score_low: undefined → 0.30", fill='black', font=font_small, anchor='mm')
    
    draw.text((450, 280), "Floor from paired segment fills missing values", fill=PURPLE, font=font_medium, anchor='mm')
    img.save('public/DS-25/floor_fillin.png')
    
    print("  DS-25 images created!")

# ============ DS-26 Images ============
def create_ds26_images():
    print("Creating DS-26 images...")
    
    # Header
    img, draw = create_header(26, "From Rules to Fuzzy Logic", "Why Min/Max Matters", ORANGE)
    
    # T-norm surfaces (simplified visual)
    center_y = 400
    draw.text((600, center_y - 100), "T-Norms: min(x,y)  vs  x·y  vs  max(0,x+y-1)", fill='white', font=font_medium, anchor='mm')
    
    # Three boxes representing surfaces
    for i, (name, color) in enumerate([("MIN", GREEN), ("PRODUCT", ORANGE), ("ŁUKASIEWICZ", RED)]):
        x = 300 + i * 300
        draw.rectangle([(x - 100, center_y - 40), (x + 100, center_y + 40)], fill=color, outline='white', width=2)
        draw.text((x, center_y), name, fill='white', font=font_small, anchor='mm')
    
    img.save('public/DS-26/fuzzy_logic_intro.png')
    
    # T-norm families
    img = Image.new('RGB', (900, 550), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Three Major T-Norm Families", fill='black', font=font_large, anchor='mm')
    
    tnorms = [
        ("Minimum (Gödel)", "T_min(x,y) = min(x,y)", GREEN),
        ("Product", "T_prod(x,y) = x · y", ORANGE),
        ("Łukasiewicz", "T_Luk(x,y) = max(0,x+y-1)", RED),
    ]
    
    for i, (name, formula, color) in enumerate(tnorms):
        y = 120 + i * 130
        draw.rectangle([(100, y), (800, y + 90)], fill=color, outline='black', width=2)
        draw.text((450, y + 30), name, fill='white', font=font_medium, anchor='mm')
        draw.text((450, y + 60), formula, fill='white', font=font_small, anchor='mm')
    
    img.save('public/DS-26/tnorm_families.png')
    
    # T-norm comparison
    img = Image.new('RGB', (900, 500), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "T-Norm Comparison: x=0.8, y=0.6", fill='black', font=font_large, anchor='mm')
    
    results = [
        ("Minimum", "0.6", GREEN, "Largest"),
        ("Product", "0.48", ORANGE, "Middle"),
        ("Łukasiewicz", "0.4", RED, "Smallest"),
    ]
    
    for i, (name, result, color, note) in enumerate(results):
        x = 150 + i * 250
        draw.rectangle([(x - 80, 100), (x + 80, 200)], fill=color, outline='black', width=2)
        draw.text((x, 130), name, fill='white', font=font_medium, anchor='mm')
        draw.text((x, 170), result, fill='white', font=font_large, anchor='mm')
        draw.text((x, 230), note, fill=GRAY, font=font_small, anchor='mm')
    
    draw.text((450, 300), "Ordering: T_Luk ≤ T_prod ≤ T_min (always!)", fill=PURPLE, font=font_medium, anchor='mm')
    img.save('public/DS-26/tnorm_comparison.png')
    
    # Surface comparison
    img = Image.new('RGB', (900, 500), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Surface Comparison: 3D Views", fill='black', font=font_large, anchor='mm')
    
    surfaces = [
        ("min(x,y)", "Roof-like", GREEN),
        ("x · y", "Curved bowl", ORANGE),
        ("max(0,x+y-1)", "Truncated plane", RED),
    ]
    
    for i, (formula, desc, color) in enumerate(surfaces):
        x = 150 + i * 250
        # Simple 3D-ish representation
        points = [(x - 60, 200), (x + 60, 200), (x + 80, 300), (x - 40, 300)]
        draw.polygon(points, fill=color, outline='black')
        draw.text((x, 150), formula, fill='black', font=font_small, anchor='mm')
        draw.text((x, 340), desc, fill=GRAY, font=font_small, anchor='mm')
    
    img.save('public/DS-26/surface_comparison.png')
    
    # Idempotence
    img = Image.new('RGB', (900, 500), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Idempotence: T(x,x) = x ?", fill='black', font=font_large, anchor='mm')
    
    tests = [
        ("Minimum", "min(0.5, 0.5) = 0.5", "✓ Idempotent", GREEN),
        ("Product", "0.5 × 0.5 = 0.25 ≠ 0.5", "✗ NOT Idempotent", RED),
        ("Łukasiewicz", "max(0, 0.5+0.5-1) = 0 ≠ 0.5", "✗ NOT Idempotent", RED),
    ]
    
    for i, (name, calc, result, color) in enumerate(tests):
        y = 120 + i * 110
        draw.rectangle([(100, y), (800, y + 80)], fill=color, outline='black', width=2)
        draw.text((200, y + 25), name, fill='white', font=font_medium, anchor='mm')
        draw.text((500, y + 25), calc, fill='white', font=font_small, anchor='mm')
        draw.text((500, y + 55), result, fill='white', font=font_medium, anchor='mm')
    
    img.save('public/DS-26/idempotence.png')
    
    # T-conorm comparison
    img = Image.new('RGB', (900, 450), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "T-Conorms (OR Operators)", fill='black', font=font_large, anchor='mm')
    
    tconorms = [
        ("Maximum", "max(0.8, 0.6) = 0.8", BLUE),
        ("Prob Sum", "0.8+0.6-0.48 = 0.92", PURPLE),
        ("Bounded", "min(1, 1.4) = 1.0", ORANGE),
    ]
    
    for i, (name, formula, color) in enumerate(tconorms):
        x = 150 + i * 250
        draw.rectangle([(x - 100, 100), (x + 100, 200)], fill=color, outline='black', width=2)
        draw.text((x, 130), name, fill='white', font=font_medium, anchor='mm')
        draw.text((x, 170), formula, fill='white', font=font_tiny, anchor='mm')
    
    draw.text((450, 280), "Ordering: S_max ≤ S_prob ≤ S_Luk", fill=GRAY, font=font_medium, anchor='mm')
    img.save('public/DS-26/tconorm_comparison.png')
    
    # Rule aggregation
    img = Image.new('RGB', (900, 500), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Rule Aggregation with Min/Max", fill='black', font=font_large, anchor='mm')
    
    draw.text((450, 100), "Rule: (high_score AND high_velocity) OR unusual_location", fill='black', font=font_medium, anchor='mm')
    
    draw.rectangle([(100, 150), (400, 280)], fill=LIGHT_GREEN, outline=GREEN, width=2)
    draw.text((250, 170), "AND (min)", fill=GREEN, font=font_medium, anchor='mm')
    draw.text((250, 200), "min(0.8, 0.6) = 0.6", fill='black', font=font_small, anchor='mm')
    
    draw.rectangle([(500, 150), (800, 280)], fill=LIGHT_BLUE, outline=BLUE, width=2)
    draw.text((650, 170), "OR (max)", fill=BLUE, font=font_medium, anchor='mm')
    draw.text((650, 200), "max(0.6, 0.9) = 0.9", fill='black', font=font_small, anchor='mm')
    
    draw.rectangle([(300, 330), (600, 400)], fill=LIGHT_PURPLE, outline=PURPLE, width=2)
    draw.text((450, 365), "Result: 0.9", fill=PURPLE, font=font_large, anchor='mm')
    
    img.save('public/DS-26/rule_aggregation.png')
    
    # Idempotence proof
    img = Image.new('RGB', (900, 450), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Proof: Product is NOT Idempotent", fill='black', font=font_large, anchor='mm')
    
    draw.text((450, 100), "For idempotence: x·x = x", fill='black', font=font_medium, anchor='mm')
    draw.text((450, 140), "x² = x  →  x² - x = 0  →  x(x-1) = 0", fill=GRAY, font=font_small, anchor='mm')
    draw.text((450, 180), "Solutions: x = 0 or x = 1 only!", fill=RED, font=font_medium, anchor='mm')
    
    draw.rectangle([(200, 230), (700, 320)], fill=LIGHT_RED, outline=RED, width=2)
    draw.text((450, 260), "Counterexample: x = 0.5", fill=RED, font=font_medium, anchor='mm')
    draw.text((450, 290), "0.5 × 0.5 = 0.25 ≠ 0.5  ✗", fill='black', font=font_medium, anchor='mm')
    
    img.save('public/DS-26/idempotence_proof.png')
    
    print("  DS-26 images created!")

# ============ DS-27 Images ============
def create_ds27_images():
    print("Creating DS-27 images...")
    
    # Header
    img, draw = create_header(27, "Quantile Stability", "Ties and Small Samples", BLUE)
    
    # ECDF staircase - moved text below chart to avoid overlap
    # Simple staircase
    steps = [(250, 500), (350, 450), (450, 400), (550, 350), (650, 300), (750, 260), (850, 230)]
    for i in range(len(steps) - 1):
        draw.line([steps[i], (steps[i+1][0], steps[i][1])], fill=YELLOW, width=3)
        draw.line([(steps[i+1][0], steps[i][1]), steps[i+1]], fill=YELLOW, width=3)
    
    img.save('public/DS-27/quantile_stability_intro.png')
    
    # ECDF with ties
    img = Image.new('RGB', (900, 550), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "ECDF with Ties: Plateau Effect", fill='black', font=font_large, anchor='mm')
    
    # Axes
    draw.line([(100, 400), (800, 400)], fill='black', width=2)
    draw.line([(100, 400), (100, 100)], fill='black', width=2)
    draw.text((450, 440), "Value", fill='black', font=font_medium, anchor='mm')
    draw.text((60, 250), "F(x)", fill='black', font=font_medium, anchor='mm')
    
    # Steps with plateau
    ecdf_points = [(100, 400), (200, 380), (300, 380), (400, 380), (500, 300), (600, 250), (700, 150), (800, 100)]
    for i in range(len(ecdf_points) - 1):
        x1, y1 = ecdf_points[i]
        x2, y2 = ecdf_points[i + 1]
        draw.line([(x1, y1), (x2, y1)], fill=BLUE, width=3)
        draw.line([(x2, y1), (x2, y2)], fill=BLUE, width=3)
    
    # Highlight plateau
    draw.rectangle([(200, 370), (500, 390)], outline=RED, width=3)
    draw.text((350, 350), "Tie plateau", fill=RED, font=font_small, anchor='mm')
    
    img.save('public/DS-27/ecdf_with_ties.png')
    
    # Interpolation methods
    img = Image.new('RGB', (900, 500), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Interpolation Methods Comparison", fill='black', font=font_large, anchor='mm')
    
    methods = [
        ("Type 1", "Nearest", "9", GREEN),
        ("Type 6", "Excel", "9.05", ORANGE),
        ("Type 7", "Python", "9.1", BLUE),
    ]
    
    for i, (type_name, desc, result, color) in enumerate(methods):
        x = 150 + i * 250
        draw.rectangle([(x - 80, 100), (x + 80, 220)], fill=color, outline='black', width=2)
        draw.text((x, 130), type_name, fill='white', font=font_medium, anchor='mm')
        draw.text((x, 160), desc, fill='white', font=font_small, anchor='mm')
        draw.text((x, 195), f"p90 = {result}", fill='white', font=font_medium, anchor='mm')
    
    draw.text((450, 300), "Same data, different methods → different results!", fill=RED, font=font_medium, anchor='mm')
    img.save('public/DS-27/interpolation_methods.png')
    
    # Tie blocks
    img = Image.new('RGB', (900, 450), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Tie Blocks: Non-Unique Quantiles", fill='black', font=font_large, anchor='mm')
    
    draw.text((450, 100), "Data: [10, 20, 20, 20, 20, 30, 40, 50]", fill='black', font=font_medium, anchor='mm')
    
    # Visual representation
    values = [10, 20, 20, 20, 20, 30, 40, 50]
    for i, v in enumerate(values):
        x = 150 + i * 80
        color = RED if v == 20 else BLUE
        draw.rectangle([(x, 200), (x + 60, 260)], fill=color, outline='black', width=1)
        draw.text((x + 30, 230), str(v), fill='white', font=font_medium, anchor='mm')
    
    draw.text((450, 320), "What is p50? F(20) = 0.625, F(10) = 0.125", fill=GRAY, font=font_small, anchor='mm')
    draw.text((450, 350), "Answer: 20 (but ambiguous!)", fill=PURPLE, font=font_medium, anchor='mm')
    
    img.save('public/DS-27/tie_blocks.png')
    
    # Quantile variance
    img = Image.new('RGB', (900, 450), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Quantile Variance: Small Samples", fill='black', font=font_large, anchor='mm')
    
    draw.text((450, 100), "Var(Q̂_p) ≈ p(1-p) / (n × f(Q_p)²)", fill=PURPLE, font=font_medium, anchor='mm')
    
    draw.rectangle([(150, 160), (750, 280)], fill=LIGHT_YELLOW, outline=YELLOW, width=2)
    draw.text((450, 190), "High variance when:", fill='black', font=font_medium, anchor='mm')
    draw.text((450, 220), "• n is small  • p near 0 or 1  • f(Q_p) is small", fill=GRAY, font=font_small, anchor='mm')
    draw.text((450, 250), "90th percentile is MORE variable than median!", fill=RED, font=font_small, anchor='mm')
    
    img.save('public/DS-27/quantile_variance.png')
    
    # Closest observation
    img = Image.new('RGB', (900, 400), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Closest Observation Method", fill='black', font=font_large, anchor='mm')
    
    draw.text((450, 100), "Q(p) = X_(⌈np⌉)  — Always returns an actual observation", fill=GREEN, font=font_medium, anchor='mm')
    
    draw.rectangle([(150, 150), (400, 280)], fill=LIGHT_GREEN, outline=GREEN, width=2)
    draw.text((275, 175), "Advantages", fill=GREEN, font=font_medium, anchor='mm')
    draw.text((275, 210), "• Repeatable", fill='black', font=font_small, anchor='mm')
    draw.text((275, 235), "• Stable", fill='black', font=font_small, anchor='mm')
    draw.text((275, 260), "• Discrete-friendly", fill='black', font=font_small, anchor='mm')
    
    draw.rectangle([(500, 150), (750, 280)], fill=LIGHT_RED, outline=RED, width=2)
    draw.text((625, 175), "Disadvantages", fill=RED, font=font_medium, anchor='mm')
    draw.text((625, 210), "• Discontinuous", fill='black', font=font_small, anchor='mm')
    draw.text((625, 235), "• Limited resolution", fill='black', font=font_small, anchor='mm')
    
    img.save('public/DS-27/closest_observation.png')
    
    # Repeatability
    img = Image.new('RGB', (900, 400), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Threshold Repeatability", fill='black', font=font_large, anchor='mm')
    
    strategies = [
        ("Fix method", "interpolation='nearest'"),
        ("Round precision", "round(value, 2)"),
        ("Document", "version='1.0'"),
    ]
    
    for i, (title, code) in enumerate(strategies):
        y = 100 + i * 80
        draw.rectangle([(150, y), (750, y + 60)], fill=LIGHT_BLUE, outline=BLUE, width=2)
        draw.text((250, y + 30), title, fill=BLUE, font=font_medium, anchor='mm')
        draw.text((550, y + 30), code, fill='black', font=font_small, anchor='mm')
    
    img.save('public/DS-27/repeatability.png')
    
    # Exercise comparison
    img = Image.new('RGB', (900, 450), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Exercise: Comparing Interpolation Rules", fill='black', font=font_large, anchor='mm')
    
    draw.text((450, 90), "Data: [5, 10, 15, 20, 25], n=5", fill='black', font=font_medium, anchor='mm')
    draw.text((450, 130), "Find: 90th percentile", fill='black', font=font_medium, anchor='mm')
    
    draw.rectangle([(150, 170), (400, 300)], fill=LIGHT_GREEN, outline=GREEN, width=2)
    draw.text((275, 195), "Type 1 (Nearest)", fill=GREEN, font=font_medium, anchor='mm')
    draw.text((275, 230), "Index = ⌈5×0.9⌉ = 5", fill='black', font=font_small, anchor='mm')
    draw.text((275, 270), "p90 = 25", fill=GREEN, font=font_large, anchor='mm')
    
    draw.rectangle([(500, 170), (750, 300)], fill=LIGHT_BLUE, outline=BLUE, width=2)
    draw.text((625, 195), "Type 7 (Linear)", fill=BLUE, font=font_medium, anchor='mm')
    draw.text((625, 230), "Interpolated", fill='black', font=font_small, anchor='mm')
    draw.text((625, 270), "p90 = 23", fill=BLUE, font=font_large, anchor='mm')
    
    draw.text((450, 360), "Difference: 8.3% — significant for small samples!", fill=RED, font=font_medium, anchor='mm')
    
    img.save('public/DS-27/exercise_comparison.png')
    
    print("  DS-27 images created!")

# ============ DS-28 Images ============
def create_ds28_images():
    print("Creating DS-28 images...")
    
    # Header
    img, draw = create_header(28, "Robust Imputation", "Numeric Coercion and NA Handling", GREEN)
    
    # Histogram silhouettes
    draw.text((600, 350), "Before vs After Imputation", fill='white', font=font_medium, anchor='mm')
    
    # Simple histogram shapes
    bars1 = [(300, 480), (350, 450), (400, 400), (450, 420), (500, 460)]
    for x, h in bars1:
        draw.rectangle([(x, h), (x + 40, 500)], fill=BLUE, outline='white', width=1)
    
    bars2 = [(650, 350), (700, 480), (750, 450), (800, 420), (850, 450), (900, 470)]
    for x, h in bars2:
        draw.rectangle([(x, h), (x + 40, 500)], fill=GREEN, outline='white', width=1)
    
    img.save('public/DS-28/imputation_intro.png')
    
    # Coercion examples
    img = Image.new('RGB', (900, 450), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Numeric Coercion Examples", fill='black', font=font_large, anchor='mm')
    
    examples = [
        ('"100"', '100.0', GREEN),
        ('"$100"', 'None', RED),
        ('""', 'None', RED),
        ('"1e10"', '1e10', GREEN),
        ('"NaN"', 'nan ⚠', ORANGE),
    ]
    
    for i, (input_val, output, color) in enumerate(examples):
        y = 100 + i * 60
        draw.text((200, y), input_val, fill='black', font=font_medium, anchor='mm')
        draw.text((400, y), "→", fill=GRAY, font=font_medium, anchor='mm')
        draw.text((600, y), output, fill=color, font=font_medium, anchor='mm')
    
    img.save('public/DS-28/coercion_examples.png')
    
    # Imputation strategies
    img = Image.new('RGB', (950, 550), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((475, 30), "Imputation Strategies", fill='black', font=font_large, anchor='mm')
    
    strategies = [
        ("Zero", "fillna(0)", "Shifts left", BLUE),
        ("Mean", "fillna(mean)", "Preserves mean", GREEN),
        ("Median", "fillna(median)", "Robust center", PURPLE),
        ("Exclude", "dropna()", "Reduces n", ORANGE),
    ]
    
    for i, (name, code, effect, color) in enumerate(strategies):
        x = 120 + i * 210
        draw.rectangle([(x - 80, 100), (x + 80, 250)], fill=color, outline='black', width=2)
        draw.text((x, 130), name, fill='white', font=font_medium, anchor='mm')
        draw.text((x, 170), code, fill='white', font=font_tiny, anchor='mm')
        draw.text((x, 210), effect, fill='white', font=font_tiny, anchor='mm')
    
    img.save('public/DS-28/imputation_strategies.png')
    
    # Distribution impact
    img = Image.new('RGB', (900, 450), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Impact on Distribution Statistics", fill='black', font=font_large, anchor='mm')
    
    impacts = [
        ("Zero Impute", "Mean ↓", "Variance ↑", "Lower %iles ↓"),
        ("Mean Impute", "Mean =", "Variance ↓", "Middle compressed"),
        ("Median Impute", "Mean ~", "Variance ↓", "Median ="),
    ]
    
    for i, (method, mean_eff, var_eff, quant_eff) in enumerate(impacts):
        y = 100 + i * 100
        draw.rectangle([(100, y), (800, y + 70)], fill=LIGHT_BLUE if i == 0 else (LIGHT_GREEN if i == 1 else LIGHT_PURPLE), outline='black', width=1)
        draw.text((180, y + 35), method, fill='black', font=font_medium, anchor='mm')
        draw.text((350, y + 35), mean_eff, fill='black', font=font_small, anchor='mm')
        draw.text((500, y + 35), var_eff, fill='black', font=font_small, anchor='mm')
        draw.text((680, y + 35), quant_eff, fill='black', font=font_small, anchor='mm')
    
    img.save('public/DS-28/distribution_impact.png')
    
    # Rule geometry
    img = Image.new('RGB', (900, 450), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "How fillna(0) Changes Rule Geometry", fill='black', font=font_large, anchor='mm')
    
    # Before: scattered points
    draw.text((250, 100), "Before", fill=BLUE, font=font_medium, anchor='mm')
    for x, y in [(180, 200), (220, 180), (280, 220), (320, 190), (260, 250)]:
        draw.ellipse([x - 5, y - 5, x + 5, y + 5], fill=BLUE)
    
    # After: cluster at origin + scattered
    draw.text((650, 100), "After (with zeros)", fill=GREEN, font=font_medium, anchor='mm')
    for x, y in [(580, 280), (590, 275), (585, 285)]:  # Cluster at "origin"
        draw.ellipse([x - 5, y - 5, x + 5, y + 5], fill=RED)
    for x, y in [(620, 200), (680, 180), (720, 220), (760, 190)]:
        draw.ellipse([x - 5, y - 5, x + 5, y + 5], fill=GREEN)
    
    draw.text((650, 320), "↑ Imputed zeros", fill=RED, font=font_small, anchor='mm')
    
    img.save('public/DS-28/rule_geometry.png')
    
    # Histograms comparison
    img = Image.new('RGB', (900, 500), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Histograms: Before and After Imputation", fill='black', font=font_large, anchor='mm')
    
    # Before histogram
    draw.text((250, 100), "Original", fill=BLUE, font=font_medium, anchor='mm')
    bars = [(120, 150), (160, 100), (200, 80), (240, 120), (280, 180)]
    for x, h in bars:
        draw.rectangle([(x, 250 - h), (x + 35, 250)], fill=BLUE, outline='black', width=1)
    
    # After histogram (with spike at zero)
    draw.text((650, 100), "After Zero Imputation", fill=GREEN, font=font_medium, anchor='mm')
    bars = [(520, 200), (560, 100), (600, 80), (640, 100), (680, 140)]  # Spike at first
    for i, (x, h) in enumerate(bars):
        color = RED if i == 0 else GREEN
        draw.rectangle([(x, 250 - h), (x + 35, 250)], fill=color, outline='black', width=1)
    draw.text((538, 280), "Spike!", fill=RED, font=font_tiny, anchor='mm')
    
    img.save('public/DS-28/histograms_comparison.png')
    
    # Exercise percentile
    img = Image.new('RGB', (900, 450), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Exercise: Quantifying Percentile Shift", fill='black', font=font_large, anchor='mm')
    
    draw.text((450, 100), "Original: [5,10,15,20,25,30,50,100,150,200]", fill='black', font=font_medium, anchor='mm')
    draw.text((450, 140), "Replace 2 values with 0 (20% missing)", fill=GRAY, font=font_small, anchor='mm')
    
    draw.rectangle([(200, 180), (450, 280)], fill=LIGHT_BLUE, outline=BLUE, width=2)
    draw.text((325, 210), "p50 Original: 27.5", fill=BLUE, font=font_medium, anchor='mm')
    draw.text((325, 250), "p50 Imputed: 20", fill=BLUE, font=font_medium, anchor='mm')
    
    draw.rectangle([(500, 180), (750, 280)], fill=LIGHT_RED, outline=RED, width=2)
    draw.text((625, 210), "Shift: 7.5", fill=RED, font=font_medium, anchor='mm')
    draw.text((625, 250), "27% reduction!", fill=RED, font=font_medium, anchor='mm')
    
    img.save('public/DS-28/exercise_percentile.png')
    
    print("  DS-28 images created!")

# ============ DS-29 Images ============
def create_ds29_images():
    print("Creating DS-29 images...")
    
    # Header
    img, draw = create_header(29, "Putting It All Together", "Stratified Audit Plan", PURPLE)
    
    # Flow arrows
    steps = ["Thresholds", "Strata", "Sample", "Investigate", "Adjust"]
    x_positions = [200, 350, 500, 650, 800]
    for i, (step, x) in enumerate(zip(steps, x_positions)):
        draw.rectangle([(x - 60, 380), (x + 60, 420)], fill=YELLOW, outline='white', width=2)
        draw.text((x, 400), step, fill='black', font=font_tiny, anchor='mm')
        if i < len(steps) - 1:
            draw.text((x + 90, 400), "→", fill='white', font=font_medium, anchor='mm')
    
    img.save('public/DS-29/audit_plan_intro.png')
    
    # Threshold cutoffs
    img = Image.new('RGB', (900, 450), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Step 1: Threshold Cutoffs (Percentile-Based)", fill='black', font=font_large, anchor='mm')
    
    strata = [
        ("Low", "0-50th", "50%", GREEN),
        ("Medium", "50-85th", "35%", YELLOW),
        ("High", "85-99th", "14%", ORANGE),
        ("Extreme", "99th+", "1%", RED),
    ]
    
    bar_width = 700
    bar_x = 100
    bar_y = 150
    
    widths = [350, 245, 98, 7]  # Proportional
    x_offset = bar_x
    for (name, range_str, pct, color), w in zip(strata, widths):
        draw.rectangle([(x_offset, bar_y), (x_offset + w, bar_y + 80)], fill=color, outline='black', width=1)
        if w > 50:
            draw.text((x_offset + w//2, bar_y + 25), name, fill='white', font=font_medium, anchor='mm')
            draw.text((x_offset + w//2, bar_y + 55), pct, fill='white', font=font_small, anchor='mm')
        x_offset += w
    
    draw.text((450, 280), "Percentile boundaries define stratum membership", fill=GRAY, font=font_medium, anchor='mm')
    
    img.save('public/DS-29/threshold_cutoffs.png')
    
    # Stratification design
    img = Image.new('RGB', (900, 500), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Step 2: Stratification Design", fill='black', font=font_large, anchor='mm')
    
    draw.text((450, 80), "Multi-dimensional: Amount × Risk × Account Age", fill='black', font=font_medium, anchor='mm')
    draw.text((450, 110), "= 4 × 3 × 2 = 24 possible strata", fill=GRAY, font=font_small, anchor='mm')
    
    example_strata = [
        ("Extreme_High_New", "🔴 Critical", RED),
        ("High_Medium_New", "🟡 High", ORANGE),
        ("Medium_Low_Seas", "🟢 Routine", GREEN),
    ]
    
    for i, (name, priority, color) in enumerate(example_strata):
        y = 160 + i * 80
        draw.rectangle([(200, y), (700, y + 60)], fill=color, outline='black', width=2)
        draw.text((350, y + 30), name, fill='white', font=font_medium, anchor='mm')
        draw.text((600, y + 30), priority, fill='white', font=font_small, anchor='mm')
    
    img.save('public/DS-29/stratification_design.png')
    
    # Sample allocation
    img = Image.new('RGB', (900, 500), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Step 3: Sample Size Allocation", fill='black', font=font_large, anchor='mm')
    
    methods = [
        ("Proportional", "n×(N_h/N)", BLUE),
        ("Neyman", "n×(N_h×σ_h)/Σ", GREEN),
        ("Risk-Weighted", "n×(N_h×p_h)/Σ", RED),
    ]
    
    for i, (name, formula, color) in enumerate(methods):
        x = 150 + i * 250
        draw.rectangle([(x - 80, 100), (x + 80, 200)], fill=color, outline='black', width=2)
        draw.text((x, 130), name, fill='white', font=font_medium, anchor='mm')
        draw.text((x, 170), formula, fill='white', font=font_tiny, anchor='mm')
    
    draw.text((450, 280), "Choose based on audit goals: precision vs cost vs risk", fill=GRAY, font=font_medium, anchor='mm')
    
    img.save('public/DS-29/sample_allocation.png')
    
    # Summary report
    img = Image.new('RGB', (900, 500), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Step 6: Summary Report", fill='black', font=font_large, anchor='mm')
    
    # Table header
    headers = ["Stratum", "Reviewed", "Fraud", "Rate"]
    col_x = [150, 300, 450, 600]
    for i, (header, x) in enumerate(zip(headers, col_x)):
        draw.rectangle([(x - 60, 80), (x + 60, 110)], fill=GRAY, outline='black', width=1)
        draw.text((x, 95), header, fill='white', font=font_small, anchor='mm')
    
    # Data rows
    rows = [
        ("Extreme_High", "50", "8", "16.0%", RED),
        ("High_Medium", "80", "4", "5.0%", ORANGE),
        ("Medium_Low", "167", "2", "1.2%", GREEN),
    ]
    
    for i, (stratum, reviewed, fraud, rate, color) in enumerate(rows):
        y = 130 + i * 50
        values = [stratum, reviewed, fraud, rate]
        for j, (val, x) in enumerate(zip(values, col_x)):
            fill_color = color if j == 0 else 'white'
            draw.rectangle([(x - 60, y), (x + 60, y + 40)], fill=fill_color, outline='black', width=1)
            text_color = 'white' if j == 0 else 'black'
            draw.text((x, y + 20), val, fill=text_color, font=font_small, anchor='mm')
    
    img.save('public/DS-29/summary_report.png')
    
    # Overlay adjustments
    img = Image.new('RGB', (900, 400), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Step 7: Overlay Adjustments", fill='black', font=font_large, anchor='mm')
    
    draw.rectangle([(100, 100), (400, 250)], fill=LIGHT_RED, outline=RED, width=2)
    draw.text((250, 130), "Fraud rate > expected", fill=RED, font=font_medium, anchor='mm')
    draw.text((250, 170), "Action: LOWER threshold", fill='black', font=font_small, anchor='mm')
    draw.text((250, 200), "→ Catch more cases", fill=GRAY, font=font_small, anchor='mm')
    
    draw.rectangle([(500, 100), (800, 250)], fill=LIGHT_GREEN, outline=GREEN, width=2)
    draw.text((650, 130), "Fraud rate < expected", fill=GREEN, font=font_medium, anchor='mm')
    draw.text((650, 170), "Action: RAISE threshold", fill='black', font=font_small, anchor='mm')
    draw.text((650, 200), "→ Reduce false positives", fill=GRAY, font=font_small, anchor='mm')
    
    img.save('public/DS-29/overlay_adjustments.png')
    
    # Exercise plan
    img = Image.new('RGB', (900, 450), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Exercise: Three-Strata Audit Plan", fill='black', font=font_large, anchor='mm')
    
    draw.text((450, 80), "Feature: transaction_velocity", fill='black', font=font_medium, anchor='mm')
    
    strata_plan = [
        ("Low", "0-5", "100", "0.5%"),
        ("Medium", "5-15", "150", "2%"),
        ("High", "15+", "200", "8%"),
    ]
    
    headers = ["Stratum", "Range", "Sample n", "Expected Rate"]
    col_x = [150, 300, 450, 650]
    for i, (header, x) in enumerate(zip(headers, col_x)):
        draw.rectangle([(x - 70, 120), (x + 70, 150)], fill=PURPLE, outline='black', width=1)
        draw.text((x, 135), header, fill='white', font=font_small, anchor='mm')
    
    for i, (stratum, range_val, n, rate) in enumerate(strata_plan):
        y = 170 + i * 50
        values = [stratum, range_val, n, rate]
        for j, (val, x) in enumerate(zip(values, col_x)):
            draw.rectangle([(x - 70, y), (x + 70, y + 40)], fill='white', outline='black', width=1)
            draw.text((x, y + 20), val, fill='black', font=font_small, anchor='mm')
    
    draw.text((450, 370), "Total sample: 450 | Power: 80% | α: 0.05", fill=GRAY, font=font_medium, anchor='mm')
    
    img.save('public/DS-29/exercise_plan.png')
    
    # Complete flowchart
    img = Image.new('RGB', (900, 600), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Complete Audit Workflow", fill='black', font=font_large, anchor='mm')
    
    steps = [
        ("Raw Data", GRAY, 80),
        ("Quantiles (ECDF)", BLUE, 150),
        ("Stratification", GREEN, 220),
        ("Sample Sizing", ORANGE, 290),
        ("Investigation", RED, 360),
        ("Summary & Metrics", PURPLE, 430),
        ("Adjustment → Loop", YELLOW, 500),
    ]
    
    for name, color, y in steps:
        draw.rectangle([(250, y), (650, y + 50)], fill=color, outline='black', width=2)
        draw.text((450, y + 25), name, fill='white', font=font_medium, anchor='mm')
        if y < 500:
            draw.line([(450, y + 50), (450, y + 70)], fill='black', width=2)
            draw.polygon([(445, y + 65), (455, y + 65), (450, y + 75)], fill='black')
    
    img.save('public/DS-29/complete_flowchart.png')
    
    print("  DS-29 images created!")

# ============ DS-30 Images ============
def create_ds30_images():
    print("Creating DS-30 images...")
    
    # Header
    img, draw = create_header(30, "Mathematical Blueprint", "Scenario Calibration Summary", YELLOW)
    
    # Six pillars
    pillars = ["📊 Nonparametric", "🛡️ Robust", "🎲 Sampling", "📈 Metrics", "🔵 Sets", "🌫️ Fuzzy"]
    for i, pillar in enumerate(pillars):
        x = 200 + (i % 3) * 300
        y = 320 + (i // 3) * 100
        draw.rectangle([(x - 100, y), (x + 100, y + 60)], fill=PURPLE, outline='white', width=2)
        draw.text((x, y + 30), pillar, fill='white', font=font_small, anchor='mm')
    
    img.save('public/DS-30/blueprint_intro.png')
    
    # Pipeline overview
    img = Image.new('RGB', (900, 550), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((450, 30), "Pipeline Overview: Six Pillars", fill='black', font=font_large, anchor='mm')
    
    pillars_detail = [
        ("📊 Nonparametrics", "Quantiles, ECDF", BLUE),
        ("🛡️ Robust Statistics", "MAD, Medcouple", GREEN),
        ("🎲 Sampling Theory", "Hypergeometric", ORANGE),
        ("📈 Decision Metrics", "F1, PR Curves", RED),
        ("🔵 Set Mathematics", "Venn, Jaccard", PURPLE),
        ("🌫️ Fuzzy Aggregation", "Min/Max T-Norms", YELLOW),
    ]
    
    for i, (name, desc, color) in enumerate(pillars_detail):
        row = i // 2
        col = i % 2
        x = 230 + col * 440
        y = 100 + row * 130
        draw.rectangle([(x - 180, y), (x + 180, y + 100)], fill=color, outline='black', width=2)
        draw.text((x, y + 35), name, fill='white', font=font_medium, anchor='mm')
        draw.text((x, y + 70), desc, fill='white', font=font_small, anchor='mm')
    
    img.save('public/DS-30/pipeline_overview.png')
    
    # Individual pillar images
    pillar_configs = [
        ("nonparametric", "Nonparametric Statistics", "Quantiles, ECDF, Order Statistics", BLUE),
        ("robust", "Robust Statistics", "MAD, Medcouple, Adjusted Fences", GREEN),
        ("sampling", "Sampling Theory", "Hypergeometric, Power Analysis", ORANGE),
        ("metrics", "Decision Metrics", "Precision, Recall, F1, PR Curves", RED),
        ("set", "Set Mathematics", "Intersection, Union, Jaccard", PURPLE),
        ("fuzzy", "Fuzzy Aggregation", "Min/Max T-Norms, Idempotence", YELLOW),
    ]
    
    for suffix, title, desc, color in pillar_configs:
        img = Image.new('RGB', (900, 400), color='white')
        draw = ImageDraw.Draw(img)
        draw.text((450, 30), f"Pillar: {title}", fill='black', font=font_large, anchor='mm')
        
        draw.rectangle([(150, 100), (750, 250)], fill=color, outline='black', width=3)
        draw.text((450, 150), title, fill='white', font=font_subtitle, anchor='mm')
        draw.text((450, 200), desc, fill='white', font=font_medium, anchor='mm')
        
        draw.text((450, 320), f"Maps to: pipeline implementation", fill=GRAY, font=font_medium, anchor='mm')
        
        img.save(f'public/DS-30/{suffix}_pillar.png')
    
    # End-to-end diagram
    img = Image.new('RGB', (950, 700), color='white')
    draw = ImageDraw.Draw(img)
    draw.text((475, 30), "End-to-End Pipeline with Math Labels", fill='black', font=font_large, anchor='mm')
    
    stages = [
        ("Raw Data", "{x₁, x₂, ..., xₙ}", GRAY, 80),
        ("Preprocessing", "Coercion, Imputation", BLUE, 150),
        ("Thresholds", "Q(p) = F̂⁻¹(p)", GREEN, 220),
        ("Stratification", "∪Sₕ = Universe", ORANGE, 290),
        ("Sampling", "Hypergeometric", RED, 360),
        ("Rules", "𝟙{x≥τ}, min/max", PURPLE, 430),
        ("Metrics", "F1 = 2PR/(P+R)", YELLOW, 500),
        ("Comparison", "J(A,B) = |A∩B|/|A∪B|", BLUE, 570),
    ]
    
    for name, formula, color, y in stages:
        draw.rectangle([(150, y), (450, y + 50)], fill=color, outline='black', width=2)
        draw.text((300, y + 25), name, fill='white', font=font_medium, anchor='mm')
        draw.text((700, y + 25), formula, fill='black', font=font_small, anchor='mm')
        if y < 570:
            draw.line([(300, y + 50), (300, y + 70)], fill='black', width=2)
    
    img.save('public/DS-30/end_to_end_diagram.png')
    
    print("  DS-30 images created!")

# ============ Run All ============
if __name__ == "__main__":
    print("Generating images for DS-25 to DS-30...")
    print("=" * 50)
    create_ds25_images()
    create_ds26_images()
    create_ds27_images()
    create_ds28_images()
    create_ds29_images()
    create_ds30_images()
    print("=" * 50)
    print("All images created successfully!")

