# 🧠 CareerLens — AI-Powered Job Market Intelligence (React Version)

A full-stack, AI-powered tech job market intelligence platform built with **React 18 + Vite** (frontend) and **FastAPI** (backend), trained on verified data from **115,000+ job postings** (Naukri.com + LinkedIn).

---

## ✨ Features

- **🏠 Interactive Dashboard:** Overview of total job records, median salaries, role distributions, and skill demand.
- **📊 Global Market Benchmarks:** Filterable by role & region (Salary Percentiles, Skill Demand, Experience Trajectory, Top Employers).
- **🌐 Global Market (Country Breakdown):** Country-by-country breakdown with Zoom Mode for non-US analysis, role distribution, and top hiring companies.
- **🇮🇳 India Tech Market:** Dedicated Naukri.com insights, city-level LPA salary benchmarks, and direct job search links.
- **💰 ML Salary Predictor:** Machine learning compensation estimator (XGBoost/LightGBM) trained on 31 features (USD & INR LPA).
- **🔍 AI Resume Analyzer:** Instant resume evaluation against market skill demands using Groq LLM (Llama 3.3 70B).
- **✍️ AI Resume Rewriter:** Action verb optimization, bullet point metric enhancement, and ATS keyword tailoring.
- **🗺️ Career Path Explorer:** Step-by-step career transition roadmap generator from current role to target dream role.
- **🤝 Salary Negotiation Coach:** Custom negotiation scripts and counter-offer email generator based on market percentiles.
- **🎯 Interview Prep Guide:** Role-specific question bank, AI mock interview sets, and AI answer review with scores (/10).
- **🏢 Company Intelligence:** Employer search, hiring volume, role distributions, and AI company culture insights.
- **🤖 Market Chatbot:** Conversational AI trained on 115,000+ job records with direct job search links.
- **🚀 Portfolio Project Generator:** Curated industry projects + custom AI project specifications with Kaggle & GitHub links.
- **📚 Course Recommendations:** Role & skill-based curated courses with price and level filters.
- **📊 Export PDF Report:** Publication-quality PDF report generation using ReportLab.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, React Router v6, Recharts, Vanilla CSS (Dark-mode Glassmorphism)
- **Backend:** FastAPI, Python 3.10+, Uvicorn, Pandas, Scikit-Learn, XGBoost, LightGBM, Groq SDK, ReportLab
- **AI/LLM:** Groq API (`llama-3.3-70b-versatile`)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Python 3.10+

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
```env
GROQ_API_KEY=your_groq_api_key_here
```

Start the FastAPI backend:
```bash
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173/` in your browser.

---

## 📜 License

MIT License
