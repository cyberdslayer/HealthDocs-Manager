# Frontend - Patient Portal

React application for managing medical documents.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

```
frontend/
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
└── package.json

```

## Features

- **File Upload**: Drag-and-drop or click to upload PDF files
- **File Validation**: Client-side validation for PDF files and size limits
- **Document List**: View all uploaded documents with metadata
- **Download**: Download any document with a single click
- **Delete**: Remove documents with confirmation
- **Responsive Design**: Works on desktop and mobile devices

## Technologies

- **React 18** - UI framework
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
