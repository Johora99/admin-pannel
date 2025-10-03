const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Failed:", error);
  } else {
    console.log("SMTP Ready ✅");
  }
});

async function sendConfirmationEmail(to, link) {
  try {
    const info = await transporter.sendMail({
      from: `"My Project" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Confirm your account',
      html: `
        <h2>Welcome!</h2>
        <p>Click the button below to confirm your account:</p>
        <a href="${link}" style="display:inline-block;padding:10px 20px;background:#4CAF50;color:white;text-decoration:none;border-radius:4px;">Confirm Email</a>
        <p>If the button doesn’t work, copy this URL into your browser:</p>
        <p>${link}</p>
      `,
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email sending error:", error);
  }
}

module.exports = { sendConfirmationEmail, transporter };
