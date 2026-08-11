const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_FROM_PHONE || 'whatsapp:+14155238886';

let client;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

const sendWhatsAppMessage = async (to, message) => {
  if (!client) {
    console.log(`[DEV] WhatsApp message would be sent to ${to}: ${message}`);
    return;
  }

  try {
    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    await client.messages.create({
      body: message,
      from: fromPhone,
      to: formattedTo
    });
    console.log(`WhatsApp message sent to ${formattedTo}`);
  } catch (error) {
    console.error(`Failed to send WhatsApp message: ${error.message}`);
  }
};

module.exports = {
  sendWhatsAppMessage
};
