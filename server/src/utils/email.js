import nodemailer from 'nodemailer';
import logger from './logger.js';

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
    port: process.env.EMAIL_PORT || 2525,
    auth: {
      user: process.env.EMAIL_USERNAME || 'username',
      pass: process.env.EMAIL_PASSWORD || 'password',
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'MERN Bookstore <noreply@bookstore.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html
  };

  // 3) Actually send the email
  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${options.email}`);
  } catch (error) {
    logger.error(`Error sending email to ${options.email}: ${error.message}`);
    throw error;
  }
};

export default sendEmail;
