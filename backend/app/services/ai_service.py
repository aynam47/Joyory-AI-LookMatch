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
    budget: Optional[float]

def get_client():
    api_key = os.getenv("AI_API_KEY")
    if not api_key:
        raise ValueError("AI_API_KEY environment variable is not set")
    return genai.Client(api_key=api_key)

def extract_attributes_from_text(text: str) -> dict:
    client = get_client()
    prompt = f"""
    You are an expert beauty consultant. Analyze the following user input and extract the relevant beauty product attributes.
    If the user mentions a budget, extract the maximum amount as a number.
    If the user mentions a reference product (e.g. MAC Ruby Woo), infer its category, shade, finish, undertone, etc.
    
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
    prompt = """
    You are an expert beauty consultant. Analyze the provided image of a beauty product.
    Identify its category, subcategory, color family, shade, undertone, finish, texture, and coverage based on visual evidence.
    If exact product is not clear, deduce the generic visual characteristics.
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
