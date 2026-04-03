import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../Lib/authOptions";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  const allowedEmail = (process.env.EDITOR_EMAIL || "sughoshpdixit@gmail.com").toLowerCase();

  if (!session || session?.user?.email?.toLowerCase() !== allowedEmail) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { image, fileName, folder } = req.body;

    if (!image || !fileName) {
      return res.status(400).json({ error: "Missing image or fileName" });
    }

    // Extract base64 data
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Determine folder based on provided folder or extract from fileName
    let imageFolder = folder || "uploads";
    
    // If folder is not provided, try to extract from fileName (for blog post file names like "DS-12")
    if (!folder && fileName) {
      // Check if fileName looks like a blog post identifier (e.g., "DS-12")
      const match = fileName.match(/^(DS-\d+)/);
      if (match) {
        imageFolder = match[1];
      }
    }
    
    // Sanitize folder name
    imageFolder = imageFolder.replace(/[^a-zA-Z0-9-_]/g, "-");

    // Create public directory path
    const publicDir = path.join(process.cwd(), "public", imageFolder);
    
    // Ensure directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "-");
    const imageFileName = `${timestamp}-${sanitizedFileName}`;
    const imagePath = path.join(publicDir, imageFileName);

    // Write file
    fs.writeFileSync(imagePath, buffer);

    // Return public URL
    const publicUrl = `/${imageFolder}/${imageFileName}`;

    return res.status(200).json({
      success: true,
      url: publicUrl,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading image", error);
    return res.status(500).json({ error: "Failed to upload image." });
  }
}

