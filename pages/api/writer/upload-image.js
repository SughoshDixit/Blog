import fs from "fs";
import path from "path";
import { verifyWriterRequest } from "../../../Lib/writerAuth";
import { commitFileToGitHub, hasGitHubCommitConfig } from "../../../Lib/githubCommit";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authCheck = await verifyWriterRequest(req, res);
  if (!authCheck.authorized) {
    return res.status(401).json({ error: "Unauthorized — admin access required." });
  }

  try {
    const { image, fileName, folder } = req.body || {};

    if (!image || !fileName) {
      return res.status(400).json({ error: "Missing image or fileName" });
    }

    const base64Data = image.replace(/^data:image\/[\w+.-]+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    let imageFolder = folder || "uploads";
    if (!folder && fileName) {
      const match = fileName.match(/^(DS-\d+|BL-\d+)/i);
      if (match) imageFolder = match[1];
    }

    imageFolder = imageFolder.replace(/[^a-zA-Z0-9-_]/g, "-");
    const publicDir = path.join(process.cwd(), "public", imageFolder);

    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "-");
    const imageFileName = `${timestamp}-${sanitizedFileName}`;
    const imagePath = path.join(publicDir, imageFileName);

    const repoPath = `public/${imageFolder}/${imageFileName}`;
    const publicUrl = `/${imageFolder}/${imageFileName}`;

    if (process.env.VERCEL && hasGitHubCommitConfig()) {
      const gh = await commitFileToGitHub({
        repoPath,
        contentBase64: base64Data,
        message: `Writer Studio: Upload image ${imageFileName}`,
      });
      if (gh.committed) {
        return res.status(200).json({
          success: true,
          committedToGitHub: true,
          commitUrl: gh.commitUrl,
          url: publicUrl,
          message: `Image committed to GitHub (${repoPath}).`,
        });
      }
    }

    try {
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      fs.writeFileSync(imagePath, buffer);
      return res.status(200).json({
        success: true,
        url: publicUrl,
        message: "Image uploaded to public folder.",
      });
    } catch (fsErr) {
      if (fsErr?.code === "EROFS" || fsErr?.code === "EACCES" || fsErr?.code === "ENOENT") {
        if (hasGitHubCommitConfig()) {
          const gh = await commitFileToGitHub({
            repoPath,
            contentBase64: base64Data,
            message: `Writer Studio: Upload image ${imageFileName}`,
          });
          if (gh.committed) {
            return res.status(200).json({
              success: true,
              committedToGitHub: true,
              commitUrl: gh.commitUrl,
              url: publicUrl,
              message: `Image committed to GitHub (${repoPath}).`,
            });
          }
        }
        // Fallback on read-only Vercel filesystem so live preview still works
        return res.status(200).json({
          success: true,
          url: image,
          readOnlyEnv: true,
          message: "Image attached for live preview (set GITHUB_TOKEN or upload to /public in repo before publishing).",
        });
      }
      throw fsErr;
    }
  } catch (error) {
    console.error("Error uploading image", error);
    return res.status(500).json({ error: "Failed to upload image." });
  }
}
