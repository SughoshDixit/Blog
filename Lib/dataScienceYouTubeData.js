/**
 * Data Science YouTube content on @sughoshdixit
 * Update video IDs below as you publish more DS content.
 */
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@sughoshdixit";

/**
 * Tech Podcasts / Data Science playlist on the channel.
 * https://www.youtube.com/playlist?list=PL6OvmCeVVrDtOBGNO7uL89ZahyRgR6yjg
 */
export const DS_PLAYLIST_ID = "PL6OvmCeVVrDtOBGNO7uL89ZahyRgR6yjg";
export const DS_PLAYLIST_URL = `https://www.youtube.com/playlist?list=${DS_PLAYLIST_ID}`;

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

/** Embed src — uses the full playlist so new videos appear automatically. */
export const DS_EMBED_SRC = `https://www.youtube.com/embed/videoseries?list=${DS_PLAYLIST_ID}&modestbranding=1`;
