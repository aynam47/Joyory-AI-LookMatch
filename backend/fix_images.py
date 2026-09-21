import json

unsplash_mapping = {
    "lipstick": [
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=500&h=500&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1571781564883-8ee35948f294?w=500&h=500&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=500&h=500&fit=crop&auto=format"
    ],
    "lip gloss": [
        "https://images.unsplash.com/photo-1617220194464-071a93e3d231?w=500&h=500&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop&auto=format"
    ],
    "foundation": [
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1631214503813-f661cc2e3799?w=500&h=500&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&h=500&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1512496015851-a1c8d4f056d9?w=500&h=500&fit=crop&auto=format"
    ],
    "blush": [
        "https://images.unsplash.com/photo-1512496015851-a1c8d4f056d9?w=500&h=500&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop&auto=format"
    ],
    "mascara": [
        "https://images.unsplash.com/photo-1583241475880-083f84372725?w=500&h=500&fit=crop&auto=format"
    ],
    "eyeliner": [
        "https://images.unsplash.com/photo-1583241475880-083f84372725?w=500&h=500&fit=crop&auto=format"
    ],
    "serum": [
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1608248593856-42bc76db78e7?w=500&h=500&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1629363447833-25a746522851?w=500&h=500&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop&auto=format"
    ],
    "sunscreen": [
        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&h=500&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1611077544689-8ebac325e648?w=500&h=500&fit=crop&auto=format"
    ],
    "skincare": [
        "https://images.unsplash.com/photo-1570194065650-d60fd23d517f?w=500&h=500&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1615397323605-2d6fcf45fb56?w=500&h=500&fit=crop&auto=format"
    ],
    "shampoo": [
        "https://images.unsplash.com/photo-1526685412586-ce6e71911961?w=500&h=500&fit=crop&auto=format"
    ],
    "conditioner": [
        "https://images.unsplash.com/photo-1626806787426-5910811b6325?w=500&h=500&fit=crop&auto=format"
    ],
    "mask": [
        "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&h=500&fit=crop&auto=format"
    ],
    "spray": [
        "https://images.unsplash.com/photo-1609203673756-324c3e390c29?w=500&h=500&fit=crop&auto=format"
    ],
    "mousse": [
        "https://images.unsplash.com/photo-1585232004423-244e0e6904e3?w=500&h=500&fit=crop&auto=format"
    ],
    "perfume": [
        "https://images.unsplash.com/photo-1541643600914-78b084683702?w=500&h=500&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1582211594533-268f4f1edcb9?w=500&h=500&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&h=500&fit=crop&auto=format"
    ],
    "cologne": [
        "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500&h=500&fit=crop&auto=format"
    ],
    "bundle": [
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&h=500&fit=crop&auto=format"
    ],
    "kit": [
        "https://images.unsplash.com/photo-1558562304-4b5cb3855ff0?w=500&h=500&fit=crop&auto=format"
    ],
    "set": [
        "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500&h=500&fit=crop&auto=format"
    ]
}

fallback = [
    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1611077544976-b620b784e565?w=500&h=500&fit=crop&auto=format"
]

with open('app/data/products.json', 'r') as f:
    products = json.load(f)

# Track usage to avoid repeats if possible
usage_counts = {}

def get_image(subcat, name):
    subcat = subcat.lower() if subcat else 'skincare'
    
    # Try to find a matching list
    candidates = unsplash_mapping.get(subcat)
    if not candidates:
        # Check if name contains any of the keys
        for key, urls in unsplash_mapping.items():
            if key in name.lower():
                candidates = urls
                break
    
    if not candidates:
        candidates = fallback
        
    # Find the candidate with the lowest usage
    best_candidate = candidates[0]
    min_usage = usage_counts.get(best_candidate, 0)
    
    for c in candidates:
        u = usage_counts.get(c, 0)
        if u < min_usage:
            min_usage = u
            best_candidate = c
            
    usage_counts[best_candidate] = usage_counts.get(best_candidate, 0) + 1
    return best_candidate

for p in products:
    p['image'] = get_image(p.get('subcategory', ''), p.get('name', ''))

with open('app/data/products.json', 'w') as f:
    json.dump(products, f, indent=2)

print("Proper images updated!")
