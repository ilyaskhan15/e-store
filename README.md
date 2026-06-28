# FIFA Kit Dropshipping Store

Production-ready full-stack e-commerce store for FIFA kits and fan t-shirts.

## Prerequisites

- Python 3.11
- Node.js 18+ and npm
- pip

## Backend Setup

1. Create and activate a Python environment, then install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Copy `.env.example` to `.env` and adjust values if needed.
3. Run migrations from the backend folder:
   ```bash
   cd backend
   python manage.py makemigrations
   python manage.py migrate
   ```
4. Seed sample data:
   ```bash
   python manage.py seed_data
   ```
5. Start the API server:
   ```bash
   python manage.py runserver 8000
   ```

## Frontend Setup

1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Ensure `VITE_API_URL=http://localhost:8000/api` is available in your environment.
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```

## Seed Command

Run this from `backend/`:

```bash
python manage.py seed_data
```

## Default Login

- Email: `admin@store.com`
- Password: `admin123`

## Docker Start

Start both backend and frontend with one command from the repo root:

```bash
docker compose up --build
```

Then open:

- Frontend: http://localhost:5174
- Backend API: http://localhost:8001
