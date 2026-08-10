const express = require('express');
const prisma = require('../../config/db');
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ data: notifications });
  } catch (err) {
    next(err);
  }
});

router.put('/:id/read', requireAuth, async (req, res, next) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { readAt: new Date() },
    });
    res.json({ data: notification });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
