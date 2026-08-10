const express = require('express');
const Stripe = require('stripe');
const { requireAuth } = require('../../middleware/auth');
const prisma = require('../../config/db');

// The secret key is loaded from the environment
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key');
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

    // Build line items for Stripe
    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
        },
        unit_amount: item.priceCents,
      },
      quantity: 1,
    }));

    // Generate a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.PUBLIC_URL || 'http://localhost:5173'}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.PUBLIC_URL || 'http://localhost:5173'}/pricing`,
      client_reference_id: order.id,
      customer_email: order.email,
    });

    res.json({ data: { url: session.url } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
