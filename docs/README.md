# Joyory AI LookMatch

Welcome to the documentation for **Joyory AI LookMatch**, an AI-powered beauty match application. This project leverages generative AI to analyze text descriptions or images of makeup/beauty products and matches them with available products in a catalog based on specific attributes like color, tone, finish, and skin type.

## Architecture

The project follows a modern decoupled architecture, consisting of two main parts:

- **Frontend**: A single-page React application built with **Vite**, **TypeScript**, and **Tailwind CSS**. It provides a dynamic, responsive UI for users to select features or describe their desired look using natural language.
- **Backend**: A RESTful **FastAPI** Python application that serves the core API, processes matches using algorithmic scoring, and integrates with the **Google Gemini AI API** for natural language understanding and image analysis.

## Core Features

- **Describe Your Look**: Users can type a natural language description (e.g., _"I want a matte red lipstick that lasts all day"_). The frontend sends this to the backend, where Gemini extracts structured beauty attributes (color family, finish, etc.), and the backend finds the best products.
- **Quick Select (Chips)**: Users can select desired features (e.g., _"vegan"_, _"hydrating"_, _"spf 50"_) from a pre-defined list to instantly filter and match products based on exact feature overlap.
- **Image Analysis**: Users can upload an image, and the AI will extract the relevant beauty attributes (like shade and undertone) to find similar products.
- **Explainable AI Matching**: The matching algorithm doesn't just return products; it returns a `MatchResult` that includes the specific `reasons` why a product matched the user's query, which is displayed on the product cards.

## Project Structure

```
Joyory-AI-LookMatch/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI routers (products.py, ai.py, matching.py)
│   │   ├── schemas/      # Pydantic models (product.py, matching.py)
│   │   ├── services/     # Core business logic and AI integration
│   │   └── data/         # JSON database for the MVP (products.json)
│   ├── main.py           # FastAPI application entry point
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.tsx       # Monolithic React component containing all UI
│   │   ├── main.tsx      # React entry point
│   │   └── index.css     # Tailwind CSS styles
│   ├── package.json      # Node dependencies
│   └── vite.config.ts    # Vite bundler configuration (includes API proxy)
└── docs/                 # Project documentation
```

## Documentation Structure

- [Setup Guide](SETUP_GUIDE.md) - Instructions to get the project running locally.
- [API Reference](API_REFERENCE.md) - Detailed schemas and endpoint documentation for the backend REST API.
- [Frontend Architecture](FRONTEND_ARCHITECTURE.md) - Deep dive into the React components and state management.
