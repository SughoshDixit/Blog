import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      project_id: process.env.FIREBASE_PROJECT_ID,
    }),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { title, body, url, adminKey } = req.body;
  if (adminKey !== process.env.ADMIN_NOTIFICATION_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const snap = await db.collection("fcm_tokens").get();
    const tokens = snap.docs.map((d) => d.data().token).filter(Boolean);

    if (!tokens.length) return res.status(200).json({ sent: 0, message: "No subscribers" });

    const message = {
      notification: {
        title: title || "New post on SughoshDixit.com",
        body: body || "A new article has been published!",
      },
      data: { url: url || "/" },
    };

    let sent = 0;
    let failed = 0;
    const staleTokens = [];

    await Promise.all(
      tokens.map(async (token) => {
        try {
          await admin.messaging().send({ ...message, token });
          sent++;
        } catch (err) {
          failed++;
          if (
            err.code === "messaging/registration-token-not-registered" ||
            err.code === "messaging/invalid-registration-token"
          ) {
            staleTokens.push(token);
          }
        }
      })
    );

    if (staleTokens.length) {
      const staleSnap = await db.collection("fcm_tokens").where("token", "in", staleTokens.slice(0, 10)).get();
      await Promise.all(staleSnap.docs.map((d) => d.ref.delete()));
    }

    res.status(200).json({ sent, failed, staleRemoved: staleTokens.length });
  } catch (error) {
    console.error("Notification send error:", error);
    res.status(500).json({ message: "Failed to send notifications" });
  }
}
