const express = require('express');
const prisma = require('../../config/db');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/rbac');
const { validateBody } = require('../../middleware/validate');
const { buildCrud } = require('../../utils/crudFactory');
const {
  clientCreate,
  clientStatusUpdate,
  templateProductCreate,
  templateProductUpdate,
  userCreateAdmin,
  userUpdateAdmin,
  userPermissionUpdate,
} = require('../../utils/schemas');
const bcrypt = require('bcryptjs');

const router = express.Router();
const onlyInternal = requireRole('SUPER_ADMIN', 'CONSULTANT');

// --- Clients (tenants) CRUD -------------------------------------------------
router.get('/clients', requireAuth, onlyInternal, async (req, res, next) => {
  try {
    const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ data: clients });
  } catch (err) {
    next(err);
  }
});

router.post('/clients', requireAuth, requireRole('SUPER_ADMIN'), validateBody(clientCreate), async (req, res, next) => {
  try {
    const client = await prisma.client.create({ data: req.body });
    res.status(201).json({ data: client });
  } catch (err) {
    next(err);
  }
});

router.put('/clients/:id/status', requireAuth, requireRole('SUPER_ADMIN'), validateBody(clientStatusUpdate), async (req, res, next) => {
  try {
    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });
    res.json({ data: client });
  } catch (err) {
    next(err);
  }
});

router.get('/clients/:id', requireAuth, onlyInternal, async (req, res, next) => {
  try {
    const client = await prisma.client.findUnique({ where: { id: req.params.id } });
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json({ data: client });
  } catch (err) {
    next(err);
  }
});

// --- Client User Management --------------------------------------------------
router.get('/clients/:clientId/users', requireAuth, onlyInternal, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({ where: { clientId: req.params.clientId } });
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
});

router.post('/clients/:clientId/users', requireAuth, onlyInternal, validateBody(userCreateAdmin), async (req, res, next) => {
  try {
    const { password, ...rest } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        ...rest,
        passwordHash,
        clientId: req.params.clientId,
      },
    });
    res.status(201).json({ data: user });
  } catch (err) {
    next(err);
  }
});

router.put('/clients/:clientId/users/:userId', requireAuth, onlyInternal, validateBody(userUpdateAdmin), async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.userId, clientId: req.params.clientId },
      data: req.body,
    });
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});

router.delete('/clients/:clientId/users/:userId', requireAuth, onlyInternal, async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.userId, clientId: req.params.clientId },
      data: { isActive: false },
    });
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});

// --- Permission Management ---------------------------------------------------
router.get('/clients/:clientId/users/:userId/permissions', requireAuth, onlyInternal, async (req, res, next) => {
  try {
    const perms = await prisma.userPermission.findMany({
      where: { userId: req.params.userId, user: { clientId: req.params.clientId } },
    });
    res.json({ data: perms });
  } catch (err) {
    next(err);
  }
});

router.put('/clients/:clientId/users/:userId/permissions', requireAuth, onlyInternal, validateBody(userPermissionUpdate), async (req, res, next) => {
  try {
    const userId = req.params.userId;
    // ensure user exists and belongs to client
    const user = await prisma.user.findUnique({ where: { id: userId, clientId: req.params.clientId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // update permissions
    const result = await prisma.$transaction(async (tx) => {
      await tx.userPermission.deleteMany({ where: { userId } });
      if (req.body.length > 0) {
        await tx.userPermission.createMany({
          data: req.body.map(p => ({
            userId,
            ...p
          }))
        });
      }
      return tx.userPermission.findMany({ where: { userId } });
    });
    
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

// --- Team management (consultants) -----------------------------------------
router.get('/team', requireAuth, onlyInternal, async (req, res, next) => {
  try {
    const team = await prisma.user.findMany({
      where: { role: { in: ['SUPER_ADMIN', 'CONSULTANT'] } },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true },
    });
    res.json({ data: team });
  } catch (err) {
    next(err);
  }
});

// --- Template store management ----------------------------------------------
// templateProduct is a platform-wide catalogue, not tenant-scoped — the
// `untenanted` flag skips clientId filtering; the role guards below are what
// protect these routes.
const templateCrud = buildCrud('templateProduct', {
  defaultOrderBy: { createdAt: 'desc' },
  untenanted: true,
  writableFields: ['name', 'category', 'priceCents', 'isSubscription', 'storageKey'],
});
router.get('/templates', requireAuth, onlyInternal, templateCrud.list);
router.post(
  '/templates',
  requireAuth,
  requireRole('SUPER_ADMIN'),
  validateBody(templateProductCreate),
  templateCrud.create,
);
router.put(
  '/templates/:id',
  requireAuth,
  requireRole('SUPER_ADMIN'),
  validateBody(templateProductUpdate),
  templateCrud.update,
);
router.delete('/templates/:id', requireAuth, requireRole('SUPER_ADMIN'), templateCrud.remove);

// --- Platform analytics (usage across all tenants) --------------------------
router.get('/analytics/usage', requireAuth, requireRole('SUPER_ADMIN'), async (req, res, next) => {
  try {
    const [clientCount, activeSubscriptions, incidentCount, auditCount] = await Promise.all([
      prisma.client.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.incident.count(),
      prisma.audit.count(),
    ]);
    res.json({ data: { clientCount, activeSubscriptions, incidentCount, auditCount } });
  } catch (err) {
    next(err);
  }
});

// TODO: /content (blog posts, regulatory alerts) CRUD once a Content/Post
// model is added to schema.prisma — kept out of v1 schema pending CMS decision.

module.exports = router;
