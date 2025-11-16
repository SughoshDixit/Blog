import { useEffect, useMemo, useRef, useState } from "react";

function PrintSummary({ title, abstract, headings = [], headerImage, articleRef }) {
  const [keyImages, setKeyImages] = useState([]);
  const [ready, setReady] = useState(false);
  const printContainerRef = useRef(null);

  // Collect up to 3 key images from the article (header first, then first two imgs)
  useEffect(() => {
    const imgs = [];
    if (headerImage) imgs.push(headerImage);
    try {
      if (articleRef?.current) {
        const nodes = Array.from(articleRef.current.querySelectorAll("img"));
        for (const img of nodes) {
          if (imgs.length >= 3) break;
          if (img?.src) imgs.push(img.src);
        }
      }
    } catch (e) {}
    setKeyImages(imgs);
  }, [headerImage, articleRef]);

  const takeaways = useMemo(() => {
    const items = (headings || [])
      .filter((h) => h.depth === 2 || h.depth === 3)
      .slice(0, 3)
      .map((h) => h.text);
    if (items.length === 0 && title) return [title];
    return items;
  }, [headings, title]);

  // Prepare print-only mode
  const handlePrint = () => {
    try {
      document.body.classList.add("print-summary-only");
      setReady(true);
      // Give the browser a moment to layout
      setTimeout(() => {
        window.print();
        // Cleanup after print
        setTimeout(() => {
          document.body.classList.remove("print-summary-only");
          setReady(false);
        }, 50);
      }, 50);
    } catch (e) {
      console.error("Print failed", e);
      document.body.classList.remove("print-summary-only");
    }
  };

  return (
    <div className="my-4">
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm"
        aria-label="Download summary PDF"
      >
        Download Summary (PDF)
      </button>

      {/* Print container - visible only in print mode via CSS */}
      <div id="print-summary" ref={printContainerRef} className="hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          {abstract && <p className="mb-4 text-sm">{abstract}</p>}

          {keyImages && keyImages.length > 0 && (
            <div className="mb-4 grid grid-cols-1 gap-3">
              {keyImages.map((src, idx) => (
                <img key={idx} src={src} alt={`Key chart ${idx + 1}`} style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }} />
              ))}
            </div>
          )}

          {takeaways && takeaways.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1">Key Takeaways</h2>
              <ol className="list-decimal pl-5 text-sm">
                {takeaways.map((t, i) => (
                  <li key={i} className="mb-1">{t}</li>
                ))}
              </ol>
            </div>
          )}

          <div className="text-xs text-gray-600">
            Generated from Sughosh's Chronicles • {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintSummary;
