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

    for product in products:
        score = 0.0
        reasons = []

        # Budget Check (Hard filter or small penalty if strict)
        # Requirements state: "Only recommend products at or below ₹700 when possible."
        # "If there are no products within budget: Tell the user: No exact matches were found within your budget. Here are the closest alternatives."
        # We will handle budget by adding a large score boost if within budget, or filtering later.
        if attributes.budget:
            if product.price <= attributes.budget:
                score += 5.0
                reasons.append("Within budget")
            else:
                # Slight penalty to deprioritize but not exclude
                score -= 2.0

        # Category: 30%
        if attributes.category and product.category.lower() == attributes.category.lower():
            score += 30.0
            reasons.append(f"Same category ({product.category})")

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
    return results[:3]
