"""
Export Router — PDF report generation endpoint.
"""

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER
from services.data_service import get_dataframe, get_salary_df, get_skills, TARGET_ROLES
from collections import Counter

router = APIRouter()

PRIMARY = HexColor("#065A82")
ACCENT = HexColor("#02C39A")
GRAY = HexColor("#666666")
LIGHT_BG = HexColor("#F0F7FF")
LIGHT_GRAY = HexColor("#EEEEEE")


class ReportRequest(BaseModel):
    role: str
    region: str = "Global"
    user_name: str = ""


@router.post("/export-report")
def export_report(req: ReportRequest):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            rightMargin=2*cm, leftMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)
    styles = getSampleStyleSheet()
    elements = []

    title_style = ParagraphStyle("Title", parent=styles["Title"],
                                 fontSize=24, textColor=PRIMARY, spaceAfter=6, alignment=TA_CENTER)
    subtitle_style = ParagraphStyle("Sub", parent=styles["Normal"],
                                    fontSize=12, textColor=GRAY, spaceAfter=4, alignment=TA_CENTER)
    heading_style = ParagraphStyle("Head", parent=styles["Heading1"],
                                   fontSize=14, textColor=PRIMARY, spaceBefore=12, spaceAfter=6)
    body_style = ParagraphStyle("Body", parent=styles["Normal"],
                                fontSize=10, textColor=black, spaceAfter=4, leading=14)

    # Header
    elements.append(Paragraph("🧠 CareerLens", title_style))
    elements.append(Paragraph("AI-Powered Job Market Intelligence Report", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=2, color=ACCENT))
    elements.append(Spacer(1, 0.3*cm))
    elements.append(Paragraph(f"Role: <b>{req.role}</b> | Region: <b>{req.region}</b>", body_style))
    elements.append(Paragraph(f"Generated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}", body_style))
    if req.user_name:
        elements.append(Paragraph(f"Prepared for: <b>{req.user_name}</b>", body_style))
    elements.append(Spacer(1, 0.5*cm))

    # ── Shared Data ───────────────────────────────────────────────────────────
    df = get_dataframe()
    sal = get_salary_df(df)
    role_df = df[df["role_category"] == req.role]
    role_data = sal[sal["role_category"] == req.role]
    if req.region == "India":
        role_df   = role_df[role_df["region"] == "India"]
        role_data = role_data[role_data["region"] == "India"]

    total_jobs = len(role_df)

    # ── Section 1: Salary Benchmarks ─────────────────────────────────────────
    elements.append(Paragraph("1. Salary Benchmarks", heading_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=LIGHT_GRAY))

    if len(role_data) >= 5:
        p10    = role_data["salary_usd"].quantile(0.10)
        p25    = role_data["salary_usd"].quantile(0.25)
        median = role_data["salary_usd"].median()
        p75    = role_data["salary_usd"].quantile(0.75)
        p90    = role_data["salary_usd"].quantile(0.90)

        overview_data = [
            ["Percentile", "Annual (USD)", "Annual (INR ≈ ₹83/$)"],
            ["10th Percentile (Entry)",    f"${p10:,.0f}",    f"₹{p10*83/100000:.1f} LPA"],
            ["25th Percentile",            f"${p25:,.0f}",    f"₹{p25*83/100000:.1f} LPA"],
            ["50th Percentile (Median)",   f"${median:,.0f}", f"₹{median*83/100000:.1f} LPA"],
            ["75th Percentile",            f"${p75:,.0f}",    f"₹{p75*83/100000:.1f} LPA"],
            ["90th Percentile (Senior)",   f"${p90:,.0f}",    f"₹{p90*83/100000:.1f} LPA"],
            ["Total Job Postings",         f"{total_jobs:,}", "-"],
        ]
        tbl = Table(overview_data, colWidths=[6*cm, 5*cm, 5*cm])
        tbl.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
            ("TEXTCOLOR", (0, 0), (-1, 0), white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, LIGHT_BG]),
            ("GRID", (0, 0), (-1, -1), 0.5, LIGHT_GRAY),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]))
        elements.append(tbl)
    else:
        elements.append(Paragraph(f"Insufficient salary data for {req.role} in {req.region}.", body_style))

    elements.append(Spacer(1, 0.5*cm))

    # ── Section 2: Top Skills ─────────────────────────────────────────────────
    elements.append(Paragraph("2. Top 15 In-Demand Skills", heading_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=LIGHT_GRAY))
    top_skills = get_skills(role=req.role if req.role else None,
                            region="India" if req.region == "India" else None,
                            top_n=15)
    if top_skills:
        skills_data = [["Rank", "Skill", "# Job Postings"]]
        for i, s in enumerate(top_skills, 1):
            skills_data.append([str(i), s["skill"].title(), f"{s['count']:,}"])
        sk_tbl = Table(skills_data, colWidths=[1.5*cm, 8*cm, 6.5*cm])
        sk_tbl.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), ACCENT),
            ("TEXTCOLOR", (0, 0), (-1, 0), white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("ALIGN", (0, 0), (0, -1), "CENTER"),
            ("ALIGN", (2, 0), (2, -1), "CENTER"),
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, LIGHT_BG]),
            ("GRID", (0, 0), (-1, -1), 0.5, LIGHT_GRAY),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ]))
        elements.append(sk_tbl)
    else:
        elements.append(Paragraph("No skill data available for this selection.", body_style))

    elements.append(Spacer(1, 0.5*cm))

    # ── Section 3: Top Hiring Companies ──────────────────────────────────────
    elements.append(Paragraph("3. Top 10 Hiring Companies", heading_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=LIGHT_GRAY))
    from services.data_service import get_companies
    top_companies = get_companies(role=req.role if req.role else None,
                                  region="India" if req.region == "India" else None,
                                  top_n=10)
    if top_companies:
        comp_data = [["Rank", "Company", "Open Postings"]]
        for i, c in enumerate(top_companies, 1):
            comp_data.append([str(i), c["company"], str(c["openings"])])
        co_tbl = Table(comp_data, colWidths=[1.5*cm, 10*cm, 4.5*cm])
        co_tbl.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
            ("TEXTCOLOR", (0, 0), (-1, 0), white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("ALIGN", (0, 0), (0, -1), "CENTER"),
            ("ALIGN", (2, 0), (2, -1), "CENTER"),
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, LIGHT_BG]),
            ("GRID", (0, 0), (-1, -1), 0.5, LIGHT_GRAY),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ]))
        elements.append(co_tbl)
    else:
        elements.append(Paragraph("No company data available for this selection.", body_style))

    elements.append(Spacer(1, 0.5*cm))

    # ── Section 4: Negotiation Benchmarks ────────────────────────────────────
    if len(role_data) >= 5:
        elements.append(Paragraph("4. Salary Negotiation Benchmarks", heading_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=LIGHT_GRAY))
        elements.append(Paragraph(
            f"Use these benchmarks when negotiating your {req.role} offer. "
            "Always anchor to the 75th–90th percentile range.", body_style))
        elements.append(Spacer(1, 0.2*cm))

        neg_data = [
            ["Career Stage", "Target Ask (USD)", "Target Ask (INR)", "Strategy"],
            ["Entry Level / Fresher", f"${p25:,.0f}–${median:,.0f}",
             f"₹{p25*83/100000:.0f}–{median*83/100000:.0f}L", "Negotiate on benefits, signing bonus"],
            ["Mid Level (3-6 yrs)",   f"${median:,.0f}–${p75:,.0f}",
             f"₹{median*83/100000:.0f}–{p75*83/100000:.0f}L", "Lead with competing offers"],
            ["Senior Level (6+ yrs)", f"${p75:,.0f}–${p90:,.0f}",
             f"₹{p75*83/100000:.0f}–{p90*83/100000:.0f}L", "Anchor at P90, settle at P75"],
        ]
        neg_tbl = Table(neg_data, colWidths=[4*cm, 4*cm, 4*cm, 4*cm])
        neg_tbl.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), ACCENT),
            ("TEXTCOLOR", (0, 0), (-1, 0), white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, LIGHT_BG]),
            ("GRID", (0, 0), (-1, -1), 0.5, LIGHT_GRAY),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("WORDWRAP", (0, 0), (-1, -1), True),
        ]))
        elements.append(neg_tbl)

    # ── Footer ────────────────────────────────────────────────────────────────
    elements.append(Spacer(1, 1*cm))
    elements.append(HRFlowable(width="100%", thickness=1, color=LIGHT_GRAY))
    footer_style = ParagraphStyle("Footer", parent=styles["Normal"],
                                  fontSize=8, textColor=GRAY, alignment=TA_CENTER)
    elements.append(Paragraph(
        f"CareerLens Market Intelligence Report | Generated {datetime.now().strftime('%B %d, %Y')} | "
        f"Data sourced from 115,000+ job postings (Naukri + LinkedIn)",
        footer_style))

    doc.build(elements)
    buffer.seek(0)

    filename = f"CareerLens_{req.role.replace('/', '_')}_{req.region}_{datetime.now().strftime('%Y%m%d')}.pdf"
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )

