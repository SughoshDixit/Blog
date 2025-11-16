import { useEffect, useMemo, useRef, useState } from "react";

function PrintSummary({ title, abstract, headings = [], headerImage, articleRef }) {
  const [allImages, setAllImages] = useState([]); // [{src, caption}]
  const [selected, setSelected] = useState({});
  const [landscape, setLandscape] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [dragIndex, setDragIndex] = useState(null);
  const [note, setNote] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [takeawaySelection, setTakeawaySelection] = useState({});
  const printContainerRef = useRef(null);
  const storageKey = `printSummary:${title || "post"}`;

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return;
      if ((e.key === 'l' || e.key === 'L')) { setLandscape((v) => !v); }
      if ((e.key === 'c' || e.key === 'C')) { setShowCaptions((v) => !v); }
      if ((e.key === 'p' || e.key === 'P')) { e.preventDefault(); handlePrint(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Load persisted state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const data = JSON.parse(raw);
        if (data?.selected) setSelected(data.selected);
        if (typeof data?.landscape === "boolean") setLandscape(data.landscape);
        if (typeof data?.showCaptions === "boolean") setShowCaptions(data.showCaptions);
        if (typeof data?.note === "string") setNote(data.note);
        if (data?.takeawaySelection) setTakeawaySelection(data.takeawaySelection);
      }
    } catch {}
  }, [storageKey]);

  // Persist state
  useEffect(() => {
    try {
      const data = { selected, landscape, showCaptions, note, takeawaySelection };
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {}
  }, [selected, landscape, showCaptions, note, takeawaySelection, storageKey]);

  // Collect images (with captions) and smart auto-select based on alt and width
  useEffect(() => {
    const items = [];
    if (headerImage) items.push({ src: headerImage, caption: "", score: 1 });
    try {
      if (articleRef?.current) {
        const nodes = Array.from(articleRef.current.querySelectorAll("img"));
        for (const img of nodes) {
          if (!img?.src) continue;
          const score = (img.naturalWidth || 0) + (img.alt ? 500 : 0);
          items.push({ src: img.src, caption: img.alt || "", score });
        }
      }
    } catch (e) {}
    // sort by score desc and take top 8
    items.sort((a, b) => (b.score || 0) - (a.score || 0));
    const limited = items.slice(0, 8).map(({ src, caption }) => ({ src, caption }));
    setAllImages(limited);
    setSelected((prev) => {
      if (Object.keys(prev).length > 0) return prev;
      const defSel = {};
      limited.forEach((it, i) => { defSel[it.src] = i < 3; });
      return defSel;
    });
  }, [headerImage, articleRef]);

  // Takeaways list from headings with selection
  const allTakeaways = useMemo(() => (headings || []).filter((h) => h.depth === 2 || h.depth === 3).map((h) => h.text), [headings]);
  useEffect(() => {
    if (!allTakeaways || allTakeaways.length === 0) return;
    setTakeawaySelection((prev) => {
      if (Object.keys(prev).length > 0) return prev;
      const init = {};
      allTakeaways.forEach((t, i) => { init[t] = i < 3; });
      return init;
    });
  }, [allTakeaways]);

  const chosenTakeaways = useMemo(() => {
    const chosen = (allTakeaways || []).filter((t) => takeawaySelection[t]);
    if (chosen.length > 0) return chosen;
    return (allTakeaways || []).slice(0, 3);
  }, [allTakeaways, takeawaySelection]);

  const handleToggleTakeaway = (t) => {
    setTakeawaySelection((prev) => ({ ...prev, [t]: !prev[t] }));
  };

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
  const onDragOver = (index) => (e) => { e.preventDefault(); e.dataTransfer && (e.dataTransfer.dropEffect = "move"); };
  const onDrop = (index) => (e) => { e.preventDefault(); if (dragIndex==null||dragIndex===index) return; moveImage(dragIndex,index); setDragIndex(null); };
  const touchStartRef = useRef(null);
  const onTouchStart = (index) => () => { touchStartRef.current=index; setDragIndex(index); };
  const onTouchEnd = (index) => () => { if (touchStartRef.current!=null && touchStartRef.current!==index){ moveImage(touchStartRef.current,index);} touchStartRef.current=null; setDragIndex(null); };

  const handlePrint = () => {
    try {
      if (landscape) document.body.classList.add("print-landscape");
      document.body.classList.add("print-summary-only");
      setTimeout(() => { window.print(); setTimeout(() => { document.body.classList.remove("print-summary-only"); document.body.classList.remove("print-landscape"); }, 50); }, 50);
    } catch (e) { document.body.classList.remove("print-summary-only"); document.body.classList.remove("print-landscape"); }
  };

  // Compose state for sharing
  const buildState = () => {
    const imgs = allImages.filter((it) => selected[it.src]).map((it) => it.src);
    return { t: title, a: abstract, i: imgs, k: chosenTakeaways, n: note, l: landscape ? 1 : 0, c: showCaptions ? 1 : 0 };
  };

  const handleShare = async () => {
    try {
      const state = buildState();
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(state))));
      const url = `${window.location.origin}${window.location.pathname}#summary=${encoded}`;
      await navigator.clipboard.writeText(url);
      setShareUrl(url);
      setIsSharing(true);
      setTimeout(() => setIsSharing(false), 3000);
    } catch (e) {
      setShareUrl("");
      setIsSharing(true);
      setTimeout(() => setIsSharing(false), 3000);
    }
  };

  const handleEmail = async (toOverride) => {
    try {
      setEmailStatus("");
      const to = toOverride || emailTo;
      if (!to) {
        setEmailStatus("Enter recipient email");
        return;
      }
      const state = buildState();
      const resp = await fetch('/api/email-summary', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to, title: state.t, abstract: state.a, images: state.i, takeaways: state.k, note: state.n }) });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        setEmailStatus(data.error || 'Failed to send');
      } else {
        setEmailStatus('Email sent');
      }
    } catch (e) {
      setEmailStatus('Failed to send');
    }
  };

  const handleDownloadDoc = () => {
    const state = buildState();
    const imagesHtml = state.i.map((src, i) => `<div style="margin:12px 0;"><img src="${src}" alt="Chart ${i+1}" style="max-width:100%;" /></div>`).join("");
    const takeawaysHtml = state.k.length ? `<ol>${state.k.map((t) => `<li>${escapeHtml(String(t))}</li>`).join("")}</ol>` : "";
    const noteHtml = state.n ? `<p><em>${escapeHtml(String(state.n))}</em></p>` : "";
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><h1>${escapeHtml(String(state.t||'Summary'))}</h1>${state.a?`<p>${escapeHtml(String(state.a))}</p>`:""}${imagesHtml}${takeawaysHtml}${noteHtml}</body></html>`;
    const blob = new Blob(["\ufeff" + html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `summary_${Date.now()}.doc`; a.click(); URL.revokeObjectURL(url);
  };

  // Compose a PNG; in landscape, arrange charts in two columns
  const handleDownloadPng = async () => {
    try {
      const chosen = allImages.filter((it) => selected[it.src]);
      const width = landscape ? 1400 : 1024;
      const margin = 24;
      const gutter = 16;
      const lineHeight = 28;
      const titleHeight = 40;
      const abstractLines = abstract ? Math.ceil(abstract.length / 80) : 0;
      const abstractHeight = abstract ? abstractLines * lineHeight + margin : 0;
      const takeawaysHeight = chosenTakeaways.length ? (chosenTakeaways.length * lineHeight + margin) : 0;
      const noteLines = note ? Math.ceil(note.length / 90) : 0;
      const noteHeight = note ? noteLines * lineHeight + margin : 0;

      // Preload images
      const bitmaps = [];
      for (const it of chosen) {
        const img = await loadImage(it.src);
        bitmaps.push({ img, caption: it.caption, w: img.width, h: img.height });
      }

      // Layout images
      let imagesHeight = 0;
      if (landscape && bitmaps.length) {
        const colWidth = (width - margin * 2 - gutter) / 2;
        const scaled = bitmaps.map(({ img, caption }) => {
          const scale = Math.min(1, colWidth / img.width);
          const w = img.width * scale;
          const h = img.height * scale;
          const capH = showCaptions && caption ? lineHeight : 0;
          return { img, caption, w, h, capH };
        });
        let colHeights = [0, 0];
        scaled.forEach((b) => {
          const col = colHeights[0] <= colHeights[1] ? 0 : 1;
          colHeights[col] += b.h + b.capH + gutter;
        });
        imagesHeight = Math.max(colHeights[0], colHeights[1]);
      } else {
        const scaled = bitmaps.map(({ img, caption }) => {
          const scale = Math.min(1, (width - margin * 2) / img.width);
          const w = img.width * scale;
          const h = img.height * scale;
          const capH = showCaptions && caption ? lineHeight : 0;
          return { img, caption, w, h, capH };
        });
        imagesHeight = scaled.reduce((acc, b) => acc + b.h + b.capH + margin, 0);
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
        const scaled = bitmaps.map(({ img, caption }) => {
          const scale = Math.min(1, colWidth / img.width);
          const w = img.width * scale;
          const h = img.height * scale;
          const capH = showCaptions && caption ? lineHeight : 0;
          return { img, caption, w, h, capH };
        });
        let colY = [y, y];
        scaled.forEach((b) => {
          const col = colY[0] <= colY[1] ? 0 : 1;
          const x = margin + (col === 0 ? 0 : colWidth + gutter) + (colWidth - b.w) / 2;
          positions.push({ x, y: colY[col], b });
          colY[col] += b.h + b.capH + gutter;
        });
        positions.forEach(({ x, y: yy, b }) => {
          ctx.drawImage(b.img, x, yy, b.w, b.h);
          if (showCaptions && b.caption) {
            ctx.font = "italic 12px Inter, Arial, sans-serif";
            ctx.fillStyle = "#374151";
            ctx.fillText(truncate(b.caption, 80), x, yy + b.h + 14);
          }
        });
        y = Math.max(colY[0], colY[1]);
      } else {
        for (const { img, caption } of bitmaps) {
          const scale = Math.min(1, (width - margin * 2) / img.width);
          const drawW = img.width * scale;
          const drawH = img.height * scale;
          const x = (width - drawW) / 2;
          ctx.drawImage(img, x, y, drawW, drawH);
          y += drawH;
          if (showCaptions && caption) {
            ctx.font = "italic 12px Inter, Arial, sans-serif";
            ctx.fillStyle = "#374151";
            y += 14;
            ctx.fillText(truncate(caption, 90), x, y);
          }
          y += margin;
        }
      }

      // Takeaways
      if (chosenTakeaways.length) {
        ctx.font = "bold 18px Inter, Arial, sans-serif";
        ctx.fillStyle = "#111827";
        ctx.fillText("Key Takeaways", margin, y + 20);
        y += 24;
        ctx.font = "16px Inter, Arial, sans-serif";
        chosenTakeaways.forEach((t, i) => {
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
        ctx.fillStyle = "#111827";
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
        <button
          type="button"
          onClick={handleDownloadDoc}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm"
          aria-label="Download summary DOC"
        >
          Download Summary (DOC)
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
          aria-label="Share summary"
        >
          {isSharing ? "Sharing..." : "Share Summary"}
        </button>
        <div className="flex items-center gap-2">
          <input type="email" value={emailTo} onChange={(e)=>setEmailTo(e.target.value)} placeholder="recipient@example.com" className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800" />
          <button type="button" onClick={()=>handleEmail()} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm" aria-label="Email summary">Email Summary</button>
          <button type="button" onClick={()=>handleEmail(process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'sughoshpdixit@gmail.com')} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm" aria-label="Email to admin">Send to Admin</button>
          {emailStatus && <span className="text-xs text-gray-600 dark:text-gray-300">{emailStatus}</span>}
        </div>
        <label className="text-xs sm:text-sm flex items-center gap-2 text-gray-700 dark:text-gray-200 ml-2">
          <input type="checkbox" checked={landscape} onChange={(e) => setLandscape(e.target.checked)} />
          Landscape
        </label>
        <label className="text-xs sm:text-sm flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <input type="checkbox" checked={showCaptions} onChange={(e) => setShowCaptions(e.target.checked)} />
          Show captions
        </label>
      </div>

      {/* Takeaways selection */}
      {allTakeaways && allTakeaways.length > 0 && (
        <div className="mt-3 p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/60">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">Select takeaways to include</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allTakeaways.map((t) => (
              <label key={t} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-200">
                <input type="checkbox" checked={!!takeawaySelection[t]} onChange={()=>handleToggleTakeaway(t)} />
                <span className="truncate" title={t}>{t}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Live preview */}
      <div className="mt-3 p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/60">
        <div className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">Preview</div>
        <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800">
          <h3 className="text-base font-semibold mb-1">{title}</h3>
          {abstract && <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">{abstract}</p>}
          {allImages && allImages.filter((it) => selected[it.src]).length > 0 && (
            <div className={`${landscape ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-1 gap-3'} mb-3`}>
              {allImages.filter((it) => selected[it.src]).map((it, idx) => (
                <div key={it.src}>
                  <img src={it.src} alt={it.caption || `Chart ${idx + 1}`} className="w-full h-auto rounded" />
                  {showCaptions && (it.caption || "") && (
                    <div className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">{it.caption}</div>
                  )}
                </div>
              ))}
            </div>
          )}
          {chosenTakeaways.length > 0 && (
            <ul className="list-disc pl-5 text-xs text-gray-700 dark:text-gray-200 mb-2">
              {chosenTakeaways.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          {note && (
            <div className="text-[11px] text-gray-700 dark:text-gray-300 italic">{note}</div>
          )}
        </div>
      </div>

      {/* Chart selection & DnD reorder (touch + mouse) */}
      {allImages && allImages.length > 0 && (
        <div className="mt-3 p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/60">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">Select charts to include (drag to reorder)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allImages.map((it, i) => (
              <div
                key={it.src}
                className={`flex items-center justify-between gap-2 text-xs text-gray-700 dark:text-gray-200 rounded border border-transparent ${dragIndex===i? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700':''}`}
                draggable
                onDragStart={onDragStart(i)}
                onDragOver={onDragOver(i)}
                onDrop={onDrop(i)}
                onTouchStart={onTouchStart(i)}
                onTouchEnd={onTouchEnd(i)}
              >
                <label className="flex items-center gap-2 p-1">
                  <input type="checkbox" checked={!!selected[it.src]} onChange={() => handleToggle(it.src)} />
                  <span className="truncate max-w-[200px]" title={it.caption || it.src}>Chart {i + 1}</span>
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

          {allImages && allImages.filter((it) => selected[it.src]).length > 0 && (
            <div className={`${landscape ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-1 gap-3'} mb-4`}>
              {allImages.filter((it) => selected[it.src]).map((it, idx) => (
                <div key={idx}>
                  <img src={it.src} alt={`Key chart ${idx + 1}`} style={{ width: "100%", height: "auto", borderRadius: 8 }} />
                  {showCaptions && (it.caption || "") && (
                    <div style={{ fontSize: 12, color: '#374151', marginTop: 6, fontStyle: 'italic' }}>{it.caption}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {chosenTakeaways && chosenTakeaways.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1">Key Takeaways</h2>
              <ol className="list-decimal pl-5 text-sm">
                {chosenTakeaways.map((t, i) => (
                  <li key={i} className="mb-1">{t}</li>
                ))}
              </ol>
            </div>
          )}

          {note && (
            <div className="mt-2 text-xs text-gray-700" style={{ fontStyle: 'italic' }}>
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

function truncate(s, n) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

export default PrintSummary;
