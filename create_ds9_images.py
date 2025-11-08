from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = Path("public/DS-9")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

FONT_PATHS = [
    "C:/Windows/Fonts/seguisb.ttf",
    "C:/Windows/Fonts/segoeui.ttf",
]


def load_font(size: int) -> ImageFont.FreeTypeFont:
    for path in FONT_PATHS:
        font_path = Path(path)
        if font_path.exists():
            return ImageFont.truetype(str(font_path), size=size)
    return ImageFont.load_default()


def draw_centered_text(draw: ImageDraw.ImageDraw, text: str, box: tuple[int, int, int, int], font: ImageFont.FreeTypeFont, fill: tuple[int, int, int]):
    left, top, right, bottom = box
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = left + (right - left - text_width) / 2
    y = top + (bottom - top - text_height) / 2
    draw.text((x, y), text, font=font, fill=fill)


def header_image():
    image = Image.new("RGB", (1600, 900), "#0f172a")
    draw = ImageDraw.Draw(image)

    title_font = load_font(70)
    subtitle_font = load_font(32)

    draw_centered_text(
        draw,
        "Classical vs Robust Z-Scores",
        (0, 160, 1600, 450),
        title_font,
        (240, 249, 255),
    )
    draw_centered_text(
        draw,
        "Median & MAD keep their cool when the mean melts down",
        (0, 460, 1600, 680),
        subtitle_font,
        (148, 163, 184),
    )
    image.save(OUTPUT_DIR / "robust_vs_classic.png", "PNG")


def influence_image():
    image = Image.new("RGB", (1400, 800), "#f8fafc")
    draw = ImageDraw.Draw(image)

    title_font = load_font(50)
    label_font = load_font(28)
    caption_font = load_font(32)

    draw_centered_text(
        draw,
        "Influence Functions",
        (0, 40, 1400, 160),
        title_font,
        (15, 23, 42),
    )
    draw_centered_text(
        draw,
        "Mean & SD → Unbounded | Median & MAD → Bounded",
        (0, 150, 1400, 220),
        caption_font,
        (71, 85, 105),
    )

    draw.rectangle((120, 260, 660, 700), outline="#1d4ed8", width=6)
    draw.rectangle((740, 260, 1280, 700), outline="#059669", width=6)

    draw_centered_text(draw, "Mean / SD", (120, 260, 660, 320), label_font, (29, 78, 216))
    draw_centered_text(draw, "Median / MAD", (740, 260, 1280, 320), label_font, (4, 120, 87))

    draw.multiline_text(
        (170, 360),
        "• Influence grows with distance\n• One extreme point can dominate\n• Breakdown point: 0%",
        font=label_font,
        fill=(30, 64, 175),
        spacing=16,
    )
    draw.multiline_text(
        (790, 360),
        "• Influence stays bounded\n• Needs 50% corruption to fail\n• Breakdown point: 50%",
        font=label_font,
        fill=(4, 120, 87),
        spacing=16,
    )

    image.save(OUTPUT_DIR / "influence_function.png", "PNG")


def workflow_image():
    image = Image.new("RGB", (1400, 900), "#eef2ff")
    draw = ImageDraw.Draw(image)

    title_font = load_font(54)
    box_font = load_font(34)

    draw_centered_text(
        draw,
        "Robust Outlier Workflow",
        (0, 80, 1400, 200),
        title_font,
        (49, 46, 129),
    )

    steps = [
        ("Profile data", "#c7d2fe"),
        ("Run robust z", "#a5b4fc"),
        ("Inspect flags", "#818cf8"),
        ("Refit classical", "#6366f1"),
    ]

    box_width = 260
    box_height = 180
    gap = 80
    start_x = (1400 - (len(steps) * box_width + (len(steps) - 1) * gap)) / 2
    y = 340

    for index, (label, color) in enumerate(steps):
        x = start_x + index * (box_width + gap)
        draw.rounded_rectangle((x, y, x + box_width, y + box_height), radius=24, fill=color)
        draw_centered_text(draw, label, (x, y + 20, x + box_width, y + box_height - 20), box_font, (30, 27, 75))

    image.save(OUTPUT_DIR / "robust_workflow.png", "PNG")


def case_study_image():
    image = Image.new("RGB", (1600, 900), "#fdf2f8")
    draw = ImageDraw.Draw(image)

    title_font = load_font(56)
    column_font = load_font(36)
    text_font = load_font(30)

    draw_centered_text(
        draw,
        "Student Scores — Classical vs Robust",
        (0, 80, 1600, 220),
        title_font,
        (131, 24, 67),
    )

    draw.rounded_rectangle((180, 260, 760, 760), radius=40, fill="#fce7f3", outline="#db2777", width=4)
    draw.rounded_rectangle((840, 260, 1420, 760), radius=40, fill="#ffe4e6", outline="#be123c", width=4)

    draw_centered_text(draw, "Classical z", (180, 260, 760, 340), column_font, (190, 24, 93))
    draw_centered_text(draw, "Robust z", (840, 260, 1420, 340), column_font, (211, 54, 130))

    classical_text = (
        "μ = 92.05\n"
        "σ = 203.8\n"
        "z(76)  ≈ -0.08\n"
        "z(999) ≈  4.45"
    )
    robust_text = (
        "median = 85\n"
        "MAD* = 5.93\n"
        "zᵣ(76)  ≈ -1.52\n"
        "zᵣ(999) ≈ 154.1"
    )

    draw.multiline_text((230, 380), classical_text, font=text_font, fill=(219, 39, 119), spacing=18)
    draw.multiline_text((890, 380), robust_text, font=text_font, fill=(190, 24, 93), spacing=18)

    image.save(OUTPUT_DIR / "outlier_case_study.png", "PNG")


def qq_plot_image():
    image = Image.new("RGB", (1400, 820), "#ecfeff")
    draw = ImageDraw.Draw(image)

    title_font = load_font(48)
    caption_font = load_font(28)

    draw_centered_text(
        draw,
        "QQ Plot Before vs After Robust Cleaning",
        (0, 60, 1400, 180),
        title_font,
        (8, 47, 73),
    )

    draw.rounded_rectangle((120, 220, 660, 720), radius=28, fill="#cffafe", outline="#0e7490", width=4)
    draw.rounded_rectangle((740, 220, 1280, 720), radius=28, fill="#a5f3fc", outline="#0891b2", width=4)

    draw_centered_text(draw, "Raw data\n(999 present)", (120, 220, 660, 360), caption_font, (14, 116, 144))
    draw_centered_text(draw, "Winsorized / Cleaned", (740, 220, 1280, 320), caption_font, (22, 78, 99))

    draw.multiline_text(
        (180, 390),
        "• Points lift off the diagonal\n• Heavy tail from single error\n• Classical z is unreliable",
        font=caption_font,
        fill=(14, 116, 144),
        spacing=14,
    )
    draw.multiline_text(
        (800, 390),
        "• Points hug the diagonal\n• Distribution realigns\n• Safe to revisit classical stats",
        font=caption_font,
        fill=(22, 78, 99),
        spacing=14,
    )

    image.save(OUTPUT_DIR / "qq_plot_comparison.png", "PNG")


def decision_image():
    image = Image.new("RGB", (1600, 900), "#f1f5f9")
    draw = ImageDraw.Draw(image)

    title_font = load_font(58)
    box_font = load_font(34)

    draw_centered_text(
        draw,
        "Choosing Classical vs Robust",
        (0, 60, 1600, 200),
        title_font,
        (15, 23, 42),
    )

    draw.rounded_rectangle((200, 260, 760, 760), radius=36, fill="#dbeafe", outline="#2563eb", width=4)
    draw.rounded_rectangle((840, 260, 1400, 760), radius=36, fill="#dcfce7", outline="#16a34a", width=4)

    draw_centered_text(draw, "Classical z-score", (200, 260, 760, 340), box_font, (30, 64, 175))
    draw_centered_text(draw, "Robust z-score", (840, 260, 1400, 340), box_font, (22, 101, 52))

    classical_points = (
        "• Clean, controlled pipelines\n"
        "• Large, Gaussian samples\n"
        "• Regulatory requirements\n"
        "• Transparent historical metrics"
    )
    robust_points = (
        "• Unknown data quality\n"
        "• Heavy tails or skewness\n"
        "• High cost of missed anomalies\n"
        "• Default for exploratory work"
    )

    draw.multiline_text((240, 380), classical_points, font=box_font, fill=(37, 99, 235), spacing=18)
    draw.multiline_text((880, 380), robust_points, font=box_font, fill=(21, 128, 61), spacing=18)

    image.save(OUTPUT_DIR / "method_decision.png", "PNG")


def main():
    header_image()
    influence_image()
    workflow_image()
    case_study_image()
    qq_plot_image()
    decision_image()


if __name__ == "__main__":
    main()

