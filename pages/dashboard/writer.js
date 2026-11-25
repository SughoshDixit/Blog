import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { onAuthStateChanged } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../../Firebase/Firebase";
import {
  FiArrowLeft,
  FiEdit3,
  FiColumns,
  FiEye,
  FiSliders,
  FiImage,
  FiSave,
  FiDownload,
  FiCopy,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
  FiZap,
  FiX,
} from "react-icons/fi";

const MDXRemote = dynamic(
  () => import("next-mdx-remote").then((mod) => mod.MDXRemote),
  { ssr: false }
);

const ADMIN_EMAIL = "sughoshpdixit@gmail.com";
const DRAFT_KEY = "sd_dashboard_writer_draft";

function slugifyTitle(title) {
  return String(title || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function makeInitialState() {
  return {
    fileName: "",
    id: String(Math.floor(100 + Math.random() * 900)),
    title: "",
    author: "Sughosh P Dixit",
    date: new Date().toISOString().split("T")[0],
    tags: "",
    topic: "Data Science",
    abstract: "",
    headerImage: "",
    isPublished: false,
    prominentShelf: true,
    unlisted: false,
    body: "",
  };
}

function buildMarkdownDocument(form) {
  const esc = (v) => String(v || "").replace(/"/g, '\\"');
  const safeName = form.fileName || slugifyTitle(form.title) || "new-article";
  const frontMatter = [
    "---",
    `Id: ${esc(form.id)}`,
    `Title: "${esc(form.title)}"`,
    `Author: ${esc(form.author)}`,
    `Date: "${esc(form.date)}"`,
    `Tags: ${esc(form.tags)}`,
    `Topic: ${esc(form.topic)}`,
    `Abstract: "${esc(form.abstract)}"`,
    `HeaderImage: ${esc(form.headerImage)}`,
    `isPublished: ${Boolean(form.isPublished)}`,
    `prominentShelf: ${form.prominentShelf !== false}`,
    `unlisted: ${Boolean(form.unlisted)}`,
    "---",
    "",
  ].join("\n");

  return { fileName: safeName, markdown: `${frontMatter}${form.body || ""}\n` };
}

export default function DedicatedBlogWriter() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [formState, setFormState] = useState(makeInitialState);
  const [manualFileName, setManualFileName] = useState(false);
  const [viewMode, setViewMode] = useState("split"); // "edit" | "split" | "preview"
  const [showSettings, setShowSettings] = useState(false);
  const [showCoach, setShowCoach] = useState(false);

  const [previewContent, setPreviewContent] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const [coachLoading, setCoachLoading] = useState(false);
  const [coachResult, setCoachResult] = useState(null);

  const textareaRef = useRef(null);
  const bodyImageInputRef = useRef(null);
  const headerImageInputRef = useRef(null);

  // Admin gate (Firebase Auth + localStorage cache)
  useEffect(() => {
    try {
      const cached = JSON.parse(localStorage.getItem("user") || "null");
      if (cached?.email?.toLowerCase() === ADMIN_EMAIL) {
        setIsAdmin(true);
      }
    } catch {
      // Ignore
    }

    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAdmin(user?.email?.toLowerCase() === ADMIN_EMAIL);
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  // Restore saved draft
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setFormState((prev) => ({ ...prev, ...parsed }));
          if (parsed.fileName) setManualFileName(true);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formState));
    } catch {
      // Ignore quota errors
    }
  }, [formState]);

  // Debounced MDX preview
  useEffect(() => {
    if (!formState.body?.trim()) {
      setPreviewContent(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsPreviewLoading(true);
      try {
        const res = await fetch("/api/writer/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: formState.body }),
        });
        if (!res.ok) throw new Error("Preview failed");
        const data = await res.json();
        setPreviewContent(data);
      } catch {
        setPreviewContent(null);
      } finally {
        setIsPreviewLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formState.body]);

  const wordStats = useMemo(() => {
    const words = (formState.body || "").trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 220));
    return { words, minutes };
  }, [formState.body]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "fileName") setManualFileName(Boolean(value.trim()));
    setFormState((prev) => {
      const next = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "title" && !manualFileName) {
        next.fileName = slugifyTitle(value);
      }
      return next;
    });
  };

  const getAuthHeaders = async () => {
    const headers = { "Content-Type": "application/json" };
    try {
      const token = await auth.currentUser?.getIdToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    } catch {
      // Fallback
    }
    return headers;
  };

  const insertMarkdown = (before, after = "", placeholder = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = formState.body.substring(start, end) || placeholder;
    const updated =
      formState.body.substring(0, start) +
      before +
      selected +
      after +
      formState.body.substring(end);

    setFormState((prev) => ({ ...prev, body: updated }));
    setTimeout(() => {
      textarea.focus();
      const pos = start + before.length + selected.length;
      textarea.setSelectionRange(pos, pos);
    }, 0);
  };

  const handleEditorKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
      if (e.key.toLowerCase() === "b") {
        e.preventDefault();
        insertMarkdown("**", "**", "bold text");
      } else if (e.key.toLowerCase() === "i") {
        e.preventDefault();
        insertMarkdown("*", "*", "italic text");
      } else if (e.key.toLowerCase() === "k") {
        e.preventDefault();
        insertMarkdown("[", "](https://)", "link text");
      }
    }
  };

  const uploadImageFile = async (file, target = "body") => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus({ type: "error", message: "Please select a valid image file." });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setStatus({ type: "error", message: "Image size must be under 8 MB." });
      return;
    }

    setIsUploading(true);
    setStatus({ type: "loading", message: "Attaching image..." });

    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.onerror = () => reject(new Error("Failed to read image."));
        reader.readAsDataURL(file);
      });

      const headers = await getAuthHeaders();
      const res = await fetch("/api/writer/upload-image", {
        method: "POST",
        headers,
        body: JSON.stringify({
          image: dataUrl,
          fileName: file.name,
          folder: formState.fileName || slugifyTitle(formState.title) || "uploads",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Image upload failed");

      let finalUrl = json.url;
      let finalMsg = json.message || "Image attached!";

      // On read-only production hosts (Vercel), upload to Firebase Storage for a clean permanent URL
      if (json.readOnlyEnv) {
        try {
          const storage = getStorage();
          const folder = (formState.fileName || slugifyTitle(formState.title) || "uploads").replace(/[^a-zA-Z0-9-_]/g, "-");
          const safeName = (file.name || "pasted-image.png").replace(/[^a-zA-Z0-9.-]/g, "-");
          const imgRef = storageRef(storage, `blog-writer/${folder}/${Date.now()}-${safeName}`);
          await uploadBytes(imgRef, file);
          finalUrl = await getDownloadURL(imgRef);
          finalMsg = "Image uploaded to Firebase Storage!";
        } catch {
          // Keep inline preview data URL if Firebase Storage rules reject upload
        }
      }

      if (target === "header") {
        setFormState((prev) => ({ ...prev, headerImage: finalUrl }));
      } else {
        const alt = (file.name || "image").replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        insertMarkdown(`\n![${alt}](${finalUrl})\n`, "", "");
      }
      setStatus({ type: "success", message: finalMsg });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  const runWritingCoach = async (action) => {
    setShowCoach(true);
    setCoachLoading(true);
    try {
      const textarea = textareaRef.current;
      const selection =
        textarea && textarea.selectionStart !== textarea.selectionEnd
          ? formState.body.substring(textarea.selectionStart, textarea.selectionEnd)
          : "";

      const headers = await getAuthHeaders();
      const res = await fetch("/api/writer/assist", {
        method: "POST",
        headers,
        body: JSON.stringify({
          action,
          title: formState.title,
          body: formState.body,
          selection,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Writing coach failed.");
      setCoachResult(data);
    } catch (err) {
      setCoachResult({ error: err.message });
    } finally {
      setCoachLoading(false);
    }
  };

  const applyGrammarReplacement = (matchedText, replacement) => {
    if (!matchedText || !replacement) return;
    setFormState((prev) => ({
      ...prev,
      body: prev.body.replace(matchedText, replacement),
    }));
    setCoachResult((prev) =>
      prev?.matches
        ? {
            ...prev,
            matches: prev.matches.filter((m) => m.matchedText !== matchedText),
          }
        : prev
    );
  };

  const handleSave = async () => {
    if (!formState.title.trim() || !formState.body.trim()) {
      setStatus({ type: "error", message: "Add a title and some content before saving." });
      return;
    }

    setStatus({ type: "loading", message: "Saving post..." });
    try {
      const headers = await getAuthHeaders();
      const payload = {
        ...formState,
        fileName: formState.fileName || slugifyTitle(formState.title) || "new-article",
        abstract:
          formState.abstract.trim() ||
          formState.body.replace(/[#*_`>\[\]()!-]/g, " ").trim().slice(0, 160),
      };
      const res = await fetch("/api/writer/save-post", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Save failed.");
      setStatus({ type: "success", message: json.message || "Saved!" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleDownload = () => {
    const { fileName, markdown } = buildMarkdownDocument(formState);
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus({ type: "success", message: `Downloaded ${fileName}.md` });
  };

  const handleCopy = async () => {
    try {
      const { markdown } = buildMarkdownDocument(formState);
      await navigator.clipboard.writeText(markdown);
      setStatus({ type: "success", message: "Full markdown copied to clipboard!" });
    } catch {
      setStatus({ type: "error", message: "Failed to copy." });
    }
  };

  const handleClear = () => {
    setFormState(makeInitialState());
    setManualFileName(false);
    setCoachResult(null);
    localStorage.removeItem(DRAFT_KEY);
    setStatus({ type: "idle", message: "" });
  };

  if (authChecked && !isAdmin) {
    return (
      <>
        <Head>
          <title>Writer Studio — Restricted</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="min-h-screen bg-[#FAF8F6] dark:bg-[#161513] flex items-center justify-center px-4">
          <div className="max-w-md w-full rounded-2xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] p-8 text-center">
            <h1
              className="text-2xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-2"
              style={{ fontFamily: "Charter, Georgia, serif" }}
            >
              Admin Access Required
            </h1>
            <p className="text-sm text-[#6E6B68] dark:text-[#B8B4B0] mb-6">
              Please sign in as <span className="font-medium">{ADMIN_EMAIL}</span> to use the Blog Writer Studio.
            </p>
            <Link href="/dashboard">
              <a className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C74634] text-white text-sm font-semibold hover:bg-[#A73A2C] transition-colors">
                <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
              </a>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const toolbarButtons = [
    { label: "H1", action: () => insertMarkdown("# ", "", "Heading 1") },
    { label: "H2", action: () => insertMarkdown("## ", "", "Heading 2") },
    { label: "H3", action: () => insertMarkdown("### ", "", "Heading 3") },
    { label: "Bold", action: () => insertMarkdown("**", "**", "bold") },
    { label: "Italic", action: () => insertMarkdown("*", "*", "italic") },
    { label: "Link", action: () => insertMarkdown("[", "](https://)", "link text") },
    { label: "Quote", action: () => insertMarkdown("> ", "", "quote") },
    { label: "Code", action: () => insertMarkdown("```\n", "\n```", "code") },
    { label: "List", action: () => insertMarkdown("- ", "", "item") },
    { label: "Divider", action: () => insertMarkdown("\n---\n", "", "") },
  ];

  const inputClass =
    "w-full px-3.5 py-2 rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-[#FAF8F6] dark:bg-[#201E1C] text-sm text-[#161513] dark:text-[#F5F4F2] focus:outline-none focus:border-[#C74634]";

  return (
    <>
      <Head>
        <title>{formState.title ? `${formState.title} — Writer` : "Blog Writer Studio — Sughosh Dixit"}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#FAF8F6] dark:bg-[#161513]">
        {/* Sticky Top Studio Header */}
        <header className="sticky top-0 z-30 border-b border-[#E0DDD9] dark:border-[#3D3A36] bg-white/95 dark:bg-[#201E1C]/95 backdrop-blur-md px-4 sm:px-6 py-3">
          <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <a className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6E6B68] dark:text-[#B8B4B0] hover:text-[#C74634] transition-colors">
                  <FiArrowLeft className="w-4 h-4" />
                  <span>Dashboard</span>
                </a>
              </Link>
              <span className="text-[#E0DDD9] dark:text-[#3D3A36]">|</span>
              <span className="text-xs text-[#6E6B68] dark:text-[#B8B4B0]">
                {wordStats.words} words · ~{wordStats.minutes} min read · Auto-saved
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* View Mode */}
              <div className="inline-flex rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-[#FAF8F6] dark:bg-[#2C2A27] p-0.5">
                {[
                  { id: "edit", label: "Write", icon: <FiEdit3 className="w-3.5 h-3.5" /> },
                  { id: "split", label: "Split", icon: <FiColumns className="w-3.5 h-3.5" /> },
                  { id: "preview", label: "Preview", icon: <FiEye className="w-3.5 h-3.5" /> },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setViewMode(m.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      viewMode === m.id
                        ? "bg-[#C74634] text-white"
                        : "text-[#6E6B68] dark:text-[#B8B4B0]"
                    }`}
                  >
                    {m.icon}
                    <span className="hidden sm:inline">{m.label}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => runWritingCoach("grammar")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                  showCoach
                    ? "border-[#C74634] bg-[#C74634]/10 text-[#C74634] dark:text-[#E8572A]"
                    : "border-[#E0DDD9] dark:border-[#3D3A36] text-[#161513] dark:text-[#F5F4F2] hover:border-[#C74634]"
                }`}
              >
                <FiZap className="w-3.5 h-3.5" />
                Writing Coach
              </button>

              <button
                type="button"
                onClick={() => setShowSettings((s) => !s)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                  showSettings
                    ? "border-[#C74634] bg-[#C74634]/10 text-[#C74634] dark:text-[#E8572A]"
                    : "border-[#E0DDD9] dark:border-[#3D3A36] text-[#161513] dark:text-[#F5F4F2] hover:border-[#C74634]"
                }`}
              >
                <FiSliders className="w-3.5 h-3.5" />
                Post Settings
              </button>

              <button
                type="button"
                onClick={handleDownload}
                title="Download .md"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E0DDD9] dark:border-[#3D3A36] text-xs font-medium text-[#161513] dark:text-[#F5F4F2] hover:border-[#C74634] cursor-pointer"
              >
                <FiDownload className="w-3.5 h-3.5" />
                <span className="hidden md:inline">.md</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                title="Copy Markdown"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E0DDD9] dark:border-[#3D3A36] text-xs font-medium text-[#161513] dark:text-[#F5F4F2] hover:border-[#C74634] cursor-pointer"
              >
                <FiCopy className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={status.type === "loading"}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#C74634] hover:bg-[#A73A2C] text-white text-xs font-semibold cursor-pointer disabled:opacity-60"
              >
                <FiSave className="w-3.5 h-3.5" />
                Save
              </button>
            </div>
          </div>

          {status.type !== "idle" && status.message && (
            <div
              className={`max-w-[1600px] mx-auto mt-2.5 flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl text-xs ${
                status.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                  : status.type === "error"
                  ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300"
                  : "bg-[#FAF8F6] dark:bg-[#2C2A27] text-[#6E6B68] dark:text-[#B8B4B0]"
              }`}
            >
              <span className="flex items-center gap-2">
                {status.type === "success" ? <FiCheckCircle /> : status.type === "error" ? <FiAlertCircle /> : null}
                {status.message}
              </span>
              <button type="button" onClick={() => setStatus({ type: "idle", message: "" })} className="cursor-pointer">
                <FiX />
              </button>
            </div>
          )}
        </header>

        {/* Collapsible Post Settings Drawer */}
        {showSettings && (
          <div className="border-b border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] px-4 sm:px-6 py-5">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6E6B68] dark:text-[#B8B4B0] mb-1">
                  File Slug (.md)
                </label>
                <input name="fileName" value={formState.fileName} onChange={handleChange} placeholder="auto-from-title" className={inputClass} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6E6B68] dark:text-[#B8B4B0] mb-1">
                  Post ID
                </label>
                <input name="id" value={formState.id} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6E6B68] dark:text-[#B8B4B0] mb-1">
                  Topic
                </label>
                <input name="topic" value={formState.topic} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6E6B68] dark:text-[#B8B4B0] mb-1">
                  Publish Date
                </label>
                <input type="date" name="date" value={formState.date} onChange={handleChange} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6E6B68] dark:text-[#B8B4B0] mb-1">
                  Tags (space-separated)
                </label>
                <input name="tags" value={formState.tags} onChange={handleChange} placeholder="DataScience Python Essays" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6E6B68] dark:text-[#B8B4B0] mb-1">
                  Cover Image URL
                </label>
                <div className="flex gap-2">
                  <input name="headerImage" value={formState.headerImage} onChange={handleChange} placeholder="/folder/cover.jpg" className={inputClass} />
                  <input ref={headerImageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => uploadImageFile(e.target.files?.[0], "header")} />
                  <button type="button" onClick={() => headerImageInputRef.current?.click()} className="px-3 rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] text-[#161513] dark:text-[#F5F4F2] hover:border-[#C74634] cursor-pointer">
                    <FiImage />
                  </button>
                </div>
              </div>
              <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap items-center justify-between gap-4 pt-1 text-sm text-[#161513] dark:text-[#F5F4F2]">
                <div className="flex flex-wrap items-center gap-6">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isPublished" checked={formState.isPublished} onChange={handleChange} />
                    <span>Published</span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="prominentShelf" checked={formState.prominentShelf} onChange={handleChange} />
                    <span>Prominent Shelf</span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="unlisted" checked={formState.unlisted} onChange={handleChange} />
                    <span>Unlisted</span>
                  </label>
                </div>
                <button type="button" onClick={handleClear} className="inline-flex items-center gap-1.5 text-xs text-[#6E6B68] hover:text-[#C74634] cursor-pointer">
                  <FiTrash2 /> Clear Draft
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Workspace */}
        <div className="flex-1 flex overflow-hidden">
          <div
            className={`flex-1 grid ${
              viewMode === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
            } divide-y lg:divide-y-0 lg:divide-x divide-[#E0DDD9] dark:divide-[#3D3A36]`}
          >
            {/* Editor Pane */}
            {viewMode !== "preview" && (
              <div className="flex flex-col bg-white dark:bg-[#201E1C] overflow-y-auto">
                {/* Inline Formatting Toolbar */}
                <div className="sticky top-0 z-10 bg-[#FAF8F6] dark:bg-[#2C2A27] border-b border-[#E0DDD9] dark:border-[#3D3A36] px-4 sm:px-6 py-2 flex flex-wrap items-center gap-1.5">
                  {toolbarButtons.map((btn) => (
                    <button
                      key={btn.label}
                      type="button"
                      onClick={btn.action}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#201E1C] border border-[#E0DDD9] dark:border-[#3D3A36] text-[#161513] dark:text-[#F5F4F2] hover:border-[#C74634] cursor-pointer"
                    >
                      {btn.label}
                    </button>
                  ))}
                  <input ref={bodyImageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => uploadImageFile(e.target.files?.[0], "body")} />
                  <button
                    type="button"
                    onClick={() => bodyImageInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#C74634] text-white hover:bg-[#A73A2C] cursor-pointer disabled:opacity-60"
                  >
                    <FiImage className="w-3.5 h-3.5" />
                    {isUploading ? "Uploading..." : "Attach Image"}
                  </button>
                </div>

                {/* Medium-style Title + Abstract + Body Canvas */}
                <div className="max-w-3xl w-full mx-auto px-6 sm:px-10 py-8 flex-1 flex flex-col">
                  <input
                    name="title"
                    value={formState.title}
                    onChange={handleChange}
                    spellCheck={true}
                    placeholder="Write your article title..."
                    className="w-full bg-transparent text-3xl sm:text-4xl font-semibold text-[#161513] dark:text-[#F5F4F2] placeholder-[#B8B4B0] dark:placeholder-[#6E6B68] focus:outline-none mb-3"
                    style={{ fontFamily: "Charter, Georgia, serif" }}
                  />
                  <textarea
                    name="abstract"
                    value={formState.abstract}
                    onChange={handleChange}
                    spellCheck={true}
                    rows={2}
                    placeholder="Add a brief 1–2 sentence subtitle or summary..."
                    className="w-full bg-transparent text-base text-[#5e5645] dark:text-[#B8B4B0] placeholder-[#B8B4B0] dark:placeholder-[#6E6B68] focus:outline-none resize-none pb-4 mb-5 border-b border-[#E0DDD9] dark:border-[#3D3A36]"
                  />
                  <textarea
                    ref={textareaRef}
                    name="body"
                    value={formState.body}
                    onChange={handleChange}
                    onKeyDown={handleEditorKeyDown}
                    spellCheck={true}
                    onDrop={(e) => {
                      const file = e.dataTransfer?.files?.[0];
                      if (file && file.type.startsWith("image/")) {
                        e.preventDefault();
                        uploadImageFile(file, "body");
                      }
                    }}
                    onPaste={(e) => {
                      const fileFromFiles = Array.from(e.clipboardData?.files || []).find((f) =>
                        f.type.startsWith("image/")
                      );
                      const itemImage = Array.from(e.clipboardData?.items || []).find((it) =>
                        it.type.startsWith("image/")
                      );
                      const imageFile = fileFromFiles || itemImage?.getAsFile();
                      if (imageFile) {
                        e.preventDefault();
                        uploadImageFile(imageFile, "body");
                        return;
                      }

                      // If user copied an image from a webpage (HTML <img> with no plain text)
                      const plain = e.clipboardData?.getData("text/plain") || "";
                      const html = e.clipboardData?.getData("text/html") || "";
                      if (!plain.trim() && html) {
                        const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
                        if (match?.[1]) {
                          e.preventDefault();
                          insertMarkdown(`\n![image](${match[1]})\n`, "", "");
                        }
                      }
                    }}
                    placeholder="Tell your story in Markdown... (Tip: Ctrl+B bold, Ctrl+I italic, drag-and-drop or paste images, Grammarly works right here)"
                    className="w-full flex-1 min-h-[460px] bg-transparent text-base leading-relaxed text-[#161513] dark:text-[#F5F4F2] placeholder-[#B8B4B0] dark:placeholder-[#6E6B68] focus:outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {/* Live Blog Preview Pane */}
            {viewMode !== "edit" && (
              <div className="bg-[#FAF8F6] dark:bg-[#161513] px-6 sm:px-10 py-8 overflow-y-auto">
                <article className="max-w-3xl mx-auto">
                  {formState.topic && (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C74634]/10 text-[#C74634] dark:text-[#E8572A] mb-3">
                      {formState.topic}
                    </span>
                  )}
                  <h1
                    className="text-3xl sm:text-4xl font-semibold text-[#161513] dark:text-[#F5F4F2] leading-tight mb-3"
                    style={{ fontFamily: "Charter, Georgia, serif" }}
                  >
                    {formState.title || "Your Article Title"}
                  </h1>
                  {formState.abstract && (
                    <p className="text-base text-[#5e5645] dark:text-[#B8B4B0] leading-relaxed mb-4">
                      {formState.abstract}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#6E6B68] dark:text-[#B8B4B0] pb-5 mb-6 border-b border-[#E0DDD9] dark:border-[#3D3A36]">
                    <span className="font-semibold text-[#161513] dark:text-[#F5F4F2]">
                      {formState.author || "Sughosh P Dixit"}
                    </span>
                    <span>·</span>
                    <span>{formState.date}</span>
                    <span>·</span>
                    <span>{wordStats.minutes} min read</span>
                  </div>

                  {formState.headerImage && (
                    <div className="mb-6 rounded-2xl overflow-hidden border border-[#E0DDD9] dark:border-[#3D3A36]">
                      <img src={formState.headerImage} alt={formState.title || "Cover"} className="w-full max-h-80 object-cover" />
                    </div>
                  )}

                  {isPreviewLoading && <p className="text-xs text-[#9a8f75] mb-3">Updating preview…</p>}

                  <div className="prose prose-sm sm:prose-lg dark:prose-invert max-w-none break-words">
                    {previewContent ? (
                      <MDXRemote {...previewContent} />
                    ) : (
                      <p className="text-sm text-[#6E6B68] dark:text-[#B8B4B0]">
                        Your formatted article preview will appear here as you write.
                      </p>
                    )}
                  </div>
                </article>
              </div>
            )}
          </div>

          {/* Writing Coach & Grammar Sidebar */}
          {showCoach && (
            <aside className="w-full sm:w-96 border-l border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] p-5 overflow-y-auto flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-[#161513] dark:text-[#F5F4F2] flex items-center gap-2">
                  <FiZap className="text-[#C74634]" /> Writing Coach
                </h2>
                <button type="button" onClick={() => setShowCoach(false)} className="text-[#6E6B68] hover:text-[#161513] cursor-pointer">
                  <FiX />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => runWritingCoach("grammar")} disabled={coachLoading} className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#C74634] text-white hover:bg-[#A73A2C] cursor-pointer disabled:opacity-60">
                  Grammar &amp; Style
                </button>
                <button type="button" onClick={() => runWritingCoach("titles")} disabled={coachLoading} className="px-3 py-2 rounded-xl text-xs font-medium border border-[#E0DDD9] dark:border-[#3D3A36] text-[#161513] dark:text-[#F5F4F2] hover:border-[#C74634] cursor-pointer disabled:opacity-60">
                  Title &amp; Abstract
                </button>
                <button type="button" onClick={() => runWritingCoach("polish")} disabled={coachLoading} className="px-3 py-2 rounded-xl text-xs font-medium border border-[#E0DDD9] dark:border-[#3D3A36] text-[#161513] dark:text-[#F5F4F2] hover:border-[#C74634] cursor-pointer disabled:opacity-60">
                  AI Polish
                </button>
                <button type="button" onClick={() => runWritingCoach("continue")} disabled={coachLoading} className="px-3 py-2 rounded-xl text-xs font-medium border border-[#E0DDD9] dark:border-[#3D3A36] text-[#161513] dark:text-[#F5F4F2] hover:border-[#C74634] cursor-pointer disabled:opacity-60">
                  Continue Writing
                </button>
              </div>

              {coachLoading && (
                <p className="text-xs text-[#6E6B68] dark:text-[#B8B4B0]">Analyzing your writing…</p>
              )}

              {coachResult?.error && (
                <p className="text-xs text-red-600 dark:text-red-400">{coachResult.error}</p>
              )}

              {coachResult?.readability && (
                <div className="rounded-xl bg-[#FAF8F6] dark:bg-[#201E1C] p-3 text-xs space-y-1 text-[#5e5645] dark:text-[#B8B4B0]">
                  <p className="font-semibold text-[#161513] dark:text-[#F5F4F2]">Readability</p>
                  <p>Words: {coachResult.readability.wordCount} · Sentences: {coachResult.readability.sentenceCount}</p>
                  <p>Avg sentence length: {coachResult.readability.avgWordsPerSentence} words</p>
                  {coachResult.readability.longSentences > 0 && (
                    <p className="text-[#C74634] dark:text-[#E8572A]">
                      {coachResult.readability.longSentences} long sentence(s) (&gt;28 words)
                    </p>
                  )}
                </div>
              )}

              {coachResult?.matches && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-[#161513] dark:text-[#F5F4F2]">
                    {coachResult.matches.length === 0
                      ? "No grammar or spelling issues found!"
                      : `${coachResult.matches.length} Grammar / Style Suggestions (LanguageTool)`}
                  </p>
                  {coachResult.matches.map((m) => (
                    <div key={m.id} className="rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] p-3 text-xs space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-[#C74634] dark:text-[#E8572A]">{m.shortMessage}</span>
                        {m.matchedText && (
                          <code className="px-1.5 py-0.5 rounded bg-[#FAF8F6] dark:bg-[#201E1C] text-[#161513] dark:text-[#F5F4F2]">
                            {m.matchedText}
                          </code>
                        )}
                      </div>
                      <p className="text-[#5e5645] dark:text-[#B8B4B0]">{m.message}</p>
                      {m.replacements?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {m.replacements.map((rep) => (
                            <button
                              key={rep}
                              type="button"
                              onClick={() => applyGrammarReplacement(m.matchedText, rep)}
                              className="px-2 py-1 rounded-lg bg-[#C74634]/10 text-[#C74634] dark:text-[#E8572A] hover:bg-[#C74634] hover:text-white font-medium cursor-pointer transition-colors"
                            >
                              Use &ldquo;{rep}&rdquo;
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {coachResult?.suggestion && (
                <div className="rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] p-3 text-xs whitespace-pre-wrap text-[#161513] dark:text-[#F5F4F2] leading-relaxed">
                  {coachResult.suggestion}
                </div>
              )}
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
