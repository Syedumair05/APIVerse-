from PIL import Image, ImageDraw, ImageFont
import math
import os

def create_charts():
    out_dir = r"C:\Users\Syed Umair Ahmed\.gemini\antigravity-ide\brain\778d4312-48fa-4f05-b0f9-5a50bdd9ad3e\charts"
    os.makedirs(out_dir, exist_ok=True)

    # 1. CHART 1: Regional Population (Bar Chart)
    w, h = 900, 450
    img1 = Image.new("RGBA", (w, h), "#F8FAFC")
    draw1 = ImageDraw.Draw(img1)
    
    # Title
    draw1.rectangle([0, 0, w, 50], fill="#0F172A")
    draw1.text((20, 15), "Global Population by Region (Billions / Millions)", fill="#FFFFFF")

    data1 = [
        ("Asia", 4.7, "#4F46E5"),
        ("Africa", 1.4, "#0EA5E9"),
        ("Americas", 1.03, "#10B981"),
        ("Europe", 0.74, "#F59E0B"),
        ("Oceania", 0.045, "#EC4899")
    ]
    
    max_val = 5.0
    chart_x, chart_y = 80, 80
    chart_w, chart_h = 780, 300
    
    # Gridlines
    for i in range(6):
        val = max_val * (5 - i) / 5
        y = chart_y + i * (chart_h / 5)
        draw1.line([(chart_x, y), (chart_x + chart_w, y)], fill="#E2E8F0", width=1)
        draw1.text((20, y - 6), f"{val:.1f}B", fill="#64748B")

    bar_width = 80
    gap = (chart_w - len(data1) * bar_width) // (len(data1) + 1)

    for idx, (label, val, color) in enumerate(data1):
        bx = chart_x + gap + idx * (bar_width + gap)
        bh = int((val / max_val) * chart_h)
        by = chart_y + chart_h - bh

        # Draw Bar
        draw1.rectangle([bx, by, bx + bar_width, chart_y + chart_h], fill=color)
        
        # Value tag
        val_str = f"{val}B" if val >= 0.1 else f"{int(val*1000)}M"
        draw1.text((bx + 15, by - 20), val_str, fill="#1E293B")
        
        # Label
        draw1.text((bx + 15, chart_y + chart_h + 10), label, fill="#0F172A")

    img1.convert("RGB").save(os.path.join(out_dir, "chart_region_pop.png"))

    # 2. CHART 2: Sovereign Country Count by Region (Donut Chart)
    img2 = Image.new("RGBA", (w, h), "#F8FAFC")
    draw2 = ImageDraw.Draw(img2)
    
    draw2.rectangle([0, 0, w, 50], fill="#0F172A")
    draw2.text((20, 15), "Sovereign Country Breakdown by Region (Total: 244 Nations)", fill="#FFFFFF")

    data2 = [
        ("Africa (58)", 58, "#0EA5E9"),
        ("Americas (56)", 56, "#10B981"),
        ("Europe (53)", 53, "#4F46E5"),
        ("Asia (50)", 50, "#F59E0B"),
        ("Oceania (27)", 27, "#EC4899")
    ]
    
    total_countries = sum(d[1] for d in data2)
    center_x, center_y = 260, 250
    radius = 150
    inner_radius = 80
    
    start_deg = -90
    for label, val, color in data2:
        sweep = (val / total_countries) * 360
        end_deg = start_deg + sweep
        
        # Draw Pie Slice
        draw2.pieslice(
            [center_x - radius, center_y - radius, center_x + radius, center_y + radius],
            start=start_deg, end=end_deg, fill=color
        )
        start_deg = end_deg

    # Inner donut cutout
    draw2.ellipse(
        [center_x - inner_radius, center_y - inner_radius, center_x + inner_radius, center_y + inner_radius],
        fill="#F8FAFC"
    )
    draw2.text((center_x - 30, center_y - 10), "244 Nations", fill="#0F172A")

    # Legend
    lx, ly = 480, 120
    for label, val, color in data2:
        draw2.rectangle([lx, ly, lx + 20, ly + 20], fill=color)
        pct = (val / total_countries) * 100
        draw2.text((lx + 35, ly + 2), f"{label} — {pct:.1f}%", fill="#1E293B")
        ly += 45

    img2.convert("RGB").save(os.path.join(out_dir, "chart_region_donut.png"))

    # 3. CHART 3: Top 10 Most Populous Nations (Horizontal Bar Chart)
    w3, h3 = 900, 500
    img3 = Image.new("RGBA", (w3, h3), "#F8FAFC")
    draw3 = ImageDraw.Draw(img3)

    draw3.rectangle([0, 0, w3, 50], fill="#0F172A")
    draw3.text((20, 15), "Top 10 Most Populous Nations (in Millions)", fill="#FFFFFF")

    data3 = [
        ("India", 1428, "#4F46E5"),
        ("China", 1411, "#4F46E5"),
        ("United States", 340, "#0EA5E9"),
        ("Indonesia", 277, "#0EA5E9"),
        ("Pakistan", 240, "#0EA5E9"),
        ("Nigeria", 224, "#10B981"),
        ("Brazil", 216, "#10B981"),
        ("Bangladesh", 173, "#10B981"),
        ("Russia", 144, "#F59E0B"),
        ("Ethiopia", 126, "#F59E0B")
    ]

    max_p = 1500
    cy = 75
    bar_h = 28
    for country, pop, color in data3:
        bar_w = int((pop / max_p) * 550)
        draw3.text((40, cy + 5), country, fill="#0F172A")
        draw3.rectangle([200, cy, 200 + bar_w, cy + bar_h], fill=color)
        draw3.text((210 + bar_w, cy + 5), f"{pop}M", fill="#475569")
        cy += 40

    img3.convert("RGB").save(os.path.join(out_dir, "chart_top_pop.png"))
    print("All chart images generated successfully!")

if __name__ == "__main__":
    create_charts()
