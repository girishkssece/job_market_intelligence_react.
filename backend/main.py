"""
CareerLens Backend — FastAPI Application
Re-uses business logic from the original job_market_intelligence project.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from database import create_tables
from routers import data, predict, ai, export, auth

load_dotenv()

app = FastAPI(
    title="CareerLens API",
    description="AI-Powered Job Market Intelligence Backend",
    version="2.0.0",
)

create_tables()

# Read allowed origins from env (comma-separated), default to localhost for dev
_raw_origins = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,https://careerlens-frontend.onrender.com"
)
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register routers ────────────────────────────────────────────────────────
app.include_router(data.router,    prefix="/api", tags=["Data"])
app.include_router(predict.router, prefix="/api", tags=["Predict"])
app.include_router(ai.router,      prefix="/api", tags=["AI"])
app.include_router(export.router,  prefix="/api", tags=["Export"])
app.include_router(auth.router,    prefix="/api", tags=["Auth"])


@app.get("/")
def root():
    return {"message": "CareerLens API v2.0 — Running"}


@app.get("/api/health")
def health():
    return {"status": "ok", "groq_key_set": bool(os.environ.get("GROQ_API_KEY"))}
