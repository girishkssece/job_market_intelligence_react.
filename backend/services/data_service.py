"""
Data Service — loads and caches the master dataset, provides aggregation helpers.
Re-implements key logic from the original src/utils.py.
"""

import pandas as pd
import numpy as np
import os
import re
from collections import Counter
from functools import lru_cache

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

# ── Constants (from original src/utils.py) ──────────────────────────────────
TARGET_ROLES = [
    "Data Scientist", "Data Analyst", "Data Engineer", "ML Engineer",
    "AI Engineer", "Software Engineer", "Business Analyst",
    "DevOps/MLOps Engineer", "Cloud Engineer", "Frontend Developer",
    "Full Stack Developer", "Data Science Intern",
    "Software Engineering Intern", "Business Analyst Intern",
]

NOISE_SKILLS = {
    "communication", "teamwork", "problem solving", "leadership",
    "management", "english", "hindi", "skills", "ability", "knowledge",
    "experience", "strong", "good", "excellent", "proficient",
    "understanding", "familiar", "work", "working", "team",
    "data", "analysis", "development", "design", "project",
    "business", "technical", "professional", "years", "role",
    "job", "position", "candidate", "company", "organization",
    "required", "preferred", "must", "should", "ability to",
    "responsible", "responsibilities", "looking", "seeking", "hiring",
    "join", "opportunity", "growth", "learning", "training",
    "nan", "none", "", "etc", "eg", "ie", "also", "using",
    "including", "related", "based", "level", "senior", "junior",
    "lead", "manager", "analyst", "engineer", "developer", "scientist",
}


def clean_skills(skills_list):
    """Clean and filter skill tokens."""
    cleaned = []
    for skill in skills_list:
        s = str(skill).strip().lower()
        s = re.sub(r"[^a-z0-9\s\.\+\#\-]", "", s)
        s = s.strip()
        if s and s not in NOISE_SKILLS and len(s) > 1 and len(s) < 40:
            cleaned.append(s)
    return cleaned


ROLE_KEYWORDS = {
    "Data Scientist":              ["data scientist", "data science"],
    "Data Analyst":                ["data analyst", "business intelligence analyst", "bi analyst"],
    "Data Engineer":               ["data engineer", "etl developer", "big data engineer"],
    "ML Engineer":                 ["machine learning engineer", "ml engineer", "mlops"],
    "AI Engineer":                 ["ai engineer", "artificial intelligence", "deep learning engineer"],
    "Software Engineer":           ["software engineer", "software developer", "backend developer", "sde"],
    "Business Analyst":            ["business analyst"],
    "DevOps/MLOps Engineer":       ["devops", "mlops", "site reliability", "sre"],
    "Cloud Engineer":              ["cloud engineer", "cloud architect", "aws engineer"],
    "Frontend Developer":          ["frontend", "front-end", "react developer", "ui developer"],
    "Full Stack Developer":        ["full stack", "fullstack", "mern", "mean stack"],
    "Data Science Intern":         ["data science intern", "ds intern"],
    "Software Engineering Intern": ["software intern", "sde intern", "engineering intern"],
    "Business Analyst Intern":     ["business analyst intern", "ba intern"],
}


def categorize_title(title):
    """Categorize a job title into one of TARGET_ROLES."""
    t = str(title).lower().strip()
    for role, keywords in ROLE_KEYWORDS.items():
        for kw in keywords:
            if kw in t:
                return role
    return "Other"


# ── Data Loading ────────────────────────────────────────────────────────────
_df_cache = None


def get_dataframe():
    """Load and cache the master dataset."""
    global _df_cache
    if _df_cache is not None:
        return _df_cache

    csv_path = os.path.join(DATA_DIR, "processed", "master_jobs.csv")
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at {csv_path}")

    df = pd.read_csv(csv_path)

    # Categorize titles
    df["role_category"] = df["job_title"].apply(categorize_title)

    # Parse skills
    df["skills_parsed"] = df["skills_clean"].apply(
        lambda x: [s.strip() for s in str(x).strip("[]").replace("'", "").split(",") if s.strip()]
        if pd.notna(x) else []
    )
    df["skills_str"] = df["skills_parsed"].apply(lambda x: "|".join(x))

    # Region
    df["country"] = df["country"].fillna("Unknown")
    df["region"] = df["country"].apply(
        lambda x: "India" if str(x).strip().lower() in ["india", "in"] else "Global"
    )

    _df_cache = df
    return df


def get_salary_df(df=None):
    """Return rows with valid salary data."""
    if df is None:
        df = get_dataframe()
    sal = df.dropna(subset=["salary_usd"]).copy()
    sal = sal[(sal["salary_usd"] > 1000) & (sal["salary_usd"] < 500000)]
    return sal


# ── Aggregation Helpers ─────────────────────────────────────────────────────

def get_overview():
    """Get high-level dashboard stats."""
    df = get_dataframe()
    sal = get_salary_df(df)
    india = df[df["region"] == "India"]

    role_dist = (
        df["role_category"]
        .value_counts()
        .head(12)
        .to_dict()
    )
    # Remove "Other" if present
    role_dist.pop("Other", None)

    return {
        "total_jobs": len(df),
        "total_with_salary": len(sal),
        "india_jobs": len(india),
        "global_jobs": len(df) - len(india),
        "median_salary_usd": round(sal["salary_usd"].median(), 0) if len(sal) > 0 else 0,
        "unique_companies": int(df["company_name"].nunique()),
        "unique_cities": int(df["city"].nunique()),
        "role_distribution": role_dist,
        "target_roles": TARGET_ROLES,
    }


def get_salary_data(role=None, region=None, city=None):
    """Get salary statistics with optional filters."""
    df = get_dataframe()
    sal = get_salary_df(df)

    if role and role != "All Roles":
        sal = sal[sal["role_category"] == role]
    if region and region != "Global":
        sal = sal[sal["region"] == region]
    if city:
        sal = sal[sal["city"].str.lower() == city.lower()]

    if len(sal) < 3:
        return {"count": len(sal), "insufficient": True}

    return {
        "count": len(sal),
        "insufficient": False,
        "mean": round(sal["salary_usd"].mean(), 0),
        "median": round(sal["salary_usd"].median(), 0),
        "p25": round(sal["salary_usd"].quantile(0.25), 0),
        "p75": round(sal["salary_usd"].quantile(0.75), 0),
        "p90": round(sal["salary_usd"].quantile(0.90), 0),
        "min": round(sal["salary_usd"].min(), 0),
        "max": round(sal["salary_usd"].max(), 0),
    }


def get_salary_by_role(region=None):
    """Get median salary for each role."""
    df = get_dataframe()
    sal = get_salary_df(df)
    if region and region != "Global":
        sal = sal[sal["region"] == region]

    result = []
    for role in TARGET_ROLES:
        role_data = sal[sal["role_category"] == role]
        if len(role_data) >= 3:
            result.append({
                "role": role,
                "median": round(role_data["salary_usd"].median(), 0),
                "p25": round(role_data["salary_usd"].quantile(0.25), 0),
                "p75": round(role_data["salary_usd"].quantile(0.75), 0),
                "count": len(role_data),
            })
    return sorted(result, key=lambda x: x["median"], reverse=True)


def get_skills(role=None, region=None, top_n=20):
    """Get top skills by count."""
    df = get_dataframe()
    filtered = df.copy()
    if role and role != "All Roles":
        filtered = filtered[filtered["role_category"] == role]
    if region and region == "India":
        filtered = filtered[filtered["region"] == "India"]

    all_skills = []
    for skills in filtered["skills_parsed"]:
        all_skills.extend(clean_skills(skills))

    counter = Counter(all_skills)
    return [{"skill": s, "count": c} for s, c in counter.most_common(top_n)]


def get_companies(role=None, region=None, top_n=20):
    """Get top companies by job count."""
    df = get_dataframe()
    filtered = df.copy()
    if role and role != "All Roles":
        filtered = filtered[filtered["role_category"] == role]
    if region and region == "India":
        filtered = filtered[filtered["region"] == "India"]

    top = (
        filtered["company_name"]
        .dropna()
        .value_counts()
        .head(top_n)
        .reset_index()
    )
    top.columns = ["company", "openings"]
    return top.to_dict(orient="records")


def get_company_detail(name):
    """Get deep dive data for a single company."""
    df = get_dataframe()
    sal = get_salary_df(df)

    comp = df[df["company_name"].str.lower() == name.lower()]
    if len(comp) == 0:
        comp = df[df["company_name"].str.lower().str.contains(name.lower(), na=False)]
    if len(comp) == 0:
        return None

    comp_sal = sal[sal["company_name"].isin(comp["company_name"].unique())]

    # Roles
    roles = comp["role_category"].value_counts().to_dict()
    roles.pop("Other", None)

    # Locations
    locs = comp["city"].dropna().value_counts().head(10).to_dict()

    # Skills
    all_skills = []
    for s in comp["skills_parsed"]:
        all_skills.extend(clean_skills(s))
    top_skills = [{"skill": s, "count": c} for s, c in Counter(all_skills).most_common(15)]

    salary_info = {}
    if len(comp_sal) >= 3:
        salary_info = {
            "median": round(comp_sal["salary_usd"].median(), 0),
            "min": round(comp_sal["salary_usd"].min(), 0),
            "max": round(comp_sal["salary_usd"].max(), 0),
            "count": len(comp_sal),
        }

    return {
        "name": comp["company_name"].iloc[0],
        "total_jobs": len(comp),
        "roles": roles,
        "locations": locs,
        "skills": top_skills,
        "salary": salary_info,
    }


def get_india_market():
    """Get India-specific market data."""
    df = get_dataframe()
    sal = get_salary_df(df)

    india = df[df["region"] == "India"]
    india_sal = sal[sal["region"] == "India"]

    # City counts
    city_counts = (
        india["city"].dropna().value_counts().head(15).reset_index()
    )
    city_counts.columns = ["city", "count"]
    city_counts = city_counts[~city_counts["city"].isin(["Unknown", "other", "India"])]

    # City salary
    city_salary = []
    if len(india_sal) > 0:
        cs = india_sal.groupby("city")["salary_usd"].agg(["median", "count"]).reset_index()
        cs = cs[(cs["count"] >= 2) & (~cs["city"].isin(["Unknown", "other", "India"]))]
        cs = cs.sort_values("median", ascending=False).head(15)
        for _, row in cs.iterrows():
            city_salary.append({
                "city": row["city"],
                "median_usd": round(row["median"], 0),
                "lpa": round(row["median"] / 1200, 1),
                "count": int(row["count"]),
            })

    # Salary by role
    role_salary = []
    for role in TARGET_ROLES:
        rd = india_sal[india_sal["role_category"] == role]
        if len(rd) >= 2:
            role_salary.append({
                "role": role,
                "median_usd": round(rd["salary_usd"].median(), 0),
                "lpa": round(rd["salary_usd"].median() / 1200, 1),
                "count": len(rd),
            })

    # Skills
    all_skills = []
    for s in india["skills_parsed"]:
        all_skills.extend(clean_skills(s))
    top_skills = [{"skill": s, "count": c} for s, c in Counter(all_skills).most_common(20)]

    # Top companies
    top_companies = (
        india["company_name"].dropna().value_counts().head(20).reset_index()
    )
    top_companies.columns = ["company", "openings"]

    return {
        "total_jobs": len(india),
        "total_with_salary": len(india_sal),
        "median_salary_usd": round(india_sal["salary_usd"].median(), 0) if len(india_sal) > 0 else 0,
        "median_lpa": round(india_sal["salary_usd"].median() / 1200, 1) if len(india_sal) > 0 else 0,
        "city_counts": city_counts.to_dict(orient="records"),
        "city_salary": city_salary,
        "role_salary": role_salary,
        "top_skills": top_skills,
        "top_companies": top_companies.to_dict(orient="records"),
    }


def get_global_market(target_country=None):
    """Get country-by-country breakdown of global job market data."""
    df = get_dataframe()
    sal = get_salary_df(df)

    # Exclude Unknown or blank countries
    countries_df = df[~df["country"].str.lower().isin(["unknown", "nan", ""])]
    sal_countries = sal[~sal["country"].str.lower().isin(["unknown", "nan", ""])]

    # Top countries by job volume
    country_counts = (
        countries_df["country"]
        .value_counts()
        .head(20)
        .reset_index()
    )
    country_counts.columns = ["country", "count"]

    # Country median salary
    country_salary = []
    cs = sal_countries.groupby("country")["salary_usd"].agg(["median", "count"]).reset_index()
    cs = cs[cs["count"] >= 3].sort_values("median", ascending=False).head(20)
    for _, row in cs.iterrows():
        country_salary.append({
            "country": row["country"],
            "median_usd": round(row["median"], 0),
            "count": int(row["count"])
        })

    # Country detail if selected
    selected_data = None
    if target_country and target_country != "All Countries":
        c_df = countries_df[countries_df["country"].str.lower() == target_country.lower()]
        c_sal = sal_countries[sal_countries["country"].str.lower() == target_country.lower()]

        all_skills = []
        for s in c_df["skills_parsed"]:
            all_skills.extend(clean_skills(s))
        c_skills = [{"skill": s, "count": c} for s, c in Counter(all_skills).most_common(15)]

        c_roles = c_df["role_category"].value_counts().head(10).to_dict()
        c_roles.pop("Other", None)

        c_comps = c_df["company_name"].dropna().value_counts().head(10).reset_index()
        c_comps.columns = ["company", "openings"]

        selected_data = {
            "country": target_country,
            "total_jobs": len(c_df),
            "median_salary_usd": round(c_sal["salary_usd"].median(), 0) if len(c_sal) > 0 else 0,
            "skills": c_skills,
            "roles": c_roles,
            "top_companies": c_comps.to_dict(orient="records"),
        }

    return {
        "total_countries": int(countries_df["country"].nunique()),
        "country_counts": country_counts.to_dict(orient="records"),
        "country_salary": country_salary,
        "selected_country_data": selected_data,
    }


def get_experience_analysis(role=None):
    """Salary by experience level."""
    df = get_dataframe()
    sal = get_salary_df(df)
    if role and role != "All Roles":
        sal = sal[sal["role_category"] == role]

    sal = sal.dropna(subset=["experience_years"])
    if len(sal) < 10:
        return []

    bins = [0, 1, 3, 5, 8, 12, 20]
    labels = ["0-1 yr", "1-3 yrs", "3-5 yrs", "5-8 yrs", "8-12 yrs", "12+ yrs"]
    sal["exp_bucket"] = pd.cut(sal["experience_years"], bins=bins, labels=labels, right=False)

    result = []
    for label in labels:
        bucket = sal[sal["exp_bucket"] == label]
        if len(bucket) >= 3:
            result.append({
                "experience": label,
                "median": round(bucket["salary_usd"].median(), 0),
                "count": len(bucket),
            })
    return result
