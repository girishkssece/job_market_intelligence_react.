"""
AI Service — Groq LLM wrapper for all AI-powered features.
"""

import os
from groq import Groq
from services.data_service import get_dataframe, get_salary_df, get_skills, clean_skills, TARGET_ROLES
from collections import Counter

_client = None


def get_client():
    global _client
    if _client is None:
        api_key = os.environ.get("GROQ_API_KEY", "")
        if api_key:
            _client = Groq(api_key=api_key)
    return _client


def _call_llm(prompt, max_tokens=2000, temperature=0.7):
    client = get_client()
    if not client:
        return {"error": "GROQ_API_KEY not configured"}
    try:
        response = client.chat.completions.create(
            model="qwen/qwen3.8-27b",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=temperature,
        )
        return {"result": response.choices[0].message.content}
    except Exception as e:
        return {"error": str(e)}


def build_market_context():
    """Build a data summary for chatbot context."""
    df = get_dataframe()
    sal = get_salary_df(df)
    parts = []
    parts.append(f"DATASET: {len(df):,} job records from Naukri.com (India) and LinkedIn (Global)")

    india_count = len(df[df["region"] == "India"])
    parts.append(f"India jobs: {india_count:,}")
    parts.append(f"Global jobs: {len(df) - india_count:,}")

    parts.append("\nSALARY DATA BY ROLE (USD and INR LPA):")
    for role in TARGET_ROLES[:10]:
        rd = sal[sal["role_category"] == role]
        if len(rd) >= 5:
            med = rd["salary_usd"].median()
            p25 = rd["salary_usd"].quantile(0.25)
            p75 = rd["salary_usd"].quantile(0.75)
            parts.append(f"- {role}: Median ${med:,.0f}/yr (₹{med/1200:.1f}L), Range ${p25:,.0f}-${p75:,.0f}")

    top_skills_data = get_skills(top_n=10)
    parts.append("\nTOP 10 IN-DEMAND SKILLS:")
    for s in top_skills_data:
        parts.append(f"- {s['skill'].title()}: {s['count']:,} postings")

    return "\n".join(parts)


# ── Public AI Functions ─────────────────────────────────────────────────────

def analyze_resume(resume_text, target_role):
    top_skills = get_skills(role=target_role, top_n=15)
    skill_names = [s["skill"] for s in top_skills]

    prompt = f"""You are an expert resume reviewer and career advisor for the {target_role} field.

Analyze this resume against the current job market data:

TOP IN-DEMAND SKILLS FOR {target_role}: {", ".join(skill_names)}

RESUME:
{resume_text[:3000]}

Provide a detailed analysis with:
1. MATCH SCORE (out of 100)
2. SKILLS FOUND (skills from the resume that match market demand)
3. MISSING CRITICAL SKILLS (top skills they need but don't have)
4. RESUME STRENGTHS
5. AREAS FOR IMPROVEMENT
6. SPECIFIC RECOMMENDATIONS (3-5 actionable items)
7. ATS COMPATIBILITY SCORE (out of 100)

Be specific and actionable."""

    return _call_llm(prompt, max_tokens=2000, temperature=0.4)


def rewrite_resume(resume_text, target_role, experience_level, target_company="", job_desc=""):
    top_skills = get_skills(role=target_role, top_n=10)
    skill_names = [s["skill"] for s in top_skills]

    prompt = f"""Rewrite this resume for a {target_role} position {f'at {target_company}' if target_company else ''}.
Experience: {experience_level}. Top market skills: {", ".join(skill_names)}

RESUME: {resume_text[:3000]}
{f'JOB DESC: {job_desc[:800]}' if job_desc else ''}

Rules:
- Keep all real info, don't fabricate
- Strong action verbs, quantify everything
- ATS keywords included
- Provide: 1) Rewritten resume 2) Key changes 3) ATS keywords added"""

    return _call_llm(prompt, max_tokens=3000, temperature=0.4)


def generate_negotiation_script(role, current_salary, target_salary, company="", experience=2, strengths="", neg_type="Job Offer Negotiation"):
    increase = ((target_salary - current_salary) / current_salary * 100) if current_salary > 0 else 0

    prompt = f"""You are an expert salary negotiation coach.

Create a detailed negotiation script for:
- Role: {role}
- Company: {company or "the company"}
- Type: {neg_type}
- Current: ${current_salary:,}/year (₹{current_salary/1200:.1f} LPA)
- Target: ${target_salary:,}/year (₹{target_salary/1200:.1f} LPA) — {increase:.0f}% increase
- Experience: {experience} years
- Strengths: {strengths or "Strong technical skills"}

Include:
1. OPENING STATEMENT
2. VALUE PROPOSITION
3. THE ASK
4. HANDLING OBJECTIONS
5. CLOSING
6. KEY PHRASES TO USE
7. PHRASES TO AVOID"""

    return _call_llm(prompt, max_tokens=2000, temperature=0.7)


def generate_negotiation_email(role, current_salary, target_salary, company="", name="", email_type="Counter Offer Email"):
    increase = ((target_salary - current_salary) / current_salary * 100) if current_salary > 0 else 0

    prompt = f"""Write a professional {email_type} for:
- Name: {name or "the candidate"}
- Role: {role}
- Company: {company or "the company"}
- Current: ${current_salary:,} → Target: ${target_salary:,} ({increase:.0f}% increase)
- INR: ₹{current_salary/1200:.1f} LPA → ₹{target_salary/1200:.1f} LPA

Requirements: Professional, data-backed, concise (<250 words), include subject line."""

    return _call_llm(prompt, max_tokens=800, temperature=0.7)


def generate_interview_questions(role, company="", experience_level="Mid (3-6 yrs)", question_type="All Types", count=10):
    prompt = f"""You are a technical interviewer at {company or "a top tech company"}.

Generate {count} realistic interview questions for {role} ({experience_level}).
Focus: {question_type}

For each question:
Q[number]. [Question]
TYPE: [Technical/Behavioral/Case Study/Python/SQL]
DIFFICULTY: [Easy/Medium/Hard]
TESTING: [What this tests]
KEY POINTS:
- [Point 1]
- [Point 2]
---"""

    return _call_llm(prompt, max_tokens=2500, temperature=0.8)


def review_answer(role, question, answer):
    prompt = f"""You are an expert interviewer for {role}.

QUESTION: {question}
CANDIDATE'S ANSWER: {answer}

Provide:
SCORE: [X/10]
WHAT YOU DID WELL:
WHAT'S MISSING:
IMPROVED ANSWER:
KEY POINTS TO REMEMBER:"""

    return _call_llm(prompt, max_tokens=1000, temperature=0.5)


def chat_message(messages):
    client = get_client()
    if not client:
        return {"error": "GROQ_API_KEY not configured"}

    context = build_market_context()
    system_prompt = f"""You are CareerLens AI, an expert job market intelligence assistant.
You have access to real data from 115,000+ job postings.

REAL MARKET DATA:
{context}

Always back answers with specific numbers. Give both USD and INR (LPA) for salary figures.
Be concise, data-driven, encouraging, and actionable.
When users ask for jobs, provide direct search links to Naukri, LinkedIn, and Indeed."""

    try:
        api_messages = [{"role": "system", "content": system_prompt}]
        for msg in messages[-10:]:
            api_messages.append({"role": msg["role"], "content": msg["content"]})

        response = client.chat.completions.create(
            model="qwen/qwen3.8-27b",
            messages=api_messages,
            max_tokens=1000,
            temperature=0.7,
        )
        return {"result": response.choices[0].message.content}
    except Exception as e:
        return {"error": str(e)}


def generate_company_insights(company_name, data):
    prompt = f"""Provide insights about {company_name} as an employer:
- Job postings: {data.get('total_jobs', 0)}
- Top roles: {', '.join(list(data.get('roles', {}).keys())[:5])}
- Top skills: {', '.join([s['skill'] for s in data.get('skills', [])[:10]])}
- Locations: {', '.join(list(data.get('locations', {}).keys())[:5])}

Provide: 1) COMPANY OVERVIEW 2) HIRING CULTURE 3) INTERVIEW PROCESS 4) SALARY TIPS 5) HOW TO STAND OUT"""

    return _call_llm(prompt, max_tokens=1000, temperature=0.7)


def generate_portfolio_projects(role, experience, interests="", skills="", count=5):
    top_skills = get_skills(role=role, top_n=10)
    skill_names = [s["skill"] for s in top_skills]

    prompt = f"""Generate {count} unique portfolio project ideas for:
- Role: {role}
- Experience: {experience}
- Interests: {interests or "general technology"}
- Skills: {skills or "Python basics"}
- Market-demand skills: {", ".join(skill_names)}

For each:
PROJECT [number]: [Title]
DIFFICULTY: [Beginner/Intermediate/Advanced]
DURATION: [X weeks]
DESCRIPTION: [2-3 sentences]
TECH STACK: [Technologies]
DATASET/API: [Data source]
KEY FEATURES:
- [Feature 1-3]
RESUME IMPACT: [How to describe on resume]
---"""

    return _call_llm(prompt, max_tokens=3000, temperature=0.9)


def generate_career_path(current_role, target_role, skills="", experience=0):
    prompt = f"""Create a career progression plan:
- Current: {current_role} ({experience} years exp)
- Target: {target_role}
- Current skills: {skills or "Not specified"}

Provide:
1. CAREER PATH (step-by-step progression)
2. SKILLS TO LEARN (prioritized)
3. TIMELINE (realistic)
4. RECOMMENDED CERTIFICATIONS
5. SALARY PROGRESSION (USD + INR LPA)
6. ACTIONABLE NEXT STEPS"""

    return _call_llm(prompt, max_tokens=1500, temperature=0.6)
