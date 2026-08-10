const express = require('express');
const { requireAuth } = require('../../middleware/auth');
const { requirePermission } = require('../../middleware/rbac');
const { validateBody } = require('../../middleware/validate');
const { buildCrud } = require('../../utils/crudFactory');
const { legalRegisterItemCreate, legalRegisterItemUpdate } = require('../../utils/schemas');

const router = express.Router();
const crud = buildCrud('legalRegisterItem', {
  defaultOrderBy: { dueDate: 'asc' },
  writableFields: [
    'jurisdiction',
    'regulationRef',
    'title',
    'description',
    'obligation',
    'dueDate',
    'status',
    'evidenceUrl',
  ],
});

router.get('/', requireAuth, requirePermission('compliance', 'canView'), crud.list);
router.get('/:id', requireAuth, requirePermission('compliance', 'canView'), crud.get);
router.post(
  '/',
  requireAuth,
  requirePermission('compliance', 'canCreate'),
  validateBody(legalRegisterItemCreate),
  crud.create,
);
router.put(
  '/:id',
  requireAuth,
  requirePermission('compliance', 'canEdit'),
  validateBody(legalRegisterItemUpdate),
  crud.update,
);
router.delete('/:id', requireAuth, requirePermission('compliance', 'canDelete'), crud.remove);

module.exports = router;
