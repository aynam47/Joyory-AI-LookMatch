from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.schemas.matching import AIAttributes, MatchResponse, LookMatchRequest
from app.services.ai_service import extract_attributes_from_text, extract_attributes_from_image
from app.services.matching_service import match_products
import os
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class ProductNameRequest(BaseModel):
    text: str
    api_key: Optional[str] = None

@router.get("/status")
def get_ai_status():
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("AI_API_KEY")
    is_configured = bool(api_key and api_key.strip() != "your_gemini_api_key_here")
    return {
        "status": "ready" if is_configured else "missing_key",
        "has_key": is_configured,
        "message": "Gemini API key is configured" if is_configured else "Please set GEMINI_API_KEY in backend/.env"
    }

@router.post("/product-name", response_model=AIAttributes)
def analyze_product_name(request: ProductNameRequest):
    try:
        attributes_dict = extract_attributes_from_text(request.text, api_key=request.api_key)
        return AIAttributes(**attributes_dict)
    except Exception as e:
        logger.error(f"Error analyzing text: {e}", exc_info=True)
        detail_msg = str(e)
        if "API key" in detail_msg:
            raise HTTPException(status_code=400, detail=detail_msg)
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {detail_msg}")

@router.post("/lookmatch-text", response_model=MatchResponse)
def lookmatch_from_text(request: LookMatchRequest):
    """
    Unified text endpoint:
    1. Extracts luxury product details, shade, and ingredients using Gemini.
    2. Skims local ingredients.json and products.json.
    3. Returns top 5 closest matches + analyzed luxury product.
    """
    try:
        attributes_dict = extract_attributes_from_text(request.text, api_key=request.api_key)
        attributes = AIAttributes(**attributes_dict)
        if request.budget:
            attributes.budget = request.budget

        matches = match_products(attributes, limit=5)
        return MatchResponse(matches=matches, analyzed_product=attributes)
    except Exception as e:
        logger.error(f"Error running text LookMatch: {e}", exc_info=True)
        detail_msg = str(e)
        if "API key" in detail_msg:
            raise HTTPException(status_code=400, detail=detail_msg)
        raise HTTPException(status_code=500, detail=f"LookMatch failed: {detail_msg}")

@router.post("/image", response_model=AIAttributes)
async def analyze_image(file: UploadFile = File(...), api_key: Optional[str] = Form(None)):
    try:
        image_bytes = await file.read()
        attributes_dict = extract_attributes_from_image(image_bytes, file.content_type, api_key=api_key)
        return AIAttributes(**attributes_dict)
    except Exception as e:
        logger.error(f"Error analyzing image: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {str(e)}")
