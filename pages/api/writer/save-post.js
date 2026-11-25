import fs from "fs";
import path from "path";
import { verifyWriterRequest } from "../../../Lib/writerAuth";

const CONTENT_DIR = path.join(process.cwd(), "_content");

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9-_]/g, "-");
}

function escapeFrontMatterValue(value) {
  if (typeof value !== "string") return "";
  return value.replace(/"/g, '\\"');
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authCheck = await verifyWriterRequest(req, res);
  if (!authCheck.authorized) {
    return res.status(401).json({ error: "Unauthorized — admin access required." });
  }

  const {
    fileName,
    id,
    title,
    author,
    date,
    tags,
    topic,
    abstract,
    headerImage,
    isPublished,
    unlisted,
    prominentShelf,
    body,
  } = req.body || {};

  if (!fileName || !id || !title || !author || !abstract || !body) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const safeFileName = sanitizeFileName(fileName.replace(/\.md$/i, ""));
  const fullPath = path.join(CONTENT_DIR, `${safeFileName}.md`);

  const frontMatter = [
    "---",
    `Id: ${escapeFrontMatterValue(String(id))}`,
    `Title: "${escapeFrontMatterValue(title)}"`,
    `Author: ${escapeFrontMatterValue(author)}`,
    `Date: "${escapeFrontMatterValue(date || new Date().toISOString().split("T")[0])}"`,
    `Tags: ${escapeFrontMatterValue(tags || "")}`,
    `Topic: ${escapeFrontMatterValue(topic || "")}`,
    `Abstract: "${escapeFrontMatterValue(abstract)}"`,
    `HeaderImage: ${escapeFrontMatterValue(headerImage || "")}`,
    `isPublished: ${Boolean(isPublished)}`,
    `prominentShelf: ${prominentShelf !== false}`,
    `unlisted: ${Boolean(unlisted)}`,
    "---",
    "",
  ].join("\n");

  const fileContent = `${frontMatter}${body}\n`;

  try {
    fs.writeFileSync(fullPath, fileContent, "utf8");
    return res.status(200).json({
      savedLocally: true,
      fileName: `${safeFileName}.md`,
      markdown: fileContent,
      message: `Saved to _content/${safeFileName}.md`,
    });
  } catch (error) {
    // Production serverless environments (e.g. Vercel) have a read-only filesystem
    if (error?.code === "EROFS" || error?.code === "EACCES" || error?.code === "ENOENT") {
      return res.status(200).json({
        savedLocally: false,
        readOnlyEnv: true,
        fileName: `${safeFileName}.md`,
        markdown: fileContent,
        message: "Production filesystem is read-only. Use Download .md or Copy Markdown to commit this post to GitHub.",
      });
    }
    console.error("Error saving post", error);
    return res.status(500).json({ error: "Failed to save the post." });
  }
}
