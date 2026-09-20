# Setup Guide

Follow these instructions to run the Joyory AI LookMatch application locally.

## Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Set up a Python virtual environment** (optional but recommended):
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
   Copy `.env.example` to a new file named `.env` and fill in any required API keys (e.g., Gemini API keys for the AI analysis).
   ```bash
   cp .env.example .env
   ```

5. **Run the FastAPI server**:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will be available at `http://localhost:8000`.

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

**Note**: Ensure the backend server is running concurrently. The frontend Vite configuration proxies `/api` requests directly to `http://localhost:8000`, so no manual CORS setup is required when running the development server.
