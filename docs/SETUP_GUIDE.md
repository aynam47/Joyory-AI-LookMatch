# Setup Guide

Follow these instructions to run the Joyory AI LookMatch application locally.

## Prerequisites

- **Node.js** (v18 or higher) for the frontend
- **Python** (v3.9 or higher) for the backend

## Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Set up a Python virtual environment** (highly recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables**:
   Copy `.env.example` to a new file named `.env`.
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and replace `your_gemini_api_key_here` with your actual **Google Gemini API Key**. The application uses Gemini for the natural language and image processing capabilities. If this key is missing or invalid, the AI endpoints will return errors.

5. **Run the FastAPI server**:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will be available at `http://localhost:8000`. You can view the automatic Swagger UI documentation at `http://localhost:8000/docs`.

## Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   
4. **Open the app**:
   Navigate to the URL provided by Vite (usually `http://localhost:5173`) in your web browser.

**Note on CORS & Proxying**: Ensure the backend server is running concurrently. The frontend Vite configuration (`vite.config.ts`) proxies all `/api` requests directly to `http://localhost:8000`. This bypasses any CORS issues during local development. If you change the backend port, you must also update `vite.config.ts` accordingly.

## Troubleshooting

- **Address already in use**: If port 8000 (backend) or 5173 (frontend) is already in use, you can stop the conflicting process or run the servers on different ports.
  - To change backend port: `uvicorn app.main:app --reload --port 8080` (Requires updating frontend proxy).
  - To change frontend port: `npm run dev -- --port 3000`.
- **AI Matching fails**: Check your `.env` file to ensure the `AI_API_KEY` is present and valid. Check the backend console output for detailed error traces from the Google Generative AI SDK.
