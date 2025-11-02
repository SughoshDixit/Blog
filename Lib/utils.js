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

