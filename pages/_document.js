import { Html, Head, Main, NextScript } from 'next/document';

// ─── Google AdSense ───────────────────────────────────────────────────────────
// Replace REPLACE_WITH_YOUR_PUBLISHER_ID with your actual ca-pub-XXXXXXXXXXXXXXXX
// You get this from https://adsense.google.com after approval.
const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || '';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#C74634" />
        <meta name="author" content="Sughosh Dixit" />
        <link rel="alternate" type="application/rss+xml" title="Sughosh Dixit — RSS Feed" href="/api/feed" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
        {/* 
          Google AdSense Auto Ads
          —————————————————————————————————————
          The script below activates both manual ad units AND Google's Auto Ads.
          Auto Ads uses ML to find optimal placements on top of our manual ones.
          You can tune Auto Ad frequency/formats in AdSense > Ads > Auto Ads.
        */}
        {ADSENSE_PUBLISHER_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
            crossOrigin="anonymous"
            data-overlapping-ad-unit-optimization="false"
          />
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

