const express = require('express');
const rateLimit = require('express-rate-limit');
const prisma = require('../../config/db');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/rbac');
const { validateBody } = require('../../middleware/validate');
const { contactMessage } = require('../../utils/schemas');
const { sendContactNotification } = require('../../utils/mailer');

const router = express.Router();

// The only unauthenticated write in the API, so it gets its own tight limiter
// on top of the global one — 5 per hour per IP is plenty for a real enquiry.
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many enquiries from this address. Please try again later.' },
});

// POST /api/public/contact — marketing site enquiry form
router.post('/contact', contactLimiter, validateBody(contactMessage), async (req, res, next) => {
  try {
    const { fullName, email, message } = req.body;
    const saved = await prisma.contactMessage.create({
      data: { fullName, email, message },
      select: { id: true, createdAt: true },
    });

    // TODO: notify the consultant inbox via nodemailer once SMTP credentials
    // are provisioned. Persisting first means an email outage never loses an
    // enquiry — the record is already durable.
    sendContactNotification({ fullName, email, message });
    res.status(201).json({ data: saved });
  } catch (err) {
    next(err);
  }
});

// GET /api/public/templates — catalogue for the marketing site's store page.
// Deliberately narrower than the admin view: storageKey is the S3 object path
// and must not leak to an unauthenticated caller.
router.get('/templates', async (req, res, next) => {
  try {
    const templates = await prisma.templateProduct.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        category: true,
        priceCents: true,
        isSubscription: true,
      },
    });
    res.json({ data: templates });
  } catch (err) {
    next(err);
  }
});

// GET /api/public/contact — internal staff read the inbox
router.get(
  '/contact',
  requireAuth,
  requireRole('SUPER_ADMIN', 'CONSULTANT'),
  async (req, res, next) => {
    try {
      const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      res.json({ data: messages });
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
