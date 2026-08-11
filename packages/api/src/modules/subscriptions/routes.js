const express = require('express');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/rbac');
const controller = require('./controller');

const router = express.Router();

router.post(
  '/checkout-session',
  requireAuth,
  requireRole('CLIENT_ADMIN', 'SUPER_ADMIN'),
  controller.createCheckoutSession
);
router.post('/webhook', controller.handleWebhook);

module.exports = router;
