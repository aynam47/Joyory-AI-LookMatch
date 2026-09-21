# ✨ Joyory AI LookMatch

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11%2B-blue?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Gemini-AI-8E44AD?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

> **Joyory AI LookMatch** is an AI-powered beauty discovery platform that lets users describe a luxury product by text, voice, or image — and instantly surfaces the closest affordable matches from a curated catalog, complete with ingredient overlap and explainable match reasons.

---

## 📸 What It Does

| Input Mode | How It Works |
|---|---|
| 💬 **Text / Voice** | Describe a product (e.g., *"Charlotte Tilbury Flawless Filter"*) → Gemini extracts beauty attributes → top 5 matches returned |
| 📷 **Image Upload** | Upload a product photo → Gemini Vision identifies shade, finish, category → matched to catalog |
| 🎯 **Direct Match** | POST structured `AIAttributes` directly to `/api/match` for programmatic use |

---

## 🗂️ Repository Layout

```
Joyory-AI-LookMatch/
├── backend/                   # FastAPI Python backend
│   ├── app/
│   │   ├── api/               # Route handlers (products, ai, matching)
│   │   ├── schemas/           # Pydantic request / response models
│   │   ├── services/          # Business logic & Gemini AI integration
│   │   └── data/              # JSON product & ingredient catalog
│   ├── .env.example           # Environment variable template
│   └── requirements.txt       # Python dependencies
├── frontend/                  # React + Vite + TypeScript frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components (layout, home, ui)
│   │   ├── pages/             # Route-level page components
│   │   ├── types/             # Shared TypeScript interfaces
│   │   └── utils/             # Helper utilities
│   ├── index.html
│   └── package.json
└── docs/                      # Full project documentation
    ├── README.md              # Overview & architecture (this doc index)
    ├── SETUP_GUIDE.md         # Local development setup
    ├── API_REFERENCE.md       # Complete REST API reference
    ├── FRONTEND_ARCHITECTURE.md  # Component tree & state management
    └── CONTRIBUTING.md        # How to contribute
```

---

## ⚡ Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd Joyory-AI-LookMatch

# 2. Backend setup
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
cp .env.example .env           # Add your GEMINI_API_KEY
uvicorn app.main:app --reload  # Runs on http://localhost:8000

# 3. Frontend setup (new terminal)
cd frontend
npm install
npm run dev                    # Runs on http://localhost:5173
```

> Get a free Gemini API key at https://aistudio.google.com/app/apikey

---

## 📚 Documentation

| Document | Description |
|---|---|
| [Setup Guide](docs/SETUP_GUIDE.md) | Step-by-step local environment setup |
| [API Reference](docs/API_REFERENCE.md) | All REST endpoints, schemas & examples |
| [Frontend Architecture](docs/FRONTEND_ARCHITECTURE.md) | Component tree, routing & state |
| [Contributing](docs/CONTRIBUTING.md) | Development workflow & contribution guidelines |

---

## 🛠️ Tech Stack

**Backend**
- FastAPI — high-performance Python web framework
- Google Gemini AI — multimodal LLM for text & image understanding
- Pydantic v2 — data validation & serialization

**Frontend**
- React 19 with TypeScript
- Vite 8 — build tool & dev server
- TailwindCSS 4 — utility-first styling
- React Router 7 — client-side routing

---

## 📄 License

This project is for demonstration / hackathon purposes.
