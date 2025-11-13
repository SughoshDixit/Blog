import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../Lib/authOptions";
import db from "../../../Firebase/Firebase-admin";
import { getAllBlogPosts } from "../../../Lib/Data";
import { generateSlug } from "../../../Lib/utils";
import { sendWeeklyDigest } from "../../../Lib/email";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check authentication (only admin can trigger digest)
  const session = await getServerSession(req, res, authOptions);
  const allowedEmail = (process.env.EDITOR_EMAIL || "sughoshpdixit@gmail.com").toLowerCase();

  if (!session || session?.user?.email?.toLowerCase() !== allowedEmail) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Get all published posts from the last 7 days
    const allBlogs = getAllBlogPosts();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentPosts = allBlogs
      .filter((blog) => {
        if (!blog.data || !blog.data.isPublished) return false;
        const postDate = new Date(blog.data.Date);
        return postDate >= oneWeekAgo;
      })
      .sort((a, b) => new Date(b.data.Date) - new Date(a.data.Date))
      .map((blog) => ({
        title: blog.data.Title,
        slug: generateSlug(blog.data.Title),
        abstract: blog.data.Abstract || "",
        date: blog.data.Date,
        readTime: blog.readTime?.text || "5 min read",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://sughoshblog.vercel.app"}/blogs/${generateSlug(blog.data.Title)}`,
      }));

    if (recentPosts.length === 0) {
      return res.status(200).json({ 
        message: "No new posts in the last 7 days. Digest not sent.",
        postsCount: 0 
      });
    }

    // Get all active subscribers
    const subscribersRef = db.collection("newsletter_subscribers");
    const subscribersSnapshot = await subscribersRef
      .where("active", "==", true)
      .where("digest", "==", true)
      .get();

    if (subscribersSnapshot.empty) {
      return res.status(200).json({ 
        message: "No active subscribers found.",
        subscribersCount: 0 
      });
    }

    const subscribers = [];
    subscribersSnapshot.forEach((doc) => {
      subscribers.push(doc.data().email);
    });

    console.log(`Sending weekly digest to ${subscribers.length} subscribers with ${recentPosts.length} posts`);

    // Send digest to each subscriber
    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const email of subscribers) {
      try {
        const result = await sendWeeklyDigest(email, recentPosts);
        if (result.success) {
          results.success++;
        } else {
          results.failed++;
          results.errors.push({ email, error: result.error });
        }
      } catch (error) {
        results.failed++;
        results.errors.push({ email, error: error.message });
        console.error(`Error sending digest to ${email}:`, error);
      }
    }

    return res.status(200).json({
      message: `Weekly digest sent to ${results.success} subscribers. ${results.failed} failed.`,
      success: results.success,
      failed: results.failed,
      totalSubscribers: subscribers.length,
      postsCount: recentPosts.length,
      errors: results.errors.length > 0 ? results.errors : undefined,
    });
  } catch (error) {
    console.error("Error sending weekly digest:", error);
    return res.status(500).json({ 
      error: "Failed to send weekly digest",
      details: error.message 
    });
  }
}

