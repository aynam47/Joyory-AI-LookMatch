import json

skincare_images = {
    9: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop&auto=format", # Hydration Boost Serum
    10: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&h=500&fit=crop&auto=format", # Daily Defense Sunscreen
    20: "https://images.unsplash.com/photo-1608248593856-42bc76db78e7?w=500&h=500&fit=crop&auto=format", # BHA Clarifying Serum
    21: "https://images.unsplash.com/photo-1629363447833-25a746522851?w=500&h=500&fit=crop&auto=format", # Niacinamide + Zinc Drops
    22: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop&auto=format", # Vitamin C Glow
    23: "https://images.unsplash.com/photo-1611077544689-8ebac325e648?w=500&h=500&fit=crop&auto=format", # Multi-Peptide Serum
    24: "https://images.unsplash.com/photo-1615397323605-2d6fcf45fb56?w=500&h=500&fit=crop&auto=format", # Centella Cream
    25: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=500&fit=crop&auto=format"  # Invisible Shield Sunscreen
}

with open('app/data/products.json', 'r') as f:
    products = json.load(f)

for p in products:
    if p['id'] in skincare_images:
        p['image'] = skincare_images[p['id']]

with open('app/data/products.json', 'w') as f:
    json.dump(products, f, indent=2)

print("Skincare images explicitly mapped!")
