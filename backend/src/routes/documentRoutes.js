const express = require('express');
const router = express.Router();
const DocumentController = require('../controllers/documentController');
const upload = require('../middleware/uploadMiddleware');

// Upload document
router.post('/upload', upload.single('file'), DocumentController.uploadDocument);

// Get all documents
router.get('/', DocumentController.getAllDocuments);

// Download document
router.get('/:id', DocumentController.downloadDocument);

// Delete document
router.delete('/:id', DocumentController.deleteDocument);

module.exports = router;
