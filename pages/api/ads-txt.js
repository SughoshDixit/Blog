// Serve ads.txt via API route for maximum compatibility with Google's crawler.
// Static files in /public can be affected by CDN caching or bot protection.
export default function handler(req, res) {
  const content = 'google.com, pub-5371818145935476, DIRECT, f08c47fec0942fa0\n';

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.status(200).send(content);
}
