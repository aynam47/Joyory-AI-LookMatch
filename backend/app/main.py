from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path

from dotenv import load_dotenv

# Load environment variables explicitly from backend directory
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)

from app.api import products, ai, matching

app = FastAPI(
    title="AI Beauty Match API",
    description="Backend API for AI Beauty Match hackathon MVP",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon MVP, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(products.router, prefix="/api", tags=["products"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(matching.router, prefix="/api", tags=["matching"])

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Beauty Match API"}
