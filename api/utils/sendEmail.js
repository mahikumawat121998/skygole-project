const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Fast OTP Service" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
