import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../Lib/authOptions";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      project_id: process.env.FIREBASE_PROJECT_ID,
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
  });
}

export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

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

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    let imageFolder = folder || "uploads";
    if (!folder && fileName) {
      const match = fileName.match(/^(DS-\d+|BL-\d+)/);
      if (match) imageFolder = match[1];
    }
    imageFolder = imageFolder.replace(/[^a-zA-Z0-9-_]/g, "-");

    const ext = fileName.split(".").pop() || "png";
    const timestamp = Date.now();
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, "-");
    const storagePath = `blog-images/${imageFolder}/${timestamp}-${sanitizedName}`;

    const bucket = admin.storage().bucket();
    const file = bucket.file(storagePath);

    await file.save(buffer, {
      metadata: {
        contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
        cacheControl: "public, max-age=31536000",
      },
    });

    await file.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

    return res.status(200).json({
      success: true,
      url: publicUrl,
      message: "Image uploaded to Firebase Storage",
    });
  } catch (error) {
    console.error("Error uploading image", error);
    return res.status(500).json({ error: "Failed to upload image." });
  }
}
