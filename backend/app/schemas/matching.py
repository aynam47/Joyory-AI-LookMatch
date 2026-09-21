from pydantic import BaseModel, Field
from typing import List, Optional

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
    reference_brand: Optional[str] = None
    reference_product_name: Optional[str] = None
    estimated_price: Optional[float] = None
    formula_summary: Optional[str] = None

class MatchResult(BaseModel):
    id: int
    name: str
    brand: str
    price: float
    image: str
    score: float
    reasons: List[str] = []
    shared_ingredients: List[str] = []
    category: Optional[str] = None
    shade: Optional[str] = None
    finish: Optional[str] = None
    savings_percentage: Optional[float] = None
    unmatched: List[str] = []

class MatchResponse(BaseModel):
    matches: List[MatchResult]
    analyzed_product: Optional[AIAttributes] = None

class LookMatchRequest(BaseModel):
    text: str
    api_key: Optional[str] = None
    budget: Optional[float] = None
