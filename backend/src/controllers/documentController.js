const fs = require('fs');
const DocumentModel = require('../models/documentModel');

const DocumentController = {
  // Upload document
  uploadDocument: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file provided'
        });
      }

      // Save document metadata to database
      const document = await DocumentModel.create(
        req.file.originalname,
        req.file.path,
        req.file.size
      );

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        document: document
      });
    } catch (error) {
      // Clean up uploaded file if database insert fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error uploading file'
      });
    }
  },

  // Get all documents
  getAllDocuments: async (req, res) => {
    try {
      const documents = await DocumentModel.findAll();
      
      res.json({
        success: true,
        documents: documents
      });
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching documents'
      });
    }
  },

  // Download document
  downloadDocument: async (req, res) => {
    try {
      const documentId = req.params.id;
      const document = await DocumentModel.findById(documentId);

      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }

      // Check if file exists
      if (!fs.existsSync(document.filepath)) {
        return res.status(404).json({
          success: false,
          message: 'File not found on server'
        });
      }

      // Set headers for file download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${document.filename}"`);

      // Stream file to response
      const fileStream = fs.createReadStream(document.filepath);
      fileStream.pipe(res);
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({
        success: false,
        message: 'Error downloading file'
      });
    }
  },

  // Delete document
  deleteDocument: async (req, res) => {
    try {
      const documentId = req.params.id;
      const document = await DocumentModel.findById(documentId);

      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }

      // Delete file from file system
      if (fs.existsSync(document.filepath)) {
        fs.unlinkSync(document.filepath);
      }

      // Delete from database
      await DocumentModel.delete(documentId);

      res.json({
        success: true,
        message: 'Document deleted successfully'
      });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting document'
      });
    }
  }
};

module.exports = DocumentController;
