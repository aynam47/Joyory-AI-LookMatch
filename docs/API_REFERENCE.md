# API Reference

The backend provides a RESTful API powered by FastAPI. By default, it runs on `http://localhost:8000`. Automatic documentation is available at `http://localhost:8000/docs` (Swagger UI) when the server is running.

## Endpoints

### 1. `GET /api/products`
Retrieves a list of all available products in the catalog.
- **Response**: `200 OK` with an array of `Product` objects.

### 2. `GET /api/products/{product_id}`
Retrieves details for a specific product by its ID.
- **Parameters**: 
  - `product_id` (integer, path parameter) - The ID of the product.
- **Response**: `200 OK` with a `Product` object, or `404 Not Found` if it doesn't exist.

### 3. `POST /api/ai/product-name`
Analyzes a natural language text description of a product to extract beauty attributes (e.g., color, tone, finish) using the Gemini AI.
- **Request Body** (JSON):
  ```json
  {
    "text": "I want a matte red lipstick that is long lasting"
  }
  ```
- **Response**: `200 OK` with an `AIAttributes` object.
  ```json
  {
    "category": "Makeup",
    "color_family": "Red",
    "finish": "Matte",
    "features": ["long lasting"]
  }
  ```

### 4. `POST /api/ai/image`
Analyzes an uploaded image to extract beauty attributes using the multimodal capabilities of Gemini AI.
- **Request Body** (FormData):
  - `file`: The image file to analyze.
- **Response**: `200 OK` with extracted `AIAttributes`.

### 5. `POST /api/match`
Finds matching products based on provided attributes.
- **Request Body** (JSON): An `AIAttributes` object extracted from the `/api/ai/...` endpoints (or provided manually).
- **Response**: `200 OK` with a `MatchResponse` object.
  ```json
  {
    "matches": [
      {
        "id": 11,
        "name": "Matte Velvet Lip Colour",
        "brand": "Luxe Lip",
        "price": 799,
        "image": "https://images.unsplash.com/.../image.jpg",
        "score": 100,
        "reasons": ["Matches desired finish (Matte)", "Features 'long lasting'"]
      }
    ]
  }
  ```

## Data Models

### `Product`
```typescript
{
    id: int
    name: str
    brand: str
    category: str
    price: float
    shade: str | null
    color_family: str | null
    undertone: str | null
    finish: str | null
    texture: str | null
    coverage: str | null
    skin_types: list[str]
    features: list[str]
    image: str
}
```

### `AIAttributes`
```typescript
{
    category: str | null
    subcategory: str | null
    color_family: str | null
    shade: str | null
    undertone: str | null
    finish: str | null
    texture: str | null
    coverage: str | null
    features: list[str]
    budget: float | null
}
```

### `MatchResult`
```typescript
{
    id: int
    name: str
    brand: str
    price: float
    image: str
    score: float
    reasons: list[str]
}
```

## CORS
The API has CORS configured in `main.py` to allow all origins (`*`) for development and hackathon purposes. In production, this should be restricted to the specific origin of the frontend application.
