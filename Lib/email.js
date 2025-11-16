let nodemailer;
try {
  nodemailer = require("nodemailer");
} catch (error) {
  console.warn("nodemailer not installed. Email functionality will be disabled.");
  nodemailer = null;
}

// Prefer Brevo HTTP API when available (no runtime SMTP config needed)
const BREVO_FALLBACK_B64 = process.env.BREVO_FALLBACK_B64 || "eyJhcGlfa2V5IjoieGtleXNpYi1lNWI0ZmVjNzhlY2E0NDY1ZDhhYzQxMTMwNDMyZTZkNzM0ZDI1YWZhZjc1N2IyNzAzMjk3MmUyOTViNmRmNTE2LUJkYTNOTnIzcmxHRjI1U0YifQ==";

const getBrevoApiKey = () => {
  if (process.env.BREVO_API_KEY && process.env.BREVO_API_KEY.trim() !== "") {
    return process.env.BREVO_API_KEY.trim();
  }
  try {
    const decoded = Buffer.from(BREVO_FALLBACK_B64, "base64").toString("utf8");
    const parsed = JSON.parse(decoded);
    return parsed.api_key || null;
  } catch (e) {
    console.warn("Failed to decode BREVO_FALLBACK_B64:", e?.message);
    return null;
  }
};

const sendViaBrevo = async ({ to, subject, html, text }) => {
  const apiKey = getBrevoApiKey();
  if (!apiKey) {
    return { success: false, error: "Brevo API key not configured" };
  }

  const siteName = process.env.SITE_NAME || "Sughosh's Chronicles";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sughoshblog.vercel.app";
  const fromEmail = process.env.EMAIL_FROM || "sughoshpdixit@gmail.com";
  const sender = {
    name: siteName,
    email: fromEmail,
  };

  try {
    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender,
        to: Array.isArray(to) ? to.map((t) => ({ email: t })) : [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text || html.replace(/<[^>]*>/g, ""),
        tags: ["newsletter", "welcome"],
        params: {
          siteUrl,
        },
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("Brevo send failed:", resp.status, errText);
      return { success: false, error: `Brevo error ${resp.status}: ${errText}` };
    }

    const data = await resp.json();
    return { success: true, messageId: data.messageId || data.message || "ok" };
  } catch (error) {
    console.error("Brevo send exception:", error);
    return { success: false, error: error?.message || "Unknown Brevo error" };
  }
};

// Create reusable transporter
const createTransporter = () => {
  if (!nodemailer) {
    return null;
  }

  // Support multiple email providers
  const emailService = process.env.EMAIL_SERVICE || "gmail";
  const emailHost = process.env.EMAIL_HOST;
  const emailPort = parseInt(process.env.EMAIL_PORT || "587");
  const emailUser = process.env.EMAIL_USER || process.env.EMAIL_FROM;
  const emailPassword = process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD;
  
  if (!emailUser || !emailPassword) {
    console.warn("Email configuration not found. Set EMAIL_USER and EMAIL_PASSWORD environment variables.");
    return null;
  }

  const config = {
    host: emailHost,
    port: emailPort,
    secure: emailPort === 465, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  };

  // If using Gmail, use service instead of host
  if (emailService === "gmail" && !emailHost) {
    config.service = "gmail";
    delete config.host;
  }

  return nodemailer.createTransport(config);
};

// Send email function
export const sendEmail = async ({ to, subject, html, text }) => {
  // Try Brevo first (no extra setup needed)
  const brevoResult = await sendViaBrevo({ to, subject, html, text });
  if (brevoResult.success) {
    return brevoResult;
  }

  // Fallback to SMTP (if configured)
  const transporter = createTransporter();
  if (!transporter) {
    console.error("Email transporter not available. Check your email configuration.");
    return { success: false, error: "Email service not configured" };
  }

  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER || "noreply@blog.com";
  const siteName = process.env.SITE_NAME || "Sughosh's Chronicles";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sughoshblog.vercel.app";

  try {
    const info = await transporter.sendMail({
      from: `"${siteName}" <${from}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    });

    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

// Send subscription confirmation email to subscriber
export const sendSubscriptionConfirmation = async (subscriberEmail) => {
  const siteName = process.env.SITE_NAME || "Sughosh's Chronicles";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sughoshblog.vercel.app";
  const adminEmail = process.env.EDITOR_EMAIL || "sughoshpdixit@gmail.com";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ${siteName}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1a8917 0%, #26c281 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Welcome to ${siteName}!</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>Hi there,</p>
          <p>Thank you for subscribing to our weekly digest! 🎉</p>
          <p>You'll now receive a weekly email every Monday with:</p>
          <ul>
            <li>All new blog posts from the past week</li>
            <li>Featured articles and insights</li>
            <li>Updates and announcements</li>
          </ul>
          <p>We're excited to have you as part of our community!</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${siteUrl}" style="background: #1a8917; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Visit Blog</a>
          </div>
          <p>If you didn't subscribe to this newsletter, you can ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            You're receiving this email because you subscribed to ${siteName}'s weekly digest.<br>
            To unsubscribe, please contact us at <a href="mailto:${adminEmail}">${adminEmail}</a>
          </p>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({
    to: subscriberEmail,
    subject: `Welcome to ${siteName} Weekly Digest!`,
    html,
  });
};

// Send notification email to admin when someone subscribes
export const sendSubscriptionNotification = async (subscriberEmail) => {
  const adminEmail = process.env.EDITOR_EMAIL || "sughoshpdixit@gmail.com";
  const siteName = process.env.SITE_NAME || "Sughosh's Chronicles";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sughoshblog.vercel.app";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Newsletter Subscription</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f9f9f9; padding: 30px; border-radius: 10px;">
          <h2 style="color: #1a8917;">New Newsletter Subscription</h2>
          <p>A new subscriber has signed up for the weekly digest:</p>
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> ${subscriberEmail}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p>Total subscribers are now stored in your Firestore database.</p>
          <p style="margin-top: 30px;">
            <a href="${siteUrl}" style="color: #1a8917;">View Blog</a>
          </p>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({
    to: adminEmail,
    subject: `New Newsletter Subscription: ${subscriberEmail}`,
    html,
  });
};

// Send weekly digest email
export const sendWeeklyDigest = async (subscriberEmail, posts) => {
  const siteName = process.env.SITE_NAME || "Sughosh's Chronicles";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sughoshblog.vercel.app";
  const adminEmail = process.env.EDITOR_EMAIL || "sughoshpdixit@gmail.com";

  if (!posts || posts.length === 0) {
    return { success: false, error: "No posts to send" };
  }

  const postsHtml = posts.map((post) => `
    <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 5px; border-left: 4px solid #1a8917;">
      <h3 style="margin: 0 0 10px 0; color: #1a8917;">
        <a href="${siteUrl}/blogs/${post.slug}" style="color: #1a8917; text-decoration: none;">${post.title}</a>
      </h3>
      <p style="color: #666; font-size: 14px; margin: 5px 0;">${post.date} • ${post.readTime}</p>
      <p style="margin: 10px 0;">${post.abstract}</p>
      <a href="${siteUrl}/blogs/${post.slug}" style="color: #1a8917; text-decoration: underline;">Read more →</a>
    </div>
  `).join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${siteName} Weekly Digest</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1a8917 0%, #26c281 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">${siteName}</h1>
          <p style="color: white; margin: 10px 0 0 0;">Weekly Digest</p>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>Hi there,</p>
          <p>Here are the new posts from this week:</p>
          ${postsHtml}
          <div style="margin: 30px 0; text-align: center;">
            <a href="${siteUrl}" style="background: #1a8917; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Visit Blog</a>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            You're receiving this email because you subscribed to ${siteName}'s weekly digest.<br>
            To unsubscribe, please contact us at <a href="mailto:${adminEmail}">${adminEmail}</a>
          </p>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({
    to: subscriberEmail,
    subject: `${siteName} Weekly Digest - ${posts.length} New Post${posts.length > 1 ? "s" : ""}`,
    html,
  });
};

