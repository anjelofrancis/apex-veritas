const prisma = require('../config/db');

/**
 * Restricts a route to a fixed set of roles.
 * Usage: router.get('/admin/clients', requireAuth, requireRole('SUPER_ADMIN'), handler)
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }
    next();
  };
}

/**
 * Restricts a route by per-module CRUD permission for CLIENT_USER sub-users.
 * CLIENT_ADMIN, CONSULTANT and SUPER_ADMIN bypass this check.
 * Usage: requirePermission('documents', 'canEdit')
 */
function requirePermission(module, action) {
  return async (req, res, next) => {
    if (['CLIENT_ADMIN', 'CONSULTANT', 'SUPER_ADMIN'].includes(req.user.role)) {
      return next();
    }
    const perm = await prisma.userPermission.findUnique({
      where: { userId_module: { userId: req.user.id, module } },
    });
    if (!perm || !perm[action]) {
      return res.status(403).json({ error: `Forbidden: missing ${action} on ${module}` });
    }
    next();
  };
}

module.exports = { requireRole, requirePermission };
