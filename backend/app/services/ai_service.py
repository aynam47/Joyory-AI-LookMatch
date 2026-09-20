import os
import json
from google import genai
from google.genai import types
from pydantic import BaseModel
from typing import Optional, List

class ExtractAttributesOutput(BaseModel):
    category: Optional[str]
    subcategory: Optional[str]
    color_family: Optional[str]
    shade: Optional[str]
    undertone: Optional[str]
    finish: Optional[str]
    texture: Optional[str]
    coverage: Optional[str]
    features: Optional[List[str]]
    key_ingredients: Optional[List[str]]
    budget: Optional[float]

def get_client():
    api_key = os.getenv("AI_API_KEY")
    if not api_key:
        raise ValueError("AI_API_KEY environment variable is not set")
    return genai.Client(api_key=api_key)

# Pre-load available data context to guide the LLM
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
try:
    with open(os.path.join(DATA_DIR, "products.json"), "r") as f:
        products_data = json.load(f)
        AVAILABLE_CATEGORIES = list(set(p.get("category", "").lower() for p in products_data if p.get("category")))
        AVAILABLE_FINISHES = list(set(p.get("finish", "").lower() for p in products_data if p.get("finish")))
        AVAILABLE_INGREDIENTS = list(set(i.lower() for p in products_data for i in p.get("key_ingredients", [])))
except Exception:
    AVAILABLE_CATEGORIES = []
    AVAILABLE_FINISHES = []
    AVAILABLE_INGREDIENTS = []

def extract_attributes_from_text(text: str) -> dict:
    client = get_client()
    
    available_context = f"""
    IMPORTANT: You must map the user's intent to our available product catalog. If possible, use the exact terminology below:
    - Available Categories: {", ".join(AVAILABLE_CATEGORIES)}
    - Available Finishes: {", ".join(AVAILABLE_FINISHES)}
    - Available Ingredients: {", ".join(AVAILABLE_INGREDIENTS)}
    """
    
    prompt = f"""
    You are an expert beauty consultant. Analyze the following user input and extract the relevant beauty product attributes.
    If the user mentions a budget, extract the maximum amount as a number.
    If the user mentions a reference product (e.g. MAC Ruby Woo), infer its category, shade, finish, undertone, etc.
    Extract any key ingredients the user explicitly asks for, or infer typical key ingredients if they mention a reference product.
    
    {available_context if AVAILABLE_CATEGORIES else ""}
    
    User Input: "{text}"
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ExtractAttributesOutput,
        ),
    )
    return json.loads(response.text)

def extract_attributes_from_image(image_bytes: bytes, mime_type: str) -> dict:
    client = get_client()
    
    available_context = f"""
    IMPORTANT: You must map the visual characteristics to our available product catalog if possible:
    - Available Categories: {", ".join(AVAILABLE_CATEGORIES)}
    - Available Finishes: {", ".join(AVAILABLE_FINISHES)}
    - Available Ingredients: {", ".join(AVAILABLE_INGREDIENTS)}
    """
    
    prompt = f"""
    You are an expert beauty consultant. Analyze the provided image of a beauty product.
    Identify its category, subcategory, color family, shade, undertone, finish, texture, and coverage based on visual evidence.
    Also identify any key ingredients shown on the packaging or infer common key ingredients for this specific product.
    If exact product is not clear, deduce the generic visual characteristics.
    
    {available_context if AVAILABLE_CATEGORIES else ""}
    """
    
    # Send image to Gemini
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[
            types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
            prompt
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ExtractAttributesOutput,
        ),
    )
    
    return json.loads(response.text)
