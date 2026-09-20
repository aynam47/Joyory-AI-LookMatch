from pydantic import BaseModel, Field
from typing import List, Optional

class Product(BaseModel):
    id: int
    name: str
    brand: str
    category: str
    price: float
    shade: Optional[str] = None
    color_family: Optional[str] = None
    undertone: Optional[str] = None
    finish: Optional[str] = None
    texture: Optional[str] = None
    coverage: Optional[str] = None
    skin_types: Optional[List[str]] = []
    features: Optional[List[str]] = []
    key_ingredients: Optional[List[str]] = []
    image: str
