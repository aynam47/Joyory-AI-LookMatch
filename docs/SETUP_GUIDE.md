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

2. **Serve the static files**:
   You can use any static file server. For example, using Python's built-in HTTP server:
   ```bash
   python -m http.server 3000
   ```
   Or using Node.js `http-server`:
   ```bash
   npx http-server -p 3000
   ```

3. **Open the app**:
   Navigate to `http://localhost:3000` in your web browser.

**Note**: Ensure the backend server is running, as the frontend makes requests to `http://localhost:8000/api`.
