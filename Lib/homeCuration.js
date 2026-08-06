import { generateSlug } from "./utils";

/**
 * Homepage editorial card feed: show ONLY these posts, in this order.
 * Everything else on the home page is surfaced as a curated playlist
 * (see Components/BlogPlaylists.js) instead of a loose article card.
 *
 * Matched against posts by slug (generateSlug of the title), so punctuation
 * differences do not matter.
 */
export const FEATURED_FEED_TITLES = [
  "Why Support Liverpool F.C? The Beautiful Game vs The Lazy Game",
  "Stop Defending Hindu Rituals with Pseudoscience",
  "Dr. Vinayak Damodar Savarkar — The Underrated Colossus of Bharat's Freedom Struggle",
  "India in a Shifting Global Order — Book Notes",
  "Five Years at Oracle: From Cloud Analyst to Data Scientist",
];

export const FEATURED_FEED_SLUGS = FEATURED_FEED_TITLES.map(generateSlug);

export const PLAYLIST_EXCLUDED_TOPICS = [];

/**
 * Optional presentation metadata for playlists, keyed by `Series` name first,
 * then by `Topic`. `order` controls vertical position (lower = higher up).
 * Anything without an entry still renders with sensible defaults.
 */
export const PLAYLIST_META = {
  // Series-based playlists
  "Hari Vayu Stuti": {
    kicker: "Stotra Exegesis",
    title: "Hari Vayu Stuti — Deep Dive",
    blurb:
      "A word-by-word journey through Sri Trivikrama Panditacharya's stotra — the deeds of Hanuman, Bhima, and Madhva.",
    order: 1,
  },
  "Ekadashi and its significance": {
    kicker: "Sacred Series",
    title: "Ekadashi & Its Significance",
    blurb:
      "History, exegesis, fasting science, and scriptural narratives of the holy Ekadashi fasts.",
    order: 2,
  },
  // Topic-based playlists (fallback when a post has no Series)
  Civilization: {
    kicker: "History & Heritage",
    title: "Civilization & Bharat",
    blurb:
      "Long-form essays on India's civilizational thread, heritage, and the ideas that shaped Bharat.",
    order: 3,
  },
  "RSS Centenary": {
    kicker: "National Thought",
    title: "RSS Centenary Notes",
    blurb: "Reflections and reportage around the centenary year.",
    order: 4,
  },
  "Vedic Studies": {
    kicker: "Dharma & Philosophy",
    title: "Vedic Studies & Dharma",
    blurb:
      "Philosophical deep-dives, scriptural commentary, and notes on dharmic practice.",
    order: 5,
  },
  Book: {
    kicker: "Reading Notes",
    title: "Book Notes",
    blurb: "Key ideas distilled from books worth your time.",
    order: 6,
  },
  Experience: {
    kicker: "Career & Craft",
    title: "Work, Career & Craft",
    blurb: "Lessons from building a career in data science and technology.",
    order: 7,
  },
  Personal: {
    kicker: "Personal Essays",
    title: "Personal Essays & Reflections",
    blurb: "Stories, tributes, and reflections from life off the keyboard.",
    order: 8,
  },
  "My Love Story 💌": {
    kicker: "Personal",
    title: "My Love Story",
    blurb: "A personal chapter, told the long way.",
    order: 9,
  },
};

export function playlistMetaFor(key) {
  return PLAYLIST_META[key] || {};
}
