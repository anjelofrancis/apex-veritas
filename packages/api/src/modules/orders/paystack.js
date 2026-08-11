const express = require('express');
const { requireAuth } = require('../../middleware/auth');
const prisma = require('../../config/db');

const router = express.Router();

router.post('/create-checkout-session', requireAuth, async (req, res, next) => {
  try {
    const { orderId } = req.body;
    
    // Fetch the order and its items
    const isInternal = req.user.role === 'SUPER_ADMIN' || req.user.role === 'CONSULTANT';
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Authorization check
    if (!isInternal && order.clientId !== req.user.clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Calculate total amount in KES (assuming item.priceCents was actually stored in KES cents or equivalent)
    // Paystack expects the amount in the lowest denomination (e.g. Kobo for NGN, Cents for USD, Cents for KES - KES doesn't really use cents in daily life but Paystack API expects the amount multiplied by 100 for KES as well).
    const totalAmount = order.items.reduce((sum, item) => sum + item.priceCents, 0);

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: order.email,
        amount: totalAmount,
        currency: 'KES',
        reference: `ORDER_${order.id}_${Date.now()}`,
        callback_url: `${process.env.PUBLIC_URL || 'http://localhost:5173'}/pricing/success`,
        metadata: {
          order_id: order.id,
          client_id: order.clientId,
        }
      })
    });

    const data = await response.json();
    
    if (!data.status) {
      return res.status(400).json({ error: data.message || 'Payment initialization failed' });
    }

    res.json({ data: { url: data.data.authorization_url } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
