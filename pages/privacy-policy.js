import Head from "next/head";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getProminentTopics } from "../Lib/Data";
import {
  SITE_URL,
  siteOgImageUrl,
  SITE_OG_IMAGE_WIDTH,
  SITE_OG_IMAGE_HEIGHT,
  SITE_OG_IMAGE_ALT,
} from "../Lib/siteConfig";

export const getStaticProps = () => {
  const topics = getProminentTopics();
  return { props: { topics } };
};

const PAGE_TITLE = "Privacy Policy — Sughosh Dixit";
const PAGE_DESC =
  "How sughoshdixit.com handles your data, cookies, and third-party services including Google AdSense and Analytics.";

export default function PrivacyPolicy({ topics }) {
  const lastUpdated = "13 May 2026";

  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESC} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/privacy-policy`} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESC} />
        <meta property="og:image" content={siteOgImageUrl()} />
        <meta property="og:image:width" content={String(SITE_OG_IMAGE_WIDTH)} />
        <meta property="og:image:height" content={String(SITE_OG_IMAGE_HEIGHT)} />
        <meta property="og:image:alt" content={SITE_OG_IMAGE_ALT} />
      </Head>

      <div className="min-h-screen bg-[#FAF8F6] dark:bg-[#201E1C]">
        <Navbar topics={topics} />

        <main className="pt-24 pb-16 px-4 md:px-8">
          <article className="max-w-3xl mx-auto">
            <header className="mb-12">
              <p className="text-xs uppercase tracking-[0.2em] text-[#9a8f75] dark:text-[#6E6B68] mb-3">
                Legal
              </p>
              <h1
                className="text-3xl md:text-4xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-4"
                style={{ fontFamily: "Charter, Georgia, serif" }}
              >
                Privacy Policy
              </h1>
              <p className="text-sm text-[#9a8f75] dark:text-[#6E6B68]">
                Last updated: {lastUpdated}
              </p>
            </header>

            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              style={{
                fontFamily: "Charter, Georgia, serif",
                lineHeight: 1.8,
                color: "inherit",
              }}
            >
              {/* ── Introduction ─────────────────────────────────── */}
              <Section title="Introduction">
                <p>
                  Welcome to <strong>sughoshdixit.com</strong> (&quot;the
                  Site&quot;), operated by Sughosh Dixit. Your privacy matters.
                  This page explains what data is collected, how it is used, and
                  your rights regarding that data.
                </p>
              </Section>

              {/* ── Information We Collect ────────────────────────── */}
              <Section title="Information We Collect">
                <p>We may collect the following types of information:</p>
                <ul>
                  <li>
                    <strong>Usage data</strong> — pages visited, time spent,
                    referral source, browser type, and device information,
                    collected automatically via analytics tools.
                  </li>
                  <li>
                    <strong>Email address</strong> — only if you voluntarily
                    subscribe to the newsletter.
                  </li>
                  <li>
                    <strong>Cookies</strong> — small files stored on your device
                    to improve your experience and serve relevant
                    advertisements.
                  </li>
                </ul>
              </Section>

              {/* ── Google AdSense ────────────────────────────────── */}
              <Section title="Google AdSense & Advertising">
                <p>
                  This Site uses <strong>Google AdSense</strong>, a service
                  provided by Google LLC, to display advertisements. Google
                  AdSense uses cookies to serve ads based on your prior visits
                  to this Site and other websites. Google&apos;s use of
                  advertising cookies enables it and its partners to serve ads
                  based on your visit to this Site and/or other sites on the
                  Internet.
                </p>
                <p>
                  You may opt out of personalised advertising by visiting{" "}
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C74634] dark:text-[#E8572A] hover:underline"
                  >
                    Google Ads Settings
                  </a>
                  . Alternatively, you can opt out of third-party vendor cookies
                  by visiting{" "}
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C74634] dark:text-[#E8572A] hover:underline"
                  >
                    aboutads.info
                  </a>
                  .
                </p>
              </Section>

              {/* ── Google Analytics ──────────────────────────────── */}
              <Section title="Google Analytics">
                <p>
                  We use Google Analytics to understand how visitors interact
                  with the Site. Google Analytics collects information such as
                  how often users visit, which pages they view, and what other
                  sites they visited before coming here. We use this information
                  solely to improve the Site. Google Analytics collects only the
                  IP address assigned to you on the date you visit, rather than
                  your name or other identifying information.
                </p>
                <p>
                  Google&apos;s ability to use and share information collected by
                  Google Analytics is restricted by the{" "}
                  <a
                    href="https://www.google.com/analytics/terms/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C74634] dark:text-[#E8572A] hover:underline"
                  >
                    Google Analytics Terms of Service
                  </a>{" "}
                  and the{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C74634] dark:text-[#E8572A] hover:underline"
                  >
                    Google Privacy Policy
                  </a>
                  .
                </p>
              </Section>

              {/* ── Cookies ──────────────────────────────────────── */}
              <Section title="Cookies">
                <p>
                  Cookies are small text files placed on your device. This Site
                  uses cookies for:
                </p>
                <ul>
                  <li>Remembering your theme preference (dark/light mode)</li>
                  <li>Understanding site traffic via analytics</li>
                  <li>Serving relevant advertisements via Google AdSense</li>
                </ul>
                <p>
                  You can control cookies through your browser settings. Note
                  that disabling cookies may affect Site functionality.
                </p>
              </Section>

              {/* ── Third-Party Links ────────────────────────────── */}
              <Section title="Third-Party Links">
                <p>
                  The Site may contain links to external websites (e.g.,
                  GitHub, LinkedIn, YouTube). We are not responsible for the
                  privacy practices or content of those sites. We encourage you
                  to read their privacy policies.
                </p>
              </Section>

              {/* ── Data Retention ───────────────────────────────── */}
              <Section title="Data Retention">
                <p>
                  Newsletter subscriber emails are retained until you
                  unsubscribe. Analytics data is retained according to
                  Google&apos;s default retention policies (typically 14
                  months). We do not sell or share your personal data with
                  third parties beyond the services described above.
                </p>
              </Section>

              {/* ── Your Rights ──────────────────────────────────── */}
              <Section title="Your Rights">
                <p>You have the right to:</p>
                <ul>
                  <li>Request access to the personal data we hold about you</li>
                  <li>Request correction or deletion of your data</li>
                  <li>Opt out of personalised advertising</li>
                  <li>Unsubscribe from the newsletter at any time</li>
                </ul>
                <p>
                  To exercise any of these rights, contact us at{" "}
                  <a
                    href="mailto:sughoshpdixit@gmail.com"
                    className="text-[#C74634] dark:text-[#E8572A] hover:underline"
                  >
                    sughoshpdixit@gmail.com
                  </a>
                  .
                </p>
              </Section>

              {/* ── Changes ──────────────────────────────────────── */}
              <Section title="Changes to This Policy">
                <p>
                  We may update this Privacy Policy from time to time. Changes
                  will be reflected on this page with an updated &quot;Last
                  updated&quot; date. Continued use of the Site after changes
                  constitutes acceptance of the new policy.
                </p>
              </Section>

              {/* ── Contact ──────────────────────────────────────── */}
              <Section title="Contact">
                <p>
                  If you have any questions about this Privacy Policy, please
                  email{" "}
                  <a
                    href="mailto:sughoshpdixit@gmail.com"
                    className="text-[#C74634] dark:text-[#E8572A] hover:underline"
                  >
                    sughoshpdixit@gmail.com
                  </a>
                  .
                </p>
              </Section>
            </div>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}

// ── Reusable section component ─────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2
        className="text-xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-4 mt-8"
        style={{ fontFamily: "Charter, Georgia, serif" }}
      >
        {title}
      </h2>
      <div className="text-[#3D3A36] dark:text-[#D1CEC9] space-y-3">
        {children}
      </div>
    </section>
  );
}
