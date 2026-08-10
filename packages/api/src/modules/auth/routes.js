const express = require('express');
const rateLimit = require('express-rate-limit');
const { requireAuth } = require('../../middleware/auth');
const { validateBody } = require('../../middleware/validate');
const { registerSchema, loginSchema, refreshSchema } = require('../../utils/schemas');
const controller = require('./controller');

const router = express.Router();

// Stricter limiter on auth endpoints to slow down credential stuffing
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

router.post('/register', authLimiter, validateBody(registerSchema), controller.register);
router.post('/login', authLimiter, validateBody(loginSchema), controller.login);
router.post('/refresh', validateBody(refreshSchema), controller.refresh);
router.get('/me', requireAuth, controller.me);

router.post('/mfa/setup', requireAuth, controller.setupMfa);
router.post('/mfa/verify', authLimiter, controller.verifyMfa);
router.post('/mfa/enable', requireAuth, controller.enableMfa);

module.exports = router;
