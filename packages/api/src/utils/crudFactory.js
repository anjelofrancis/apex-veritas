const prisma = require('../config/db');

const INTERNAL_ROLES = ['SUPER_ADMIN', 'CONSULTANT'];

/**
 * Builds standard list/get/create/update/delete handlers for a Prisma
 * model that is scoped to a tenant via `clientId`. Internal staff
 * (SUPER_ADMIN / CONSULTANT) may pass ?clientId= to view a specific
 * tenant's records; client-side roles are always scoped to their own.
 *
 * Options:
 *   writableFields — whitelist of body fields accepted on create/update.
 *                    Anything else is dropped, so a caller can't reassign
 *                    `clientId` or overwrite `createdAt` via mass assignment.
 *   untenanted     — model has no `clientId` column (e.g. templateProduct);
 *                    skips scoping entirely. Guard such routes by role.
 *
 * Usage:
 *   const { list, get, create, update, remove } = buildCrud('task', {
 *     writableFields: ['title', 'status'],
 *   });
 *   router.get('/', requireAuth, list);
 */
function buildCrud(modelName, options = {}) {
  const model = prisma[modelName];
  const { defaultOrderBy, writableFields, untenanted = false } = options;

  function isInternal(req) {
    return INTERNAL_ROLES.includes(req.user.role);
  }

  /**
   * Keeps only whitelisted fields. Without a whitelist the body is passed
   * through unchanged, which is only safe on untenanted, role-guarded models.
   */
  function pickWritable(body) {
    if (!writableFields) return { ...body };
    return Object.fromEntries(
      Object.entries(body ?? {}).filter(([key]) => writableFields.includes(key)),
    );
  }

  /**
   * Resolves which tenant this request may touch.
   * Returns `{ allowed: false }` rather than an unscoped filter when a
   * client-side user has no clientId, so the query fails closed instead of
   * silently returning every tenant's rows.
   */
  function resolveTenant(req) {
    if (untenanted) return { allowed: true, clientId: undefined };
    if (isInternal(req)) {
      // No ?clientId= means "across all tenants", which internal staff may do.
      return { allowed: true, clientId: req.query.clientId || undefined };
    }
    if (!req.user.clientId) return { allowed: false };
    return { allowed: true, clientId: req.user.clientId };
  }

  function whereFor(tenant, extraWhere = {}) {
    return tenant.clientId ? { clientId: tenant.clientId, ...extraWhere } : extraWhere;
  }

  async function list(req, res, next) {
    try {
      const tenant = resolveTenant(req);
      if (!tenant.allowed) return res.status(403).json({ error: 'No tenant assigned' });

      const records = await model.findMany({
        where: whereFor(tenant),
        orderBy: defaultOrderBy,
      });
      res.json({ data: records });
    } catch (err) {
      next(err);
    }
  }

  async function get(req, res, next) {
    try {
      const tenant = resolveTenant(req);
      if (!tenant.allowed) return res.status(403).json({ error: 'No tenant assigned' });

      const record = await model.findFirst({ where: whereFor(tenant, { id: req.params.id }) });
      if (!record) return res.status(404).json({ error: 'Not found' });
      res.json({ data: record });
    } catch (err) {
      next(err);
    }
  }

  async function create(req, res, next) {
    try {
      const data = pickWritable(req.body);

      if (!untenanted) {
        const clientId = isInternal(req) ? req.body.clientId : req.user.clientId;
        if (!clientId) return res.status(400).json({ error: 'clientId is required' });
        data.clientId = clientId;
      }

      const record = await model.create({ data });
      res.status(201).json({ data: record });
    } catch (err) {
      next(err);
    }
  }

  async function update(req, res, next) {
    try {
      const tenant = resolveTenant(req);
      if (!tenant.allowed) return res.status(403).json({ error: 'No tenant assigned' });

      const existing = await model.findFirst({ where: whereFor(tenant, { id: req.params.id }) });
      if (!existing) return res.status(404).json({ error: 'Not found' });

      // pickWritable deliberately never passes clientId through — a tenant
      // must not be able to hand its own records to another tenant.
      const record = await model.update({
        where: { id: req.params.id },
        data: pickWritable(req.body),
      });
      res.json({ data: record });
    } catch (err) {
      next(err);
    }
  }

  async function remove(req, res, next) {
    try {
      const tenant = resolveTenant(req);
      if (!tenant.allowed) return res.status(403).json({ error: 'No tenant assigned' });

      const existing = await model.findFirst({ where: whereFor(tenant, { id: req.params.id }) });
      if (!existing) return res.status(404).json({ error: 'Not found' });
      await model.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  return { list, get, create, update, remove };
}

module.exports = { buildCrud };
