const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

// Create a transporter using SMTP or other transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com', // Use Gmail for development
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Template directory
const templateDir = path.join(__dirname, '../email-templates');

// Load email template
const loadTemplate = async (templateName, data) => {
  try {
    const templatePath = path.join(templateDir, `${templateName}.ejs`);
    const template = await fs.promises.readFile(templatePath, 'utf-8');
    return ejs.render(template, data);
  } catch (error) {
    console.error('Error loading email template:', error);
    throw new Error('Failed to load email template');
  }
};

// Send email function
const sendEmail = async (to, subject, templateName, data = {}) => {
  try {
    // Add common data to all emails
    const emailData = {
      ...data,
      appName: process.env.APP_NAME || 'Komorebi Pizza',
      appUrl: process.env.CLIENT_URL || 'http://localhost:3000',
      currentYear: new Date().getFullYear(),
    };

    // Load and render the email template
    const html = await loadTemplate(templateName, emailData);

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Komorebi Pizza'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

// Specific email functions
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  
  await sendEmail(
    user.email,
    'Password Reset Request',
    'password-reset',
    {
      name: user.name,
      resetUrl,
      expiresIn: '1 hour', // Should match token expiration
    }
  );
};

const sendPasswordResetByAdminEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  
  await sendEmail(
    user.email,
    'Your Password Has Been Reset by an Administrator',
    'password-reset-by-admin',
    {
      name: user.name,
      resetUrl,
      expiresIn: '10 minutes',
    }
  );
};

const sendOrderConfirmationEmail = async (user, order) => {
  await sendEmail(
    user.email,
    `Order Confirmation - #${order.id}`,
    'order-confirmation',
    {
      name: user.name,
      orderNumber: order.id,
      orderDate: new Date(order.createdAt).toLocaleDateString(),
      orderTotal: order.totalPrice,
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
      })),
    }
  );
};

const sendBulkMarketingEmail = async (recipientEmails, subject, content) => {
  if (!recipientEmails || recipientEmails.length === 0) {
    throw new Error('No recipients provided for bulk email.');
  }

  try {
    // Send one email to yourself (or a dedicated address) and BCC all recipients
    // This is more efficient and private than sending individual emails.
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Komorebi Pizza'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: process.env.EMAIL_FROM || process.env.SMTP_USER, // The 'to' field is required, send to self
      bcc: recipientEmails,
      subject,
      html: content, // Assuming content is HTML
    });

    console.log('Bulk marketing email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending bulk marketing email:', error);
    throw new Error('Failed to send bulk marketing email');
  }
};

const sendNewsletter = async (subscribers, subject, content) => {
  const results = [];
  
  for (const subscriber of subscribers) {
    try {
      const result = await sendEmail(
        subscriber.email,
        subject,
        'newsletter',
        {
          name: subscriber.name || 'Valued Customer',
          content,
          unsubscribeUrl: `${process.env.CLIENT_URL}/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${subscriber.unsubscribeToken}`,
        }
      );
      results.push({ email: subscriber.email, success: true, messageId: result.messageId });
    } catch (error) {
      console.error(`Failed to send to ${subscriber.email}:`, error);
      results.push({ email: subscriber.email, success: false, error: error.message });
    }
  }
  
  return results;
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendPasswordResetByAdminEmail,
  sendOrderConfirmationEmail,
  sendNewsletter,
  sendBulkMarketingEmail,
};
