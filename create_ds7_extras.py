"""Generate additional DS-7 illustrative images."""

from pathlib import Path
from typing import Tuple

from PIL import Image, ImageDraw, ImageFont


OUTPUT_DIR = Path("public/DS-7")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def load_font(size: int) -> ImageFont.FreeTypeFont:
    """Load a default font with graceful fallback."""

    try:
        return ImageFont.truetype("arial.ttf", size)
    except OSError:
        return ImageFont.load_default()


def draw_centered_text(draw: ImageDraw.ImageDraw, text: str, xy: Tuple[int, int], font: ImageFont.ImageFont, fill: Tuple[int, int, int]):
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    draw.text((xy[0] - w // 2, xy[1] - h // 2), text, font=font, fill=fill)


def create_boxplot_workflow():
    img = Image.new("RGB", (1920, 1080), (245, 248, 255))
    draw = ImageDraw.Draw(img)

    title_font = load_font(72)
    subtitle_font = load_font(42)
    label_font = load_font(36)

    draw_centered_text(draw, "Boxplot Workflow", (960, 120), title_font, (34, 58, 94))
    draw_centered_text(draw, "From raw data to decisions", (960, 210), subtitle_font, (79, 112, 156))

    steps = [
        "Collect data",
        "Find Q1 / Median / Q3",
        "Compute IQR",
        "Set Tukey fences",
        "Flag outliers"
    ]

    x_positions = [260, 620, 980, 1340, 1680]
    box_color = (232, 239, 255)
    border_color = (87, 125, 179)

    for x, step in zip(x_positions, steps):
        draw.rounded_rectangle([x - 160, 340, x + 160, 820], radius=40, fill=box_color, outline=border_color, width=6)
        wrapped = "\n".join(step.split(" / "))
        draw_centered_text(draw, wrapped, (x, 580), label_font, (38, 66, 110))

    for start, end in zip(x_positions[:-1], x_positions[1:]):
        draw.line([start + 180, 580, end - 180, 580], fill=border_color, width=8)
        draw.polygon([(end - 190, 580), (end - 210, 560), (end - 210, 600)], fill=border_color)

    img.save(OUTPUT_DIR / "boxplot_workflow.png")


def create_outlier_actions():
    img = Image.new("RGB", (1920, 1080), (254, 246, 238))
    draw = ImageDraw.Draw(img)

    title_font = load_font(70)
    subtitle_font = load_font(44)
    label_font = load_font(38)
    small_font = load_font(30)

    draw_centered_text(draw, "Handling Suspected Outliers", (960, 130), title_font, (133, 74, 26))
    draw_centered_text(draw, "Use fences to guide your next move", (960, 220), subtitle_font, (168, 96, 42))

    actions = [
        ("Investigate", "Check data entry, sensors, context"),
        ("Cap / Winsorize", "Clamp values to the nearest fence"),
        ("Transform", "Apply log or Box-Cox to tame scale"),
        ("Model choices", "Use robust estimators or tree models")
    ]

    top = 320
    row_height = 180
    box_left = 280
    box_right = 1640

    for idx, (title, desc) in enumerate(actions):
        y1 = top + idx * row_height
        y2 = y1 + 140
        draw.rounded_rectangle([box_left, y1, box_right, y2], radius=35, fill=(255, 255, 255), outline=(197, 148, 97), width=4)
        draw.text((box_left + 40, y1 + 30), title, font=label_font, fill=(117, 73, 28))
        draw.text((box_left + 40, y1 + 80), desc, font=small_font, fill=(151, 108, 59))

    img.save(OUTPUT_DIR / "outlier_actions.png")


def create_fence_layers():
    img = Image.new("RGB", (1920, 1080), (240, 248, 244))
    draw = ImageDraw.Draw(img)

    title_font = load_font(70)
    subtitle_font = load_font(40)
    label_font = load_font(32)
    annot_font = load_font(28)

    draw_centered_text(draw, "Inner vs. Outer Fences", (960, 120), title_font, (30, 86, 74))
    draw_centered_text(draw, "Tukey's layers that wrap the box", (960, 210), subtitle_font, (52, 119, 103))

    baseline_y = 760
    left_x = 400
    right_x = 1520
    draw.line((left_x, baseline_y, right_x, baseline_y), fill=(60, 108, 93), width=8)

    draw_centered_text(draw, "Data axis", (960, baseline_y + 60), annot_font, (60, 108, 93))

    box_left = 700
    box_right = 1220
    box_top = 430
    box_bottom = 670

    draw.rectangle((box_left, box_top, box_right, box_bottom), fill=(213, 235, 227), outline=(23, 93, 82), width=5)
    draw.line((box_left, (box_top + box_bottom) // 2, box_right, (box_top + box_bottom) // 2), fill=(23, 93, 82), width=5)

    draw_centered_text(draw, "Median", (960, (box_top + box_bottom) // 2 - 10), label_font, (23, 93, 82))
    draw.text((box_left + 10, box_top + 15), "Q1", font=annot_font, fill=(23, 93, 82))
    draw.text((box_right - 60, box_top + 15), "Q3", font=annot_font, fill=(23, 93, 82))

    inner_left = box_left - 180
    inner_right = box_right + 180
    draw.line((inner_left, box_top - 60, inner_left, box_bottom + 60), fill=(243, 156, 18), width=6)
    draw.line((inner_right, box_top - 60, inner_right, box_bottom + 60), fill=(243, 156, 18), width=6)

    draw_centered_text(draw, "Inner fence (1.5 × IQR)", (inner_left, box_top - 90), annot_font, (183, 112, 7))
    draw_centered_text(draw, "Inner fence (1.5 × IQR)", (inner_right, box_top - 90), annot_font, (183, 112, 7))

    outer_left = box_left - 360
    outer_right = box_right + 360
    draw.line((outer_left, box_top - 80, outer_left, box_bottom + 80), fill=(214, 48, 49), width=6)
    draw.line((outer_right, box_top - 80, outer_right, box_bottom + 80), fill=(214, 48, 49), width=6)

    draw_centered_text(draw, "Outer fence (3 × IQR)", (outer_left, box_bottom + 120), annot_font, (158, 31, 32))
    draw_centered_text(draw, "Outer fence (3 × IQR)", (outer_right, box_bottom + 120), annot_font, (158, 31, 32))

    draw_centered_text(draw, "Points beyond outer fences → likely outliers", (960, 880), label_font, (214, 48, 49))
    draw_centered_text(draw, "Points between inner & outer fences → investigate", (960, 940), label_font, (183, 112, 7))

    img.save(OUTPUT_DIR / "fence_layers_overview.png")


def main():
    create_boxplot_workflow()
    create_outlier_actions()
    create_fence_layers()


if __name__ == "__main__":
    main()

