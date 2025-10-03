const { Resend } = require('resend'); // CommonJS require

const resend = new Resend('re_QigmN6Qn_BizgF1hCMHtHm1fzrZickR1h'); // your API key

async function sendConfirmationEmail(to, link) {
  try {
    const data = await resend.emails.send({
      from: 'My Project <no-reply@no-replya.com>', // ✅ valid verified email
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

    console.log("✅ Email sent:", data);
  } catch (error) {
    console.error("❌ Email sending error:", error);
  }
}

// Export function using CommonJS
// module.exports = { sendConfirmationEmail };
