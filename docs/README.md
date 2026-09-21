# Joyory AI LookMatch — Documentation Hub

Welcome to the official documentation for **Joyory AI LookMatch**, an AI-powered beauty discovery platform.

---

## What Is Joyory AI LookMatch?

Joyory AI LookMatch helps users find affordable alternatives to high-end beauty products. A user can:

- **Type** the name of a luxury product (e.g., *"Charlotte Tilbury Flawless Filter"*)
- **Speak** their request using the built-in voice interface
- **Upload** a product image for AI-powered visual analysis

The system uses **Google Gemini AI** to extract structured beauty attributes (category, shade, finish, ingredients, etc.) and then runs a weighted scoring algorithm against a curated product catalog to return the **top 5 closest matches** — with explainable reasons for each result.

---

## High-Level Architecture

```
┌──────────────────────────────────────────────────┐
│                   Browser / Client                │
│  React 19 + TypeScript + Vite + TailwindCSS 4    │
│                                                  │
│  ┌─────────────┐  ┌────────────────────────────┐ │
│  │  Home Page  │  │    AI LookMatch Chat Page   │ │
│  │  (catalog)  │  │  (text / voice / image)    │ │
│  └─────────────┘  └────────────────────────────┘ │
└────────────────────────┬─────────────────────────┘
                         │ HTTP (Vite proxy → :8000)
┌────────────────────────▼─────────────────────────┐
│              FastAPI Backend (:8000)              │
│                                                  │
│  /api/products   →  Product catalog CRUD         │
│  /api/ai/status  →  Gemini key health check      │
│  /api/ai/product-name  →  Text → AIAttributes    │
│  /api/ai/image   →  Image → AIAttributes         │
│  /api/ai/lookmatch-text  →  Text → MatchResponse │
│  /api/match      →  AIAttributes → MatchResponse │
│                                                  │
│  ┌─────────────────┐  ┌─────────────────────┐   │
│  │  ai_service.py  │  │ matching_service.py  │   │
│  │  (Gemini calls) │  │  (scoring engine)   │   │
│  └────────┬────────┘  └─────────────────────┘   │
│           │                                      │
│  ┌────────▼────────────────────────────────┐     │
│  │  Google Gemini API (external)           │     │
│  └─────────────────────────────────────────┘     │
└──────────────────────────────────────────────────┘
```

---

## Documentation Index

| File | Audience | Contents |
|---|---|---|
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | All developers | Environment setup, dependencies, running locally |
| [API_REFERENCE.md](API_REFERENCE.md) | Backend developers, API consumers | All endpoints, schemas, request/response examples |
| [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md) | Frontend developers | Component tree, routing, state management, styling |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contributors | Branching strategy, code style, PR process |

---

## Core Features

### 🤖 AI Attribute Extraction
`ai_service.py` sends structured prompts to Gemini Flash to extract up to 14 beauty attributes from free-form text or product images. Attributes include category, shade, undertone, finish, texture, coverage, features, and key ingredients.

### ⚖️ Weighted Scoring Engine
`matching_service.py` scores every catalog product against the extracted `AIAttributes` using configurable weights per attribute. Ingredient matching uses a synonym dictionary to normalize INCI names (e.g., `sodium hyaluronate` → `Hyaluronic Acid`).

### 💬 Conversational Chat UI
`AILookMatchPage.tsx` implements a full chat interface with:
- Auto-scrolling message history
- Voice input via Web Speech API
- Image upload with validation (max 5 MB, JPG/PNG/WEBP)
- Per-message product result cards with match scores & reasons

### 🛍️ Product Catalog
Products are stored in `backend/app/data/products.json`. Each product entry supports all `AIAttributes` fields plus `brand`, `price`, `originalPrice`, `skin_types`, and `image`.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key (primary lookup) |
| `AI_API_KEY` | Optional | Fallback alias for `GEMINI_API_KEY` |

> Get a free key at https://aistudio.google.com/app/apikey
