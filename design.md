# Patient Portal - Design Document

## 1. Tech Stack Choices

### Q1. Frontend Framework: **React.js**

**Why React?**
- **Component-based architecture**: Makes it easy to build reusable UI components (file upload form, file list, file item)
- **Rich ecosystem**: Extensive libraries for file handling, HTTP requests (axios), and UI components
- **Virtual DOM**: Efficient rendering and updates when file list changes
- **Industry standard**: Widely adopted, good community support, and extensive documentation
- **Hooks**: Modern React hooks (useState, useEffect) simplify state management for our use case

**Styling: Tailwind CSS**

**Why Tailwind?**
I chose Tailwind to rapidly build a clean, responsive UI without the overhead of context-switching between CSS files and JSX. It allows for consistent spacing and design tokens, ensuring the 'clean structure' requested in the prompt. Key benefits include:
- **Utility-first approach**: Write styles directly in JSX without creating separate CSS files
- **Rapid development**: Pre-built utility classes speed up UI development significantly
- **Responsive design**: Built-in responsive modifiers (sm:, md:, lg:) make mobile-first design effortless
- **Consistent design system**: Standardized spacing, colors, and typography scales ensure visual consistency
- **No naming conflicts**: No need to think about class naming conventions or CSS specificity issues
- **Production optimization**: Unused styles are automatically purged, resulting in minimal CSS bundle size
- **Developer experience**: IntelliSense support and clear documentation make it easy to use

### Q2. Backend Framework: **Node.js with Express.js**

**Why Express?**
- **Lightweight and flexible**: Perfect for building REST APIs quickly
- **Middleware ecosystem**: Easy file upload handling with `multer`, CORS support
- **JavaScript everywhere**: Same language as frontend, reducing context switching
- **Non-blocking I/O**: Good for file operations and concurrent requests
- **Simple routing**: Clean API endpoint definition
- **Easy deployment**: Minimal configuration needed for local development

### Q3. Database: **SQLite**

**Why SQLite?**
- **Zero configuration**: No separate database server needed - perfect for local development
- **File-based**: Single file database, easy to backup and share
- **Lightweight**: Minimal overhead for metadata storage
- **ACID compliant**: Ensures data integrity
- **Sufficient for requirements**: Our metadata table is simple and SQLite handles it perfectly
- **Easy migration path**: Can upgrade to PostgreSQL later without major code changes

**Why not PostgreSQL for this assignment?**
- PostgreSQL requires separate server setup, which complicates local testing
- Overkill for single-user scenario with simple metadata
- SQLite is easier for reviewers to run without additional setup

### Q4. Scaling to 1,000 Users - Considerations

If supporting 1,000 users, I would consider:

**Authentication & Authorization**
- Implement user authentication (JWT tokens or session-based)
- Add user ID to documents table to isolate user data
- Implement role-based access control

**Database Migration**
- Migrate from SQLite to **PostgreSQL** or **MySQL**
- Add indexes on `user_id` and `created_at` columns
- Implement connection pooling
- Add database backups and replication

**File Storage**
- Move from local file system to **cloud storage** (AWS S3, Google Cloud Storage, Azure Blob)
- Implement CDN for faster file downloads
- Add file size limits and virus scanning
- Implement chunked uploads for large files

**Backend Infrastructure**
- Containerize with **Docker** for consistent deployments
- Use **load balancer** with multiple backend instances
- Implement **caching** (Redis) for frequently accessed metadata
- Add rate limiting to prevent abuse
- Implement proper logging and monitoring (Winston, Prometheus)

**Security Enhancements**
- Add HTTPS/TLS encryption
- Implement CSRF protection
- Add input validation and sanitization
- Implement file type verification (not just extension check)
- Add virus/malware scanning for uploads

**Frontend Optimizations**
- Implement pagination for document lists
- Add lazy loading and infinite scroll
- Implement client-side caching
- Use a CDN for static assets
- Add progressive web app (PWA) features

**Performance**
- Implement database query optimization
- Add compression for API responses (gzip)
- Use database transactions for consistency
- Implement background job processing for large files

## 2. Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │           React Frontend (Port 3000)                │    │
│  │  • File Upload Form                                 │    │
│  │  • Document List View                               │    │
│  │  • Download/Delete Actions                          │    │
│  └──────────────────┬──────────────────────────────────┘    │
└─────────────────────┼───────────────────────────────────────┘
                      │
                      │ HTTP/HTTPS (axios)
                      │ REST API Calls
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  Express.js Backend (Port 5000)              │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              API Routes Layer                       │    │
│  │  • POST /documents/upload                           │    │
│  │  • GET  /documents                                  │    │
│  │  • GET  /documents/:id                              │    │
│  │  • DELETE /documents/:id                            │    │
│  └──────────────────┬──────────────────────────────────┘    │
│                     │                                        │
│  ┌─────────────────┴────────────────┬─────────────────┐    │
│  │                                   │                  │    │
│  ▼                                   ▼                  │    │
│  ┌──────────────────────┐  ┌──────────────────────┐   │    │
│  │  Multer Middleware   │  │  Database Service     │   │    │
│  │  (File Upload)       │  │  (SQLite Operations)  │   │    │
│  └──────────┬───────────┘  └──────────┬───────────┘   │    │
└─────────────┼──────────────────────────┼───────────────┘    │
              │                          │                     │
              │                          │                     │
              ▼                          ▼                     │
┌──────────────────────────┐  ┌─────────────────────────┐    │
│   File System            │  │   SQLite Database        │    │
│   (uploads/ folder)      │  │   (database.sqlite)      │    │
│                          │  │                          │    │
│  • PDF files stored      │  │  documents table:        │    │
│  • Named by ID           │  │  - id (PRIMARY KEY)      │    │
│  • Organized by date     │  │  - filename              │    │
│                          │  │  - filepath              │    │
│                          │  │  - filesize              │    │
│                          │  │  - created_at            │    │
└──────────────────────────┘  └─────────────────────────┘    │
```

### Data Flow

**Upload Flow:**
1. User selects PDF in React form
2. Frontend validates file type (PDF only)
3. FormData sent to POST /documents/upload
4. Backend validates file with multer
5. File saved to uploads/ directory
6. Metadata inserted into SQLite database
7. Success response with file details returned
8. Frontend updates document list

**List Flow:**
1. Frontend calls GET /documents on load
2. Backend queries all records from documents table
3. Returns JSON array of file metadata
4. Frontend renders list of documents

**Download Flow:**
1. User clicks download button
2. Frontend calls GET /documents/:id
3. Backend queries database for file path
4. File streamed as response with appropriate headers
5. Browser downloads the file

**Delete Flow:**
1. User clicks delete button (with confirmation)
2. Frontend calls DELETE /documents/:id
3. Backend deletes file from uploads/ folder
4. Backend deletes record from database
5. Success response returned
6. Frontend removes item from list

## 3. API Specification

### 1. Upload Document

**Endpoint:** `POST /documents/upload`

**Description:** Upload a PDF file to the system

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: FormData with field `file` containing PDF

**Sample Request (curl):**
```bash
curl -X POST http://localhost:5000/documents/upload \
  -F "file=@/path/to/document.pdf"
```

**Sample Success Response:**
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

**Sample Error Response:**
```json
{
  "success": false,
  "message": "Only PDF files are allowed"
}
```

**Status Codes:**
- `201`: File uploaded successfully
- `400`: Invalid file type or no file provided
- `500`: Server error during upload

---

### 2. List All Documents

**Endpoint:** `GET /documents`

**Description:** Retrieve list of all uploaded documents

**Request:**
- Method: `GET`
- No body required

**Sample Request (curl):**
```bash
curl http://localhost:5000/documents
```

**Sample Success Response:**
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

**Status Codes:**
- `200`: Success
- `500`: Server error

---

### 3. Download Document

**Endpoint:** `GET /documents/:id`

**Description:** Download a specific document by ID

**Request:**
- Method: `GET`
- URL Parameter: `id` (document ID)

**Sample Request (curl):**
```bash
curl http://localhost:5000/documents/1 --output prescription.pdf
```

**Response:**
- Binary PDF file stream
- Headers:
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="prescription.pdf"`

**Sample Error Response:**
```json
{
  "success": false,
  "message": "Document not found"
}
```

**Status Codes:**
- `200`: File downloaded successfully
- `404`: Document not found
- `500`: Server error

---

### 4. Delete Document

**Endpoint:** `DELETE /documents/:id`

**Description:** Delete a document from the system

**Request:**
- Method: `DELETE`
- URL Parameter: `id` (document ID)

**Sample Request (curl):**
```bash
curl -X DELETE http://localhost:5000/documents/1
```

**Sample Success Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

**Sample Error Response:**
```json
{
  "success": false,
  "message": "Document not found"
}
```

**Status Codes:**
- `200`: Deleted successfully
- `404`: Document not found
- `500`: Server error

## 4. Data Flow Description

### Q5. File Upload Process (Step-by-Step)

**Upload Flow:**

1. **User Action (Frontend)**
   - User clicks "Choose File" button in React component
   - User selects a PDF file from their system
   - User clicks "Upload" button

2. **Client-Side Validation (Frontend)**
   - React validates file extension is `.pdf`
   - Checks if file is selected
   - Shows error message if validation fails

3. **Request Preparation (Frontend)**
   - Creates FormData object
   - Appends file to FormData with key `file`
   - Sends POST request to `/documents/upload` using axios

4. **Request Reception (Backend)**
   - Express receives the multipart/form-data request
   - Request passes through CORS middleware
   - Reaches upload route handler

5. **File Processing (Backend - Multer Middleware)**
   - Multer intercepts the request
   - Validates file type (PDF only via fileFilter)
   - Generates unique filename: `timestamp-originalname.pdf`
   - Saves file to `uploads/` directory
   - Attaches file metadata to `req.file`

6. **Database Storage (Backend)**
   - Extracts file metadata (filename, filepath, size)
   - Creates SQL INSERT statement
   - Inserts record into `documents` table
   - Database returns the new record ID

7. **Response Generation (Backend)**
   - Constructs JSON response with document details
   - Sets HTTP status code to 201 (Created)
   - Sends response back to frontend

8. **UI Update (Frontend)**
   - Receives success response
   - Displays success message to user
   - Refreshes document list to show new file
   - Resets upload form

**Download Flow:**

1. **User Action (Frontend)**
   - User clicks "Download" button next to a document
   - Click handler extracts document ID

2. **Request Preparation (Frontend)**
   - Sends GET request to `/documents/:id`
   - Sets response type to 'blob' for binary data

3. **Database Query (Backend)**
   - Receives request with document ID
   - Queries SQLite database: `SELECT * FROM documents WHERE id = ?`
   - Checks if document exists

4. **File Validation (Backend)**
   - Verifies file exists in file system
   - Checks file path is valid and accessible

5. **File Streaming (Backend)**
   - Sets Content-Type header to `application/pdf`
   - Sets Content-Disposition header with original filename
   - Creates read stream from file
   - Streams file data as response

6. **File Reception (Frontend)**
   - Receives binary blob data
   - Creates object URL from blob
   - Creates temporary anchor (`<a>`) element
   - Sets download attribute with filename
   - Programmatically clicks anchor to trigger download

7. **Browser Download (Client)**
   - Browser's download manager takes over
   - File saved to user's Downloads folder
   - Download progress shown in browser UI

## 5. Assumptions

### Q6. Assumptions Made

**File Handling:**
- Maximum file size: **10MB** per upload (configurable in multer)
- Only **PDF files** are allowed (validated by extension and MIME type)
- Files are stored with timestamp prefix to avoid naming conflicts
- No duplicate file detection implemented (same file can be uploaded multiple times)

**User Management:**
- **Single user system** - no authentication or authorization
- All documents belong to one user
- No user login or session management required
- In production, would add user_id foreign key to documents table

**Concurrency:**
- SQLite handles concurrent reads efficiently
- Writes are serialized by SQLite automatically
- No explicit locking mechanism implemented
- Assuming low concurrent upload volume for single user

**Security:**
- Basic file type validation (PDF only)
- No virus/malware scanning implemented
- No rate limiting on uploads
- CORS enabled for localhost development only
- In production, would add authentication, HTTPS, and stricter CORS

**Storage:**
- Files stored locally in `uploads/` directory
- No cloud storage integration
- No backup or redundancy mechanism
- Assuming sufficient local disk space

**Performance:**
- No pagination implemented (all documents loaded at once)
- Suitable for < 100 documents
- Would add pagination for larger datasets
- No caching mechanism implemented

**Error Handling:**
- Basic error messages returned to client
- File system errors caught and logged
- Database errors handled with try-catch
- Partial uploads cleaned up on failure

**Data Validation:**
- File type validated on both frontend and backend
- Filenames sanitized to prevent path traversal
- No additional metadata validation (e.g., file content verification)

**Database:**
- SQLite auto-increment for primary keys
- UTC timestamps for created_at
- No soft delete (files permanently removed)
- No audit trail or version history

**Network:**
- Application runs on localhost
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- No reverse proxy or load balancer

**Browser Compatibility:**
- Modern browsers (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- File API support required
- No IE11 support

**Testing:**
- Manual testing only
- No automated unit or integration tests
- No CI/CD pipeline
- Designed for local development and demonstration
