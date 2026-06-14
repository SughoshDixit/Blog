/**
 * Post visibility helpers.
 *
 * - prominentShelf:false  → stays published & linkable, but is dropped from the
 *   home feed, topic listings, RSS, and search. It IS still listed on /archive.
 * - unlisted:true         → published & reachable ONLY by its direct URL. It is
 *   removed from EVERY listing surface, including /archive, the sitemap, related
 *   posts, and prev/next navigation. Nothing in the app links to it.
 */
export function isUnlisted(blog) {
  return blog?.data?.unlisted === true;
}

export function isProminentShelf(blog) {
  if (isUnlisted(blog)) return false;
  return blog?.data?.prominentShelf !== false;
}
