#!/usr/bin/env python3
"""
Hacktivist Claims Tracker — PDF Generator
==========================================
Reads data/claims.json and produces a landscape A4 PDF with:
  - Color-coded credibility tier badges
  - Row shading by alignment
  - Left accent border per tier
  - Legend bar and data caveat footer

Usage:
    pip install reportlab
    python generate_pdf.py
    # → outputs/hacktivist_claims_tracker.pdf

To customise the output path:
    python generate_pdf.py --output my_report.pdf

To filter by tier or alignment:
    python generate_pdf.py --tier "Almost Certainly Fabricated"
    python generate_pdf.py --alignment "Iran-Nexus"
"""

import json
import os
import argparse
from pathlib import Path

from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle,
    Paragraph, Spacer, HRFlowable
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER

# ── OUTPUT ────────────────────────────────────────────────────────────
REPO_ROOT   = Path(__file__).resolve().parent.parent
DATA_PATH   = REPO_ROOT / "data" / "claims.json"
OUTPUT_DIR  = REPO_ROOT / "pdf" / "outputs"
OUTPUT_FILE = OUTPUT_DIR / "hacktivist_claims_tracker.pdf"

PAGE = landscape(A4)

# ── COLORS ────────────────────────────────────────────────────────────
C = {
    "fab":      colors.HexColor('#C0392B'),
    "exa":      colors.HexColor('#D35400'),
    "pla":      colors.HexColor('#B7950B'),
    "con":      colors.HexColor('#1A7A43'),
    "fab_lt":   colors.HexColor('#FADBD8'),
    "exa_lt":   colors.HexColor('#FAE5D3'),
    "pla_lt":   colors.HexColor('#FEF9E7'),
    "con_lt":   colors.HexColor('#D5F5E3'),
    "head":     colors.HexColor('#0f1117'),
    "row_iran": colors.HexColor('#BBCFE8'),
    "row_russ": colors.HexColor('#DEC8EF'),
    "row_dual": colors.HexColor('#C3CAFE'),
    "row_fin":  colors.HexColor('#D8DDE2'),
    "row_even": colors.HexColor('#FFFFFF'),
    "row_odd":  colors.HexColor('#F8F9FA'),
    "grid":     colors.HexColor('#BDC3C7'),
    "white":    colors.white,
    "txt_dark": colors.HexColor('#1a1a2e'),
    "txt_mid":  colors.HexColor('#2c3e50'),
    "txt_lite": colors.HexColor('#4a5568'),
}

TIER_MAP = {
    "Almost Certainly Fabricated": ("FABRICATED",   "fab",  "fab_lt", colors.white),
    "Likely Exaggerated":          ("EXAGGERATED",  "exa",  "exa_lt", colors.white),
    "Plausible but Unverified":    ("PLAUSIBLE",    "pla",  "pla_lt", colors.HexColor('#1a1a00')),
    "Confirmed":                   ("CONFIRMED",    "con",  "con_lt", colors.white),
}

def align_row_color(alignment: str) -> colors.Color:
    a = alignment.lower()
    if "russia" in a and "iran" in a: return C["row_dual"]
    if "russia" in a:                 return C["row_russ"]
    if "financial" in a:              return C["row_fin"]
    return C["row_iran"]  # Iran-Nexus default


# ── PARAGRAPH STYLES ──────────────────────────────────────────────────
def ps(size=5.5, bold=False, color=None, align=TA_CENTER, bg=None, leading_extra=1.5):
    kwargs = dict(
        fontSize=size,
        fontName='Helvetica-Bold' if bold else 'Helvetica',
        textColor=color or C["txt_dark"],
        leading=size + leading_extra,
        wordWrap='LTR',
        alignment=align,
    )
    if bg:
        kwargs['backColor'] = bg
    return ParagraphStyle('s', **kwargs)

CELL    = ps(5.5, color=C["txt_dark"])
BOLD    = ps(5.5, bold=True, color=C["txt_dark"])
SMALL   = ps(5.0, color=C["txt_mid"])
SOURCE  = ps(4.8, color=C["txt_lite"])
HDR     = ps(6.5, bold=True, color=C["white"], align=TA_CENTER)

def badge(tier: str) -> Paragraph:
    label, bg_key, _, fg = TIER_MAP.get(tier, ("UNKNOWN", "grid", "row_even", C["txt_dark"]))
    style = ps(5.5, bold=True, color=fg, bg=C[bg_key], align=TA_CENTER)
    return Paragraph(label, style)

def p(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(str(text), style)


# ── LEGEND ────────────────────────────────────────────────────────────
def make_tier_legend() -> Table:
    items = [
        ("fab",  "white", "FABRICATED: Almost Certainly Fabricated"),
        ("exa",  "white", "EXAGGERATED: Likely Exaggerated"),
        ("pla",  "white", "PLAUSIBLE: Plausible / Unverified"),
        ("con",  "white", "CONFIRMED: Confirmed"),
    ]
    cells = [[
        p(label, ps(6.5, bold=True, color=C[fg], bg=C[bg], align=TA_CENTER))
        for bg, fg, label in items
    ]]
    t = Table(cells, colWidths=[7.1 * cm] * 4)
    t.setStyle(TableStyle([
        ('GRID',          (0,0),(-1,-1), 0.3, C["grid"]),
        ('TOPPADDING',    (0,0),(-1,-1), 4),
        ('BOTTOMPADDING', (0,0),(-1,-1), 4),
        ('LEFTPADDING',   (0,0),(-1,-1), 6),
    ]))
    return t

def make_align_legend() -> Table:
    rows = [[
        p('Row Color:', ps(7, bold=True)),
        p('Blue = Iran-Nexus / Pro-Palestinian',  ps(7, color=colors.HexColor('#1A5276'))),
        p('Purple = Pro-Russia',                  ps(7, color=colors.HexColor('#6C3483'))),
        p('Indigo = Dual / Mixed alignment',      ps(7, color=colors.HexColor('#4527A0'))),
        p('Grey = Financially motivated',         ps(7, color=colors.HexColor('#2C3E50'))),
    ]]
    t = Table(rows, colWidths=[3.2*cm, 6.5*cm, 5.0*cm, 5.5*cm, 5.0*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (1,0),(1,0), C["row_iran"]),
        ('BACKGROUND',    (2,0),(2,0), C["row_russ"]),
        ('BACKGROUND',    (3,0),(3,0), C["row_dual"]),
        ('BACKGROUND',    (4,0),(4,0), C["row_fin"]),
        ('GRID',          (0,0),(-1,-1), 0.3, C["grid"]),
        ('TOPPADDING',    (0,0),(-1,-1), 4),
        ('BOTTOMPADDING', (0,0),(-1,-1), 4),
        ('LEFTPADDING',   (0,0),(-1,-1), 6),
    ]))
    return t


# ── DATA TABLE ────────────────────────────────────────────────────────
HEADERS    = ['Hacktivist Group', 'Alignment', 'Attack Type', 'Entity Targeted',
              'Entity Type', 'Country', 'Date', 'Credibility\nTier', 'Assessment', 'Sources']
COL_WIDTHS = [3.0*cm, 2.4*cm, 2.8*cm, 4.0*cm, 2.2*cm, 1.6*cm, 1.8*cm, 2.3*cm, 5.0*cm, 3.8*cm]

def build_data_table(claims: list) -> Table:
    header_row = [p(h, HDR) for h in HEADERS]
    rows = [header_row]
    style_cmds = [
        ('BACKGROUND',    (0,0),(-1,0), C["head"]),
        ('TEXTCOLOR',     (0,0),(-1,0), C["white"]),
        ('FONTNAME',      (0,0),(-1,0), 'Helvetica-Bold'),
        ('TOPPADDING',    (0,0),(-1,-1), 3),
        ('BOTTOMPADDING', (0,0),(-1,-1), 3),
        ('LEFTPADDING',   (0,0),(-1,-1), 3),
        ('RIGHTPADDING',  (0,0),(-1,-1), 3),
        ('VALIGN',        (0,0),(-1,-1), 'TOP'),
        ('GRID',          (0,0),(-1,-1), 0.2, C["grid"]),
    ]

    for i, claim in enumerate(claims):
        ri = i + 1
        tier = claim.get("credibility_tier", "Plausible but Unverified")
        _, bg_key, lt_key, _ = TIER_MAP.get(tier, ("?", "grid", "row_even", C["txt_dark"]))
        row_bg = align_row_color(claim.get("alignment", ""))

        row = [
            p(claim.get("group",""), ps(5.5, bold=True, color=C["txt_dark"])),
            p(claim.get("alignment",""), SMALL),
            p(claim.get("attack_type",""), SMALL),
            p(claim.get("target",""), CELL),
            p(claim.get("entity_type",""), SMALL),
            p(claim.get("country",""), SMALL),
            p(claim.get("date",""), SMALL),
            badge(tier),
            p(claim.get("assessment",""), ps(5.0, color=C["txt_mid"])),
            p(claim.get("sources",""), SOURCE),
        ]
        rows.append(row)

        style_cmds += [
            ('BACKGROUND', (0,ri),(6,ri), row_bg),
            ('BACKGROUND', (8,ri),(9,ri), row_bg),
            ('BACKGROUND', (7,ri),(7,ri), C[lt_key]),
            ('LINEBEFORE',  (0,ri),(0,ri), 2.5, C[bg_key]),
        ]

    t = Table(rows, colWidths=COL_WIDTHS, repeatRows=1)
    t.setStyle(TableStyle(style_cmds))
    return t


# ── MAIN ──────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Generate hacktivist claims PDF")
    parser.add_argument("--output", default=str(OUTPUT_FILE), help="Output PDF path")
    parser.add_argument("--tier", default=None, help="Filter by credibility tier")
    parser.add_argument("--alignment", default=None, help="Filter by alignment (partial match)")
    args = parser.parse_args()

    # Load data
    print(f"Loading {DATA_PATH}…")
    with open(DATA_PATH) as f:
        claims = json.load(f)

    # Apply filters
    if args.tier:
        claims = [c for c in claims if c.get("credibility_tier","") == args.tier]
        print(f"Filtered to tier '{args.tier}': {len(claims)} claims")
    if args.alignment:
        claims = [c for c in claims if args.alignment.lower() in c.get("alignment","").lower()]
        print(f"Filtered to alignment '{args.alignment}': {len(claims)} claims")

    if not claims:
        print("No claims match the filters. Exiting.")
        return

    # Ensure output dir
    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    title_s = ParagraphStyle('T', fontSize=14, fontName='Helvetica-Bold',
                              textColor=C["head"], leading=18)
    sub_s   = ParagraphStyle('S', fontSize=8,  fontName='Helvetica',
                              textColor=colors.HexColor('#4a5568'), leading=11)
    foot_s  = ParagraphStyle('F', fontSize=5.5, fontName='Helvetica',
                              textColor=colors.HexColor('#718096'), leading=7.5)

    doc = SimpleDocTemplate(
        str(out_path), pagesize=PAGE,
        leftMargin=0.7*cm, rightMargin=0.7*cm,
        topMargin=0.9*cm,  bottomMargin=1.4*cm
    )

    story = [
        p(f"Hacktivist Claims Tracker — Iran-Nexus & Pro-Russia Groups "
          f"| Feb 28 – Mar 3, 2026 | {len(claims)} claims | Compiled Mar 3, 2026", title_s),
        Spacer(1, 0.2*cm),
        make_tier_legend(),
        Spacer(1, 0.15*cm),
        make_align_legend(),
        Spacer(1, 0.25*cm),
        build_data_table(claims),
        Spacer(1, 0.3*cm),
        HRFlowable(width='100%', thickness=0.5, color=C["grid"]),
        Spacer(1, 0.1*cm),
        p("<b>DATA CAVEAT:</b> Most claims are unverified self-reports from hacktivist Telegram "
          "channels and X/Twitter posts. Credibility assessments are based on independent analysis "
          "from Unit 42/Palo Alto Networks, Flashpoint, Sophos X-Ops, Hudson Rock, Check Point Research, "
          "CloudSEK, CrowdStrike, Truesec, SOCRadar Dark Web Monitor, and Halcyon RRC. "
          "Social intelligence: @FalconFeedsio, @H4ckmanac, @Cyberknow20, HackRisk.io, Outpost24. "
          "Claims should NOT be treated as confirmed incidents without independent validation. "
          "Coverage: 2026-02-28 through 2026-03-03. For situational awareness only.", foot_s),
    ]

    doc.build(story)
    print(f"\n✓ PDF written to: {out_path}")
    print(f"  {len(claims)} claims | {out_path.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
