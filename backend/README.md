# Backend - Patient Portal API

Node.js/Express backend for managing medical document uploads.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## Project Structure

```
backend/
├── server.js          # Main Express server
├── database.js        # SQLite database operations
├── package.json       # Dependencies
├── uploads/           # Uploaded PDF files (created automatically)
└── database.sqlite    # SQLite database file (created automatically)
```

## API Endpoints

See main README.md for detailed API documentation.

## Technologies

- **Express.js** - Web framework
- **SQLite3** - Database
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
