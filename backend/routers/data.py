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
