"""
AI Router — all Groq-powered AI feature endpoints.
"""

from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional
from services import ai_service
from services.data_service import get_company_detail
import pdfplumber
from io import BytesIO

router = APIRouter()


# ── Request Models ──────────────────────────────────────────────────────────

class ResumeAnalyzeRequest(BaseModel):
    resume_text: str
    target_role: str


class ResumeRewriteRequest(BaseModel):
    resume_text: str
    target_role: str
    experience_level: str = "Mid-level (3-6 years)"
    target_company: str = ""
    job_desc: str = ""


class NegotiateScriptRequest(BaseModel):
    role: str
    current_salary: float
    target_salary: float
    company: str = ""
    experience: int = 2
    strengths: str = ""
    negotiation_type: str = "Job Offer Negotiation"


class NegotiateEmailRequest(BaseModel):
    role: str
    current_salary: float
    target_salary: float
    company: str = ""
    name: str = ""
    email_type: str = "Counter Offer Email"


class InterviewQuestionsRequest(BaseModel):
    role: str
    company: str = ""
    experience_level: str = "Mid (3-6 yrs)"
    question_type: str = "All Types"
    count: int = 10


class ReviewAnswerRequest(BaseModel):
    role: str
    question: str
    answer: str


class ChatRequest(BaseModel):
    messages: List[dict]


class CompanyInsightsRequest(BaseModel):
    company_name: str


class PortfolioRequest(BaseModel):
    role: str
    experience: str = "Intermediate developer"
    interests: str = ""
    skills: str = ""
    count: int = 5


class CareerPathRequest(BaseModel):
    current_role: str
    target_role: str
    skills: str = ""
    experience: int = 0


# ── Endpoints ───────────────────────────────────────────────────────────────

@router.post("/resume-analyze")
def analyze_resume(req: ResumeAnalyzeRequest):
    return ai_service.analyze_resume(req.resume_text, req.target_role)


@router.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    content = await file.read()
    filename = file.filename or "resume.pdf"
    fname_lower = filename.lower()
    text = ""

    try:
        if fname_lower.endswith(".pdf"):
            try:
                import pypdf
                reader = pypdf.PdfReader(BytesIO(content))
                text = "\n".join([page.extract_text() or "" for page in reader.pages])
            except Exception:
                import pdfplumber
                with pdfplumber.open(BytesIO(content)) as pdf:
                    text = "\n".join([page.extract_text() or "" for page in pdf.pages])
        elif fname_lower.endswith(".docx"):
            import docx
            doc = docx.Document(BytesIO(content))
            text = "\n".join([p.text for p in doc.paragraphs if p.text])
        elif fname_lower.endswith(".txt") or fname_lower.endswith(".md"):
            text = content.decode("utf-8", errors="ignore")
        else:
            text = content.decode("utf-8", errors="ignore")

        cleaned = text.strip()
        if not cleaned:
            return {"error": "Could not extract text from file. Please ensure it is not empty or password protected."}

        return {
            "text": cleaned,
            "filename": filename,
            "char_count": len(cleaned),
            "word_count": len(cleaned.split()),
        }
    except Exception as e:
        return {"error": f"Failed to parse resume file: {str(e)}"}


@router.post("/resume-rewrite")
def rewrite_resume(req: ResumeRewriteRequest):
    return ai_service.rewrite_resume(
        req.resume_text, req.target_role,
        req.experience_level, req.target_company, req.job_desc,
    )


@router.post("/negotiate-script")
def negotiate_script(req: NegotiateScriptRequest):
    return ai_service.generate_negotiation_script(
        req.role, req.current_salary, req.target_salary,
        req.company, req.experience, req.strengths, req.negotiation_type,
    )


@router.post("/negotiate-email")
def negotiate_email(req: NegotiateEmailRequest):
    return ai_service.generate_negotiation_email(
        req.role, req.current_salary, req.target_salary,
        req.company, req.name, req.email_type,
    )


@router.post("/interview-questions")
def interview_questions(req: InterviewQuestionsRequest):
    return ai_service.generate_interview_questions(
        req.role, req.company, req.experience_level,
        req.question_type, req.count,
    )


@router.post("/interview-review")
def interview_review(req: ReviewAnswerRequest):
    return ai_service.review_answer(req.role, req.question, req.answer)


@router.post("/chat")
def chat(req: ChatRequest):
    return ai_service.chat_message(req.messages)


@router.post("/company-insights")
def company_insights(req: CompanyInsightsRequest):
    data = get_company_detail(req.company_name)
    if data is None:
        return {"error": "Company not found"}
    return ai_service.generate_company_insights(req.company_name, data)


@router.post("/portfolio-projects")
def portfolio_projects(req: PortfolioRequest):
    return ai_service.generate_portfolio_projects(
        req.role, req.experience, req.interests, req.skills, req.count,
    )


@router.post("/career-path")
def career_path(req: CareerPathRequest):
    return ai_service.generate_career_path(
        req.current_role, req.target_role, req.skills, req.experience,
    )
