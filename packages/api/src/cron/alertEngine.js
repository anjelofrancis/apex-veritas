const cron = require('node-cron');
const prisma = require('../../config/db');
const logger = require('../utils/logger');
const { sendContactNotification } = require('../utils/mailer');
const { sendWhatsAppMessage } = require('../utils/whatsapp');

// Run every day at 08:00 AM
cron.schedule('0 8 * * *', async () => {
  logger.info('Running daily Alert Engine cron job...');

  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    // 1. Expiring Documents
    const expiringDocuments = await prisma.document.findMany({
      where: {
        expiryDate: {
          not: null,
          lte: thirtyDaysFromNow,
          gte: today,
        },
      },
      include: {
        uploadedBy: true,
      },
    });

    for (const doc of expiringDocuments) {
      const message = `Alert: Document "${doc.title}" is expiring on ${doc.expiryDate.toLocaleDateString()}. Please renew it.`;
      
      // We would normally lookup user preferences or phone numbers here.
      // Using mock values or falling back to email for demonstration.
      sendContactNotification({ 
        fullName: doc.uploadedBy.firstName, 
        email: doc.uploadedBy.email, 
        message: message 
      });
      
      // WhatsApp notification
      sendWhatsAppMessage('+15555555555', message);
    }

    // 2. Overdue CAPA Actions
    const overdueCapas = await prisma.capaAction.findMany({
      where: {
        dueDate: {
          not: null,
          lt: today,
        },
        status: {
          in: ['open', 'in_progress'],
        },
      },
    });

    for (const capa of overdueCapas) {
      const message = `Alert: Corrective Action "${capa.description.substring(0, 30)}..." was due on ${capa.dueDate.toLocaleDateString()} and is currently overdue.`;
      
      // Since CAPA might not have an owner explicitly assigned in our simple seed,
      // we could alert the client admin. For now, sending a general alert.
      logger.info(message);
    }

    logger.info(`Alert Engine completed. Processed ${expiringDocuments.length} expiring documents and ${overdueCapas.length} overdue CAPAs.`);
  } catch (error) {
    logger.error('Error running Alert Engine:', error);
  }
});
