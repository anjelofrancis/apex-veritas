const express = require('express');
const { requireAuth } = require('../../middleware/auth');
const { requirePermission } = require('../../middleware/rbac');
const { validateBody } = require('../../middleware/validate');
const { buildCrud } = require('../../utils/crudFactory');
const { documentCreate, documentUpdate, documentFolderCreate } = require('../../utils/schemas');
const uploadHandler = require('./upload');

const router = express.Router();
const crud = buildCrud('document', {
  defaultOrderBy: { updatedAt: 'desc' },
  writableFields: [
    'folderId',
    'title',
    'currentVersion',
    'storageKey',
    'expiryDate',
    'approvalStatus',
    'uploadedById',
  ],
});

router.get('/', requireAuth, requirePermission('documents', 'canView'), crud.list);
router.get('/:id', requireAuth, requirePermission('documents', 'canView'), crud.get);
router.get('/:id/versions', requireAuth, requirePermission('documents', 'canView'), async (req, res, next) => {
  try {
    const versions = await require('../../config/db').documentVersion.findMany({
      where: { documentId: req.params.id },
      orderBy: { version: 'desc' },
    });
    res.json({ data: versions });
  } catch (err) {
    next(err);
  }
});
router.post('/upload', requireAuth, requirePermission('documents', 'canCreate'), uploadHandler);
router.post(
  '/',
  requireAuth,
  requirePermission('documents', 'canCreate'),
  validateBody(documentCreate),
  crud.create,
);
router.put(
  '/:id',
  requireAuth,
  requirePermission('documents', 'canEdit'),
  validateBody(documentUpdate),
  crud.update,
);
router.delete('/:id', requireAuth, requirePermission('documents', 'canDelete'), crud.remove);

const folderCrud = buildCrud('documentFolder', {
  defaultOrderBy: { name: 'asc' },
  writableFields: ['name', 'parentId'],
});
router.get('/folders', requireAuth, requirePermission('documents', 'canView'), folderCrud.list);
router.post('/folders', requireAuth, requirePermission('documents', 'canCreate'), validateBody(documentFolderCreate), folderCrud.create);
router.put('/folders/:folderId', requireAuth, requirePermission('documents', 'canEdit'), validateBody(documentFolderCreate.partial()), async (req, res, next) => {
  req.params.id = req.params.folderId;
  return folderCrud.update(req, res, next);
});
router.delete('/folders/:folderId', requireAuth, requirePermission('documents', 'canDelete'), async (req, res, next) => {
  req.params.id = req.params.folderId;
  return folderCrud.remove(req, res, next);
});

module.exports = router;
