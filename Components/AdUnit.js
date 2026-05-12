import { useEffect, useRef, useState } from 'react';

/**
 * AdUnit — Google AdSense display unit.
 *
 * Supported formats:
 *   "auto"           — Responsive display ad (flows with page width)
 *   "rectangle"      — Classic 300×250 medium rectangle (highest RPM)
 *   "in-article"     — Native-style in-article ad (blends with content)
 *   "multiplex"      — Matched content / discovery grid (looks like "More articles")
 *   "sticky-sidebar" — Sticky 300×600 half-page, desktop only, scrolls with user
 *
 * Prerequisites:
 *   - NEXT_PUBLIC_ADSENSE_PUBLISHER_ID must be set in .env.local
 *   - Each format needs its own slot ID from AdSense > Ads > By ad unit
 */

const DEV_COLORS = {
  auto:           { bg: 'rgba(199,70,52,0.07)',  border: 'rgba(199,70,52,0.3)' },
  rectangle:      { bg: 'rgba(52,99,199,0.07)',  border: 'rgba(52,99,199,0.3)' },
  'in-article':   { bg: 'rgba(52,160,82,0.07)',  border: 'rgba(52,160,82,0.3)' },
  multiplex:      { bg: 'rgba(120,52,199,0.07)', border: 'rgba(120,52,199,0.3)' },
  'sticky-sidebar': { bg: 'rgba(199,140,52,0.07)', border: 'rgba(199,140,52,0.3)' },
};

const LABELS = {
  auto:           'Auto Responsive Ad',
  rectangle:      '300×250 Rectangle Ad',
  'in-article':   'In-Article Ad',
  multiplex:      'Multiplex / Matched Content Ad',
  'sticky-sidebar': 'Sticky Sidebar Ad (300×600)',
};

// ─── Dev Placeholder ──────────────────────────────────────────────────────────
function DevPlaceholder({ slot, format, style, className }) {
  const colors = DEV_COLORS[format] || DEV_COLORS.auto;
  const label  = LABELS[format]  || 'Ad Unit';

  const baseStyle = {
    background: colors.bg,
    border: `1.5px dashed ${colors.border}`,
    borderRadius: '10px',
    padding: '14px 18px',
    textAlign: 'center',
    fontSize: '11px',
    color: '#555',
    letterSpacing: '0.04em',
    fontFamily: 'monospace',
    margin: '16px auto',
    lineHeight: 1.7,
  };

  const formatDimensions = {
    'sticky-sidebar': { width: '300px', minHeight: '250px', maxWidth: '300px' },
    rectangle:        { width: '300px', minHeight: '100px', maxWidth: '300px' },
    multiplex:        { width: '100%',  minHeight: '80px'  },
    auto:             { width: '100%',  minHeight: '60px'  },
    'in-article':     { width: '100%',  minHeight: '60px'  },
  };

  return (
    <div
      style={{ ...baseStyle, ...formatDimensions[format], ...style }}
      className={className}
    >
      <strong>📣 AdSense Placeholder</strong><br />
      <span style={{ opacity: 0.7 }}>{label}</span><br />
      <span style={{ opacity: 0.5 }}>Slot: {slot || '(not set)'}</span><br />
      <span style={{ opacity: 0.4, fontSize: '10px' }}>
        Set NEXT_PUBLIC_ADSENSE_PUBLISHER_ID in .env.local to activate
      </span>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function AdUnit({
  slot,
  format = 'auto',
  style = {},
  className = '',
}) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  const isDev = process.env.NODE_ENV === 'development';

  // Show placeholder in dev mode so layout is visible while building
  if (isDev) {
    return <DevPlaceholder slot={slot} format={format} style={style} className={className} />;
  }

  // In production, don't render anything if publisher ID is missing
  if (!publisherId || !slot) return null;

  if (format === 'sticky-sidebar') {
    return <StickyAd slot={slot} publisherId={publisherId} style={style} className={className} />;
  }

  return (
    <InlineAd
      slot={slot}
      format={format}
      publisherId={publisherId}
      style={style}
      className={className}
    />
  );
}

// ─── Sticky Sidebar Ad ───────────────────────────────────────────────────────
function StickyAd({ slot, publisherId, style, className }) {
  const adRef = useRef(null);
  const [pushed, setPushed] = useState(false);

  useEffect(() => {
    if (pushed) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setPushed(true);
    } catch (e) {
      console.warn('[AdUnit:sticky-sidebar] push failed:', e);
    }
  }, [pushed]);

  return (
    <div
      style={{
        position: 'sticky',
        top: '100px',           // clears the navbar
        width: '160px',         // compact leaderboard on sidebar
        margin: '0 auto',
        ...style,
      }}
      className={className}
      aria-hidden="true"
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '160px', height: '600px' }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format="vertical"
        data-full-width-responsive="false"
      />
    </div>
  );
}

// ─── Inline / In-Article / Multiplex / Auto Ad ───────────────────────────────
function InlineAd({ slot, format, publisherId, style, className }) {
  const adRef = useRef(null);
  const [pushed, setPushed] = useState(false);

  useEffect(() => {
    if (pushed) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setPushed(true);
    } catch (e) {
      console.warn(`[AdUnit:${format}] push failed:`, e);
    }
  }, [pushed]);

  const isInArticle  = format === 'in-article';
  const isMultiplex  = format === 'multiplex';
  const isRectangle  = format === 'rectangle';

  const wrapperStyle = {
    margin: '28px auto',
    textAlign: 'center',
    overflow: 'hidden',
    maxWidth: isRectangle ? '336px' : '100%',
    ...style,
  };

  const insProps = isMultiplex
    ? {
        className: 'adsbygoogle',
        style: { display: 'block' },
        'data-ad-format': 'autorelaxed',
        'data-ad-client': publisherId,
        'data-ad-slot': slot,
      }
    : isInArticle
    ? {
        className: 'adsbygoogle',
        style: { display: 'block', textAlign: 'center' },
        'data-ad-layout': 'in-article',
        'data-ad-format': 'fluid',
        'data-ad-client': publisherId,
        'data-ad-slot': slot,
      }
    : isRectangle
    ? {
        className: 'adsbygoogle',
        style: { display: 'inline-block', width: '336px', height: '280px' },
        'data-ad-client': publisherId,
        'data-ad-slot': slot,
      }
    : {
        // auto / default
        className: 'adsbygoogle',
        style: { display: 'block' },
        'data-ad-client': publisherId,
        'data-ad-slot': slot,
        'data-ad-format': 'auto',
        'data-full-width-responsive': 'true',
      };

  return (
    <div style={wrapperStyle} className={className} aria-hidden="true">
      <ins ref={adRef} {...insProps} />
    </div>
  );
}
