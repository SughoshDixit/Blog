import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { verifyWriterRequest } from "../../../Lib/writerAuth";
import { listRepoDirectory, readRepoFile } from "../../../Lib/githubCommit";

function sanitizeMarkdownFileName(name) {
  const base = path.basename(String(name || "").trim());
  const withExt = base.toLowerCase().endsWith(".md") ? base : `${base}.md`;
  if (!/^[A-Za-z0-9._-]+\.md$/.test(withExt)) {
    return null;
  }
  return withExt;
}

function serializeFrontmatter(data = {}) {
  const normalizeDate = (val) => {
    if (!val) return "";
    if (val instanceof Date && !Number.isNaN(val.getTime())) {
      return val.toISOString().slice(0, 10);
    }
    return String(val);
  };

  return {
    Id: data.Id != null ? String(data.Id) : "",
    Title: data.Title || "",
    Author: data.Author || "Sughosh Dixit",
    Tags: data.Tags || "",
    Topic: data.Topic || "",
    Abstract: data.Abstract || "",
    HeaderImage: data.HeaderImage || "",
    Date: normalizeDate(data.Date),
    UpdatedDate: normalizeDate(data.UpdatedDate),
    ContextNote: data.ContextNote || "",
    isPublished: Boolean(data.isPublished),
    prominentShelf: data.prominentShelf !== false,
    unlisted: Boolean(data.unlisted ?? data.isUnlisted),
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const auth = await verifyWriterRequest(req, res);
  if (!auth.authorized) {
    return res.status(401).json({ error: auth.reason || "Unauthorized" });
  }

  const contentDir = path.join(process.cwd(), "_content");
  const requestedFile = req.query?.file;

  if (requestedFile) {
    const safeFile = sanitizeMarkdownFileName(requestedFile);
    if (!safeFile) {
      return res.status(400).json({ error: "Invalid post filename." });
    }

    try {
      const fullPath = path.join(contentDir, safeFile);
      let raw = null;
      let source = "local";

      if (fs.existsSync(fullPath)) {
        raw = fs.readFileSync(fullPath, "utf8");
      } else {
        const remote = await readRepoFile(`_content/${safeFile}`);
        if (remote) {
          raw = remote.content;
          source = "github";
        }
      }

      if (raw === null) {
        return res.status(404).json({ error: `Post not found: ${safeFile}` });
      }

      const parsed = matter(raw);
      return res.status(200).json({
        source,
        fileName: safeFile.replace(/\.md$/i, ""),
        fullFileName: safeFile,
        data: serializeFrontmatter(parsed.data),
        content: parsed.content || "",
      });
    } catch (err) {
      console.error("Failed to read writer post:", err);
      return res.status(500).json({ error: err.message || "Failed to load post." });
    }
  }

  try {
    if (fs.existsSync(contentDir)) {
      const entries = fs.readdirSync(contentDir).filter((f) => f.endsWith(".md"));
      const posts = entries.map((fullFileName) => {
        const raw = fs.readFileSync(path.join(contentDir, fullFileName), "utf8");
        const parsed = matter(raw);
        const fm = serializeFrontmatter(parsed.data);
        return {
          fileName: fullFileName.replace(/\.md$/i, ""),
          fullFileName,
          title: fm.Title || fullFileName.replace(/\.md$/i, ""),
          date: fm.Date,
          topic: fm.Topic,
          isPublished: fm.isPublished,
        };
      });

      posts.sort((a, b) => {
        if (a.isPublished !== b.isPublished) return a.isPublished ? 1 : -1;
        return String(b.date || "").localeCompare(String(a.date || "")) ||
          a.fullFileName.localeCompare(b.fullFileName);
      });

      return res.status(200).json({ source: "local", posts });
    }

    const remoteFiles = await listRepoDirectory("_content");
    const posts = remoteFiles
      .filter((item) => item?.type === "file" && item?.name?.endsWith(".md"))
      .map((item) => ({
        fileName: item.name.replace(/\.md$/i, ""),
        fullFileName: item.name,
        title: item.name.replace(/\.md$/i, ""),
        date: "",
        topic: "",
        isPublished: true,
      }))
      .sort((a, b) => a.fullFileName.localeCompare(b.fullFileName));

    return res.status(200).json({ source: "github", posts });
  } catch (err) {
    console.error("Failed to list writer posts:", err);
    return res.status(500).json({ error: err.message || "Failed to list posts." });
  }
}
