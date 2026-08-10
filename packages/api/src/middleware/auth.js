const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Verifies the access token sent as `Authorization: Bearer <token>`.
 * On success, attaches `{ id, clientId, role }` to req.user.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  try {
    const payload = jwt.verify(token, config.jwt.accessSecret);
    req.user = payload; // { id, clientId, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Ensures the authenticated user's clientId matches the resource they're
 * requesting, so one tenant can never read another tenant's data.
 * Assumes the route already resolved `req.resourceClientId` (e.g. from a
 * loaded record) — set this in the controller before calling next().
 */
function enforceTenantIsolation(req, res, next) {
  if (req.user.role === 'SUPER_ADMIN' || req.user.role === 'CONSULTANT') {
    return next(); // internal staff can cross tenants (still subject to RBAC)
  }
  if (req.resourceClientId && req.resourceClientId !== req.user.clientId) {
    return res.status(403).json({ error: 'Forbidden: cross-tenant access' });
  }
  next();
}

module.exports = { requireAuth, enforceTenantIsolation };
