/**
 * Central site metadata. Set NEXT_PUBLIC_SITE_URL in Vercel (e.g. https://sughoshdixit.com)
 * when you attach a custom domain so Open Graph and canonical URLs stay correct.
 */
export const SITE_URL =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
    ? String(process.env.NEXT_PUBLIC_SITE_URL).replace(/\/$/, "")
    : "https://sughoshdixit.com";

export const SITE_NAME = "Sughosh Dixit";

export const SITE_TITLE_HOME =
  "Sughosh Dixit — Data Scientist & Writer";

export const SITE_DESCRIPTION =
  "Long-form writing by Sughosh Dixit: data science deep dives, the 30-Day DS Challenge, personal essays, Vedic studies, books, football, and life in India.";

/** Served from /public/og — swap the file to change social previews (LinkedIn caches; use Post Inspector after deploy). */
export const SITE_OG_IMAGE_PATH = "/og/social-share.jpg";

export const SITE_OG_IMAGE_WIDTH = 1200;
export const SITE_OG_IMAGE_HEIGHT = 630;

export const SITE_OG_IMAGE_ALT =
  "Sughosh Dixit — blog and portfolio: data science, AI art, and long-form writing";

export function siteOgImageUrl() {
  return `${SITE_URL}${SITE_OG_IMAGE_PATH}`;
}
