"""
ML Service — loads trained salary prediction model and provides predictions.
"""

import pickle
import os
import numpy as np

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")

_model = None
_le_title = None
_le_city = None
_feature_cols = None
_top_skills = None
_train_exp_median = None


def _load_artifacts():
    global _model, _le_title, _le_city, _feature_cols, _top_skills, _train_exp_median

    if _model is not None:
        return

    try:
        with open(os.path.join(MODEL_DIR, "salary_model.pkl"), "rb") as f:
            _model = pickle.load(f)
        with open(os.path.join(MODEL_DIR, "label_encoder.pkl"), "rb") as f:
            _le_title = pickle.load(f)
        with open(os.path.join(MODEL_DIR, "city_encoder.pkl"), "rb") as f:
            _le_city = pickle.load(f)
        with open(os.path.join(MODEL_DIR, "feature_cols.pkl"), "rb") as f:
            _feature_cols = pickle.load(f)
        with open(os.path.join(MODEL_DIR, "top_skills.pkl"), "rb") as f:
            _top_skills = pickle.load(f)
        with open(os.path.join(MODEL_DIR, "train_exp_median.pkl"), "rb") as f:
            _train_exp_median = pickle.load(f)
    except FileNotFoundError as e:
        print(f"[WARNING] ML model files not found: {e}")
        _model = None


def predict_salary(role: str, experience: float, skills: list, city: str = "other"):
    """Predict salary given job parameters."""
    _load_artifacts()

    if _model is None:
        return {"error": "Model not loaded", "predicted_salary": None}

    # Encode title
    title_cat = role if role in _le_title.classes_ else "other"
    title_encoded = _le_title.transform([title_cat])[0]

    # Encode city
    city_clean = city if city in _le_city.classes_ else "other"
    city_encoded = _le_city.transform([city_clean])[0]

    # Experience
    exp = experience if experience is not None else _train_exp_median
    exp_sq = exp ** 2

    # Build feature vector
    feature_dict = {
        "experience_years": exp,
        "experience_sq": exp_sq,
        "title_encoded": title_encoded,
        "city_encoded": city_encoded,
        "skill_count": len(skills),
        "title_length": len(role.split()),
    }

    # Skill binary features
    skills_lower = [s.lower() for s in skills]
    for skill in _top_skills:
        col = f"skill_{skill.replace(' ', '_').replace('-', '_').replace('.', '_')}"
        feature_dict[col] = 1 if skill.lower() in skills_lower else 0

    # Build array in correct order
    X = np.array([[feature_dict.get(col, 0) for col in _feature_cols]])

    prediction = _model.predict(X)[0]

    return {
        "predicted_salary": round(float(prediction), 0),
        "predicted_lpa": round(float(prediction) / 1200, 1),
        "confidence_note": "Based on global market data",
        "model_features_used": len(_feature_cols),
    }


def get_model_info():
    """Return model metadata."""
    _load_artifacts()
    if _model is None:
        return {"loaded": False}
    return {
        "loaded": True,
        "features": len(_feature_cols) if _feature_cols else 0,
        "top_skills": _top_skills[:10] if _top_skills else [],
    }
