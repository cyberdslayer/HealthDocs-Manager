const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const DB_PATH = path.join(__dirname, 'database.sqlite');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database schema
function initializeDatabase() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      filepath TEXT NOT NULL,
      filesize INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createTableSQL, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Documents table initialized');
    }
  });
}

// Database operations
const dbOperations = {
  // Insert a new document
  insertDocument: (filename, filepath, filesize) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO documents (filename, filepath, filesize) VALUES (?, ?, ?)`;
      
      db.run(sql, [filename, filepath, filesize], function(err) {
        if (err) {
          reject(err);
        } else {
          // Return the newly created document
          db.get('SELECT * FROM documents WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        }
      });
    });
  },

  // Get all documents
  getAllDocuments: () => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM documents ORDER BY created_at DESC`;
      
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // Get document by ID
  getDocumentById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM documents WHERE id = ?`;
      
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Delete document by ID
  deleteDocument: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM documents WHERE id = ?`;
      
      db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }
};

module.exports = dbOperations;
