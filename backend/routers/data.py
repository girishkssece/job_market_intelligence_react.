"""
Data Router — endpoints for job market data, salary stats, skills, companies.
"""

from fastapi import APIRouter, Query
from services.data_service import (
    get_overview, get_salary_data, get_salary_by_role,
    get_skills, get_companies, get_company_detail,
    get_india_market, get_global_market, get_experience_analysis, TARGET_ROLES,
)

router = APIRouter()


@router.get("/overview")
def overview():
    return get_overview()


@router.get("/salary-data")
def salary_data(
    role: str = Query(None),
    region: str = Query(None),
    city: str = Query(None),
):
    return get_salary_data(role=role, region=region, city=city)


@router.get("/salary-by-role")
def salary_by_role(region: str = Query(None)):
    return get_salary_by_role(region=region)


@router.get("/skills")
def skills(
    role: str = Query(None),
    region: str = Query(None),
    top_n: int = Query(20),
):
    return get_skills(role=role, region=region, top_n=top_n)


@router.get("/companies")
def companies(
    role: str = Query(None),
    region: str = Query(None),
    top_n: int = Query(20),
):
    return get_companies(role=role, region=region, top_n=top_n)


@router.get("/company/{name}")
def company_detail(name: str):
    data = get_company_detail(name)
    if data is None:
        return {"error": "Company not found"}
    return data


@router.get("/india-market")
def india_market():
    return get_india_market()


@router.get("/global-market")
def global_market(country: str = Query(None)):
    return get_global_market(target_country=country)


@router.get("/experience-analysis")
def experience_analysis(role: str = Query(None)):
    return get_experience_analysis(role=role)


@router.get("/roles")
def roles():
    return TARGET_ROLES
@router.get("/salary-comparison")
def salary_comparison(
    role: str = Query(...),
    experience: float = Query(...),
    current_salary: float = Query(...),
    region: str = Query("Global"),
):
    from services.data_service import get_salary_data, get_experience_analysis
    
    # Get market data for this role
    market = get_salary_data(role=role, region=region)
    exp_data = get_experience_analysis(role=role)
    
    if market.get("insufficient"):
        return {"error": "Not enough market data for this role"}
    
    median = market["median"]
    p25    = market["p25"]
    p75    = market["p75"]
    p90    = market["p90"]
    
    # Position
    if current_salary <= 0:
        position = "fresher"
        percentile = 0
    elif current_salary < p25:
        position = "underpaid"
        percentile = 10
    elif current_salary < median:
        position = "below_median"
        percentile = 35
    elif current_salary < p75:
        position = "above_median"
        percentile = 65
    elif current_salary < p90:
        position = "top_25"
        percentile = 80
    else:
        position = "top_10"
        percentile = 95
    
    # Gap analysis
    gap_to_median = median - current_salary
    gap_to_p75    = p75 - current_salary
    increase_pct  = ((median - current_salary) / current_salary * 100) if current_salary > 0 else 0
    
    return {
        "role":            role,
        "region":          region,
        "current_salary":  current_salary,
        "market":          market,
        "position":        position,
        "percentile":      percentile,
        "gap_to_median":   round(gap_to_median, 0),
        "gap_to_p75":      round(gap_to_p75, 0),
        "increase_pct":    round(increase_pct, 1),
        "lpa_current":     round(current_salary / 1200, 1),
        "lpa_median":      round(median / 1200, 1),
        "lpa_p75":         round(p75 / 1200, 1),
        "experience_data": exp_data,
    }