const express = require('express');
const prisma = require('../../config/db');
const { requireAuth } = require('../../middleware/auth');
const { validateBody } = require('../../middleware/validate');
const { orderCreate } = require('../../utils/schemas');

const router = express.Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const isInternal = req.user.role === 'SUPER_ADMIN' || req.user.role === 'CONSULTANT';
    const orders = await prisma.order.findMany({
      where: isInternal ? undefined : { clientId: req.user.clientId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
    res.json({ data: orders });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const isInternal = req.user.role === 'SUPER_ADMIN' || req.user.role === 'CONSULTANT';
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (!isInternal && order.clientId !== req.user.clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json({ data: order });
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, validateBody(orderCreate), async (req, res, next) => {
  try {
    const { email, items } = req.body;
    const isInternal = req.user.role === 'SUPER_ADMIN' || req.user.role === 'CONSULTANT';
    const clientId = isInternal ? req.query.clientId : req.user.clientId;
    
    const totalCents = items.reduce((sum, item) => sum + item.priceCents, 0);

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          clientId,
          email,
          totalCents,
        },
      });

      if (items.length > 0) {
        await tx.orderItem.createMany({
          data: items.map(item => ({
            orderId: createdOrder.id,
            productId: item.productId,
            priceCents: item.priceCents,
          })),
        });
      }
      
      return tx.order.findUnique({
        where: { id: createdOrder.id },
        include: { items: true },
      });
    });

    res.status(201).json({ data: order });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
