const nodemailer = require('nodemailer');
const AppError = require('./appError');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    // service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'Sauce Rep <sauce-repo@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
