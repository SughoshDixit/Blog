import fs from "fs";
import path from "path";
import { verifyWriterRequest } from "../../../Lib/writerAuth";
import { commitFileToGitHub, hasGitHubCommitConfig } from "../../../Lib/githubCommit";

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
    updatedDate,
    tags,
    topic,
    abstract,
    contextNote,
    headerImage,
    isPublished,
    unlisted,
    prominentShelf,
    commitToGitHub,
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
    ...(updatedDate ? [`UpdatedDate: "${escapeFrontMatterValue(updatedDate)}"`] : []),
    `Tags: ${escapeFrontMatterValue(tags || "")}`,
    `Topic: ${escapeFrontMatterValue(topic || "")}`,
    `Abstract: "${escapeFrontMatterValue(abstract)}"`,
    ...(contextNote ? [`ContextNote: "${escapeFrontMatterValue(contextNote)}"`] : []),
    `HeaderImage: ${escapeFrontMatterValue(headerImage || "")}`,
    `isPublished: ${Boolean(isPublished)}`,
    `prominentShelf: ${prominentShelf !== false}`,
    `unlisted: ${Boolean(unlisted)}`,
    "---",
    "",
  ].join("\n");

  const fileContent = `${frontMatter}${body}\n`;
  const commitTitle = String(title || safeFileName).trim();

  async function attemptGitHubCommit(savedLocally) {
    const gh = await commitFileToGitHub({
      repoPath: `_content/${safeFileName}.md`,
      contentBase64: Buffer.from(fileContent, "utf8").toString("base64"),
      message: `Writer Studio: ${commitTitle} (${safeFileName}.md)`,
    });
    if (!gh.committed) return null;
    return {
      savedLocally,
      committedToGitHub: true,
      commitUrl: gh.commitUrl,
      branch: gh.branch,
      fileName: `${safeFileName}.md`,
      markdown: fileContent,
      message: savedLocally
        ? `Saved locally to _content/${safeFileName}.md and committed to GitHub (${gh.branch}).`
        : `Committed _content/${safeFileName}.md to GitHub (${gh.branch}). Vercel deployment will update shortly.`,
    };
  }

  if (process.env.VERCEL && hasGitHubCommitConfig()) {
    try {
      const ghPayload = await attemptGitHubCommit(false);
      if (ghPayload) return res.status(200).json(ghPayload);
    } catch (ghErr) {
      return res.status(500).json({ error: ghErr.message || "GitHub commit failed." });
    }
  }

  try {
    fs.writeFileSync(fullPath, fileContent, "utf8");

    if (Boolean(commitToGitHub) && hasGitHubCommitConfig()) {
      try {
        const ghPayload = await attemptGitHubCommit(true);
        if (ghPayload) return res.status(200).json(ghPayload);
      } catch (ghErr) {
        return res.status(200).json({
          savedLocally: true,
          committedToGitHub: false,
          fileName: `${safeFileName}.md`,
          markdown: fileContent,
          message: `Saved locally to _content/${safeFileName}.md (GitHub commit failed: ${ghErr.message}).`,
        });
      }
    }

    return res.status(200).json({
      savedLocally: true,
      fileName: `${safeFileName}.md`,
      markdown: fileContent,
      message: `Saved to _content/${safeFileName}.md`,
    });
  } catch (error) {
    // Production serverless environments (e.g. Vercel) have a read-only filesystem
    if (error?.code === "EROFS" || error?.code === "EACCES" || error?.code === "ENOENT") {
      if (hasGitHubCommitConfig()) {
        try {
          const ghPayload = await attemptGitHubCommit(false);
          if (ghPayload) return res.status(200).json(ghPayload);
        } catch (ghErr) {
          return res.status(500).json({ error: ghErr.message || "GitHub commit failed." });
        }
      }

      return res.status(200).json({
        savedLocally: false,
        readOnlyEnv: true,
        fileName: `${safeFileName}.md`,
        markdown: fileContent,
        message: "Production filesystem is read-only. Set GITHUB_TOKEN in Vercel or use Download .md / Copy Markdown.",
      });
    }
    console.error("Error saving post", error);
    return res.status(500).json({ error: "Failed to save the post." });
  }
}
