/**
 * Canonical "newest first" comparator for blog post objects ({ data: {...} }).
 * Sorts by Date descending; posts with a valid date rank above undated ones;
 * ties / undated posts fall back to numeric Id descending.
 *
 * Centralized so the home feed, topic pages, archive, and in-article navigation
 * all order posts identically.
 */
export function sortByDateDesc(a, b) {
  const da = Date.parse(a?.data?.Date || "");
  const db = Date.parse(b?.data?.Date || "");
  const validA = !Number.isNaN(da);
  const validB = !Number.isNaN(db);
  if (validA && validB) return db - da;
  if (validA) return -1;
  if (validB) return 1;
  return (Number(b?.data?.Id) || 0) - (Number(a?.data?.Id) || 0);
}

/**
 * Generate a URL-safe slug from a title
 * Handles special characters, Unicode, and ensures consistency
 */
export function generateSlug(title) {
  if (!title) return '';
  
  return title
    .toLowerCase()
    // Replace em dash and en dash with regular dash
    .replace(/[\u2014\u2013\u2015]/g, '-')
    // Replace colons with nothing or dash
    .replace(/:/g, '-')
    // Replace ampersands with 'and'
    .replace(/&/g, 'and')
    // Replace plus signs with 'plus'
    .replace(/\+/g, 'plus')
    // Remove or replace parentheses
    .replace(/\(/g, '-')
    .replace(/\)/g, '-')
    // Replace question marks with nothing
    .replace(/\?/g, '')
    // Replace exclamation marks with nothing
    .replace(/!/g, '')
    // Replace commas with nothing
    .replace(/,/g, '')
    // Replace arrow characters
    .replace(/[→←]/g, '-')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Split by space and join with dash
    .split(' ')
    .filter(word => word.length > 0)
    .join('-')
    // Remove multiple consecutive dashes
    .replace(/-+/g, '-')
    // Remove leading/trailing dashes
    .replace(/^-+|-+$/g, '');
}

