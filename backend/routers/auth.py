from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from database import get_db, SavedAnalysis, SalaryPrediction, User
from services.auth_service import (
    create_user, authenticate_user, create_access_token,
    verify_token, get_user_by_email
)
from datetime import datetime

router  = APIRouter()
security = HTTPBearer()

# ─── SCHEMAS ──────────────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    name:     str
    email:    str
    password: str

class LoginRequest(BaseModel):
    email:    str
    password: str

class UpdateProfileRequest(BaseModel):
    name:        str  = None
    target_role: str  = None
    location:    str  = None
    experience:  float = None
    skills:      str  = None

class SaveAnalysisRequest(BaseModel):
    type:    str
    title:   str
    content: str

# ─── HELPER ───────────────────────────────────────────────────────────────────
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token   = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    user = get_user_by_email(db, payload.get("sub"))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user

# ─── ENDPOINTS ────────────────────────────────────────────────────────────────
@router.post("/auth/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if get_user_by_email(db, req.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    user  = create_user(db, req.name, req.email, req.password)
    token = create_access_token({"sub": user.email})
    return {
        "token": token,
        "user": {
            "id":          user.id,
            "name":        user.name,
            "email":       user.email,
            "target_role": user.target_role,
        }
    }

@router.post("/auth/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, req.email, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user.email})
    return {
        "token": token,
        "user": {
            "id":          user.id,
            "name":        user.name,
            "email":       user.email,
            "target_role": user.target_role,
            "location":    user.location,
            "experience":  user.experience,
            "skills":      user.skills,
        }
    }

@router.get("/auth/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id":          current_user.id,
        "name":        current_user.name,
        "email":       current_user.email,
        "target_role": current_user.target_role,
        "location":    current_user.location,
        "experience":  current_user.experience,
        "skills":      current_user.skills,
        "created_at":  current_user.created_at,
        "last_login":  current_user.last_login,
    }

@router.put("/auth/profile")
def update_profile(
    req: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if req.name:        current_user.name        = req.name
    if req.target_role: current_user.target_role = req.target_role
    if req.location:    current_user.location    = req.location
    if req.experience:  current_user.experience  = req.experience
    if req.skills:      current_user.skills      = req.skills
    db.commit()
    return {"message": "Profile updated successfully"}

@router.post("/auth/save-analysis")
def save_analysis(
    req: SaveAnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analysis = SavedAnalysis(
        user_id=current_user.id,
        type=req.type,
        title=req.title,
        content=req.content,
    )
    db.add(analysis)
    db.commit()
    return {"message": "Analysis saved!", "id": analysis.id}

@router.get("/auth/my-analyses")
def get_my_analyses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analyses = db.query(SavedAnalysis)\
        .filter(SavedAnalysis.user_id == current_user.id)\
        .order_by(SavedAnalysis.created_at.desc())\
        .limit(20)\
        .all()
    return [{
        "id":         a.id,
        "type":       a.type,
        "title":      a.title,
        "content":    a.content,
        "created_at": a.created_at,
    } for a in analyses]

@router.delete("/auth/analysis/{analysis_id}")
def delete_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analysis = db.query(SavedAnalysis)\
        .filter(SavedAnalysis.id == analysis_id,
                SavedAnalysis.user_id == current_user.id)\
        .first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    db.delete(analysis)
    db.commit()
    return {"message": "Deleted successfully"}