import { sendEmail } from "../../Lib/email";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { to, title, abstract, images = [], takeaways = [], note } = req.body || {};

    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(to))) {
      return res.status(400).json({ error: "Valid 'to' email is required" });
    }

    const siteName = process.env.SITE_NAME || "Sughosh's Chronicles";

    const imagesHtml = images
      .slice(0, 8)
      .map((src, i) => `<div style="margin: 12px 0;"><img src="${src}" alt="Chart ${i + 1}" style="max-width:100%; border-radius:8px;" /></div>`) // eslint-disable-line
      .join("");

    const takeawaysHtml = takeaways.length
      ? `<ol>${takeaways.map((t) => `<li>${escapeHtml(String(t))}</li>`).join("")}</ol>`
      : "";

    const noteHtml = note ? `<p style="font-style:italic; color:#374151;">${escapeHtml(String(note))}</p>` : "";

    const html = `
      <div style="font-family:Arial, sans-serif; line-height:1.5; color:#111827; max-width:640px; margin:0 auto;">
        <h1 style="margin:0 0 8px 0; font-size:22px;">${escapeHtml(String(title || "Summary"))}</h1>
        ${abstract ? `<p style="color:#374151;">${escapeHtml(String(abstract))}</p>` : ""}
        ${imagesHtml}
        ${takeawaysHtml ? `<h3 style=\"margin-top:16px\">Key Takeaways</h3>${takeawaysHtml}` : ""}
        ${noteHtml}
        <p style="margin-top: 20px; font-size:12px; color:#6b7280;">Sent from ${siteName}</p>
      </div>
    `;

    const result = await sendEmail({ to, subject: `${siteName} • ${title || "Summary"}`, html });
    if (!result.success) {
      return res.status(500).json({ error: result.error || "Failed to send" });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Unknown error" });
  }
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
