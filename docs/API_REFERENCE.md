# API Reference

Base URL (local development): `http://localhost:8000`

All request and response bodies are **JSON** unless otherwise noted. The API follows REST conventions.

---

## Table of Contents

- [Health Check](#health-check)
- [AI Endpoints](#ai-endpoints)
  - [GET /api/ai/status](#get-apiaistatus)
  - [POST /api/ai/product-name](#post-apiaiproduct-name)
  - [POST /api/ai/image](#post-apiaiimage)
  - [POST /api/ai/lookmatch-text](#post-apiaailookmatch-text)
- [Matching Endpoint](#matching-endpoint)
  - [POST /api/match](#post-apimatch)
- [Product Endpoints](#product-endpoints)
  - [GET /api/products](#get-apiproducts)
  - [GET /api/products/{id}](#get-apiproductsid)
- [Data Schemas](#data-schemas)

---

## Health Check

### GET /

Returns a simple health check confirming the API is running.

**Response `200 OK`**
```json
{ "message": "Welcome to AI Beauty Match API" }
```

---

## AI Endpoints

### GET /api/ai/status

Checks whether the Gemini API key is properly configured.

**Response `200 OK`**

```json
{
  "status": "ready",
  "has_key": true,
  "message": "Gemini API key is configured"
}
```

| Field | Type | Description |
|---|---|---|
| `status` | `"ready"` \| `"missing_key"` | Configuration state |
| `has_key` | `boolean` | `true` if a non-placeholder key is set |
| `message` | `string` | Human-readable status |

---

### POST /api/ai/product-name

Extracts structured beauty attributes from a free-form text description using Gemini AI.

**Request Body**

```json
{
  "text": "Charlotte Tilbury Flawless Filter in shade 3",
  "api_key": null
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `text` | `string` | ✅ | Product name or description |
| `api_key` | `string` \| `null` | ❌ | Override the server-side Gemini key |

**Response `200 OK`** → [`AIAttributes`](#aiattributes)

```json
{
  "category": "primer",
  "subcategory": "illuminating primer",
  "color_family": "beige",
  "shade": "shade 3",
  "undertone": "neutral",
  "finish": "luminous",
  "texture": "lightweight serum",
  "coverage": "sheer",
  "features": ["blurring", "buildable", "skin-enhancing"],
  "key_ingredients": ["Hyaluronic Acid", "Rose Hip Oil"],
  "budget": null,
  "reference_brand": "Charlotte Tilbury",
  "reference_product_name": "Flawless Filter",
  "estimated_price": 49.0,
  "formula_summary": "Liquid primer-foundation hybrid with a luminous skin-filter finish"
}
```

**Errors**

| Code | Reason |
|---|---|
| `400` | Invalid or missing Gemini API key |
| `500` | AI analysis failed (see `detail` field) |

---

### POST /api/ai/image

Analyzes an uploaded product image and returns extracted `AIAttributes`.

**Request** — `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | `File` | ✅ | Product image (JPG, PNG, or WEBP) |
| `api_key` | `string` | ❌ | Override server-side Gemini key |

**Response `200 OK`** → [`AIAttributes`](#aiattributes)

**Errors**

| Code | Reason |
|---|---|
| `500` | Image analysis failed |

**Frontend validation** (enforced before upload):
- File type must be `image/jpeg`, `image/png`, or `image/webp`
- File size must be ≤ 5 MB

---

### POST /api/ai/lookmatch-text

Unified endpoint: extracts attributes from text **and** runs matching in a single call. Equivalent to calling `/api/ai/product-name` then `/api/match` sequentially.

**Request Body**

```json
{
  "text": "I want something like NARS Sheer Glow Foundation",
  "api_key": null,
  "budget": 20.0
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `text` | `string` | ✅ | Product description |
| `api_key` | `string` \| `null` | ❌ | Override Gemini key |
| `budget` | `float` \| `null` | ❌ | Max price filter for returned matches |

**Response `200 OK`** → [`MatchResponse`](#matchresponse)

**Errors**

| Code | Reason |
|---|---|
| `400` | Invalid or missing Gemini API key |
| `500` | LookMatch pipeline failed |

---

## Matching Endpoint

### POST /api/match

Runs the product matching algorithm directly against a pre-built `AIAttributes` object. Use this when you already have structured attributes and want to skip the AI extraction step.

**Request Body** → [`AIAttributes`](#aiattributes)

```json
{
  "category": "foundation",
  "finish": "matte",
  "coverage": "full",
  "shade": "warm beige",
  "features": ["long-wearing", "oil-control"],
  "key_ingredients": ["Niacinamide"],
  "budget": 15.0
}
```

All fields are optional. The scoring engine weights whichever fields are present.

**Response `200 OK`** → [`MatchResponse`](#matchresponse)

---

## Product Endpoints

### GET /api/products

Returns the full product catalog.

**Response `200 OK`** → `Product[]`

```json
[
  {
    "id": 1,
    "name": "Velvet Matte Foundation",
    "brand": "Joyory",
    "category": "foundation",
    "price": 14.99,
    "image": "https://example.com/img.jpg",
    ...
  }
]
```

---

### GET /api/products/{id}

Returns a single product by its integer ID.

**Path Parameter**

| Parameter | Type | Description |
|---|---|---|
| `id` | `integer` | Unique product ID |

**Response `200 OK`** → [`Product`](#product)

**Response `404 Not Found`**
```json
{ "detail": "Product not found" }
```

---

## Data Schemas

### AIAttributes

Structured beauty attributes extracted by Gemini AI or provided directly.

| Field | Type | Description |
|---|---|---|
| `category` | `string \| null` | Product category (e.g., `"foundation"`, `"lipstick"`) |
| `subcategory` | `string \| null` | More specific category (e.g., `"liquid foundation"`) |
| `color_family` | `string \| null` | Broad color group (e.g., `"nude"`, `"red"`) |
| `shade` | `string \| null` | Specific shade name or number |
| `undertone` | `string \| null` | `"warm"`, `"cool"`, or `"neutral"` |
| `finish` | `string \| null` | `"matte"`, `"satin"`, `"dewy"`, `"luminous"`, etc. |
| `texture` | `string \| null` | Product feel (e.g., `"lightweight"`, `"creamy"`) |
| `coverage` | `string \| null` | `"sheer"`, `"light"`, `"medium"`, `"full"` |
| `features` | `string[]` | Attribute list (e.g., `["vegan", "SPF 30", "long-wearing"]`) |
| `key_ingredients` | `string[]` | Active ingredients (INCI-normalized names) |
| `budget` | `float \| null` | Maximum acceptable price in USD |
| `reference_brand` | `string \| null` | Source luxury brand name |
| `reference_product_name` | `string \| null` | Source product name |
| `estimated_price` | `float \| null` | Estimated retail price of the reference product |
| `formula_summary` | `string \| null` | One-line AI-generated summary of the formula |

---

### MatchResult

A single product match with score and explainability fields.

| Field | Type | Description |
|---|---|---|
| `id` | `integer` | Product ID |
| `name` | `string` | Product name |
| `brand` | `string` | Brand name |
| `price` | `float` | Sale price |
| `image` | `string` | Image URL |
| `score` | `float` | Match score (0–100) |
| `reasons` | `string[]` | Human-readable reasons this product matched |
| `shared_ingredients` | `string[]` | Ingredient names shared with the reference |
| `category` | `string \| null` | Product category |
| `shade` | `string \| null` | Product shade |
| `finish` | `string \| null` | Product finish |
| `savings_percentage` | `float \| null` | Discount vs. reference estimated price |
| `unmatched` | `string[]` | Attributes requested but not present in this product |

---

### MatchResponse

Top-level response returned by matching endpoints.

| Field | Type | Description |
|---|---|---|
| `matches` | `MatchResult[]` | Up to 5 ranked matches (highest score first) |
| `analyzed_product` | `AIAttributes \| null` | Structured attributes used for the search |

---

### Product

Full product catalog entry.

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `integer` | ✅ | Unique identifier |
| `name` | `string` | ✅ | Product name |
| `brand` | `string` | ✅ | Brand name |
| `category` | `string` | ✅ | Product category |
| `subcategory` | `string \| null` | ❌ | Sub-category |
| `price` | `float` | ✅ | Current price (USD) |
| `originalPrice` | `float \| null` | ❌ | Pre-discount price |
| `shade` | `string \| null` | ❌ | Shade name |
| `color_family` | `string \| null` | ❌ | Color family |
| `undertone` | `string \| null` | ❌ | Undertone |
| `finish` | `string \| null` | ❌ | Finish type |
| `texture` | `string \| null` | ❌ | Texture description |
| `coverage` | `string \| null` | ❌ | Coverage level |
| `skin_types` | `string[]` | ❌ | Compatible skin types |
| `features` | `string[]` | ❌ | Feature tags |
| `key_ingredients` | `string[]` | ❌ | Active ingredients |
| `image` | `string` | ✅ | Image URL |

---

## Interactive API Docs

The FastAPI backend auto-generates interactive API documentation at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
