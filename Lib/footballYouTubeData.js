/**
 * Football content on @sughoshdixit
 * Update video IDs below as you publish more football content.
 */
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@sughoshdixit";

/**
 * Football playlist on the channel.
 * https://www.youtube.com/playlist?list=PL6OvmCeVVrDs8KFSnt2jGxWs4_oU0Em7O
 */
export const FOOTBALL_PLAYLIST_ID = "PL6OvmCeVVrDs8KFSnt2jGxWs4_oU0Em7O";
export const FOOTBALL_PLAYLIST_URL = `https://www.youtube.com/playlist?list=${FOOTBALL_PLAYLIST_ID}`;

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

/** Embed src — uses the full playlist so new videos appear automatically. */
export const FOOTBALL_EMBED_SRC = `https://www.youtube.com/embed/videoseries?list=${FOOTBALL_PLAYLIST_ID}&modestbranding=1`;
