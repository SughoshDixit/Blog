/**
 * Brand shelf: posts stay published and linkable; when prominentShelf is false they are
 * omitted from the home feed, topic listings, RSS, and main search — listed on /archive.
 */
export function isProminentShelf(blog) {
  return blog?.data?.prominentShelf !== false;
}
