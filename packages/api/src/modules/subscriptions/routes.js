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
// NOTE: webhook route is mounted separately in server.js with express.raw()
// so Stripe's signature verification sees the untouched request body.

module.exports = router;
