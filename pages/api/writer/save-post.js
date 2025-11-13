import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../Lib/authOptions";
import fs from "fs";
import path from "path";

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

  const session = await getServerSession(req, res, authOptions);
  const allowedEmail = (process.env.EDITOR_EMAIL || "sughoshpdixit@gmail.com").toLowerCase();

  if (!session || session?.user?.email?.toLowerCase() !== allowedEmail) {
    return res.status(401).json({ error: "Unauthorized" });
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
    body,
  } = req.body || {};

  if (!fileName || !id || !title || !author || !abstract || !body) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const safeFileName = sanitizeFileName(fileName.replace(/\.md$/i, ""));
    const fullPath = path.join(CONTENT_DIR, `${safeFileName}.md`);

    const frontMatter = [
      "---",
      `Id: ${escapeFrontMatterValue(String(id))}`,
      `Title: \"${escapeFrontMatterValue(title)}\"`,
      `Author: ${escapeFrontMatterValue(author)}`,
      `Date: \"${escapeFrontMatterValue(date || new Date().toISOString().split('T')[0])}\"`,
      `Tags: ${escapeFrontMatterValue(tags || "")}`,
      `Topic: ${escapeFrontMatterValue(topic || "")}`,
      `Abstract: \"${escapeFrontMatterValue(abstract)}\"`,
      `HeaderImage: ${escapeFrontMatterValue(headerImage || "")}`,
      `isPublished: ${Boolean(isPublished)}`,
      "---",
      "",
    ].join("\n");

    const fileContent = `${frontMatter}${body}\n`;

    fs.writeFileSync(fullPath, fileContent, "utf8");

    return res.status(200).json({
      message: `Saved to ${safeFileName}.md`,
      path: fullPath,
    });
  } catch (error) {
    console.error("Error saving post", error);
    return res.status(500).json({ error: "Failed to save the post." });
  }
}
