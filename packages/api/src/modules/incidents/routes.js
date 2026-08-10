const express = require('express');
const prisma = require('../../config/db');
const { requireAuth, enforceTenantIsolation } = require('../../middleware/auth');
const { requirePermission } = require('../../middleware/rbac');
const { validateBody } = require('../../middleware/validate');
const { buildCrud } = require('../../utils/crudFactory');
const {
  incidentCreate,
  incidentUpdate,
  investigationUpsert,
  capaCreate,
  capaUpdate,
} = require('../../utils/schemas');

const router = express.Router();
const crud = buildCrud('incident', {
  defaultOrderBy: { occurredAt: 'desc' },
  writableFields: [
    'reportedById',
    'severity',
    'status',
    'location',
    'description',
    'occurredAt',
  ],
});

router.get('/', requireAuth, requirePermission('incidents', 'canView'), crud.list);
router.get('/:id', requireAuth, requirePermission('incidents', 'canView'), crud.get);
router.post(
  '/',
  requireAuth,
  requirePermission('incidents', 'canCreate'),
  validateBody(incidentCreate),
  crud.create,
);
router.put(
  '/:id',
  requireAuth,
  requirePermission('incidents', 'canEdit'),
  validateBody(incidentUpdate),
  crud.update,
);
router.delete('/:id', requireAuth, requirePermission('incidents', 'canDelete'), crud.remove);

// ---------------------------------------------------------------------------
// Nested sub-resources
//
// IncidentInvestigation and CapaAction carry no clientId — they inherit the
// tenant from the parent Incident, so every handler resolves the parent
// through a tenant-scoped lookup before touching the child.
// ---------------------------------------------------------------------------

/**
 * Resolves req.params.id to an incident the caller may touch, and publishes
 * the owning tenant on req.resourceClientId for enforceTenantIsolation.
 */
async function loadIncident(req, res, next) {
  try {
    const internal = ['SUPER_ADMIN', 'CONSULTANT'].includes(req.user.role);
    const where = internal
      ? { id: req.params.id }
      : { id: req.params.id, clientId: req.user.clientId ?? '' };

    const incident = await prisma.incident.findFirst({
      where,
      select: { id: true, clientId: true },
    });
    if (!incident) return res.status(404).json({ error: 'Incident not found' });

    req.incident = incident;
    req.resourceClientId = incident.clientId;
    next();
  } catch (err) {
    next(err);
  }
}

// --- investigation (one per incident) ---------------------------------------
router.get(
  '/:id/investigation',
  requireAuth,
  requirePermission('incidents', 'canView'),
  loadIncident,
  enforceTenantIsolation,
  async (req, res, next) => {
    try {
      const investigation = await prisma.incidentInvestigation.findUnique({
        where: { incidentId: req.incident.id },
      });
      if (!investigation) return res.status(404).json({ error: 'No investigation yet' });
      res.json({ data: investigation });
    } catch (err) {
      next(err);
    }
  },
);

// PUT rather than POST: the schema allows exactly one investigation per
// incident, so this upserts instead of erroring on a second call.
router.put(
  '/:id/investigation',
  requireAuth,
  requirePermission('incidents', 'canEdit'),
  loadIncident,
  enforceTenantIsolation,
  validateBody(investigationUpsert),
  async (req, res, next) => {
    try {
      const investigation = await prisma.incidentInvestigation.upsert({
        where: { incidentId: req.incident.id },
        create: { ...req.body, incidentId: req.incident.id },
        update: req.body,
      });
      res.json({ data: investigation });
    } catch (err) {
      next(err);
    }
  },
);

// --- CAPA actions -----------------------------------------------------------
router.get(
  '/:id/capa-actions',
  requireAuth,
  requirePermission('incidents', 'canView'),
  loadIncident,
  enforceTenantIsolation,
  async (req, res, next) => {
    try {
      const actions = await prisma.capaAction.findMany({
        where: { incidentId: req.incident.id },
        orderBy: { dueDate: 'asc' },
      });
      res.json({ data: actions });
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  '/:id/capa-actions',
  requireAuth,
  requirePermission('incidents', 'canCreate'),
  loadIncident,
  enforceTenantIsolation,
  validateBody(capaCreate),
  async (req, res, next) => {
    try {
      const action = await prisma.capaAction.create({
        data: { ...req.body, incidentId: req.incident.id },
      });
      res.status(201).json({ data: action });
    } catch (err) {
      next(err);
    }
  },
);

router.put(
  '/:id/capa-actions/:actionId',
  requireAuth,
  requirePermission('incidents', 'canEdit'),
  loadIncident,
  enforceTenantIsolation,
  validateBody(capaUpdate),
  async (req, res, next) => {
    try {
      const existing = await prisma.capaAction.findFirst({
        where: { id: req.params.actionId, incidentId: req.incident.id },
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

router.delete(
  '/:id/capa-actions/:actionId',
  requireAuth,
  requirePermission('incidents', 'canDelete'),
  loadIncident,
  enforceTenantIsolation,
  async (req, res, next) => {
    try {
      const existing = await prisma.capaAction.findFirst({
        where: { id: req.params.actionId, incidentId: req.incident.id },
      });
      if (!existing) return res.status(404).json({ error: 'CAPA action not found' });

      await prisma.capaAction.delete({ where: { id: req.params.actionId } });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
