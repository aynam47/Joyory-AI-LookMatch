# API Reference

The backend provides a RESTful API powered by FastAPI. By default, it runs on `http://localhost:8000`.

## Endpoints

### 1. `GET /api/products`
Retrieves a list of all available products.
- **Response**: `200 OK` with an array of product objects.

### 2. `GET /api/products/{product_id}`
Retrieves details for a specific product by its ID.
- **Parameters**: 
  - `product_id` (integer) - The ID of the product.
- **Response**: `200 OK` with a product object, or `404 Not Found` if it doesn't exist.

### 3. `POST /api/ai/product-name`
Analyzes a text description of a product to extract beauty attributes (e.g., color, tone, finish).
- **Request Body** (JSON):
  ```json
  {
    "text": "matte red lipstick"
  }
  ```
- **Response**: `200 OK` with extracted AI attributes.

### 4. `POST /api/ai/image`
Analyzes an uploaded image to extract beauty attributes.
- **Request Body** (FormData):
  - `file`: The image file to analyze.
- **Response**: `200 OK` with extracted AI attributes.

### 5. `POST /api/match`
Finds matching products based on provided attributes.
- **Request Body** (JSON): The attributes extracted from the `/api/ai/...` endpoints.
- **Response**: `200 OK` with a list of matching products and match scores.

## CORS
The API has CORS configured to allow all origins (`*`) for development and hackathon purposes.
