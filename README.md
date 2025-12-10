# Patient Portal - Medical Document Management System

A full-stack web application for managing medical documents (PDFs). Patients can upload, view, download, and delete their medical documents through a clean and intuitive interface.

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/31523297-176e-49ac-8cdd-02f622de55e9" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/49d1c225-358b-4109-a8c7-83ff31403645" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ce319414-17d9-49bb-8d73-dc671486f378" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/70eb7c99-4673-4241-aa27-40b6666d5dcc" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a4f39037-78a3-4a21-a665-ee3c01f852ae" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2037c93f-2035-4481-8c42-44e8feb7edc9" />

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing the API](#testing-the-api)
- [Architecture](#architecture)
- [Design Decisions](#design-decisions)
- [Future Enhancements](#future-enhancements)

## ✨ Features

### User Features
- **Upload PDF Documents**: Drag-and-drop or click to upload medical documents
- **View Documents**: See all uploaded documents with metadata (filename, size, upload date)
- **Download Documents**: Download any document with a single click
- **Delete Documents**: Remove documents with confirmation dialog
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Technical Features
- **File Validation**: PDF-only uploads with size limits (10MB)
- **Metadata Storage**: SQLite database for document metadata
- **File System Storage**: Local file storage with unique naming
- **RESTful API**: Clean API design following REST principles
- **Error Handling**: Comprehensive error handling and user feedback
- **CORS Support**: Cross-origin resource sharing for local development

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework for styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for REST API
- **Multer** - Middleware for file uploads
- **SQLite3** - Lightweight embedded database
- **CORS** - Cross-origin resource sharing

### Database
- **SQLite** - File-based relational database

## 📁 Project Structure

```
medi_care_ini8_labs/
│
├── design.md                 # Design document with architecture and decisions
├── README.md                 # This file
│
├── backend/                  # Backend API server
│   ├── server.js            # Express server and API routes
│   ├── database.js          # SQLite database operations
│   ├── package.json         # Backend dependencies
│   ├── README.md            # Backend documentation
│   ├── .gitignore
│   ├── uploads/             # Uploaded PDF files (created automatically)
│   └── database.sqlite      # SQLite database (created automatically)
│
└── frontend/                # React frontend application
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── FileUpload.js       # File upload component
    │   │   ├── FileUpload.css
    │   │   ├── DocumentList.js     # Document list component
    │   │   └── DocumentList.css
    │   ├── services/
    │   │   └── api.js              # API service layer
    │   ├── App.js                  # Main application component
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── tailwind.config.js   # Tailwind CSS configuration
    ├── postcss.config.js    # PostCSS configuration
    ├── package.json         # Frontend dependencies
    ├── README.md            # Frontend documentation
    └── .gitignore
```

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

Verify installation:
```bash
node --version
npm --version
```

## 🚀 Installation & Setup

### 1. Clone or Download the Repository

If you have the project folder, navigate to it:
```bash
cd medi_care_ini8_labs
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- express
- cors
- multer
- sqlite3
- nodemon (dev dependency)

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

This will install:
- react
- react-dom
- axios
- react-scripts
- tailwindcss
- postcss
- autoprefixer

## 🏃 Running the Application

You need to run both the backend and frontend servers.

### Option 1: Run in Separate Terminals (Recommended)

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
```

The backend will start on `http://localhost:5000`

**Terminal 2 - Frontend Server:**
```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

### Option 2: Using PowerShell (Windows)

Open PowerShell in the project root and run:

```powershell
# Start backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start"

# Wait a few seconds, then start frontend
Start-Sleep -Seconds 3
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"
```

### Development Mode (Auto-reload)

For backend development with auto-reload:
```bash
cd backend
npm run dev
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### 1. Upload Document
Upload a PDF file to the system.

**Endpoint:** `POST /documents/upload`

**Request:**
- Content-Type: `multipart/form-data`
- Body: FormData with field `file` containing PDF

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "document": {
    "id": 1,
    "filename": "prescription.pdf",
    "filepath": "uploads/1702123456789-prescription.pdf",
    "filesize": 245678,
    "created_at": "2025-12-10T10:30:45.000Z"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Only PDF files are allowed"
}
```

---

#### 2. List All Documents
Retrieve all uploaded documents.

**Endpoint:** `GET /documents`

**Response (Success - 200):**
```json
{
  "success": true,
  "documents": [
    {
      "id": 1,
      "filename": "prescription.pdf",
      "filepath": "uploads/1702123456789-prescription.pdf",
      "filesize": 245678,
      "created_at": "2025-12-10T10:30:45.000Z"
    },
    {
      "id": 2,
      "filename": "lab_results.pdf",
      "filepath": "uploads/1702123567890-lab_results.pdf",
      "filesize": 512000,
      "created_at": "2025-12-10T11:15:20.000Z"
    }
  ]
}
```

---

#### 3. Download Document
Download a specific document by ID.

**Endpoint:** `GET /documents/:id`

**Parameters:**
- `id` (URL parameter) - Document ID

**Response (Success - 200):**
- Binary PDF file stream
- Headers:
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="prescription.pdf"`

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Document not found"
}
```

---

#### 4. Delete Document
Delete a document from the system.

**Endpoint:** `DELETE /documents/:id`

**Parameters:**
- `id` (URL parameter) - Document ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Document not found"
}
```

## 🧪 Testing the API

### Using cURL

**1. Upload a document:**
```bash
curl -X POST http://localhost:5000/documents/upload -F "file=@C:\path\to\document.pdf"
```

**2. List all documents:**
```bash
curl http://localhost:5000/documents
```

**3. Download a document:**
```bash
curl http://localhost:5000/documents/1 --output downloaded.pdf
```

**4. Delete a document:**
```bash
curl -X DELETE http://localhost:5000/documents/1
```

### Using PowerShell

**1. Upload a document:**
```powershell
$filePath = "C:\path\to\document.pdf"
$uri = "http://localhost:5000/documents/upload"
$fileBytes = [System.IO.File]::ReadAllBytes($filePath)
$fileName = [System.IO.Path]::GetFileName($filePath)
$boundary = [System.Guid]::NewGuid().ToString()
$contentType = "multipart/form-data; boundary=$boundary"

$bodyLines = @(
    "--$boundary",
    "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
    "Content-Type: application/pdf",
    "",
    [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($fileBytes),
    "--$boundary--"
) -join "`r`n"

Invoke-RestMethod -Uri $uri -Method Post -ContentType $contentType -Body $bodyLines
```

**2. List all documents:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/documents" -Method Get
```

**3. Download a document:**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/documents/1" -OutFile "downloaded.pdf"
```

**4. Delete a document:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/documents/1" -Method Delete
```

### Using Postman

1. **Upload Document:**
   - Method: `POST`
   - URL: `http://localhost:5000/documents/upload`
   - Body: Select `form-data`
   - Key: `file` (change type to `File`)
   - Value: Select your PDF file

2. **List Documents:**
   - Method: `GET`
   - URL: `http://localhost:5000/documents`

3. **Download Document:**
   - Method: `GET`
   - URL: `http://localhost:5000/documents/1`
   - Click `Send and Download`

4. **Delete Document:**
   - Method: `DELETE`
   - URL: `http://localhost:5000/documents/1`

## 🏗 Architecture

### System Flow

```
User Browser (React)
       ↓
   HTTP Request
       ↓
Express.js Server
       ↓
   ┌───┴────┐
   ↓        ↓
Multer   SQLite DB
(File)   (Metadata)
   ↓        
uploads/
folder
```

### Component Diagram

```
┌─────────────────────────────────────────────┐
│           React Frontend (Port 3000)         │
│  ┌──────────────────────────────────────┐  │
│  │  App Component                        │  │
│  │  ├── FileUpload Component             │  │
│  │  └── DocumentList Component           │  │
│  └──────────────┬───────────────────────────│
└─────────────────┼───────────────────────────┘
                  │ axios (HTTP)
                  ↓
┌─────────────────────────────────────────────┐
│         Express.js Backend (Port 5000)       │
│  ┌──────────────────────────────────────┐  │
│  │  API Routes                           │  │
│  │  • POST /documents/upload             │  │
│  │  • GET  /documents                    │  │
│  │  • GET  /documents/:id                │  │
│  │  • DELETE /documents/:id              │  │
│  └──────────────┬───────────────────────────│
│                 │                            │
│     ┌───────────┴──────────┐                │
│     ↓                      ↓                │
│  ┌──────────┐       ┌──────────┐           │
│  │  Multer  │       │ Database │           │
│  │  Module  │       │  Module  │           │
│  └────┬─────┘       └─────┬────┘           │
└───────┼───────────────────┼─────────────────┘
        │                   │
        ↓                   ↓
   ┌─────────┐       ┌──────────────┐
   │ uploads/│       │database.sqlite│
   │  folder │       │               │
   └─────────┘       └──────────────┘
```

### Database Schema

```sql
CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL,
  filesize INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 💡 Design Decisions

### Why React?
- Component-based architecture for reusable UI
- Rich ecosystem with extensive libraries
- Modern hooks for state management
- Industry standard with great community support

### Why Express.js?
- Lightweight and flexible for REST APIs
- Excellent middleware ecosystem (multer, cors)
- JavaScript on both frontend and backend
- Simple routing and minimal configuration

### Why SQLite?
- Zero configuration - no separate database server
- Perfect for local development
- File-based storage - easy to backup
- ACID compliant for data integrity
- Easy migration path to PostgreSQL for production

### Why Tailwind CSS?
- Utility-first approach for rapid development
- No context switching between HTML and CSS
- Responsive design made easy
- Smaller bundle size (unused styles purged)
- Consistent design system

### Architecture Choices
- **Separation of Concerns**: Frontend and backend are completely separate
- **RESTful API**: Standard HTTP methods and status codes
- **Modular Code**: Database operations separated into own module
- **Error Handling**: Comprehensive error handling on both layers
- **Validation**: File type and size validation on both client and server

## 🚀 Future Enhancements

### For 1,000+ Users
1. **Authentication & Authorization**
   - User login with JWT tokens
   - User-specific document isolation
   - Role-based access control

2. **Database Migration**
   - PostgreSQL for production
   - Connection pooling
   - Database indexing

3. **Cloud Storage**
   - AWS S3 or Google Cloud Storage
   - CDN for faster downloads
   - Virus scanning

4. **Performance**
   - Pagination for document lists
   - Caching with Redis
   - Load balancing

5. **Security**
   - HTTPS/TLS encryption
   - Rate limiting
   - CSRF protection
   - Input sanitization

6. **Features**
   - Document preview
   - Search and filtering
   - Document categories/tags
   - Sharing capabilities
   - Version history

## 📝 Notes

- This application is designed for **local development and demonstration**
- **Single user assumption** - no authentication implemented
- Files are stored locally in `backend/uploads/`
- Maximum file size: **10MB**
- Only **PDF files** are accepted
- Database and uploads folder are created automatically on first run

## 🐛 Troubleshooting

### Port Already in Use
If you get an error that port 3000 or 5000 is already in use:

**Find and kill the process (Windows PowerShell):**
```powershell
# For port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# For port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### CORS Errors
Make sure both frontend and backend are running on the correct ports:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

### Database Not Found
The database file is created automatically on first run. If you encounter issues:
1. Delete `backend/database.sqlite` if it exists
2. Restart the backend server

### Upload Fails
Check:
1. File is a valid PDF
2. File size is under 10MB
3. Backend server is running
4. Check browser console for errors

## 📄 License

MIT License - Feel free to use this project for learning and development.

## 👤 Author

Full Stack Developer Intern Assignment

---

**Note:** See `design.md` for detailed design decisions, architecture diagrams, and scaling considerations.
