import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { auth } from "../Firebase/Firebase";
import {
  FiEdit3,
  FiEye,
  FiColumns,
  FiImage,
  FiSave,
  FiDownload,
  FiCopy,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

const MDXRemote = dynamic(
  () => import("next-mdx-remote").then((mod) => mod.MDXRemote),
  { ssr: false }
);

const DRAFT_STORAGE_KEY = "sd_dashboard_writer_draft";

function makeInitialState() {
  return {
    fileName: "new-article",
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
    body: "## Introduction\n\nStart writing your article here...\n",
  };
}

function buildMarkdownDocument(form) {
  const esc = (v) => String(v || "").replace(/"/g, '\\"');
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

  return `${frontMatter}${form.body || ""}\n`;
}

export default function BlogWriter() {
  const [isOpen, setIsOpen] = useState(true);
  const [formState, setFormState] = useState(makeInitialState);
  const [viewMode, setViewMode] = useState("split"); // "edit" | "split" | "preview"
  const [previewContent, setPreviewContent] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const textareaRef = useRef(null);
  const bodyImageInputRef = useRef(null);
  const headerImageInputRef = useRef(null);

  // Restore saved draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setFormState((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Persist draft automatically
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formState));
    } catch {
      // Ignore quota errors (e.g. large inline images)
    }
  }, [formState]);

  // Debounced MDX preview compilation
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
        if (!res.ok) throw new Error("Preview compilation failed");
        const data = await res.json();
        setPreviewContent(data);
      } catch {
        setPreviewContent(null);
      } finally {
        setIsPreviewLoading(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [formState.body]);

  const wordStats = useMemo(() => {
    const words = (formState.body || "").trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 220));
    return { words, minutes };
  }, [formState.body]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  const getAuthHeaders = async () => {
    const headers = { "Content-Type": "application/json" };
    try {
      const token = await auth.currentUser?.getIdToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    } catch {
      // Fallback to NextAuth cookie if present
    }
    return headers;
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
    setStatus({ type: "loading", message: "Uploading image..." });

    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.onerror = () => reject(new Error("Failed to read image file."));
        reader.readAsDataURL(file);
      });

      const headers = await getAuthHeaders();
      const res = await fetch("/api/writer/upload-image", {
        method: "POST",
        headers,
        body: JSON.stringify({
          image: dataUrl,
          fileName: file.name,
          folder: formState.fileName || "uploads",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Image upload failed");

      if (target === "header") {
        setFormState((prev) => ({ ...prev, headerImage: json.url }));
      } else {
        const alt = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        insertMarkdown(`\n![${alt}](${json.url})\n`, "", "");
      }

      setStatus({
        type: "success",
        message: json.message || "Image attached!",
      });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Saving post..." });

    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/writer/save-post", {
        method: "POST",
        headers,
        body: JSON.stringify(formState),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Unable to save post.");

      setStatus({ type: "success", message: json.message || "Saved!" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  const handleDownload = () => {
    const md = buildMarkdownDocument(formState);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const cleanName = (formState.fileName || "new-article").replace(/\.md$/i, "");
    a.href = url;
    a.download = `${cleanName}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus({ type: "success", message: `Downloaded ${cleanName}.md` });
  };

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(buildMarkdownDocument(formState));
      setStatus({ type: "success", message: "Full markdown copied to clipboard!" });
    } catch {
      setStatus({ type: "error", message: "Failed to copy to clipboard." });
    }
  };

  const handleReset = () => {
    const fresh = makeInitialState();
    setFormState(fresh);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setStatus({ type: "idle", message: "" });
  };

  const toolbarButtons = [
    { label: "H1", action: () => insertMarkdown("# ", "", "Heading 1") },
    { label: "H2", action: () => insertMarkdown("## ", "", "Heading 2") },
    { label: "H3", action: () => insertMarkdown("### ", "", "Heading 3") },
    { label: "Bold", action: () => insertMarkdown("**", "**", "bold text") },
    { label: "Italic", action: () => insertMarkdown("*", "*", "italic text") },
    { label: "Strike", action: () => insertMarkdown("~~", "~~", "strikethrough") },
    { label: "Link", action: () => insertMarkdown("[", "](https://)", "link text") },
    { label: "Code", action: () => insertMarkdown("`", "`", "code") },
    { label: "Code Block", action: () => insertMarkdown("```python\n", "\n```", "# code here") },
    { label: "List", action: () => insertMarkdown("- ", "", "list item") },
    { label: "Numbered", action: () => insertMarkdown("1. ", "", "step") },
    { label: "Quote", action: () => insertMarkdown("> ", "", "quote") },
    { label: "Table", action: () => insertMarkdown("\n| Column 1 | Column 2 |\n|----------|----------|\n| Value 1  | Value 2  |\n", "", "") },
    { label: "Divider", action: () => insertMarkdown("\n---\n", "", "") },
  ];

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-[#FAF8F6] dark:bg-[#201E1C] text-sm text-[#161513] dark:text-[#F5F4F2] placeholder-[#9a8f75] dark:placeholder-[#6E6B68] focus:outline-none focus:border-[#C74634] dark:focus:border-[#E8572A] transition-colors";

  return (
    <section className="bg-white dark:bg-[#2C2A27] rounded-2xl shadow-sm border border-[#E0DDD9] dark:border-[#3D3A36] mt-8 overflow-hidden">
      {/* Header bar */}
      <div className="px-6 py-5 border-b border-[#E0DDD9] dark:border-[#3D3A36] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3
              className="text-xl font-semibold text-[#161513] dark:text-[#F5F4F2]"
              style={{ fontFamily: "Charter, Georgia, serif" }}
            >
              Blog Writer Studio
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#C74634]/10 text-[#C74634] dark:text-[#E8572A]">
              Admin Only
            </span>
          </div>
          <p className="text-sm text-[#6E6B68] dark:text-[#B8B4B0] mt-0.5">
            Write articles, attach images, and preview how they look on the live blog.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E0DDD9] dark:border-[#3D3A36] text-sm font-medium text-[#161513] dark:text-[#F5F4F2] hover:border-[#C74634] transition-colors cursor-pointer"
        >
          {isOpen ? (
            <>
              <FiChevronUp className="w-4 h-4" /> Collapse Studio
            </>
          ) : (
            <>
              <FiChevronDown className="w-4 h-4" /> Open Studio
            </>
          )}
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6B68] dark:text-[#B8B4B0] mb-1.5">
                File Name (.md)
              </label>
              <input
                name="fileName"
                value={formState.fileName}
                onChange={handleChange}
                required
                placeholder="e.g. my-new-post"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6B68] dark:text-[#B8B4B0] mb-1.5">
                Post ID
              </label>
              <input
                name="id"
                value={formState.id}
                onChange={handleChange}
                required
                placeholder="e.g. 105"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6B68] dark:text-[#B8B4B0] mb-1.5">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formState.date}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6B68] dark:text-[#B8B4B0] mb-1.5">
                Article Title
              </label>
              <input
                name="title"
                value={formState.title}
                onChange={handleChange}
                required
                placeholder="A compelling title for your essay..."
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6B68] dark:text-[#B8B4B0] mb-1.5">
                Topic
              </label>
              <input
                name="topic"
                value={formState.topic}
                onChange={handleChange}
                placeholder="Data Science, Business, Personal..."
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6B68] dark:text-[#B8B4B0] mb-1.5">
                Author
              </label>
              <input
                name="author"
                value={formState.author}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6B68] dark:text-[#B8B4B0] mb-1.5">
                Tags (space-separated)
              </label>
              <input
                name="tags"
                value={formState.tags}
                onChange={handleChange}
                placeholder="MachineLearning Python India"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6B68] dark:text-[#B8B4B0] mb-1.5">
                Header Image URL
              </label>
              <div className="flex gap-2">
                <input
                  name="headerImage"
                  value={formState.headerImage}
                  onChange={handleChange}
                  placeholder="/folder/cover.jpg"
                  className={inputClass}
                />
                <input
                  ref={headerImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => uploadImageFile(e.target.files?.[0], "header")}
                />
                <button
                  type="button"
                  onClick={() => headerImageInputRef.current?.click()}
                  disabled={isUploading}
                  title="Upload cover image"
                  className="px-3 rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] text-[#161513] dark:text-[#F5F4F2] hover:border-[#C74634] transition-colors shrink-0 cursor-pointer"
                >
                  <FiImage className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E6B68] dark:text-[#B8B4B0] mb-1.5">
                Abstract / Meta Description
              </label>
              <textarea
                name="abstract"
                value={formState.abstract}
                onChange={handleChange}
                required
                rows={2}
                placeholder="1-2 sentence summary shown on cards and search results..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Visibility checkboxes */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-[#161513] dark:text-[#F5F4F2]">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isPublished"
                checked={formState.isPublished}
                onChange={handleChange}
                className="rounded border-[#E0DDD9] text-[#C74634] focus:ring-[#C74634]"
              />
              <span>Published</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="prominentShelf"
                checked={formState.prominentShelf}
                onChange={handleChange}
                className="rounded border-[#E0DDD9] text-[#C74634] focus:ring-[#C74634]"
              />
              <span>Show on Prominent Shelf</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="unlisted"
                checked={formState.unlisted}
                onChange={handleChange}
                className="rounded border-[#E0DDD9] text-[#C74634] focus:ring-[#C74634]"
              />
              <span>Unlisted</span>
            </label>
            <span className="ml-auto text-xs text-[#6E6B68] dark:text-[#B8B4B0]">
              {wordStats.words} words · ~{wordStats.minutes} min read
            </span>
          </div>

          {/* View Mode & Formatting Toolbar */}
          <div className="rounded-2xl border border-[#E0DDD9] dark:border-[#3D3A36] overflow-hidden">
            <div className="bg-[#FAF8F6] dark:bg-[#201E1C] px-4 py-2.5 border-b border-[#E0DDD9] dark:border-[#3D3A36] flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {toolbarButtons.map((btn) => (
                  <button
                    key={btn.label}
                    type="button"
                    onClick={btn.action}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] text-[#161513] dark:text-[#F5F4F2] hover:border-[#C74634] transition-colors cursor-pointer"
                  >
                    {btn.label}
                  </button>
                ))}
                <input
                  ref={bodyImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => uploadImageFile(e.target.files?.[0], "body")}
                />
                <button
                  type="button"
                  onClick={() => bodyImageInputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#C74634] text-white hover:bg-[#A73A2C] transition-colors cursor-pointer disabled:opacity-60"
                >
                  <FiImage className="w-3.5 h-3.5" />
                  {isUploading ? "Uploading..." : "Attach Image"}
                </button>
              </div>

              {/* View Mode Switcher */}
              <div className="inline-flex rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] p-0.5">
                {[
                  { id: "edit", label: "Edit", icon: <FiEdit3 className="w-3.5 h-3.5" /> },
                  { id: "split", label: "Split", icon: <FiColumns className="w-3.5 h-3.5" /> },
                  { id: "preview", label: "Preview", icon: <FiEye className="w-3.5 h-3.5" /> },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setViewMode(m.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      viewMode === m.id
                        ? "bg-[#C74634] text-white"
                        : "text-[#6E6B68] dark:text-[#B8B4B0] hover:text-[#161513] dark:hover:text-[#F5F4F2]"
                    }`}
                  >
                    {m.icon}
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Editor + Live Blog Preview Panes */}
            <div
              className={`grid ${
                viewMode === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
              } divide-y lg:divide-y-0 lg:divide-x divide-[#E0DDD9] dark:divide-[#3D3A36]`}
            >
              {viewMode !== "preview" && (
                <div className="bg-white dark:bg-[#201E1C]">
                  <textarea
                    ref={textareaRef}
                    name="body"
                    value={formState.body}
                    onChange={handleChange}
                    onDrop={(e) => {
                      const file = e.dataTransfer?.files?.[0];
                      if (file && file.type.startsWith("image/")) {
                        e.preventDefault();
                        uploadImageFile(file, "body");
                      }
                    }}
                    onPaste={(e) => {
                      const item = Array.from(e.clipboardData?.items || []).find((it) =>
                        it.type.startsWith("image/")
                      );
                      if (item) {
                        const file = item.getAsFile();
                        if (file) {
                          e.preventDefault();
                          uploadImageFile(file, "body");
                        }
                      }
                    }}
                    rows={22}
                    placeholder="Write your article in Markdown/MDX... (Drag & drop or paste images directly)"
                    className="w-full h-full min-h-[520px] p-5 bg-transparent font-mono text-sm leading-relaxed text-[#161513] dark:text-[#F5F4F2] focus:outline-none resize-y"
                  />
                </div>
              )}

              {viewMode !== "edit" && (
                <div className="bg-[#FAF8F6] dark:bg-[#161513] p-6 sm:p-8 max-h-[680px] overflow-y-auto">
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
                      {formState.title || "Untitled Article"}
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
                        <img
                          src={formState.headerImage}
                          alt={formState.title || "Header preview"}
                          className="w-full max-h-80 object-cover"
                        />
                      </div>
                    )}

                    {isPreviewLoading && (
                      <p className="text-xs text-[#9a8f75] mb-3">Rendering preview…</p>
                    )}

                    <div className="prose prose-sm sm:prose-lg dark:prose-invert max-w-none break-words">
                      {previewContent ? (
                        <MDXRemote {...previewContent} />
                      ) : (
                        <p className="text-sm text-[#6E6B68] dark:text-[#B8B4B0]">
                          Start typing markdown on the left to see your live blog preview here.
                        </p>
                      )}
                    </div>
                  </article>
                </div>
              )}
            </div>
          </div>

          {/* Status & Action Buttons */}
          {status.type !== "idle" && status.message && (
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
                status.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  : status.type === "error"
                  ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                  : "bg-[#FAF8F6] dark:bg-[#201E1C] text-[#6E6B68] dark:text-[#B8B4B0] border border-[#E0DDD9] dark:border-[#3D3A36]"
              }`}
            >
              {status.type === "success" ? (
                <FiCheckCircle className="w-4 h-4 shrink-0" />
              ) : status.type === "error" ? (
                <FiAlertCircle className="w-4 h-4 shrink-0" />
              ) : null}
              <span>{status.message}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={status.type === "loading"}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C74634] hover:bg-[#A73A2C] text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60"
              >
                <FiSave className="w-4 h-4" />
                Save Post
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#E0DDD9] dark:border-[#3D3A36] text-sm font-medium text-[#161513] dark:text-[#F5F4F2] hover:border-[#C74634] transition-colors cursor-pointer"
              >
                <FiDownload className="w-4 h-4" />
                Download .md
              </button>
              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#E0DDD9] dark:border-[#3D3A36] text-sm font-medium text-[#161513] dark:text-[#F5F4F2] hover:border-[#C74634] transition-colors cursor-pointer"
              >
                <FiCopy className="w-4 h-4" />
                Copy Markdown
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-[#6E6B68] dark:text-[#B8B4B0] hover:text-[#C74634] transition-colors cursor-pointer"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              Clear Draft
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
