from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.product import Product
from app.services.matching_service import load_products

router = APIRouter()

@router.get("/products", response_model=List[Product])
def get_all_products():
    return load_products()

@router.get("/products/{product_id}", response_model=Product)
def get_product(product_id: int):
    products = load_products()
    for product in products:
        if product.id == product_id:
            return product
    raise HTTPException(status_code=404, detail="Product not found")
