const express = require('express');
const prisma = require('../../config/db');
const { requireAuth } = require('../../middleware/auth');
const { requirePermission } = require('../../middleware/rbac');

const router = express.Router();

const INTERNAL_ROLES = ['SUPER_ADMIN', 'CONSULTANT'];

// GET /api/reports/compliance-summary — pre-built report
router.get('/compliance-summary', requireAuth, requirePermission('reports', 'canView'), async (req, res, next) => {
  try {
    // Internal staff have no clientId of their own, so they name the tenant
    // with ?clientId=. Falling through with `undefined` would have counted
    // rows where clientId IS NULL and quietly reported zeros.
    const clientId = INTERNAL_ROLES.includes(req.user.role)
      ? req.query.clientId
      : req.user.clientId;

    if (!clientId && !INTERNAL_ROLES.includes(req.user.role)) {
      return res.status(400).json({ error: 'No tenant assigned to this account' });
    }
    
    if (clientId) {
      const client = await prisma.client.findUnique({ where: { id: clientId } });
      if (!client) return res.status(404).json({ error: 'Client not found' });
    }

    const whereClause = clientId ? { clientId } : {};

    const [openObligations, overdueObligations, latestScore] = await Promise.all([
      prisma.legalRegisterItem.count({ where: { ...whereClause, status: 'open' } }),
      prisma.legalRegisterItem.count({ where: { ...whereClause, status: 'overdue' } }),
      clientId ? prisma.complianceScoreHistory.findFirst({ where: { clientId }, orderBy: { recordedAt: 'desc' } }) : null,
    ]);
    res.json({ data: { openObligations, overdueObligations, latestScore: latestScore?.score ?? null } });
  } catch (err) {
    next(err);
  }
});

// GET /safety-kpi
router.get('/safety-kpi', requireAuth, requirePermission('reports', 'canView'), async (req, res, next) => {
  try {
    const clientId = INTERNAL_ROLES.includes(req.user.role)
      ? req.query.clientId
      : req.user.clientId;

    if (!clientId && !INTERNAL_ROLES.includes(req.user.role)) {
      return res.status(400).json({ error: 'No tenant assigned to this account' });
    }
    
    if (clientId) {
      const client = await prisma.client.findUnique({ where: { id: clientId } });
      if (!client) return res.status(404).json({ error: 'Client not found' });
    }

    const whereClause = clientId ? { clientId } : {};

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const [incidentsBySeverity, thisMonthCount, lastMonthCount] = await Promise.all([
      prisma.incident.groupBy({
        by: ['severity'],
        where: whereClause,
        _count: { _all: true }
      }),
      prisma.incident.count({
        where: { ...whereClause, occurredAt: { gte: startOfThisMonth } }
      }),
      prisma.incident.count({
        where: { ...whereClause, occurredAt: { gte: startOfLastMonth, lt: startOfThisMonth } }
      }),
    ]);
    
    res.json({ data: { incidentsBySeverity, thisMonthCount, lastMonthCount } });
  } catch (err) {
    next(err);
  }
});

// GET /audit-summary
router.get('/audit-summary', requireAuth, requirePermission('reports', 'canView'), async (req, res, next) => {
  try {
    const clientId = INTERNAL_ROLES.includes(req.user.role)
      ? req.query.clientId
      : req.user.clientId;

    if (!clientId && !INTERNAL_ROLES.includes(req.user.role)) {
      return res.status(400).json({ error: 'No tenant assigned to this account' });
    }
    
    if (clientId) {
      const client = await prisma.client.findUnique({ where: { id: clientId } });
      if (!client) return res.status(404).json({ error: 'Client not found' });
    }

    const whereClause = clientId ? { clientId } : {};

    const [auditsByStatus, totalAudits, completedAudits] = await Promise.all([
      prisma.audit.groupBy({
        by: ['status'],
        where: whereClause,
        _count: { _all: true }
      }),
      prisma.audit.count({ where: whereClause }),
      prisma.audit.count({ where: { ...whereClause, status: 'COMPLETED' } })
    ]);
    
    const completionRate = totalAudits > 0 ? (completedAudits / totalAudits) * 100 : 0;
    
    res.json({ data: { auditsByStatus, totalAudits, completionRate } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
