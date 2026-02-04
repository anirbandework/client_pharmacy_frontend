# Setup Instructions

## Backend Setup

1. Navigate to backend directory:
```bash
cd "../client backend"
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start the backend server:
```bash
uvicorn main:app --reload --port 8000
```

Backend will run on: http://localhost:8000

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd "client frontend"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on: http://localhost:3000

## API Configuration

The frontend is configured to proxy API requests to the backend:
- Development: Uses Vite proxy to http://localhost:8000
- Production: Set `VITE_API_URL` in `.env` file

## Testing the Connection

1. Start backend server first (port 8000)
2. Start frontend server (port 3000)
3. Navigate to http://localhost:3000/daily-records
4. Try creating a record or uploading an Excel file

## API Endpoints

All API calls are proxied through `/api/*`:
- POST `/api/daily-records/` - Create record
- GET `/api/daily-records/` - Get all records
- PUT `/api/daily-records/{id}` - Update record
- POST `/api/daily-records/import/excel` - Upload Excel
- GET `/api/daily-records/{id}/modifications` - Get modifications