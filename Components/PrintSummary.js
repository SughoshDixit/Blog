import { useEffect, useMemo, useRef, useState } from "react";

function PrintSummary({ title, abstract, headings = [], headerImage, articleRef }) {
  const [allImages, setAllImages] = useState([]);
  const [selected, setSelected] = useState({});
  const [landscape, setLandscape] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [note, setNote] = useState("");
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

  const moveImage = (from, to) => {
    setAllImages((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const next = prev.slice();
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const onDragStart = (index) => (e) => {
    setDragIndex(index);
    e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
  };

  const onDragOver = (index) => (e) => {
    e.preventDefault();
    e.dataTransfer && (e.dataTransfer.dropEffect = "move");
  };

  const onDrop = (index) => (e) => {
    e.preventDefault();
    if (dragIndex == null || dragIndex === index) return;
    moveImage(dragIndex, index);
    setDragIndex(null);
  };

  // Basic touch reordering: tap-hold then tap target to place
  const touchStartRef = useRef(null);
  const onTouchStart = (index) => () => {
    touchStartRef.current = index;
    setDragIndex(index);
  };
  const onTouchEnd = (index) => () => {
    if (touchStartRef.current != null && touchStartRef.current !== index) {
      moveImage(touchStartRef.current, index);
    }
    touchStartRef.current = null;
    setDragIndex(null);
  };

  // Print to PDF via browser (landscape optional)
  const handlePrint = () => {
    try {
      if (landscape) document.body.classList.add("print-landscape");
      document.body.classList.add("print-summary-only");
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          document.body.classList.remove("print-summary-only");
          document.body.classList.remove("print-landscape");
        }, 50);
      }, 50);
    } catch (e) {
      console.error("Print failed", e);
      document.body.classList.remove("print-summary-only");
      document.body.classList.remove("print-landscape");
    }
  };

  // Compose a PNG; in landscape, arrange charts in two columns
  const handleDownloadPng = async () => {
    try {
      const chosenSrc = allImages.filter((src) => selected[src]);
      const width = landscape ? 1400 : 1024;
      const margin = 24;
      const gutter = 16;
      const lineHeight = 28;
      const titleHeight = 40;
      const abstractLines = abstract ? Math.ceil(abstract.length / 80) : 0;
      const abstractHeight = abstract ? abstractLines * lineHeight + margin : 0;
      const takeawaysHeight = takeaways.length ? (takeaways.length * lineHeight + margin) : 0;
      const noteLines = note ? Math.ceil(note.length / 90) : 0;
      const noteHeight = note ? noteLines * lineHeight + margin : 0;

      // Preload images
      const bitmaps = [];
      for (const src of chosenSrc) {
        const img = await loadImage(src);
        bitmaps.push({ img, w: img.width, h: img.height });
      }

      // Layout images
      let imagesHeight = 0;
      if (landscape && bitmaps.length) {
        // two-column layout
        const colWidth = (width - margin * 2 - gutter) / 2;
        const scaled = bitmaps.map(({ img }) => {
          const scale = Math.min(1, colWidth / img.width);
          return { img, w: img.width * scale, h: img.height * scale };
        });
        // compute column stacks heights
        let colHeights = [0, 0];
        scaled.forEach((b) => {
          const col = colHeights[0] <= colHeights[1] ? 0 : 1;
          colHeights[col] += b.h + gutter;
        });
        imagesHeight = Math.max(colHeights[0], colHeights[1]);
      } else {
        // single column
        const scaled = bitmaps.map(({ img }) => {
          const scale = Math.min(1, (width - margin * 2) / img.width);
          return { img, w: img.width * scale, h: img.height * scale };
        });
        imagesHeight = scaled.reduce((acc, b) => acc + b.h + margin, 0);
      }

      const totalHeight = margin + titleHeight + abstractHeight + imagesHeight + takeawaysHeight + noteHeight + margin;
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

      // Images draw
      if (landscape && bitmaps.length) {
        const colWidth = (width - margin * 2 - gutter) / 2;
        const positions = [];
        // compute scaled sizes and assign to columns
        const scaled = bitmaps.map(({ img }) => {
          const scale = Math.min(1, colWidth / img.width);
          return { img, w: img.width * scale, h: img.height * scale };
        });
        let colY = [y, y];
        scaled.forEach((b) => {
          const col = colY[0] <= colY[1] ? 0 : 1;
          const x = margin + (col === 0 ? 0 : colWidth + gutter) + (colWidth - b.w) / 2;
          positions.push({ x, y: colY[col], b });
          colY[col] += b.h + gutter;
        });
        positions.forEach(({ x, y: yy, b }) => {
          ctx.drawImage(b.img, x, yy, b.w, b.h);
        });
        y = Math.max(colY[0], colY[1]);
      } else {
        for (const { img } of bitmaps) {
          const scale = Math.min(1, (width - margin * 2) / img.width);
          const drawW = img.width * scale;
          const drawH = img.height * scale;
          const x = (width - drawW) / 2;
          ctx.drawImage(img, x, y, drawW, drawH);
          y += drawH + margin;
        }
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

      // Note/signature
      if (note) {
        y += margin / 2;
        ctx.font = "italic 14px Inter, Arial, sans-serif";
        const lines = wrapText(ctx, note, width - margin * 2);
        for (const line of lines) {
          y += lineHeight;
          ctx.fillText(line, margin, y);
        }
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
        <label className="text-xs sm:text-sm flex items-center gap-2 text-gray-700 dark:text-gray-200 ml-2">
          <input type="checkbox" checked={landscape} onChange={(e) => setLandscape(e.target.checked)} />
          Landscape
        </label>
      </div>

      {/* Chart selection & DnD reorder (touch + mouse) */}
      {allImages && allImages.length > 0 && (
        <div className="mt-3 p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/60">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">Select charts to include (drag to reorder)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allImages.map((src, i) => (
              <div
                key={src}
                className={`flex items-center justify-between gap-2 text-xs text-gray-700 dark:text-gray-200 rounded border border-transparent ${dragIndex===i? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700':''}`}
                draggable
                onDragStart={onDragStart(i)}
                onDragOver={onDragOver(i)}
                onDrop={onDrop(i)}
                onTouchStart={onTouchStart(i)}
                onTouchEnd={onTouchEnd(i)}
              >
                <label className="flex items-center gap-2 p-1">
                  <input type="checkbox" checked={!!selected[src]} onChange={() => handleToggle(src)} />
                  <span className="truncate max-w-[200px]" title={src}>Chart {i + 1}</span>
                </label>
                <span className="px-2 py-1 text-gray-500">⠿</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom note */}
      <div className="mt-3 p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/60">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2 block">Custom note/signature (optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full h-20 text-sm px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          placeholder="Add a note or signature to include in the export..."
        />
      </div>

      {/* Print container with 2-column grid in landscape */}
      <div id="print-summary" ref={printContainerRef} className="hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          {abstract && <p className="mb-4 text-sm">{abstract}</p>}

          {allImages && allImages.filter((src) => selected[src]).length > 0 && (
            <div className={`${landscape ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-1 gap-3'} mb-4`}>
              {allImages.filter((src) => selected[src]).map((src, idx) => (
                <img key={idx} src={src} alt={`Key chart ${idx + 1}`} style={{ width: "100%", height: "auto", borderRadius: 8 }} />
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

          {note && (
            <div className="mt-2 text-xs text-gray-700">
              {note}
            </div>
          )}

          <div className="text-xs text-gray-600 mt-2">
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
