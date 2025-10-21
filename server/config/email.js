const nodemailer = require('nodemailer');
require('dotenv').config();

const createTransporter = () => {
  // Use the correct Nodemailer API: createTransport
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendEmail = async (to, subject, html) => {
  try {
    // Check if email configuration is available
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('📧 [LOCALHOST] Email configuration not found. Email would be sent to:', to);
      console.log('📧 [LOCALHOST] Subject:', subject);
      console.log('📧 [LOCALHOST] Content preview:', html.substring(0, 200) + '...');
      console.log('📧 [LOCALHOST] ⚠️  To enable real emails, see EMAIL-SETUP-GUIDE.md');
      return { messageId: 'localhost-preview-' + Date.now() };
    }

    const transporter = createTransporter();
    
    // Test connection first
    await transporter.verify();
    console.log('📧 SMTP connection verified successfully');
    
    const mailOptions = {
      from: `"Komorebi Pizza" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', to);
    console.log('📧 Message ID:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    console.log('📧 [FALLBACK] Email preview for:', to);
    console.log('📧 [FALLBACK] Subject:', subject);
    console.log('📧 [FALLBACK] Content preview:', html.substring(0, 200) + '...');
    console.log('📧 [HELP] Check EMAIL-SETUP-GUIDE.md for troubleshooting');
    
    // Don't throw error in development - just log it
    if (process.env.NODE_ENV === 'development') {
      return { messageId: 'localhost-fallback-' + Date.now() };
    }
    throw error;
  }
};

module.exports = {
  sendEmail,
};
