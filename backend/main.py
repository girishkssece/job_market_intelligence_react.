"""
CareerLens Backend — FastAPI Application
Re-uses business logic from the original job_market_intelligence project.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="CareerLens API",
    description="AI-Powered Job Market Intelligence Backend",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register routers ────────────────────────────────────────────────────────
from routers import data, predict, ai, export

app.include_router(data.router,    prefix="/api", tags=["Data"])
app.include_router(predict.router, prefix="/api", tags=["Predict"])
app.include_router(ai.router,     prefix="/api", tags=["AI"])
app.include_router(export.router,  prefix="/api", tags=["Export"])


@app.get("/")
def root():
    return {"message": "CareerLens API v2.0 — Running"}


@app.get("/api/health")
def health():
    return {"status": "ok", "groq_key_set": bool(os.environ.get("GROQ_API_KEY"))}
