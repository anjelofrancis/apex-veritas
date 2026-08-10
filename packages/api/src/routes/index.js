const express = require('express');

const router = express.Router();

router.use('/auth', require('../modules/auth/routes'));
router.use('/public', require('../modules/public/routes'));
router.use('/compliance', require('../modules/compliance/routes'));
router.use('/documents', require('../modules/documents/routes'));
router.use('/audits', require('../modules/audits/routes'));
router.use('/incidents', require('../modules/incidents/routes'));
router.use('/training', require('../modules/training/routes'));
router.use('/tasks', require('../modules/tasks/routes'));
router.use('/reports', require('../modules/reports/routes'));
router.use('/subscriptions', require('../modules/subscriptions/routes'));
router.use('/notifications', require('../modules/notifications/routes'));
router.use('/admin', require('../modules/admin/routes'));
router.use('/orders', require('../modules/orders/routes'));
router.use('/stripe', require('../modules/orders/stripe'));

module.exports = router;
