from pydantic import BaseModel, Field
from typing import List, Optional
from app.schemas.product import Product

class AIAttributes(BaseModel):
    category: Optional[str] = None
    subcategory: Optional[str] = None
    color_family: Optional[str] = None
    shade: Optional[str] = None
    undertone: Optional[str] = None
    finish: Optional[str] = None
    texture: Optional[str] = None
    coverage: Optional[str] = None
    features: Optional[List[str]] = []
    key_ingredients: Optional[List[str]] = []
    budget: Optional[float] = None

class MatchResult(BaseModel):
    id: int
    name: str
    brand: str
    price: float
    image: str
    score: float
    reasons: List[str]

class MatchResponse(BaseModel):
    matches: List[MatchResult]
