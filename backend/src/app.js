const express = require('express');
const cors = require('cors');
const multer = require('multer');
const documentRoutes = require('./routes/documentRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Patient Portal API is running' });
});

app.use('/documents', documentRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB'
      });
    }
  }

  if (error.message === 'Only PDF files are allowed') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

module.exports = app;
