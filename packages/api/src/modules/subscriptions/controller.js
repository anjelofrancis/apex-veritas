const crypto = require('crypto');
const prisma = require('../../config/db');
const config = require('../../config');

const PAYSTACK_PLAN_CODES = {
  STARTER: process.env.PAYSTACK_PLAN_STARTER,
  PROFESSIONAL: process.env.PAYSTACK_PLAN_PROFESSIONAL,
  ENTERPRISE: process.env.PAYSTACK_PLAN_ENTERPRISE,
};

// POST /api/subscriptions/checkout-session — { planTier }
async function createCheckoutSession(req, res, next) {
  try {
    const { planTier } = req.body;
    const client = await prisma.client.findUnique({ where: { id: req.user.clientId } });

    // Initialize Paystack transaction for a subscription
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.paystack.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: client.email || req.user.email || 'billing@example.com',
        amount: 10000, // Dummy amount for initialize, actual amount is defined by the plan
        plan: PAYSTACK_PLAN_CODES[planTier],
        reference: `SUB_${client.id}_${Date.now()}`,
        callback_url: `${process.env.APP_URL}/portal/settings/billing?success=true`,
        metadata: {
          client_id: client.id,
          plan_tier: planTier,
        }
      })
    });

    const data = await response.json();
    
    if (!data.status) {
      return res.status(400).json({ error: data.message || 'Subscription initialization failed' });
    }

    res.json({ url: data.data.authorization_url });
  } catch (err) {
    next(err);
  }
}

// POST /api/subscriptions/webhook — Paystack webhook
async function handleWebhook(req, res) {
  try {
    // Validate Paystack signature
    const hash = crypto.createHmac('sha512', config.paystack.secretKey)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).send('Webhook signature verification failed');
    }

    const event = req.body;

    // TODO: handle charge.success, subscription.create, invoice.create
    // -> upsert Subscription + Invoice rows.
    switch (event.event) {
      case 'charge.success':
      default:
        break;
    }

    res.json({ received: true });
  } catch (err) {
    return res.status(500).send(`Webhook error: ${err.message}`);
  }
}

module.exports = { createCheckoutSession, handleWebhook };
