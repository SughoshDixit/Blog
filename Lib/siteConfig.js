/**
 * Central site metadata. Set NEXT_PUBLIC_SITE_URL in Vercel (e.g. https://yourdomain.com)
 * when you attach a custom domain so Open Graph and canonical URLs stay correct.
 */
export const SITE_URL =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
    ? String(process.env.NEXT_PUBLIC_SITE_URL).replace(/\/$/, "")
    : "https://sughoshblog.vercel.app";

export const SITE_NAME = "Sughosh's Chronicles";

export const SITE_TITLE_HOME =
  "Sughosh Dixit — Chronicles | Data Science, Stories & Ideas";

export const SITE_DESCRIPTION =
  "Essays and tutorials by Sughosh Dixit: the 30-Day Data Science Challenge, personal stories (including family and film), Vedic studies, books, football, heritage, and life in India.";
