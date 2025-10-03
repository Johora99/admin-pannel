const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use true for port 465
  auth: {
    user: "pinku.roza09@gmail.com",      // your Gmail
    pass: "sknnkbdaqiydyrql",            // your Gmail App Password (16 chars)
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Connection Failed:", error);
  } else {
    console.log("✅ SMTP Ready");
  }
});

async function sendConfirmationEmail(to, link) {
  try {
    const info = await transporter.sendMail({
      from: `"My Project" <pinku.roza09@gmail.com>`,  // must match auth.user
      to,
      subject: "Confirm your account",
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
