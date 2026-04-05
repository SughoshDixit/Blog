/**
 * Data Science YouTube content on @sughoshdixit
 * Update video IDs below as you publish more DS content.
 */
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@sughoshdixit";

/**
 * Data Science playlist on the channel.
 * Replace DS_PLAYLIST_ID with your actual playlist ID once you create one.
 */
export const DS_PLAYLIST_ID = null; // e.g. "PL6OvmCeVVrD..."
export const DS_PLAYLIST_URL = DS_PLAYLIST_ID
  ? `https://www.youtube.com/playlist?list=${DS_PLAYLIST_ID}`
  : YOUTUBE_CHANNEL_URL;

/** Data Science videos — curated from the channel. Add more as you publish. */
export const DS_VIDEOS = [
  {
    id: "yXQAM2jsYgA",
    title: "Cracking Data Science and AI with Sughosh Dixit",
  },
  {
    id: "u1PtafSwvwg",
    title: "TechJourney Series: My Path to Becoming a Data Scientist",
  },
  {
    id: "Cucjb_gGlEY",
    title: "GRADUATED | BITS Pilani | M.Tech Data Science Convocation",
  },
  {
    id: "UWUO_3lW8zE",
    title: "Covid19 QuarantinedForSure App — Data Science in Action",
  },
];

/** The primary video to embed full-width at the top of the shelf. */
export const DS_HERO_VIDEO_ID = DS_VIDEOS[0]?.id;
