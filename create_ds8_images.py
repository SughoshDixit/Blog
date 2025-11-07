"""Generate illustrative placeholders for DS-8 Adjusted Boxplot article."""

from pathlib import Path
from typing import Iterable, Tuple

from PIL import Image, ImageDraw, ImageFont


OUTPUT_DIR = Path("public/DS-8")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def load_font(size: int) -> ImageFont.ImageFont:
    try:
        return ImageFont.truetype("arial.ttf", size)
    except OSError:
        return ImageFont.load_default()


def draw_centered(draw: ImageDraw.ImageDraw, text: str, xy: Tuple[int, int], font: ImageFont.ImageFont, fill: Tuple[int, int, int]):
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    draw.text((xy[0] - w // 2, xy[1] - h // 2), text, font=font, fill=fill)


def draw_wrapped(draw: ImageDraw.ImageDraw, lines: Iterable[str], xy: Tuple[int, int], spacing: int, font: ImageFont.ImageFont, fill: Tuple[int, int, int]):
    x, y = xy
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        draw.text((x - (bbox[2] - bbox[0]) // 2, y), line, font=font, fill=fill)
        y += (bbox[3] - bbox[1]) + spacing


def header_image():
    img = Image.new("RGB", (1920, 1080), (244, 248, 255))
    draw = ImageDraw.Draw(img)

    title_font = load_font(78)
    subtitle_font = load_font(46)

    draw_centered(draw, "Adjusted Boxplots", (960, 220), title_font, (28, 66, 114))
    draw_centered(draw, "Let long tails breathe without raising false alarms", (960, 340), subtitle_font, (67, 104, 152))

    draw.rectangle((360, 520, 1560, 820), outline=(110, 149, 206), width=6, fill=(225, 236, 255))
    draw_centered(draw, "Tukey fences × Medcouple skewness", (960, 670), load_font(42), (36, 84, 152))

    img.save(OUTPUT_DIR / "adjusted_boxplot_intro.png")


def regular_vs_adjusted():
    img = Image.new("RGB", (1920, 1080), (252, 246, 240))
    draw = ImageDraw.Draw(img)

    title_font = load_font(60)
    draw_centered(draw, "Regular vs Adjusted Boxplot", (960, 120), title_font, (94, 58, 20))

    label_font = load_font(36)
    note_font = load_font(28)

    # Left panel - regular
    draw.rectangle((260, 220, 900, 880), outline=(186, 136, 79), width=5, fill=(255, 253, 248))
    draw_centered(draw, "Regular", (580, 260), label_font, (123, 76, 27))
    draw_wrapped(draw, ["Symmetric fences", "Flags tail points"], (580, 430), 12, note_font, (133, 90, 48))
    draw.line((420, 620, 740, 620), fill=(123, 76, 27), width=6)
    draw.rectangle((490, 500, 670, 740), fill=(226, 196, 148), outline=(123, 76, 27), width=4)
    draw.line((455, 620, 705, 620), fill=(123, 76, 27), width=3)

    # Right panel - adjusted
    draw.rectangle((1020, 220, 1660, 880), outline=(62, 116, 104), width=5, fill=(240, 254, 248))
    draw_centered(draw, "Adjusted", (1340, 260), label_font, (41, 86, 72))
    draw_wrapped(draw, ["Skew aware fences", "Lets long tail extend"], (1340, 430), 12, note_font, (51, 110, 94))
    draw.line((1180, 620, 1520, 620), fill=(51, 110, 94), width=6)
    draw.rectangle((1250, 500, 1430, 740), fill=(182, 230, 212), outline=(51, 110, 94), width=4)
    draw.line((1150, 620, 1550, 620), fill=(51, 110, 94), width=3)
    draw.line((1500, 560, 1590, 560), fill=(51, 110, 94), width=6)

    img.save(OUTPUT_DIR / "regular_vs_adjusted.png")


def medcouple_explainer():
    img = Image.new("RGB", (1920, 1080), (237, 245, 250))
    draw = ImageDraw.Draw(img)

    title_font = load_font(60)
    draw_centered(draw, "Medcouple (MC) intuition", (960, 140), title_font, (37, 84, 129))

    label_font = load_font(34)
    text_font = load_font(28)

    draw.rectangle((320, 260, 1600, 860), outline=(94, 139, 190), width=5, fill=(220, 234, 248))

    draw_wrapped(draw,
                 ["Pairs of points mirrored around the median",
                  "If right tail is longer, MC > 0",
                  "If left tail is longer, MC < 0",
                  "Median of pairwise slopes keeps it robust"],
                 (960, 400), 18, text_font, (37, 84, 129))

    draw.line((960, 520, 960, 820), fill=(37, 84, 129), width=4)
    draw.ellipse((900, 580, 1020, 700), outline=(37, 84, 129), width=4)
    draw_centered(draw, "Median", (960, 640), label_font, (37, 84, 129))
    draw_centered(draw, "Compare pairs", (960, 760), text_font, (37, 84, 129))

    img.save(OUTPUT_DIR / "medcouple_explainer.png")


def skew_fence_adjustments():
    img = Image.new("RGB", (1920, 1080), (245, 240, 250))
    draw = ImageDraw.Draw(img)

    title_font = load_font(58)
    draw_centered(draw, "How fences move with skew", (960, 120), title_font, (86, 57, 122))

    label_font = load_font(34)
    note_font = load_font(24)

    # Positive skew panel
    draw.rectangle((220, 220, 940, 920), outline=(146, 106, 198), width=5, fill=(232, 222, 246))
    draw_centered(draw, "MC > 0 (Right skew)", (580, 260), label_font, (96, 62, 142))
    draw_wrapped(draw, ["Upper fence → expands", "Lower fence → contracts"], (580, 420), 8, note_font, (96, 62, 142))
    draw.line((360, 640, 820, 640), fill=(96, 62, 142), width=6)
    draw.line((760, 560, 900, 560), fill=(96, 62, 142), width=8)
    draw.line((300, 720, 380, 720), fill=(96, 62, 142), width=5)

    # Negative skew panel
    draw.rectangle((980, 220, 1700, 920), outline=(69, 122, 181), width=5, fill=(217, 232, 247))
    draw_centered(draw, "MC < 0 (Left skew)", (1340, 260), label_font, (51, 90, 147))
    draw_wrapped(draw, ["Upper fence → contracts", "Lower fence → expands"], (1340, 420), 8, note_font, (51, 90, 147))
    draw.line((1120, 640, 1580, 640), fill=(51, 90, 147), width=6)
    draw.line((1080, 560, 1160, 560), fill=(51, 90, 147), width=8)
    draw.line((1520, 720, 1640, 720), fill=(51, 90, 147), width=8)

    img.save(OUTPUT_DIR / "skew_fence_adjustments.png")


def house_price_analysis():
    img = Image.new("RGB", (1920, 1080), (250, 252, 240))
    draw = ImageDraw.Draw(img)

    title_font = load_font(56)
    draw_centered(draw, "House Price Example", (960, 140), title_font, (77, 98, 37))

    table_font = load_font(28)
    header_font = load_font(32)

    draw.rectangle((320, 240, 1600, 880), outline=(128, 158, 74), width=5, fill=(236, 242, 222))
    draw_centered(draw, "Data (₹ thousands)", (960, 300), header_font, (77, 98, 37))
    draw_wrapped(draw, ["150, 180, 200, 220, 250, 280, 320, 400, 650, 1200"], (960, 360), 6, table_font, (77, 98, 37))

    draw_centered(draw, "Traditional fences → flag 1200", (960, 520), table_font, (112, 132, 68))
    draw_centered(draw, "Adjusted fences → accept 1200", (960, 560), table_font, (112, 132, 68))

    draw.rectangle((480, 620, 1440, 820), outline=(128, 158, 74), width=4, fill=(216, 232, 196))
    draw_wrapped(draw,
                 ["Lower adj. fence ≈ 112",
                  "Upper adj. fence ≈ 1618",
                  "Medcouple ≈ 0.35 → right tail slack"],
                 (960, 680), 10, table_font, (77, 98, 37))

    img.save(OUTPUT_DIR / "house_price_analysis.png")


def main():
    header_image()
    regular_vs_adjusted()
    medcouple_explainer()
    skew_fence_adjustments()
    house_price_analysis()


if __name__ == "__main__":
    main()

