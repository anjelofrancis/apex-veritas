const express = require('express');
const { requireAuth } = require('../../middleware/auth');
const { requirePermission } = require('../../middleware/rbac');
const { validateBody } = require('../../middleware/validate');
const { buildCrud } = require('../../utils/crudFactory');
const { taskCreate, taskUpdate } = require('../../utils/schemas');

const router = express.Router();
const crud = buildCrud('task', {
  defaultOrderBy: { dueDate: 'asc' },
  writableFields: ['title', 'description', 'status', 'assigneeId', 'dueDate'],
});

router.get('/', requireAuth, requirePermission('tasks', 'canView'), crud.list);
router.get('/:id', requireAuth, requirePermission('tasks', 'canView'), crud.get);
router.post(
  '/',
  requireAuth,
  requirePermission('tasks', 'canCreate'),
  validateBody(taskCreate),
  crud.create,
);
router.put(
  '/:id',
  requireAuth,
  requirePermission('tasks', 'canEdit'),
  validateBody(taskUpdate),
  crud.update,
);
router.delete('/:id', requireAuth, requirePermission('tasks', 'canDelete'), crud.remove);

module.exports = router;
