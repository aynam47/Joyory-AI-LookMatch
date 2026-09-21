import json
import os
import re
from typing import List, Dict, Set
from app.schemas.matching import AIAttributes, MatchResult
from app.schemas.product import Product

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
PRODUCTS_FILE = os.path.join(DATA_DIR, "products.json")
INGREDIENTS_FILE = os.path.join(DATA_DIR, "ingredients.json")

# Synonym dictionary to normalize cosmetic ingredient variations
INGREDIENT_SYNONYMS: Dict[str, str] = {
    "tocopherol": "Vitamin E",
    "tocopheryl acetate": "Vitamin E",
    "vitamin e": "Vitamin E",
    "sodium hyaluronate": "Hyaluronic Acid",
    "hyaluronic acid": "Hyaluronic Acid",
    "hyaluronate": "Hyaluronic Acid",
    "salicylic acid": "Salicylic Acid (BHA)",
    "salicylic acid (bha)": "Salicylic Acid (BHA)",
    "bha": "Salicylic Acid (BHA)",
    "glycolic acid": "Glycolic Acid (AHA)",
    "glycolic acid (aha)": "Glycolic Acid (AHA)",
    "aha": "Glycolic Acid (AHA)",
    "shea butter": "Shea Butter",
    "butyrospermum parkii": "Shea Butter",
    "jojoba oil": "Jojoba Oil",
    "simmondsia chinensis": "Jojoba Oil",
    "squalane": "Squalane",
    "squalene": "Squalane",
    "plant squalane": "Squalane",
    "niacinamide": "Niacinamide",
    "vitamin b3": "Niacinamide",
    "panthenol": "Panthenol",
    "provitamin b5": "Panthenol",
    "vitamin b5": "Panthenol",
    "beeswax": "Beeswax",
    "cera alba": "Beeswax",
    "peptides": "Peptides",
    "palmitoyl peptide": "Peptides",
    "copper peptides": "Peptides",
    "ceramides": "Ceramides",
    "ceramide np": "Ceramides",
    "ceramide ap": "Ceramides",
    "vitamin c": "Vitamin C",
    "l-ascorbic acid": "Vitamin C",
    "ascorbic acid": "Vitamin C",
    "retinol": "Retinol",
    "retinoid": "Retinol",
    "centella asiatica": "Centella Asiatica",
    "centella": "Centella Asiatica",
    "cica": "Centella Asiatica",
    "madecassoside": "Centella Asiatica",
    "peppermint oil": "Peppermint Oil",
    "mica": "Mica",
    "dimethicone": "Dimethicone",
    "zinc oxide": "Zinc Oxide",
    "carbon black": "Carbon Black",
    "argan oil": "Argan Oil",
    "coconut oil": "Coconut Oil"
}

SISTER_CATEGORIES = {
    "lipstick": ["lip gloss", "lip tint", "lip balm"],
    "lip gloss": ["lipstick", "lip tint", "lip oil"],
    "foundation": ["bb cream", "cc cream", "tinted moisturizer", "serum"],
    "serum": ["skincare", "moisturizer", "essence"],
    "skincare": ["serum", "moisturizer", "sunscreen"]
}

def normalize_ingredient(name: str) -> str:
    cleaned = name.lower().strip()
    return INGREDIENT_SYNONYMS.get(cleaned, name.strip().title())

def load_products() -> List[Product]:
    with open(PRODUCTS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
        return [Product(**item) for item in data]

def load_ingredients_taxonomy() -> dict:
    if os.path.exists(INGREDIENTS_FILE):
        try:
            with open(INGREDIENTS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def match_products(attributes: AIAttributes, limit: int = 5) -> List[MatchResult]:
    all_products = load_products()
    results = []

    # Normalize target query attributes
    target_category = (attributes.category or "").lower().strip()
    target_shade = (attributes.shade or "").lower().strip()
    target_color_family = (attributes.color_family or "").lower().strip()
    target_undertone = (attributes.undertone or "").lower().strip()
    target_finish = (attributes.finish or "").lower().strip()
    target_texture = (attributes.texture or "").lower().strip()
    target_features = set(f.lower().strip() for f in (attributes.features or []))
    
    # Normalize query ingredients using taxonomy
    normalized_target_ingredients = set(
        normalize_ingredient(i) for i in (attributes.key_ingredients or [])
    )

    # Estimate reference luxury price in INR for savings calculation
    ref_price_inr = None
    if attributes.estimated_price:
        # If in USD (typical < 250), convert to INR approx x85
        if attributes.estimated_price < 250:
            ref_price_inr = attributes.estimated_price * 85.0
        else:
            ref_price_inr = attributes.estimated_price

    for product in all_products:
        score = 0.0
        reasons = []
        shared_ingredients = []

        prod_category = product.category.lower().strip()
        prod_shade = (product.shade or "").lower().strip()
        prod_color_family = (product.color_family or "").lower().strip()
        prod_undertone = (product.undertone or "").lower().strip()
        prod_finish = (product.finish or "").lower().strip()
        prod_texture = (product.texture or "").lower().strip()
        prod_features = set(f.lower().strip() for f in (product.features or []))
        
        prod_ingredients_norm = {
            normalize_ingredient(i): i for i in (product.key_ingredients or [])
        }

        # 1. CATEGORY MATCHING (Max 30 pts)
        if target_category:
            if prod_category == target_category:
                score += 30.0
                reasons.append(f"Same product category ({product.category.title()})")
            elif prod_category in SISTER_CATEGORIES.get(target_category, []):
                score += 18.0
                reasons.append(f"Related formula ({product.category.title()})")
            else:
                score += 2.0
        else:
            score += 15.0

        # 2. INGREDIENT SIMILARITY (Max 35 pts)
        if normalized_target_ingredients and prod_ingredients_norm:
            common = normalized_target_ingredients.intersection(set(prod_ingredients_norm.keys()))
            for ing in common:
                shared_ingredients.append(ing)
                score += 15.0
                reasons.append(f"Shares key active: {ing}")
            
            # Additional boost if high proportion matches
            if len(common) >= 2:
                score += 10.0
                reasons.append(f"{len(common)} key ingredients in common")

        # 3. SHADE & COLOR FAMILY (Max 20 pts)
        if target_color_family and prod_color_family:
            if target_color_family == prod_color_family:
                score += 12.0
                reasons.append(f"Matching {prod_color_family.title()} color family")

        if target_shade and prod_shade:
            # Check partial or exact shade words
            target_words = set(re.findall(r'\w+', target_shade))
            prod_words = set(re.findall(r'\w+', prod_shade))
            if target_shade in prod_shade or prod_shade in target_shade or (target_words & prod_words):
                score += 10.0
                reasons.append(f"Similar shade profile ({product.shade})")

        # 4. UNDERTONE (Max 10 pts)
        if target_undertone and prod_undertone:
            if target_undertone == prod_undertone:
                score += 10.0
                reasons.append(f"Identical {prod_undertone.title()} undertone")
            elif "neutral" in (target_undertone, prod_undertone):
                score += 5.0

        # 5. FINISH & TEXTURE (Max 15 pts)
        if target_finish and prod_finish:
            if target_finish == prod_finish:
                score += 12.0
                reasons.append(f"Identical {prod_finish.title()} finish")
        
        if target_texture and prod_texture:
            if target_texture == prod_texture:
                score += 5.0

        # 6. FEATURES (Max 10 pts)
        if target_features and prod_features:
            common_features = target_features.intersection(prod_features)
            for feat in common_features:
                score += 4.0
                reasons.append(f"Feature: {feat.title()}")

        # 7. BUDGET & SAVINGS
        savings_pct = None
        if ref_price_inr and ref_price_inr > product.price:
            savings_pct = round((1.0 - (product.price / ref_price_inr)) * 100.0)
            score += 5.0
            reasons.append(f"Save {savings_pct}% vs estimated luxury price")

        if attributes.budget:
            if product.price <= attributes.budget:
                score += 5.0
                reasons.append("Within your budget")
            else:
                score -= 3.0

        # Normalize score into a sensible 0-99 scale
        final_score = min(99.0, max(10.0, round(score, 1)))

        results.append(
            MatchResult(
                id=product.id,
                name=product.name,
                brand=product.brand,
                price=product.price,
                image=product.image,
                score=final_score,
                reasons=reasons[:4],
                shared_ingredients=shared_ingredients,
                category=product.category,
                shade=product.shade,
                finish=product.finish,
                savings_percentage=savings_pct
            )
        )

    # Sort descending by match score
    results.sort(key=lambda x: x.score, reverse=True)

    # Apply budget filtering if user strictly requested budget, but preserve top 5
    if attributes.budget:
        within_budget = [r for r in results if r.price <= attributes.budget]
        if len(within_budget) >= limit:
            results = within_budget

    return results[:limit]
