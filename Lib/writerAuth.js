import { getServerSession } from "next-auth/next";
import admin from "firebase-admin";
import "../Firebase/Firebase-admin";
import { authOptions } from "./authOptions";

export async function verifyWriterRequest(req, res) {
  const allowedEmail = (process.env.EDITOR_EMAIL || "sughoshpdixit@gmail.com").toLowerCase();

  // 1. Check Firebase Bearer token (used by /dashboard)
  const authHeader = req.headers?.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    const idToken = authHeader.slice(7).trim();
    if (idToken) {
      try {
        const decoded = await admin.auth().verifyIdToken(idToken);
        if (decoded?.email?.toLowerCase() === allowedEmail) {
          return { authorized: true, email: decoded.email };
        }
      } catch (err) {
        console.warn("Firebase token verification failed:", err?.message);
      }
    }
  }

  // 2. Fallback to NextAuth session (used by /writer)
  try {
    const session = await getServerSession(req, res, authOptions);
    if (session?.user?.email?.toLowerCase() === allowedEmail) {
      return { authorized: true, email: session.user.email };
    }
  } catch (err) {
    console.warn("NextAuth session check failed:", err?.message);
  }

  return { authorized: false };
}
