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
