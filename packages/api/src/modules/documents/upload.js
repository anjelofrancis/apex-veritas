const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const path = require('path');
const prisma = require('../../config/db');

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock_access_key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock_secret_key',
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET || 'apex-veritas-documents',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
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
            storageKey: req.file.key,
            uploadedById,
          },
        });

        await tx.documentVersion.create({
          data: {
            documentId: document.id,
            version: 1,
            storageKey: req.file.key,
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
