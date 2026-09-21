import json
with open('app/data/products.json') as f:
    products = json.load(f)
for p in products:
    if p.get('category', '').lower() == 'skincare':
        print(f"{p['id']}: {p['name']}")
