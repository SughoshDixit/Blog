from PIL import Image, ImageDraw, ImageFont
import os

# Create DS-2 directory
os.makedirs('public/DS-2', exist_ok=True)

def create_placeholder_expression_pipeline():
    img = Image.new('RGB', (1200, 600), color='white')
    draw = ImageDraw.Draw(img)
    
    try:
        font_title = ImageFont.truetype("arial.ttf", 48)
        font_text = ImageFont.truetype("arial.ttf", 24)
    except:
        font_title = ImageFont.load_default()
        font_text = ImageFont.load_default()
    
    draw.text((600, 50), 'Expression Evaluation Pipeline', fill='black', anchor='mt', font=font_title)
    
    boxes = [
        (150, 300, 200, 100, 'Expression\nString'),
        (450, 300, 140, 100, 'Tokenize'),
        (700, 300, 160, 100, 'Respect\nPrecedence'),
        (970, 300, 180, 100, 'Postfix\nEvaluation'),
    ]
    
    colors = ['#e3f2fd', '#fff3e0', '#fff3e0', '#c8e6c9']
    
    for i, (x, y, w, h, text) in enumerate(boxes):
        draw.rectangle([x, y-h//2, x+w, y+h//2], fill=colors[i], outline='#1976d2', width=3)
        lines = text.split('\n')
        for j, line in enumerate(lines):
            draw.text((x+w//2, y-h//2+30+j*25), line, fill='black', anchor='mm', font=font_text)
        
        if i < len(boxes) - 1:
            draw.line([x+w, y, boxes[i+1][0], y], fill='black', width=3)
            draw.line([boxes[i+1][0]-20, y-10, boxes[i+1][0], y], fill='black', width=3)
            draw.line([boxes[i+1][0]-20, y+10, boxes[i+1][0], y], fill='black', width=3)
    
    img.save('public/DS-2/expression_pipeline.png')
    print('Created expression_pipeline.png')

def create_tokenization_example():
    img = Image.new('RGB', (1200, 800), color='white')
    draw = ImageDraw.Draw(img)
    
    try:
        font_large = ImageFont.truetype("arial.ttf", 40)
        font_text = ImageFont.truetype("arial.ttf", 20)
        font_small = ImageFont.truetype("arial.ttf", 16)
    except:
        font_large = ImageFont.load_default()
        font_text = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    draw.text((600, 50), 'Tokenization Example', fill='black', anchor='mt', font=font_large)
    
    expr = '(score >= 0.85 and stability > 0.9) or (flag == 0)'
    draw.text((600, 100), 'Input: ' + expr, fill='black', anchor='mt', font=font_small)
    
    tokens = [
        ('(', '#bbdefb'),
        ('score', '#c8e6c9'),
        ('>=', '#fff9c4'),
        ('0.85', '#ffccbc'),
        ('and', '#e1bee7'),
        ('stability', '#c8e6c9'),
        ('>', '#fff9c4'),
        ('0.9', '#ffccbc'),
        (')', '#bbdefb'),
        ('or', '#e1bee7'),
        ('(', '#bbdefb'),
        ('flag', '#c8e6c9'),
        ('==', '#fff9c4'),
        ('0', '#ffccbc'),
        (')', '#bbdefb'),
    ]
    
    x, y = 100, 200
    spacing = 70
    
    for i, (token, color) in enumerate(tokens):
        if i > 0 and i % 8 == 0:
            x = 100
            y += 100
        
        rx, ry = x, y
        w, h = 65, 50
        
        # Draw rounded rectangle
        draw.rectangle([rx, ry-h//2, rx+w, ry+h//2], fill=color, outline='black', width=2)
        draw.text((rx+w//2, ry), token, fill='black', anchor='mm', font=font_text)
        
        if i < 5:
            types = ['Paren', 'ID', 'Operator', 'Number', 'Operator']
            draw.text((rx+w//2, ry+h//2+15), types[i], fill='gray', anchor='mt', font=ImageFont.load_default())
        
        x += spacing
    
    img.save('public/DS-2/tokenization_example.png')
    print('Created tokenization_example.png')

def create_precedence_ladder():
    img = Image.new('RGB', (1000, 800), color='white')
    draw = ImageDraw.Draw(img)
    
    try:
        font_large = ImageFont.truetype("arial.ttf", 40)
        font_text = ImageFont.truetype("arial.ttf", 22)
    except:
        font_large = ImageFont.load_default()
        font_text = ImageFont.load_default()
    
    draw.text((500, 50), 'Operator Precedence Ladder', fill='black', anchor='mt', font=font_large)
    
    precedence = [
        (1, 'Parentheses', '()'),
        (2, 'Multiplication/Division', '* /'),
        (3, 'Addition/Subtraction', '+ -'),
        (4, 'Comparisons', '>= <= > < == !='),
        (5, 'NOT (unary)', 'not'),
        (6, 'AND', 'and'),
        (7, 'OR', 'or'),
    ]
    
    y = 150
    for level, name, symbols in precedence:
        width = 700 - (level - 1) * 50
        x = (1000 - width) // 2
        
        # Create gradient effect with simple colors
        colors = ['#3f51b5', '#5c6bc0', '#7986cb', '#9fa8da', '#c5cae9', '#e8eaf6', '#f3e5f5']
        draw.rectangle([x, y-30, x+width, y+30], fill=colors[level-1], outline='black', width=2)
        draw.text((x+20, y), f'{level}. {name}: {symbols}', fill='black', anchor='lm', font=font_text)
        
        if level < 7:
            draw.ellipse([x+width//2-5, y+30, x+width//2+5, y+35], fill='gray')
        
        y += 90
    
    img.save('public/DS-2/precedence_ladder.png')
    print('Created precedence_ladder.png')

def create_infix_postfix():
    img = Image.new('RGB', (1200, 1000), color='white')
    draw = ImageDraw.Draw(img)
    
    try:
        font_large = ImageFont.truetype("arial.ttf", 40)
        font_text = ImageFont.truetype("arial.ttf", 24)
        font_med = ImageFont.truetype("arial.ttf", 18)
    except:
        font_large = ImageFont.load_default()
        font_text = ImageFont.load_default()
        font_med = ImageFont.load_default()
    
    draw.text((600, 40), 'Infix → Postfix (RPN) Conversion', fill='black', anchor='mt', font=font_large)
    
    # Infix box
    draw.rectangle([80, 120, 1120, 280], fill='#fff3e0', outline='#ff9800', width=4)
    draw.text((600, 170), 'Infix Notation', fill='black', anchor='mt', font=font_text)
    
    infix = '(score >= 0.85 and stability > 0.9) or (flag == 0)'
    draw.text((600, 220), infix, fill='black', anchor='mt', font=font_med)
    draw.text((600, 250), 'Human-readable', fill='gray', anchor='mt', font=font_med)
    
    # Arrow
    draw.polygon([(600, 320), (590, 340), (610, 340)], fill='black')
    draw.line([600, 320, 600, 400], fill='black', width=5)
    
    # Postfix box
    draw.rectangle([80, 420, 1120, 580], fill='#e8f5e9', outline='#4caf50', width=4)
    draw.text((600, 470), 'Postfix (RPN) Notation', fill='black', anchor='mt', font=font_text)
    
    postfix = 'score 0.85 >= stability 0.9 > and flag 0 == or'
    draw.text((600, 520), postfix, fill='#2e7d32', anchor='mt', font=font_med)
    draw.text((600, 550), 'Machine-ready, unambiguous', fill='gray', anchor='mt', font=font_med)
    
    img.save('public/DS-2/infix_postfix.png')
    print('Created infix_postfix.png')

# Create all images
create_placeholder_expression_pipeline()
create_tokenization_example()
create_precedence_ladder()
create_infix_postfix()

print('\nAll DS-2 placeholder images created!')
print('For better quality images, use generate_ds2_images.html in a browser.')
