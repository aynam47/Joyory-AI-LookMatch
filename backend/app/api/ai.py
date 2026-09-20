from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from app.schemas.matching import AIAttributes
from app.services.ai_service import extract_attributes_from_text, extract_attributes_from_image
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class ProductNameRequest(BaseModel):
    text: str

@router.post("/product-name", response_model=AIAttributes)
def analyze_product_name(request: ProductNameRequest):
    try:
        attributes_dict = extract_attributes_from_text(request.text)
        return AIAttributes(**attributes_dict)
    except Exception as e:
        logger.error(f"Error analyzing text: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze text input.")

@router.post("/image", response_model=AIAttributes)
async def analyze_image(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        attributes_dict = extract_attributes_from_image(image_bytes, file.content_type)
        return AIAttributes(**attributes_dict)
    except Exception as e:
        logger.error(f"Error analyzing image: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze image input.")
