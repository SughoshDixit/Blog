import { verifyWriterRequest } from "../../../Lib/writerAuth";

function stripMarkdownForCheck(md) {
  return String(md || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function computeReadability(text) {
  const clean = stripMarkdownForCheck(text);
  const words = clean ? clean.split(/\s+/).filter(Boolean) : [];
  const sentences = clean
    ? clean.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean)
    : [];
  const avgWordsPerSentence = sentences.length
    ? Math.round((words.length / sentences.length) * 10) / 10
    : 0;
  const longSentences = sentences.filter((s) => s.split(/\s+/).length > 28).length;

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    avgWordsPerSentence,
    longSentences,
    readingMinutes: Math.max(1, Math.ceil(words.length / 220)),
  };
}

async function checkWithLanguageTool(text) {
  const plain = stripMarkdownForCheck(text).slice(0, 12000);
  if (!plain) return [];

  const params = new URLSearchParams();
  params.set("text", plain);
  params.set("language", "en-US");
  params.set("enabledOnly", "false");

  const resp = await fetch("https://api.languagetool.org/v2/check", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!resp.ok) {
    throw new Error(`LanguageTool returned ${resp.status}`);
  }

  const data = await resp.json();
  return (data.matches || []).slice(0, 25).map((m, idx) => ({
    id: `${m.offset}-${idx}`,
    message: m.message,
    shortMessage: m.shortMessage || m.rule?.category?.name || "Suggestion",
    category: m.rule?.category?.name || "Style",
    context: m.context?.text || "",
    matchedText: m.context?.text
      ? m.context.text.slice(m.context.offset, m.context.offset + m.context.length)
      : "",
    replacements: (m.replacements || []).slice(0, 4).map((r) => r.value),
  }));
}

async function callGeminiIfConfigured(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const models = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-flash-latest",
    "gemini-2.5-pro",
  ];
  let lastError = null;

  for (const model of models) {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 1200 },
        }),
      }
    );

    if (resp.ok) {
      const json = await resp.json();
      return json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    const errText = await resp.text().catch(() => "");
    lastError = new Error(`Gemini API error ${resp.status}${errText ? `: ${errText.slice(0, 120)}` : ""}`);
    // Retry next model on transient capacity/rate/404 errors
    if (![404, 429, 500, 502, 503, 504].includes(resp.status)) {
      throw lastError;
    }
  }

  throw lastError || new Error("Gemini API error");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authCheck = await verifyWriterRequest(req, res);
  if (!authCheck.authorized) {
    return res.status(401).json({ error: "Unauthorized — admin access required." });
  }

  const { action = "grammar", title = "", body = "", selection = "" } = req.body || {};
  const targetText = (selection || body || "").trim();

  if (!targetText && action !== "titles") {
    return res.status(400).json({ error: "Write some content first to analyze." });
  }

  try {
    const readability = computeReadability(body || targetText);

    if (action === "grammar") {
      const matches = await checkWithLanguageTool(targetText);
      return res.status(200).json({
        action,
        readability,
        matches,
        provider: "LanguageTool",
      });
    }

    if (action === "titles") {
      const aiText = await callGeminiIfConfigured(
        `You are an editor for Sughosh Dixit's long-form blog (data science, essays, India, football, business). Based on this draft, suggest 4 compelling article titles and a crisp 2-sentence meta abstract.\n\nCurrent title: ${title}\n\nDraft excerpt:\n${stripMarkdownForCheck(body).slice(0, 2500)}`
      );

      if (aiText) {
        return res.status(200).json({ action, readability, suggestion: aiText, provider: "Gemini" });
      }

      // Heuristic fallback when GEMINI_API_KEY is not set
      const headings = (body.match(/^#{1,3}\s+(.+)$/gm) || []).map((h) => h.replace(/^#+\s+/, ""));
      const firstPara = stripMarkdownForCheck(body).split(/(?<=[.!?])\s+/).slice(0, 2).join(" ");
      return res.status(200).json({
        action,
        readability,
        provider: "Built-in",
        needsAiKey: true,
        suggestion: [
          headings.length
            ? `Key sections found: ${headings.slice(0, 4).join(" · ")}`
            : "Add a ## heading to structure your piece.",
          firstPara
            ? `Suggested abstract from opening:\n${firstPara}`
            : "",
        ]
          .filter(Boolean)
          .join("\n\n"),
      });
    }

    if (action === "polish" || action === "continue") {
      const instruction =
        action === "polish"
          ? "Improve clarity, flow, and grammar while keeping the author's authentic voice. Return only the improved markdown text."
          : "Write the next 1-2 natural paragraphs continuing this essay in the same tone and style. Return only markdown.";

      const aiText = await callGeminiIfConfigured(
        `${instruction}\n\nTitle: ${title}\n\nText:\n${targetText.slice(-3000)}`
      );

      if (aiText) {
        return res.status(200).json({ action, readability, suggestion: aiText, provider: "Gemini" });
      }

      return res.status(200).json({
        action,
        readability,
        provider: "Built-in",
        needsAiKey: true,
        suggestion:
          "Generative AI rewrites & continuation require GEMINI_API_KEY in your environment variables. Meanwhile, use 'Check Grammar & Style' above for free LanguageTool grammar, spelling, and clarity fixes (and Grammarly browser extension works directly in the editor).",
      });
    }

    return res.status(400).json({ error: "Unsupported action" });
  } catch (err) {
    console.error("Writer assist error:", err);
    return res.status(500).json({ error: err?.message || "Writing assistant failed." });
  }
}
