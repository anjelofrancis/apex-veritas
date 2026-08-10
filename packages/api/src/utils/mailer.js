const nodemailer = require('nodemailer');
const config = process.env;

let transport;

if (config.SMTP_HOST && config.SMTP_PORT && config.SMTP_USER && config.SMTP_PASS) {
  transport = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: parseInt(config.SMTP_PORT, 10),
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });
}

function sendContactNotification({ fullName, email, message }) {
  const notifyEmail = config.NOTIFY_EMAIL;
  
  if (!transport) {
    console.log(`[DEV] Email would be sent to ${notifyEmail || 'no-one'}
From: ${fullName} <${email}>
Message:
${message}`);
    return;
  }
  
  if (!notifyEmail) return;

  transport.sendMail({
    from: config.SMTP_USER,
    to: notifyEmail,
    subject: `New Contact Enquiry from ${fullName}`,
    text: `Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`,
  }).catch(err => {
    console.error('Failed to send contact notification email', err);
  });
}

module.exports = { sendContactNotification };
