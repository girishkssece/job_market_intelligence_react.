"""
Predict Router — salary prediction endpoint.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from services.ml_service import predict_salary, get_model_info

router = APIRouter()


class PredictRequest(BaseModel):
    role: str
    experience: float = 2.0
    skills: List[str] = []
    city: str = "other"


@router.post("/predict-salary")
def predict(req: PredictRequest):
    return predict_salary(
        role=req.role,
        experience=req.experience,
        skills=req.skills,
        city=req.city,
    )


@router.get("/model-info")
def model_info():
    return get_model_info()
