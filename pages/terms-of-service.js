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

const PAGE_TITLE = "Terms of Service — Sughosh Dixit";
const PAGE_DESC =
  "Terms of Service and conditions for using sughoshdixit.com, including content usage, user conduct, and disclaimers.";

export default function TermsOfService({ topics }) {
  const lastUpdated = "28 June 2026";

  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESC} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/terms-of-service`} />
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
                Terms of Service
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
              {/* ── 1. Acceptance of Terms ────────────────────────── */}
              <Section title="1. Acceptance of Terms">
                <p>
                  By accessing or using <strong>sughoshdixit.com</strong> (&quot;the
                  Site&quot;), you agree to be bound by these Terms of Service. If you
                  do not agree to these terms, please do not use the Site.
                </p>
              </Section>

              {/* ── 2. Intellectual Property ──────────────────────── */}
              <Section title="2. Intellectual Property Rights">
                <p>
                  All content on this Site, including articles, essays, code snippets,
                  graphics, and logos, is the intellectual property of Sughosh Dixit unless
                  otherwise stated. 
                </p>
                <p>
                  You may read, bookmark, and share links to the content for personal,
                  non-commercial use. However, you may not republish, distribute, or modify
                  any text or media from this Site without explicit written permission.
                </p>
              </Section>

              {/* ── 3. User Conduct ───────────────────────────────── */}
              <Section title="3. User Conduct">
                <p>When using the Site, you agree not to:</p>
                <ul>
                  <li>
                    Use the Site in any way that violates applicable local, national, or
                    international laws.
                  </li>
                  <li>
                    Attempt to interfere with the proper working of the Site, including
                    submitting malicious code, spamming the newsletter/comments forms, or
                    attempting to breach security measures.
                  </li>
                  <li>
                    Scrape or harvest content from the Site using automated bots or scripts
                    for commercial purposes or to train machine learning models without prior
                    consent.
                  </li>
                </ul>
              </Section>

              {/* ── 4. Disclaimer of Warranties ───────────────────── */}
              <Section title="4. Disclaimer of Warranties">
                <p>
                  The content on this Site is provided on an &quot;as is&quot; and &quot;as
                  available&quot; basis for informational and educational purposes. While I
                  strive for accuracy, I make no warranties or representations regarding the
                  completeness, reliability, or accuracy of the information, including technical
                  tutorials, data science guides, or historical commentary.
                </p>
                <p>
                  Any reliance you place on the materials on this Site is strictly at your own
                  risk.
                </p>
              </Section>

              {/* ── 5. Limitation of Liability ────────────────────── */}
              <Section title="5. Limitation of Liability">
                <p>
                  In no event shall Sughosh Dixit be liable for any direct, indirect,
                  incidental, consequential, or special damages arising out of or in connection
                  with your use of, or inability to use, the Site or its content, even if
                  advised of the possibility of such damages.
                </p>
              </Section>

              {/* ── 6. Third-Party Links & Ads ─────────────────────── */}
              <Section title="6. Third-Party Links & Advertisements">
                <p>
                  The Site contains links to third-party websites and displays advertisements served
                  by Google AdSense. These external sites and services are governed by their own
                  respective terms and privacy policies. I do not endorse or assume responsibility
                  for any third-party content, products, or services.
                </p>
              </Section>

              {/* ── 7. Changes to Terms ───────────────────────────── */}
              <Section title="7. Changes to Terms">
                <p>
                  I reserve the right to update or modify these Terms of Service at any time.
                  Changes will be posted on this page with an updated &quot;Last updated&quot;
                  date. Your continued use of the Site after changes are made constitutes your
                  acceptance of the new Terms of Service.
                </p>
              </Section>

              {/* ── 8. Contact ────────────────────────────────────── */}
              <Section title="8. Contact Information">
                <p>
                  If you have any questions about these Terms of Service, please contact me at{" "}
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
