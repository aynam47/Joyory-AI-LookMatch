import json
import os
from typing import List, Dict
from app.schemas.matching import AIAttributes, MatchResult
from app.schemas.product import Product

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "products.json")

def load_products() -> List[Product]:
    with open(DATA_FILE, "r") as f:
        data = json.load(f)
        return [Product(**item) for item in data]

def match_products(attributes: AIAttributes) -> List[MatchResult]:
    products = load_products()
    results = []

    # 1. Category Constraint
    if attributes.category:
        target_category = attributes.category.lower().strip()
        products = [p for p in products if p.category.lower().strip() == target_category]

    for product in products:
        score = 0.0
        reasons = []

        # Category: 30%
        if attributes.category and product.category.lower().strip() == attributes.category.lower().strip():
            score += 30.0
            reasons.append(f"Same category ({product.category})")

        # Budget Scoring (Fallback penalty/bonus)
        if attributes.budget:
            if product.price <= attributes.budget:
                score += 5.0
                reasons.append("Within budget")
            else:
                score -= 2.0

        # Shade/Color: 25%
        if attributes.color_family and product.color_family and attributes.color_family.lower() == product.color_family.lower():
            score += 15.0
            reasons.append(f"Similar color family ({product.color_family})")
            
        if attributes.shade and product.shade and attributes.shade.lower() in product.shade.lower():
            score += 10.0
            reasons.append(f"Similar shade ({product.shade})")

        # Finish: 15%
        if attributes.finish and product.finish and attributes.finish.lower() == product.finish.lower():
            score += 15.0
            reasons.append(f"Similar finish ({product.finish})")

        # Undertone: 15%
        if attributes.undertone and product.undertone and attributes.undertone.lower() == product.undertone.lower():
            score += 15.0
            reasons.append(f"Similar undertone ({product.undertone})")

        # Features / Texture: 10%
        if attributes.texture and product.texture and attributes.texture.lower() == product.texture.lower():
            score += 5.0
            reasons.append(f"Similar texture ({product.texture})")
            
        if attributes.features and product.features:
            match_features = set(f.lower() for f in attributes.features).intersection(set(f.lower() for f in product.features))
            if match_features:
                score += 5.0
                reasons.append(f"Similar features")

        # Ingredients: 10%
        if attributes.key_ingredients and product.key_ingredients:
            match_ingredients = set(i.lower() for i in attributes.key_ingredients).intersection(set(i.lower() for i in product.key_ingredients))
            for ingredient in match_ingredients:
                score += 10.0
                reasons.append(f"Matches ingredient: {ingredient.title()}")
        
        # Only consider products with a positive score
        if score > 0:
            results.append(
                MatchResult(
                    id=product.id,
                    name=product.name,
                    brand=product.brand,
                    price=product.price,
                    image=product.image,
                    score=score,
                    reasons=reasons
                )
            )

    # Sort by score descending
    results.sort(key=lambda x: x.score, reverse=True)

    # Budget Filtering
    if attributes.budget:
        budget_results = [r for r in results if r.price <= attributes.budget]
        if budget_results:
            results = budget_results
        else:
            # Fallback if no items are within budget
            for r in results:
                r.reasons.append("Exceeds budget")
                
    return results[:3]
