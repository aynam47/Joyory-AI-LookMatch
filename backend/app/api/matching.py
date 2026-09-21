from fastapi import APIRouter
from app.schemas.matching import AIAttributes, MatchResponse
from app.services.matching_service import match_products

router = APIRouter()

@router.post("/match", response_model=MatchResponse)
def get_matches(attributes: AIAttributes):
    matches = match_products(attributes, limit=5)
    return MatchResponse(matches=matches, analyzed_product=attributes)
