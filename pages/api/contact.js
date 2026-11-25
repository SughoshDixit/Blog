import { sendEmail } from "../../Lib/email";

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, subject, message, website } = req.body || {};

    // Honeypot anti-spam check
    if (website) {
      return res.status(200).json({ success: true });
    }

    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim();
    const cleanSubject = String(subject || "").trim();
    const cleanMessage = String(message || "").trim();

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ error: "Please enter your name." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (!cleanSubject || cleanSubject.length < 3) {
      return res.status(400).json({ error: "Please enter a subject." });
    }
    if (!cleanMessage || cleanMessage.length < 10) {
      return res.status(400).json({ error: "Message must be at least 10 characters." });
    }

    const adminEmail = process.env.EDITOR_EMAIL || "sughoshpdixit@gmail.com";
    const siteName = process.env.SITE_NAME || "Sughosh's Chronicles";

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #161513; max-width: 640px; margin: 0 auto;">
        <h2 style="color: #C74634; margin-bottom: 12px;">New Contact Form Message</h2>
        <p><strong>From:</strong> ${escapeHtml(cleanName)} (${escapeHtml(cleanEmail)})</p>
        <p><strong>Subject:</strong> ${escapeHtml(cleanSubject)}</p>
        <hr style="border: none; border-top: 1px solid #E0DDD9; margin: 16px 0;" />
        <p style="white-space: pre-wrap;">${escapeHtml(cleanMessage)}</p>
        <hr style="border: none; border-top: 1px solid #E0DDD9; margin: 16px 0;" />
        <p style="font-size: 12px; color: #6E6B68;">Sent via ${escapeHtml(siteName)} contact form.</p>
      </div>
    `;

    const result = await sendEmail({
      to: adminEmail,
      subject: `[Contact] ${cleanSubject} — from ${cleanName}`,
      html,
      text: `From: ${cleanName} (${cleanEmail})\nSubject: ${cleanSubject}\n\n${cleanMessage}`,
    });

    if (!result.success) {
      return res.status(502).json({
        error: "Unable to deliver message right now. Please email sughoshpdixit@gmail.com directly.",
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return res.status(500).json({
      error: "Unexpected error. Please email sughoshpdixit@gmail.com directly.",
    });
  }
}
