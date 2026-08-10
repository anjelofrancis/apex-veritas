const express = require('express');
const prisma = require('../../config/db');
const { requireAuth, enforceTenantIsolation } = require('../../middleware/auth');
const { requirePermission } = require('../../middleware/rbac');
const { validateBody } = require('../../middleware/validate');
const { buildCrud } = require('../../utils/crudFactory');
const {
  auditCreate,
  auditUpdate,
  checklistItemCreate,
  checklistItemUpdate,
  findingCreate,
  findingUpdate,
  capaCreate,
  capaUpdate,
} = require('../../utils/schemas');

const router = express.Router();
const crud = buildCrud('audit', {
  defaultOrderBy: { scheduledDate: 'asc' },
  writableFields: ['type', 'status', 'title', 'scheduledDate', 'createdById'],
});

router.get('/', requireAuth, requirePermission('audits', 'canView'), crud.list);
router.get('/:id', requireAuth, requirePermission('audits', 'canView'), crud.get);
router.post(
  '/',
  requireAuth,
  requirePermission('audits', 'canCreate'),
  validateBody(auditCreate),
  crud.create,
);
router.put(
  '/:id',
  requireAuth,
  requirePermission('audits', 'canEdit'),
  validateBody(auditUpdate),
  crud.update,
);
router.delete('/:id', requireAuth, requirePermission('audits', 'canDelete'), crud.remove);

// ---------------------------------------------------------------------------
// Nested sub-resources
//
// AuditChecklistItem and AuditFinding have no clientId of their own — they
// inherit the tenant from their parent Audit. So each handler loads the parent
// through the tenant-scoped audit lookup first; if that misses, the caller
// gets a 404 and never learns whether the id exists in another tenant.
// ---------------------------------------------------------------------------

/**
 * Resolves req.params.id to an audit the caller may touch, and publishes the
 * owning tenant on req.resourceClientId for enforceTenantIsolation.
 */
async function loadAudit(req, res, next) {
  try {
    const internal = ['SUPER_ADMIN', 'CONSULTANT'].includes(req.user.role);
    const where = internal
      ? { id: req.params.id }
      : { id: req.params.id, clientId: req.user.clientId ?? '' };

    const audit = await prisma.audit.findFirst({ where, select: { id: true, clientId: true } });
    if (!audit) return res.status(404).json({ error: 'Audit not found' });

    req.audit = audit;
    req.resourceClientId = audit.clientId;
    next();
  } catch (err) {
    next(err);
  }
}

// loadAudit already scopes by tenant; enforceTenantIsolation is the explicit
// second check the architecture calls for, so a future edit to loadAudit that
// drops the scoping still can't leak across tenants.
const requireAudit = [loadAudit, enforceTenantIsolation];

// --- checklist items --------------------------------------------------------
router.get(
  '/:id/checklist-items',
  requireAuth,
  requirePermission('audits', 'canView'),
  requireAudit,
  async (req, res, next) => {
    try {
      const items = await prisma.auditChecklistItem.findMany({
        where: { auditId: req.audit.id },
        orderBy: { order: 'asc' },
      });
      res.json({ data: items });
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  '/:id/checklist-items',
  requireAuth,
  requirePermission('audits', 'canCreate'),
  requireAudit,
  validateBody(checklistItemCreate),
  async (req, res, next) => {
    try {
      const item = await prisma.auditChecklistItem.create({
        data: { ...req.body, auditId: req.audit.id },
      });
      res.status(201).json({ data: item });
    } catch (err) {
      next(err);
    }
  },
);

router.put(
  '/:id/checklist-items/:itemId',
  requireAuth,
  requirePermission('audits', 'canEdit'),
  requireAudit,
  validateBody(checklistItemUpdate),
  async (req, res, next) => {
    try {
      const existing = await prisma.auditChecklistItem.findFirst({
        where: { id: req.params.itemId, auditId: req.audit.id },
      });
      if (!existing) return res.status(404).json({ error: 'Checklist item not found' });

      const item = await prisma.auditChecklistItem.update({
        where: { id: req.params.itemId },
        data: req.body,
      });
      res.json({ data: item });
    } catch (err) {
      next(err);
    }
  },
);

router.delete(
  '/:id/checklist-items/:itemId',
  requireAuth,
  requirePermission('audits', 'canDelete'),
  requireAudit,
  async (req, res, next) => {
    try {
      const existing = await prisma.auditChecklistItem.findFirst({
        where: { id: req.params.itemId, auditId: req.audit.id },
      });
      if (!existing) return res.status(404).json({ error: 'Checklist item not found' });

      await prisma.auditChecklistItem.delete({ where: { id: req.params.itemId } });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);

// --- findings ---------------------------------------------------------------
router.get(
  '/:id/findings',
  requireAuth,
  requirePermission('audits', 'canView'),
  requireAudit,
  async (req, res, next) => {
    try {
      const findings = await prisma.auditFinding.findMany({
        where: { auditId: req.audit.id },
        orderBy: { createdAt: 'desc' },
        include: { capaActions: true },
      });
      res.json({ data: findings });
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  '/:id/findings',
  requireAuth,
  requirePermission('audits', 'canCreate'),
  requireAudit,
  validateBody(findingCreate),
  async (req, res, next) => {
    try {
      const finding = await prisma.auditFinding.create({
        data: { ...req.body, auditId: req.audit.id },
      });
      res.status(201).json({ data: finding });
    } catch (err) {
      next(err);
    }
  },
);

router.put(
  '/:id/findings/:findingId',
  requireAuth,
  requirePermission('audits', 'canEdit'),
  requireAudit,
  validateBody(findingUpdate),
  async (req, res, next) => {
    try {
      const existing = await prisma.auditFinding.findFirst({
        where: { id: req.params.findingId, auditId: req.audit.id },
      });
      if (!existing) return res.status(404).json({ error: 'Finding not found' });

      const finding = await prisma.auditFinding.update({
        where: { id: req.params.findingId },
        data: req.body,
      });
      res.json({ data: finding });
    } catch (err) {
      next(err);
    }
  },
);

// --- CAPA actions hanging off a finding -------------------------------------
router.post(
  '/:id/findings/:findingId/capa-actions',
  requireAuth,
  requirePermission('audits', 'canCreate'),
  requireAudit,
  validateBody(capaCreate),
  async (req, res, next) => {
    try {
      const finding = await prisma.auditFinding.findFirst({
        where: { id: req.params.findingId, auditId: req.audit.id },
      });
      if (!finding) return res.status(404).json({ error: 'Finding not found' });

      const action = await prisma.capaAction.create({
        data: { ...req.body, auditFindingId: finding.id },
      });
      res.status(201).json({ data: action });
    } catch (err) {
      next(err);
    }
  },
);

router.put(
  '/:id/findings/:findingId/capa-actions/:actionId',
  requireAuth,
  requirePermission('audits', 'canEdit'),
  requireAudit,
  validateBody(capaUpdate),
  async (req, res, next) => {
    try {
      const existing = await prisma.capaAction.findFirst({
        where: { id: req.params.actionId, auditFindingId: req.params.findingId },
      });
      if (!existing) return res.status(404).json({ error: 'CAPA action not found' });

      const action = await prisma.capaAction.update({
        where: { id: req.params.actionId },
        data: req.body,
      });
      res.json({ data: action });
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
