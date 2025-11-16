import { useEffect, useMemo, useRef, useState } from "react";

function PrintSummary({ title, abstract, headings = [], headerImage, articleRef }) {
  const [allImages, setAllImages] = useState([]);
  const [selected, setSelected] = useState({});
  const printContainerRef = useRef(null);

  // Collect images from article (header first), up to 8
  useEffect(() => {
    const imgs = [];
    if (headerImage) imgs.push(headerImage);
    try {
      if (articleRef?.current) {
        const nodes = Array.from(articleRef.current.querySelectorAll("img"));
        for (const img of nodes) {
          if (imgs.length >= 8) break;
          if (img?.src) imgs.push(img.src);
        }
      }
    } catch (e) {}
    setAllImages(imgs);
    const defSel = {};
    imgs.forEach((src, i) => {
      defSel[src] = i < 3; // default: first 3 selected
    });
    setSelected(defSel);
  }, [headerImage, articleRef]);

  const takeaways = useMemo(() => {
    const items = (headings || [])
      .filter((h) => h.depth === 2 || h.depth === 3)
      .slice(0, 3)
      .map((h) => h.text);
    if (items.length === 0 && title) return [title];
    return items;
  }, [headings, title]);

  const handleToggle = (src) => {
    setSelected((prev) => ({ ...prev, [src]: !prev[src] }));
  };

  // Print to PDF via browser
  const handlePrint = () => {
    try {
      document.body.classList.add("print-summary-only");
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          document.body.classList.remove("print-summary-only");
        }, 50);
      }, 50);
    } catch (e) {
      console.error("Print failed", e);
      document.body.classList.remove("print-summary-only");
    }
  };

  // Compose a simple PNG: title, abstract, selected images, takeaways
  const handleDownloadPng = async () => {
    try {
      const chosen = allImages.filter((src) => selected[src]);
      const width = 1024;
      const margin = 24;
      const lineHeight = 28;
      const titleHeight = 40;
      const abstractLines = abstract ? Math.ceil(abstract.length / 80) : 0;
      const abstractHeight = abstract ? abstractLines * lineHeight + margin : 0;
      const takeawaysHeight = takeaways.length ? (takeaways.length * lineHeight + margin) : 0;

      // Preload images to compute height
      const bitmaps = [];
      let imagesHeight = 0;
      for (const src of chosen) {
        const img = await loadImage(src);
        const scale = Math.min(1, (width - margin * 2) / img.width);
        const h = img.height * scale;
        imagesHeight += h + margin;
        bitmaps.push({ img, scale, h });
      }

      const totalHeight = margin + titleHeight + abstractHeight + imagesHeight + takeawaysHeight + margin;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = Math.ceil(totalHeight);
      const ctx = canvas.getContext("2d");

      // Background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let y = margin;
      // Title
      ctx.fillStyle = "#111827";
      ctx.font = "bold 28px Inter, Arial, sans-serif";
      ctx.fillText(title || "Summary", margin, y + 28);
      y += titleHeight;

      // Abstract
      if (abstract) {
        ctx.font = "16px Inter, Arial, sans-serif";
        const lines = wrapText(ctx, abstract, width - margin * 2);
        for (const line of lines) {
          y += lineHeight;
          ctx.fillText(line, margin, y);
        }
        y += margin / 2;
      }

      // Images
      for (const { img, scale, h } of bitmaps) {
        const drawW = img.width * scale;
        const x = (width - drawW) / 2;
        ctx.drawImage(img, x, y, drawW, h);
        y += h + margin;
      }

      // Takeaways
      if (takeaways.length) {
        ctx.font = "bold 18px Inter, Arial, sans-serif";
        ctx.fillText("Key Takeaways", margin, y + 20);
        y += 24;
        ctx.font = "16px Inter, Arial, sans-serif";
        takeaways.forEach((t, i) => {
          const bullet = `${i + 1}. ${t}`;
          const lines = wrapText(ctx, bullet, width - margin * 2);
          for (const line of lines) {
            y += lineHeight;
            ctx.fillText(line, margin, y);
          }
          y += 4;
        });
      }

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `summary_${Date.now()}.png`;
      a.click();
    } catch (e) {
      console.error("PNG export failed", e);
      alert("Unable to export PNG. Some images may block cross-origin drawing.");
    }
  };

  return (
    <div className="my-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm"
          aria-label="Download summary PDF"
        >
          Download Summary (PDF)
        </button>
        <button
          type="button"
          onClick={handleDownloadPng}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm"
          aria-label="Download summary PNG"
        >
          Download Summary (PNG)
        </button>
      </div>

      {/* Chart selection */}
      {allImages && allImages.length > 0 && (
        <div className="mt-3 p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/60">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">Select charts to include</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allImages.map((src, i) => (
              <label key={src} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-200">
                <input type="checkbox" checked={!!selected[src]} onChange={() => handleToggle(src)} />
                <span className="truncate" title={src}>Chart {i + 1}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Print container */}
      <div id="print-summary" ref={printContainerRef} className="hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          {abstract && <p className="mb-4 text-sm">{abstract}</p>}

          {allImages && allImages.filter((src) => selected[src]).length > 0 && (
            <div className="mb-4 grid grid-cols-1 gap-3">
              {allImages.filter((src) => selected[src]).map((src, idx) => (
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

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrapText(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    const m = ctx.measureText(test);
    if (m.width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export default PrintSummary;
