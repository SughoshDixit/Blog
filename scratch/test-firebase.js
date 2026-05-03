const admin = require("firebase-admin");
require("dotenv").config();

async function testFirebase() {
  console.log("Testing Firebase Admin connection...");
  
  try {
    if (!admin.apps.length) {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY 
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n").replace(/^"(.*)"$/, '$1')
        : undefined;

      admin.initializeApp({
        credential: admin.credential.cert({
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          private_key: privateKey,
          project_id: process.env.FIREBASE_PROJECT_ID,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
    }

    const db = admin.firestore();
    console.log("Checking collection 'newsletter_subscribers'...");
    const snapshot = await db.collection("newsletter_subscribers").limit(1).get();
    console.log("Success! Connection established. Document count in snippet:", snapshot.size);
    process.exit(0);
  } catch (error) {
    console.error("Firebase connection failed:");
    console.error(error);
    process.exit(1);
  }
}

testFirebase();
