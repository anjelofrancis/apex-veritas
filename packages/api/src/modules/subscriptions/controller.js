const Stripe = require('stripe');
const prisma = require('../../config/db');
const config = require('../../config');

const stripe = new Stripe(config.stripe.secretKey);

const PRICE_IDS = {
  STARTER: process.env.STRIPE_PRICE_STARTER,
  PROFESSIONAL: process.env.STRIPE_PRICE_PROFESSIONAL,
  ENTERPRISE: process.env.STRIPE_PRICE_ENTERPRISE,
};

// POST /api/subscriptions/checkout-session — { planTier }
async function createCheckoutSession(req, res, next) {
  try {
    const { planTier } = req.body;
    const client = await prisma.client.findUnique({ where: { id: req.user.clientId } });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: PRICE_IDS[planTier], quantity: 1 }],
      client_reference_id: client.id,
      success_url: `${process.env.APP_URL}/portal/settings/billing?success=true`,
      cancel_url: `${process.env.APP_URL}/portal/settings/billing?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
}

// POST /api/subscriptions/webhook — Stripe webhook (raw body; see server.js)
async function handleWebhook(req, res) {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      config.stripe.webhookSecret
    );
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }

  // TODO: handle checkout.session.completed, invoice.paid,
  // customer.subscription.updated/deleted -> upsert Subscription + Invoice rows.
  switch (event.type) {
    case 'checkout.session.completed':
    default:
      break;
  }

  res.json({ received: true });
}

module.exports = { createCheckoutSession, handleWebhook };
