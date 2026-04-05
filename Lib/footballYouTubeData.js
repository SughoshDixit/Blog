/**
 * Football content on @sughoshdixit
 * Update video IDs below as you publish more football content.
 */
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@sughoshdixit";

/**
 * Football playlist on the channel.
 * Replace FOOTBALL_PLAYLIST_ID with your actual playlist ID once you create one.
 * Until then the shelf links directly to the channel.
 */
export const FOOTBALL_PLAYLIST_ID = null; // e.g. "PL6OvmCeVVrD..."
export const FOOTBALL_PLAYLIST_URL = FOOTBALL_PLAYLIST_ID
  ? `https://www.youtube.com/playlist?list=${FOOTBALL_PLAYLIST_ID}`
  : YOUTUBE_CHANNEL_URL;

/** Football videos — curated from the channel. Add more as you publish. */
export const FOOTBALL_VIDEOS = [
  {
    id: "vX5sqN4Wl78",
    title: "Scored a Goal, Let AI Drop the Beat!",
  },
  {
    id: "rrbSLCis0QY",
    title: "Channel Intro: Data Scientist, Musician & Footballer",
  },
];

/** The primary video to embed full-width at the top of the shelf. */
export const FOOTBALL_HERO_VIDEO_ID = FOOTBALL_VIDEOS[0]?.id;
