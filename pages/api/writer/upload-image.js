import fs from "fs";
import path from "path";
import { verifyWriterRequest } from "../../../Lib/writerAuth";

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

    try {
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      fs.writeFileSync(imagePath, buffer);
      return res.status(200).json({
        success: true,
        url: `/${imageFolder}/${imageFileName}`,
        message: "Image uploaded to public folder.",
      });
    } catch (fsErr) {
      if (fsErr?.code === "EROFS" || fsErr?.code === "EACCES") {
        // Fallback on read-only Vercel filesystem so live preview still works
        return res.status(200).json({
          success: true,
          url: image,
          readOnlyEnv: true,
          message: "Image attached for live preview (upload to /public in repo before publishing).",
        });
      }
      throw fsErr;
    }
  } catch (error) {
    console.error("Error uploading image", error);
    return res.status(500).json({ error: "Failed to upload image." });
  }
}
