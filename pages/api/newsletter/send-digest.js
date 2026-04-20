import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../Lib/authOptions";
import db from "../../../Firebase/Firebase-admin";
import { getAllBlogPosts } from "../../../Lib/Data";
import { isProminentShelf } from "../../../Lib/postVisibility";
import { generateSlug } from "../../../Lib/utils";
import { sendWeeklyDigest } from "../../../Lib/email";

const TRACK_RULES = {
  "data-science-ai": {
    label: "Data Science & AI",
    keywords: ["data science", "ai", "ml", "machine learning", "model", "statistics", "probability"],
    topics: ["data science"],
  },
  "history-civilization": {
    label: "History & Civilization",
    keywords: ["history", "civilization", "bharat", "vedic", "savarkar", "rss", "freedom"],
    topics: ["civilization", "vedic studies", "rss centenary"],
  },
  "finance-decisions": {
    label: "Finance & Decision-Making",
    keywords: ["finance", "market", "economy", "risk", "decision", "sampling", "probability"],
    topics: ["experience", "book", "data science"],
  },
  "books-intellectual": {
    label: "Books & Intellectual Notes",
    keywords: ["book", "notes", "reflection", "reflections", "intellectual"],
    topics: ["book", "civilization"],
  },
  football: {
    label: "Football Lens",
    keywords: ["football", "liverpool", "soccer", "klopp"],
    topics: ["football"],
  },
  general: {
    label: "General",
    keywords: [],
    topics: [],
  },
};

const normalizeTrack = (track) => {
  const key = typeof track === "string" ? track.trim().toLowerCase() : "general";
  return TRACK_RULES[key] ? key : "general";
};

const scorePostForTrack = (post, trackKey) => {
  if (trackKey === "general") return 1;
  const rule = TRACK_RULES[trackKey];
  if (!rule) return 0;
  const topic = (post.topic || "").toLowerCase();
  const title = (post.title || "").toLowerCase();
  const tags = (post.tags || "").toLowerCase();

  let score = 0;
  if (rule.topics.some((t) => topic === t || topic.includes(t))) score += 3;
  for (const keyword of rule.keywords) {
    if (title.includes(keyword)) score += 2;
    if (tags.includes(keyword)) score += 1;
    if (topic.includes(keyword)) score += 1;
  }
  return score;
};

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
    const previewFlag =
      req.query?.preview === "1" ||
      req.query?.preview === "true" ||
      req.body?.preview === true ||
      req.body?.preview === "1" ||
      req.body?.preview === "true";

    // Get all published posts from the last 7 days
    const allBlogs = getAllBlogPosts();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const allPublishedProminentPosts = allBlogs
      .filter((blog) => blog.data && blog.data.isPublished && isProminentShelf(blog))
      .sort((a, b) => new Date(b.data.Date) - new Date(a.data.Date))
      .map((blog) => ({
        title: blog.data.Title,
        slug: generateSlug(blog.data.Title),
        abstract: blog.data.Abstract || "",
        date: blog.data.Date,
        readTime: blog.readTime?.text || "5 min read",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://sughoshblog.vercel.app"}/blogs/${generateSlug(blog.data.Title)}`,
        topic: blog.data.Topic || "",
        tags: blog.data.Tags || "",
      }));

    const recentPosts = allPublishedProminentPosts
      .filter((blog) => {
        const postDate = new Date(blog.date);
        return postDate >= oneWeekAgo;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

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
      const data = doc.data() || {};
      subscribers.push({
        email: data.email,
        track: normalizeTrack(data.track || data?.preferences?.track || "general"),
      });
    });

    console.log(
      `${previewFlag ? "Previewing" : "Sending"} weekly digest for ${subscribers.length} subscribers with ${recentPosts.length} recent posts`
    );

    // Send digest to each subscriber
    const results = {
      success: 0,
      failed: 0,
      errors: [],
      previews: [],
    };

    for (const subscriber of subscribers) {
      try {
        const trackKey = subscriber.track;
        const trackRule = TRACK_RULES[trackKey] || TRACK_RULES.general;

        const scoredRecent = recentPosts
          .map((post) => ({ post, score: scorePostForTrack(post, trackKey) }))
          .filter((item) => item.score > 0)
          .sort((a, b) => b.score - a.score || new Date(b.post.date) - new Date(a.post.date))
          .map((item) => item.post);

        const scoredEvergreen = allPublishedProminentPosts
          .map((post) => ({ post, score: scorePostForTrack(post, trackKey) }))
          .filter((item) => item.score > 0)
          .sort((a, b) => b.score - a.score || new Date(b.post.date) - new Date(a.post.date))
          .map((item) => item.post);

        const personalized = [];
        for (const post of [...scoredRecent, ...scoredEvergreen, ...recentPosts]) {
          if (!personalized.some((item) => item.slug === post.slug)) {
            personalized.push(post);
          }
          if (personalized.length >= 3) break;
        }

        if (previewFlag) {
          results.success++;
          results.previews.push({
            email: subscriber.email,
            track: trackKey,
            trackLabel: trackRule.label,
            picks: personalized.map((post) => ({
              title: post.title,
              slug: post.slug,
              date: post.date,
              topic: post.topic || null,
            })),
          });
        } else {
          const result = await sendWeeklyDigest(subscriber.email, personalized, {
            trackLabel: trackRule.label,
            isPersonalized: trackKey !== "general",
          });
          if (result.success) {
            results.success++;
          } else {
            results.failed++;
            results.errors.push({ email: subscriber.email, error: result.error });
          }
        }
      } catch (error) {
        results.failed++;
        results.errors.push({ email: subscriber.email, error: error.message });
        console.error(`Error sending digest to ${subscriber.email}:`, error);
      }
    }

    return res.status(200).json({
      mode: previewFlag ? "preview" : "send",
      message: previewFlag
        ? `Preview generated for ${results.success} subscribers. ${results.failed} failed.`
        : `Weekly digest sent to ${results.success} subscribers. ${results.failed} failed.`,
      success: results.success,
      failed: results.failed,
      totalSubscribers: subscribers.length,
      postsCount: recentPosts.length,
      previewSamples:
        previewFlag && results.previews.length > 0
          ? results.previews.slice(0, 25)
          : undefined,
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

