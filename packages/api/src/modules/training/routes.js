const express = require('express');
const { requireAuth } = require('../../middleware/auth');
const { requirePermission } = require('../../middleware/rbac');
const { validateBody } = require('../../middleware/validate');
const { buildCrud } = require('../../utils/crudFactory');
const {
  courseCreate,
  trainingRecordCreate,
  trainingRecordUpdate,
} = require('../../utils/schemas');

const router = express.Router();
const courseCrud = buildCrud('course', {
  writableFields: ['title', 'description', 'validityMonths'],
});
const recordCrud = buildCrud('trainingRecord', {
  defaultOrderBy: { expiryDate: 'asc' },
  writableFields: [
    'courseId',
    'userId',
    'completedAt',
    'certificateUrl',
    'expiryDate',
    'status',
  ],
});

router.get('/courses', requireAuth, requirePermission('training', 'canView'), courseCrud.list);
router.post(
  '/courses',
  requireAuth,
  requirePermission('training', 'canCreate'),
  validateBody(courseCreate),
  courseCrud.create,
);

router.get('/records', requireAuth, requirePermission('training', 'canView'), recordCrud.list);
router.post(
  '/records',
  requireAuth,
  requirePermission('training', 'canCreate'),
  validateBody(trainingRecordCreate),
  recordCrud.create,
);
router.put(
  '/records/:id',
  requireAuth,
  requirePermission('training', 'canEdit'),
  validateBody(trainingRecordUpdate),
  recordCrud.update,
);

module.exports = router;
