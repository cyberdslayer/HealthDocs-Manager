const db = require('../config/db');

const DocumentModel = {
  // Insert a new document
  create: (filename, filepath, filesize) => {
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
  findAll: () => {
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
  findById: (id) => {
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
  delete: (id) => {
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

module.exports = DocumentModel;
