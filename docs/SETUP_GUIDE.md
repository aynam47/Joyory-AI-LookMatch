# Setup Guide

This guide walks you through setting up Joyory AI LookMatch for local development from scratch.

---

## Prerequisites

| Tool | Minimum Version | Notes |
|---|---|---|
| Python | 3.11+ | [python.org](https://www.python.org/downloads/) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| npm | 9+ | Comes with Node.js |
| Git | Any | [git-scm.com](https://git-scm.com/) |
| Gemini API Key | — | Free at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |

---

## 1. Clone the Repository

```bash
git clone <repo-url>
cd Joyory-AI-LookMatch
```

---

## 2. Backend Setup

### 2a. Create & Activate a Virtual Environment

**Windows (PowerShell)**
```powershell
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
```

**macOS / Linux**
```bash
cd backend
python -m venv venv
source venv/bin/activate
```

> You should see `(venv)` prepended to your shell prompt.

### 2b. Install Python Dependencies

```bash
pip install -r requirements.txt
```

Key packages installed:

| Package | Purpose |
|---|---|
| `fastapi` | Web framework |
| `uvicorn` | ASGI server |
| `google-genai` | Gemini AI SDK |
| `pydantic` | Data validation |
| `python-dotenv` | `.env` file loading |
| `python-multipart` | File upload support |

### 2c. Configure Environment Variables

```bash
cp .env.example .env
```

Open `backend/.env` and set your Gemini API key:

```env
GEMINI_API_KEY=your_actual_key_here
AI_API_KEY=your_actual_key_here
```

> Both variables resolve to the same key. `GEMINI_API_KEY` takes precedence.

### 2d. Start the Backend Server

```bash
uvicorn app.main:app --reload
```

The API will be available at **http://localhost:8000**.

You can verify it is running by visiting:
- **http://localhost:8000/** — health check (`{"message": "Welcome to AI Beauty Match API"}`)
- **http://localhost:8000/docs** — interactive Swagger UI
- **http://localhost:8000/api/ai/status** — Gemini key configuration check

---

## 3. Frontend Setup

Open a **new terminal** (keep the backend running).

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**.

### How the Vite Proxy Works

`vite.config.ts` proxies all `/api/*` requests from the frontend dev server to `http://localhost:8000`. This means you do **not** need to hardcode the backend URL in frontend code — all API calls use relative paths (e.g., `/api/products`).

---

## 4. Verify Everything Is Working

1. Open **http://localhost:5173** in your browser.
2. The home page should load and display the product catalog (fetched from `/api/products`).
3. Navigate to the **AI LookMatch** page via the navbar or the hero CTA.
4. Type a product name (e.g., `Fenty Beauty Pro Filt'r Foundation`) and press **Send**.
5. You should receive a list of matched products within a few seconds.

### Common Issues

| Symptom | Likely Cause | Fix |
|---|---|---|
| Products not loading | Backend is not running | Run `uvicorn app.main:app --reload` in `/backend` |
| AI returns 400 error | Missing or invalid Gemini key | Check `backend/.env` and re-start the backend |
| CORS errors in browser | Backend CORS misconfiguration | Ensure `uvicorn` is running on port `8000` |
| `venv\Scripts\Activate.ps1` blocked | PowerShell execution policy | Run `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |

---

## 5. Project Scripts

### Backend

| Command | Description |
|---|---|
| `uvicorn app.main:app --reload` | Start dev server with hot-reload |
| `uvicorn app.main:app --host 0.0.0.0 --port 8000` | Bind to all interfaces (for LAN access) |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |

---

## 6. Adding Products to the Catalog

Edit `backend/app/data/products.json`. Each entry must conform to the `Product` schema:

```json
{
  "id": 101,
  "name": "Example Serum Foundation",
  "brand": "Example Brand",
  "category": "foundation",
  "subcategory": "liquid foundation",
  "price": 12.99,
  "originalPrice": 45.00,
  "shade": "warm beige",
  "color_family": "beige",
  "undertone": "warm",
  "finish": "satin",
  "texture": "lightweight",
  "coverage": "medium",
  "skin_types": ["normal", "dry"],
  "features": ["hydrating", "buildable"],
  "key_ingredients": ["Hyaluronic Acid", "Niacinamide"],
  "image": "https://example.com/image.jpg"
}
```

> No server restart is required — products are loaded from disk on each request during development.
