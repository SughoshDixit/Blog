import db from "../../../Firebase/Firebase-admin";
import { sendSubscriptionConfirmation, sendSubscriptionNotification } from "../../../Lib/email";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address" });
  }

  try {
    const emailLower = email.toLowerCase().trim();
    const subscribersRef = db.collection("newsletter_subscribers");
    
    // Check if email already exists
    const existing = await subscribersRef.where("email", "==", emailLower).get();
    
    if (!existing.empty) {
      return res.status(200).json({ message: "You're already signed up for the weekly digest!" });
    }

    // Add new subscriber
    const subscriberData = {
      email: emailLower,
      subscribedAt: new Date().toISOString(),
      active: true,
      source: "website",
      frequency: "weekly",
      digest: true,
    };

    await subscribersRef.add(subscriberData);

    console.log("Newsletter subscription successful:", emailLower);

    // Send confirmation email to subscriber (don't block on error)
    try {
      const emailResult = await sendSubscriptionConfirmation(emailLower);
      if (emailResult.success) {
        console.log("Confirmation email sent to:", emailLower);
      } else {
        console.warn("Failed to send confirmation email:", emailResult.error);
      }
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      // Don't fail the subscription if email fails
    }

    // Send notification email to admin (don't block on error)
    try {
      const adminEmail = process.env.EDITOR_EMAIL || "sughoshpdixit@gmail.com";
      const notificationResult = await sendSubscriptionNotification(emailLower);
      if (notificationResult.success) {
        console.log("Notification email sent to admin");
      } else {
        console.warn("Failed to send notification email:", notificationResult.error);
      }
    } catch (emailError) {
      console.error("Error sending notification email:", emailError);
      // Don't fail the subscription if email fails
    }

    return res.status(200).json({ 
      message: "Successfully signed up! Check your email for a confirmation message.",
      success: true 
    });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Provide more specific error messages
    if (error.code === 'permission-denied') {
      return res.status(500).json({ error: "Database permission error. Please contact support." });
    }
    
    return res.status(500).json({ 
      error: "Failed to subscribe. Please try again later or contact support if the issue persists." 
    });
  }
}

