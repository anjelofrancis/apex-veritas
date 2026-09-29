const multer = require('multer');
const MulterGoogleCloudStorage = require('multer-cloud-storage');
const path = require('path');
const prisma = require('../../config/db');

const upload = multer({
  storage: new MulterGoogleCloudStorage.storageEngine({
    bucket: process.env.GCS_BUCKET || 'apex-veritas-documents',
    projectId: process.env.GCP_PROJECT_ID || 'mock-project-id',
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || undefined,
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}${ext}`);
    }
  })
});

const uploadHandler = [
  upload.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { title, folderId, clientId } = req.body;
      const uploadedById = req.user.id;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const targetClientId = (req.user.role === 'SUPER_ADMIN' || req.user.role === 'CONSULTANT')
        ? clientId
        : req.user.clientId;

      if (!targetClientId) {
        return res.status(400).json({ error: 'Client ID is required' });
      }

      const result = await prisma.$transaction(async (tx) => {
        const document = await tx.document.create({
          data: {
            clientId: targetClientId,
            folderId: folderId || null,
            title,
            currentVersion: 1,
            storageKey: req.file.filename,
            uploadedById,
          },
        });

        await tx.documentVersion.create({
          data: {
            documentId: document.id,
            version: 1,
            storageKey: req.file.filename,
          },
        });

        return document;
      });

      res.status(201).json({ data: result });
    } catch (err) {
      next(err);
    }
  },
];

module.exports = uploadHandler;
