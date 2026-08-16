"""Psychometry — detailed report PDF generation (mock, ExploreX content).

Generates the multi-section detailed psychometric report as a PDF using
reportlab, personalised with the student's name / grade / assessment type.
Assessment types: DiscoverU (Classes 6-8), ExploreX (Classes 9-10),
DecidePro (Classes 11-12). Content structure currently mirrors the ExploreX
sample report; DiscoverU / DecidePro copy can be plugged in later.
"""
import io
import re
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, Flowable,
)

NAVY = colors.HexColor("#0F1A5B")
INDIGO = colors.HexColor("#5548D1")
TINT = colors.HexColor("#EEF0FF")
SLATE = colors.HexColor("#475569")
LIGHT = colors.HexColor("#94A3B8")
TRACK = colors.HexColor("#E2E8F0")
GREEN = colors.HexColor("#10B981")
AMBER = colors.HexColor("#F59E0B")
RED = colors.HexColor("#EF4444")

PAGE_W, PAGE_H = A4


def assessment_for_grade(grade: str) -> dict:
    digits = re.findall(r"\d+", grade or "")
    n = int(digits[0]) if digits else 10
    if n <= 8:
        return {"name": "DiscoverU", "classes": "Classes 6-8"}
    if n <= 10:
        return {"name": "ExploreX", "classes": "Classes 9-10"}
    return {"name": "DecidePro", "classes": "Classes 11-12"}


# ---------------------------------------------------------------- content --
CATEGORY_SCORES = [
    ("Personality & Behavioral Traits", 54),
    ("Career Interest Mapping", 50),
    ("Learning Style & Cognitive Strengths", 50),
    ("Life Readiness & Decision Skills", 57),
]

PARAMETERS = [
    ("Conscientiousness & Organization", 73, "High",
     "Use your natural discipline to anchor group projects — volunteer to own timelines."),
    ("Openness to Experience", 34, "Low",
     "Attend one workshop on a completely unfamiliar topic this term."),
    ("Extraversion & Social Influence", 58, "Medium",
     "Practise presenting your ideas in class once a week to build influence."),
    ("Scientific & Investigative Interest", 19, "Very Low",
     "Try one hands-on science experiment monthly to test whether interest grows."),
    ("Social & Helping Orientation", 63, "Medium",
     "Channel your empathy into a peer-mentoring or community role."),
    ("Business & Enterprising Drive", 62, "Medium",
     "Join a business or entrepreneurship club to sharpen commercial instincts."),
    ("Verbal & Comprehension Aptitude", 28, "Very Low",
     "Read one editorial weekly and summarise it in five sentences."),
    ("Spatial & Visual Aptitude", 71, "High",
     "Lean into design, mapping and visual-first tools when you study."),
    ("Logical & Quantitative Aptitude", 61, "Medium",
     "Solve two logic puzzles a week to keep quantitative muscles active."),
    ("Stress & Pressure Handling", 68, "Medium",
     "Your composure is an asset — take timed mocks to convert it into exam confidence."),
    ("Stream Decision Confidence", 68, "Medium",
     "Validate your stream instincts with two structured career conversations."),
    ("Goal Setting & Future Orientation", 34, "Low",
     "Write one 30-day goal each month and review it with a parent or teacher."),
]

STREAMS = [
    ("Science Stream", 30,
     "Moderate logical aptitude supports problem-solving.",
     "Low investigative interest and abstract thinking.",
     "Develop foundational analytical skills useful across diverse fields."),
    ("Commerce Stream", 80,
     "Strong business drive and interest in global economics.",
     "Moderate goal setting and analytical depth.",
     "Lead in business, finance or entrepreneurial ventures."),
    ("Humanities Stream", 70,
     "Strong social orientation and creative inclination.",
     "Developing verbal comprehension and research skills.",
     "Impact society through policy, advocacy or the creative arts."),
]

CLUSTERS = [
    ("Business & Social Impact",
     "Market analysis, community engagement, strategy.",
     "Business Studies, Economics, Sociology.",
     "Empathetic, strategic, community-focused, innovative."),
    ("Creative & Design-Oriented",
     "Visual design, content creation, user experience.",
     "Fine Arts, Graphic Design, Media Studies.",
     "Visually adept, creative, detail-oriented, expressive."),
    ("Global Business & Analytics",
     "Market research, data analysis, international trade.",
     "Economics, Business Analytics, International Relations.",
     "Analytical, globally-minded, structured, data-driven."),
]

SKILLS = [
    ("Elective Subject Mapping",
     "Focus on Commerce/Humanities, integrating design and social electives.",
     "Research interdisciplinary courses and electives that blend business, social sciences and visual arts."),
    ("Developing Research Skills",
     "Develop structured research habits for practical problem-solving.",
     "Start with well-defined, short-term research projects on social issues, using clear methodologies."),
    ("Enhancing Analytical Writing",
     "Improve clarity and structure in written arguments.",
     "Practise summarising complex texts and outlining arguments before writing, focusing on logical flow."),
    ("Mastering Problem-Solving",
     "Expand problem-solving strategies beyond familiar methods.",
     "Engage in case studies with ambiguous scenarios, actively seeking diverse perspectives."),
]

IDENTITY_PARAS = [
    "You are an Empathetic Global Business Strategist — a profile chosen due to your strong "
    "inclination towards understanding global economic trends and your deep desire to create "
    "solutions for social problems. Your balanced emotional intelligence allows you to navigate "
    "complex situations with composure.",
    "Your unique blend of strong business acumen and a genuine social orientation enables you to "
    "approach challenges with both strategic insight and a human-centered perspective. You excel "
    "at identifying patterns and visualizing solutions which, combined with your steady emotional "
    "balance, makes you a reliable and thoughtful contributor. Your potential lies in leveraging "
    "these strengths to drive impactful initiatives in dynamic environments.",
]

FRAMEWORK_INTRO = (
    "This assessment blends three well-recognised psychological frameworks: John L. Holland's "
    "RIASEC Career Interest Theory (Realistic, Investigative, Artistic, Social, Enterprising, "
    "Conventional), established models of Personality and Cognitive Strengths, and a structured "
    "view of Life Readiness, Decision Skills and Learning Style."
)

FRAMEWORK_CATS = [
    ("A. Personality & Behavioral Traits",
     "Understanding how you naturally behave, collaborate and approach challenges."),
    ("B. Career Interest Mapping",
     "Identifying interest areas aligned with career clusters."),
    ("C. Learning Style & Cognitive Strengths",
     "Understanding how you process and apply knowledge."),
    ("D. Life Readiness & Decision Skills",
     "Evaluating planning ability, career awareness and decision-making maturity."),
]

DISCLAIMER_POINTS = [
    "This report is for educational guidance and self-awareness. It is not a diagnostic or clinical tool.",
    "Your responses are private and treated as confidential.",
    "Results are inputs for planning and should be considered alongside individual circumstances.",
    "Consult qualified professionals for comprehensive career counselling.",
    "Assessment results can vary based on test conditions.",
    "Use this report together with guidance from educators and parents.",
]


# ---------------------------------------------------------------- flowables --
class ScoreBar(Flowable):
    """Horizontal score bar: label left, track+fill, % right."""

    def __init__(self, label, pct, width=150 * mm, color=INDIGO, level=None):
        super().__init__()
        self.label, self.pct, self.w, self.color, self.level = label, pct, width, color, level
        self.height = 13 * mm

    def draw(self):
        c = self.canv
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 9)
        c.drawString(0, 8.2 * mm, self.label)
        if self.level:
            c.setFillColor(LIGHT)
            c.setFont("Helvetica", 8)
            c.drawRightString(self.w, 8.2 * mm, self.level)
        bar_y, bar_h, bar_w = 3 * mm, 3 * mm, self.w - 16 * mm
        c.setFillColor(TRACK)
        c.roundRect(0, bar_y, bar_w, bar_h, 1.5 * mm, stroke=0, fill=1)
        c.setFillColor(self.color)
        c.roundRect(0, bar_y, max(bar_w * self.pct / 100.0, 3 * mm), bar_h, 1.5 * mm, stroke=0, fill=1)
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 10)
        c.drawRightString(self.w, bar_y - 0.4 * mm, f"{self.pct}%")


class SectionBand(Flowable):
    """Tinted rounded band with a section title."""

    def __init__(self, title, width=170 * mm):
        super().__init__()
        self.title, self.w = title, width
        self.height = 12 * mm

    def draw(self):
        c = self.canv
        c.setFillColor(TINT)
        c.roundRect(0, 1 * mm, self.w, 10 * mm, 2.5 * mm, stroke=0, fill=1)
        c.setFillColor(INDIGO)
        c.setFont("Helvetica-Bold", 12.5)
        c.drawString(6 * mm, 4.6 * mm, self.title)


# ---------------------------------------------------------------- styles --
def _styles():
    return {
        "body": ParagraphStyle("body", fontName="Helvetica", fontSize=9.5, leading=14, textColor=SLATE),
        "small": ParagraphStyle("small", fontName="Helvetica", fontSize=8.5, leading=12, textColor=LIGHT),
        "h1": ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=20, leading=25, textColor=NAVY),
        "h2": ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=13, leading=17, textColor=NAVY),
        "h3": ParagraphStyle("h3", fontName="Helvetica-Bold", fontSize=10.5, leading=14, textColor=INDIGO),
        "center": ParagraphStyle("center", fontName="Helvetica", fontSize=10, leading=15,
                                 textColor=SLATE, alignment=1),
        "cover_t": ParagraphStyle("cover_t", fontName="Helvetica-Bold", fontSize=26, leading=32,
                                  textColor=colors.white, alignment=1),
        "cover_s": ParagraphStyle("cover_s", fontName="Helvetica", fontSize=11, leading=16,
                                  textColor=colors.HexColor("#C7D2FE"), alignment=1),
    }


def _cover_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    canvas.setFillColor(colors.HexColor("#232C86"))
    canvas.circle(PAGE_W * 0.9, PAGE_H * 0.92, 60 * mm, stroke=0, fill=1)
    canvas.setFillColor(colors.HexColor("#4038B8"))
    canvas.circle(PAGE_W * 0.05, PAGE_H * 0.08, 45 * mm, stroke=0, fill=1)
    canvas.restoreState()


def _page_deco(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(INDIGO)
    canvas.rect(0, PAGE_H - 4 * mm, PAGE_W, 4 * mm, stroke=0, fill=1)
    canvas.setFillColor(LIGHT)
    canvas.setFont("Helvetica", 7.5)
    canvas.drawString(18 * mm, 9 * mm, "biglyp · The Leap That Defines You, Shapes Your Career.")
    canvas.drawRightString(PAGE_W - 18 * mm, 9 * mm, f"Page {doc.page}")
    canvas.restoreState()


def build_report_pdf(student_name: str, grade: str, assessment: dict) -> bytes:
    buf = io.BytesIO()
    st = _styles()
    doc = BaseDocTemplate(buf, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
                          topMargin=18 * mm, bottomMargin=16 * mm,
                          title=f"{assessment['name']} Psychometric Report — {student_name}")
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="f")
    doc.addPageTemplates([
        PageTemplate(id="cover", frames=[frame], onPage=_cover_bg),
        PageTemplate(id="page", frames=[frame], onPage=_page_deco),
    ])

    date_str = datetime.now(timezone.utc).strftime("%d/%m/%Y")
    E = []

    # ---- Cover ----
    E.append(Spacer(1, 55 * mm))
    E.append(Paragraph("biglyp", st["cover_s"]))
    E.append(Spacer(1, 4 * mm))
    E.append(Paragraph("Psychometric Assessment Report", st["cover_t"]))
    E.append(Spacer(1, 10 * mm))
    cover_rows = [["Student", student_name], ["Grade", grade or "—"],
                  ["Assessment", f"{assessment['name']} · {assessment['classes']}"], ["Date", date_str]]
    t = Table(cover_rows, colWidths=[38 * mm, 74 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("TEXTCOLOR", (0, 0), (0, -1), LIGHT),
        ("TEXTCOLOR", (1, 0), (1, -1), NAVY),
        ("FONT", (0, 0), (0, -1), "Helvetica", 9.5),
        ("FONT", (1, 0), (1, -1), "Helvetica-Bold", 10.5),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white]),
        ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("LINEBELOW", (0, 0), (-1, -2), 0.5, TRACK),
        ("ROUNDEDCORNERS", [8, 8, 8, 8]),
    ]))
    E.append(t)
    E.append(Spacer(1, 18 * mm))
    E.append(Paragraph("The Leap That Defines You, Shapes Your Career.", st["cover_s"]))

    # ---- Congratulations ----
    E.append(PageBreak())
    E.append(Paragraph("Congratulations!", st["h1"]))
    E.append(Spacer(1, 3 * mm))
    E.append(Paragraph(
        f"{student_name}, you have successfully completed the <b>{assessment['name']}</b> assessment "
        f"({assessment['classes']}). This report aligns your natural strengths with academic streams "
        "and career possibilities.", st["body"]))
    E.append(Spacer(1, 3 * mm))
    for b in ["Identify compatible academic streams", "Explore career clusters that fit your profile",
              "Understand your strengths and growth areas", "Optimise your subject selection"]:
        E.append(Paragraph(f"•&nbsp;&nbsp;{b}", st["body"]))
    E.append(Spacer(1, 6 * mm))

    # ---- Table of contents ----
    E.append(SectionBand("Table of Contents"))
    E.append(Spacer(1, 2 * mm))
    for i, s in enumerate(["Assessment Framework", "Your Professional Identity", "Assessment Scores",
                           "Stream-Fit Analysis", "Career Cluster Exploration",
                           "Academic & Skill Development", "Guidance for Parents & Student Interaction",
                           "About Biglyp & Disclaimer"], 1):
        E.append(Paragraph(f"<font color='#5548D1'><b>{i:02d}</b></font>&nbsp;&nbsp;{s}", st["body"]))

    # ---- Assessment Framework ----
    E.append(PageBreak())
    E.append(SectionBand("Assessment Framework"))
    E.append(Spacer(1, 3 * mm))
    E.append(Paragraph(FRAMEWORK_INTRO, st["body"]))
    E.append(Spacer(1, 4 * mm))
    E.append(Paragraph(f"The four core categories of the {assessment['name']} Assessment Model:", st["h2"]))
    E.append(Spacer(1, 2 * mm))
    for title, desc in FRAMEWORK_CATS:
        E.append(Paragraph(title, st["h3"]))
        E.append(Paragraph(desc, st["body"]))
        E.append(Spacer(1, 2 * mm))

    # ---- Professional Identity ----
    E.append(Spacer(1, 4 * mm))
    E.append(SectionBand("Your Professional Identity"))
    E.append(Spacer(1, 3 * mm))
    E.append(Paragraph("Empathetic Global Business Strategist", st["h2"]))
    E.append(Spacer(1, 2 * mm))
    for p in IDENTITY_PARAS:
        E.append(Paragraph(p.replace("You are", f"{student_name.split(' ')[0]}, you are", 1)
                           if p is IDENTITY_PARAS[0] else p, st["body"]))
        E.append(Spacer(1, 2.5 * mm))
    E.append(Paragraph(
        "Guidance: leverage these strengths for impactful initiatives, embrace diverse perspectives, "
        "and develop proactive goal-setting.", st["body"]))

    # ---- Assessment Scores ----
    E.append(PageBreak())
    E.append(SectionBand("Assessment Scores"))
    E.append(Spacer(1, 3 * mm))
    E.append(Paragraph("Category Scores", st["h2"]))
    E.append(Spacer(1, 2 * mm))
    for label, pct in CATEGORY_SCORES:
        E.append(ScoreBar(label, pct))
    E.append(Spacer(1, 5 * mm))
    E.append(Paragraph("Core RIASEC & Personality Mapping", st["h2"]))
    E.append(Paragraph("The average does not represent individual parameters — read each parameter "
                       "for better inference.", st["small"]))
    E.append(Spacer(1, 2 * mm))
    for label, pct, level, tip in PARAMETERS:
        color = GREEN if pct >= 70 else (INDIGO if pct >= 50 else (AMBER if pct >= 30 else RED))
        E.append(ScoreBar(label, pct, color=color, level=level))
        E.append(Paragraph(f"&nbsp;&nbsp;&nbsp;{tip}", st["small"]))
        E.append(Spacer(1, 1.5 * mm))

    # ---- Stream-Fit ----
    E.append(PageBreak())
    E.append(SectionBand("Stream-Fit Analysis"))
    E.append(Spacer(1, 3 * mm))
    E.append(Paragraph(
        "The analysis indicates a strong fit for Commerce and Humanities, driven by social orientation "
        "and business acumen. Science shows lower alignment due to less investigative interest — blend "
        "your enterprising spirit with social impact.", st["body"]))
    E.append(Spacer(1, 3 * mm))
    for name, pct, s, ch, op in STREAMS:
        E.append(ScoreBar(name, pct, color=GREEN if pct >= 70 else (INDIGO if pct >= 50 else AMBER)))
        E.append(Paragraph(f"<b>Strength:</b> {s}", st["body"]))
        E.append(Paragraph(f"<b>Challenge:</b> {ch}", st["body"]))
        E.append(Paragraph(f"<b>Opportunity:</b> {op}", st["body"]))
        E.append(Spacer(1, 3.5 * mm))

    # ---- Career Clusters ----
    E.append(PageBreak())
    E.append(SectionBand("Career Cluster Exploration"))
    E.append(Spacer(1, 3 * mm))
    E.append(Paragraph(
        f"We identified 3 career paths that strongly align with {student_name.split(' ')[0]}'s unique "
        "skills and personality. 'A Day in the Life' scenarios help visualise what to expect from each role.",
        st["body"]))
    E.append(Spacer(1, 3 * mm))
    for i, (name, act, subj, fit) in enumerate(CLUSTERS, 1):
        E.append(Paragraph(f"Career Cluster {i}: {name}", st["h2"]))
        E.append(Paragraph(f"<b>Core activities:</b> {act}", st["body"]))
        E.append(Paragraph(f"<b>Key subjects:</b> {subj}", st["body"]))
        E.append(Paragraph(f"<b>Personality fit:</b> {fit}", st["body"]))
        E.append(Spacer(1, 3.5 * mm))

    # ---- Academic & Skill Development ----
    E.append(SectionBand("Academic & Skill Development"))
    E.append(Spacer(1, 3 * mm))
    E.append(Paragraph(
        "Move from passive student to Profile Architect: leverage cognitive strengths and career "
        "interests to pick 'easy win' subjects and build a distinctive profile.", st["body"]))
    E.append(Spacer(1, 3 * mm))
    for name, goal, action in SKILLS:
        E.append(Paragraph(name, st["h3"]))
        E.append(Paragraph(f"<b>Goal:</b> {goal}", st["body"]))
        E.append(Paragraph(f"<b>Action:</b> {action}", st["body"]))
        E.append(Spacer(1, 2.5 * mm))

    # ---- Parent guidance ----
    E.append(PageBreak())
    E.append(SectionBand("Guidance for Parents & Student Interaction"))
    E.append(Spacer(1, 3 * mm))
    E.append(Paragraph("Focus: Leveraging Social & Business Strengths", st["h2"]))
    E.append(Spacer(1, 2 * mm))
    E.append(Paragraph(
        f"<b>Acknowledge:</b> Recognise {student_name.split(' ')[0]}'s drive to understand global "
        "business and create social solutions.", st["body"]))
    E.append(Paragraph(
        "<b>Propose:</b> Encourage participation in business clubs, social entrepreneurship projects "
        "or community service initiatives.", st["body"]))
    E.append(Spacer(1, 2 * mm))
    E.append(Paragraph(
        "Use this framework to discuss aspirations, align stakeholders and tailor educational "
        "strategies through constructive dialogue between student, parents and teachers.", st["body"]))

    # ---- About & disclaimer ----
    E.append(Spacer(1, 6 * mm))
    E.append(SectionBand("About Biglyp & Important Disclaimer"))
    E.append(Spacer(1, 3 * mm))
    E.append(Paragraph(
        "Biglyp is an EdFinTech platform offering AI-driven psychometric assessments, course matching "
        "and career counselling, based on recognised psychological theories including Holland's RIASEC.",
        st["body"]))
    E.append(Spacer(1, 2.5 * mm))
    for d in DISCLAIMER_POINTS:
        E.append(Paragraph(f"•&nbsp;&nbsp;{d}", st["small"]))
    E.append(Spacer(1, 4 * mm))
    E.append(Paragraph(
        f"Report generated for {student_name} · {assessment['name']} ({assessment['classes']}) · {date_str}",
        st["small"]))

    # first flowable set uses cover template, rest use page template
    E.insert(0, _SwitchTemplate("cover"))
    # after cover content, switch: find first PageBreak insertion — simplest: wrap via NextPageTemplate
    doc.build(_with_template_switch(E))
    return buf.getvalue()


class _SwitchTemplate(Flowable):
    def __init__(self, name):
        super().__init__()
        self.name = name
        self.width = self.height = 0

    def draw(self):
        pass


def _with_template_switch(elements):
    """Use cover template for page 1, standard deco for the rest."""
    from reportlab.platypus import NextPageTemplate
    out = [NextPageTemplate("page")]
    for e in elements:
        if isinstance(e, _SwitchTemplate):
            continue
        out.append(e)
    return out


# ---------------------------------------------------------------- router --
def create_psychometry_router(db, deps):
    router = APIRouter(prefix="/api")
    get_current_user = deps["get_current_user"]
    resolve_student = deps["resolve_student"]

    @router.get("/parent/psychometry/report/{student_id}")
    async def download_report(student_id: str, user: dict = Depends(get_current_user)):
        if user["role"] not in ("parent", "super_admin", "school_admin"):
            raise HTTPException(status_code=403, detail="Not allowed")
        student = await resolve_student(student_id, user)
        assessment = assessment_for_grade(student.get("grade", ""))
        pdf = build_report_pdf(student["name"], student.get("grade", ""), assessment)
        fname = f"{assessment['name']}_report_{student['name'].replace(' ', '_')}.pdf"
        return StreamingResponse(
            io.BytesIO(pdf), media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{fname}"'})

    return {"router": router}
