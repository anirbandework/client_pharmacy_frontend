# Daily Records Management System

## Directory Structure

```
src/
├── features/
│   └── DailyRecords/           # Daily Records feature module
│       ├── components/          # Feature-specific components
│       │   ├── DailyRecordForm.jsx
│       │   └── ExcelUpload.jsx
│       ├── services/            # API services and axios config
│       │   ├── axios.js
│       │   └── dailyRecords.js
│       └── index.jsx            # Main feature page
├── components/                  # Shared components
│   ├── ErrorBoundary.jsx
│   └── LoadingSpinner.jsx
├── App.jsx                      # Main app with routing
└── main.jsx                     # Entry point
```

## Features

- **Manual Entry Form**: Create daily records with real-time calculations
- **Excel Upload**: Bulk import records from Excel files
- **API Integration**: Connected to FastAPI backend
- **Responsive Design**: Tailwind CSS with dark mode support

## Running the Application

### Backend
```bash
cd "../client backend"
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
npm install
npm run dev
```

Access at: http://localhost:3000

## API Configuration

- Development: Proxied to `http://localhost:8000`
- Production: Set `VITE_API_URL` in `.env`

## Routes

- `/` - Redirects to Daily Records
- `/daily-records` - Main application page