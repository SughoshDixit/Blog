import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../Lib/authOptions";
import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";

// Dynamically import MDXRemote to avoid SSR issues
const MDXRemote = dynamic(() => import("next-mdx-remote").then(mod => mod.MDXRemote), { ssr: false });

const initialFormState = {
  fileName: "DS-",
  id: "",
  title: "",
  author: "Sughosh P Dixit",
  date: new Date().toISOString().split('T')[0], // Default to today's date
  tags: "",
  topic: "Data Science",
  abstract: "",
  headerImage: "/DS-/",
  isPublished: false,
  body: "# Heading\n\nStart writing your story here...",
};

export default function WriterDashboard() {
  const { data: session } = useSession();
  const [formState, setFormState] = useState(initialFormState);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [previewContent, setPreviewContent] = useState(null);
  const [viewMode, setViewMode] = useState("split"); // "edit", "preview", "split"
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Update preview when body changes
  useEffect(() => {
    const updatePreview = async () => {
      if (!formState.body) {
        setPreviewContent(null);
        return;
      }
      
      setIsPreviewLoading(true);
      try {
        const response = await fetch("/api/writer/preview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: formState.body }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate preview");
        }

        const data = await response.json();
        setPreviewContent(data);
      } catch (error) {
        console.error("Preview error:", error);
        setPreviewContent(null);
      } finally {
        setIsPreviewLoading(false);
      }
    };

    const timeoutId = setTimeout(updatePreview, 500); // Debounce preview updates
    return () => clearTimeout(timeoutId);
  }, [formState.body]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleReset = () => {
    setFormState(initialFormState);
    setStatus({ type: "idle", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "loading", message: "Saving draft…" });

    try {
      const response = await fetch("/api/writer/save-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json?.error || "Unable to save the post.");
      }

      setStatus({ type: "success", message: json?.message || "Saved!" });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  // Markdown formatting helpers
  const insertMarkdown = (before, after = "", placeholder = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formState.body.substring(start, end) || placeholder;
    const newText = 
      formState.body.substring(0, start) + 
      before + selectedText + after + 
      formState.body.substring(end);
    
    setFormState((prev) => ({ ...prev, body: newText }));
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Image upload handler
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setStatus({ type: "error", message: "Please select an image file" });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setStatus({ type: "error", message: "Image size must be less than 10MB" });
      return;
    }

    setIsUploading(true);
    setStatus({ type: "loading", message: "Uploading image..." });

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Image = reader.result;
          
          const response = await fetch("/api/writer/upload-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: base64Image,
              fileName: file.name,
              folder: formState.fileName?.startsWith("DS-") ? formState.fileName.match(/^(DS-\d+)/)?.[1] : "uploads",
            }),
          });

          const json = await response.json();

          if (!response.ok) {
            throw new Error(json?.error || "Failed to upload image");
          }

          // Insert image markdown at cursor position
          const textarea = textareaRef.current;
          if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const imageMarkdown = `![${file.name}](${json.url})`;
            const newText = 
              formState.body.substring(0, start) + 
              imageMarkdown + 
              formState.body.substring(end);
            
            setFormState((prev) => ({ ...prev, body: newText }));
            
            // Restore cursor position
            setTimeout(() => {
              textarea.focus();
              const newCursorPos = start + imageMarkdown.length;
              textarea.setSelectionRange(newCursorPos, newCursorPos);
            }, 0);
          }

          setStatus({ type: "success", message: "Image uploaded successfully!" });
        } catch (error) {
          setStatus({ type: "error", message: error.message });
        } finally {
          setIsUploading(false);
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
      setIsUploading(false);
    }
  };

  const markdownButtons = [
    { label: "H1", action: () => insertMarkdown("# ", "", "Heading 1"), group: "headings" },
    { label: "H2", action: () => insertMarkdown("## ", "", "Heading 2"), group: "headings" },
    { label: "H3", action: () => insertMarkdown("### ", "", "Heading 3"), group: "headings" },
    { label: "H4", action: () => insertMarkdown("#### ", "", "Heading 4"), group: "headings" },
    { label: "H5", action: () => insertMarkdown("##### ", "", "Heading 5"), group: "headings" },
    { label: "H6", action: () => insertMarkdown("###### ", "", "Heading 6"), group: "headings" },
    { label: "Bold", action: () => insertMarkdown("**", "**", "bold text"), group: "formatting" },
    { label: "Italic", action: () => insertMarkdown("*", "*", "italic text"), group: "formatting" },
    { label: "Strike", action: () => insertMarkdown("~~", "~~", "strikethrough"), group: "formatting" },
    { label: "Link", action: () => insertMarkdown("[", "](url)", "link text"), group: "links" },
    { label: "Code", action: () => insertMarkdown("`", "`", "code"), group: "code" },
    { label: "Code Block", action: () => insertMarkdown("```\n", "\n```", "code here"), group: "code" },
    { label: "List", action: () => insertMarkdown("- ", "", "list item"), group: "lists" },
    { label: "Numbered", action: () => insertMarkdown("1. ", "", "list item"), group: "lists" },
    { label: "Quote", action: () => insertMarkdown("> ", "", "quote"), group: "formatting" },
    { label: "Table", action: () => insertMarkdown("| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n", "", ""), group: "formatting" },
  ];

  if (!session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard • Sughosh&apos;s Chronicles</title>
      </Head>
      <div className="min-h-screen bg-[#f7f5f2] dark:bg-[#050810] py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-semibold text-[#191919] dark:text-[#f6f7ff]" style={{ fontFamily: "Charter, Georgia, serif" }}>
                Dashboard
              </h1>
              <p className="text-sm text-[#6e6553] dark:text-[#9aa6c6]">
                Signed in as {session?.user?.email}
              </p>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="medium-button-outline px-6 py-2"
            >
              Sign out
            </button>
          </div>

          <form className="space-y-10" onSubmit={handleSubmit}>
            <section className="p-6 rounded-3xl border border-[#e6dfd3] dark:border-[#1b263d] bg-white dark:bg-[#0f1b31] shadow-soft space-y-6">
              <h2 className="text-xl font-semibold text-[#191919] dark:text-[#f6f7ff]" style={{ fontFamily: "Charter, Georgia, serif" }}>
                Metadata
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#5e5645] dark:text-[#aab4d1]">File name (without .md)</label>
                  <input
                    name="fileName"
                    value={formState.fileName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-[#e6dfd3] focus:outline-none focus:border-[#1a8917] bg-white text-sm text-[#333] placeholder:text-[#b1a992] dark:bg-[#0d1424] dark:text-[#dadff7] dark:border-[#25304a] dark:placeholder:text-[#7783a8]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#5e5645] dark:text-[#aab4d1]">Post Id</label>
                  <input
                    name="id"
                    value={formState.id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-[#e6dfd3] focus:outline-none focus:border-[#1a8917] bg-white text-sm text-[#333] placeholder:text-[#b1a992] dark:bg-[#0d1424] dark:text-[#dadff7] dark:border-[#25304a] dark:placeholder:text-[#7783a8]"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-[#5e5645] dark:text-[#aab4d1]">Title</label>
                  <input
                    name="title"
                    value={formState.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-[#e6dfd3] focus:outline-none focus:border-[#1a8917] bg-white text-sm text-[#333] placeholder:text-[#b1a992] dark:bg-[#0d1424] dark:text-[#dadff7] dark:border-[#25304a] dark:placeholder:text-[#7783a8]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#5e5645] dark:text-[#aab4d1]">Author</label>
                  <input
                    name="author"
                    value={formState.author}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-[#e6dfd3] focus:outline-none focus:border-[#1a8917] bg-white text-sm text-[#333] placeholder:text-[#b1a992] dark:bg-[#0d1424] dark:text-[#dadff7] dark:border-[#25304a] dark:placeholder:text-[#7783a8]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#5e5645] dark:text-[#aab4d1]">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formState.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-[#e6dfd3] focus:outline-none focus:border-[#1a8917] bg-white text-sm text-[#333] placeholder:text-[#b1a992] dark:bg-[#0d1424] dark:text-[#dadff7] dark:border-[#25304a] dark:placeholder:text-[#7783a8]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#5e5645] dark:text-[#aab4d1]">Tags (space separated)</label>
                  <input
                    name="tags"
                    value={formState.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border border-[#e6dfd3] focus:outline-none focus:border-[#1a8917] bg-white text-sm text-[#333] placeholder:text-[#b1a992] dark:bg-[#0d1424] dark:text-[#dadff7] dark:border-[#25304a] dark:placeholder:text-[#7783a8]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#5e5645] dark:text-[#aab4d1]">Topic</label>
                  <input
                    name="topic"
                    value={formState.topic}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border border-[#e6dfd3] focus:outline-none focus:border-[#1a8917] bg-white text-sm text-[#333] placeholder:text-[#b1a992] dark:bg-[#0d1424] dark:text-[#dadff7] dark:border-[#25304a] dark:placeholder:text-[#7783a8]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#5e5645] dark:text-[#aab4d1]">Abstract</label>
                <textarea
                  name="abstract"
                  value={formState.abstract}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border border-[#e6dfd3] focus:outline-none focus:border-[#1a8917] bg-white text-sm text-[#333] placeholder:text-[#b1a992] dark:bg-[#0d1424] dark:text-[#dadff7] dark:border-[#25304a] dark:placeholder:text-[#7783a8]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#5e5645] dark:text-[#aab4d1]">Header image path</label>
                <input
                  name="headerImage"
                  value={formState.headerImage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-[#e6dfd3] focus:outline-none focus:border-[#1a8917] bg-white text-sm text-[#333] placeholder:text-[#b1a992] dark:bg-[#0d1424] dark:text-[#dadff7] dark:border-[#25304a] dark:placeholder:text-[#7783a8]"
                />
              </div>
              <label className="flex items-center gap-3 text-sm font-medium text-[#5e5645] dark:text-[#aab4d1]">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formState.isPublished}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border border-[#e6dfd3] text-[#1a8917] focus:ring-[#1a8917]"
                />
                Mark as published
              </label>
            </section>

            <section className="p-6 rounded-3xl border border-[#e6dfd3] dark:border-[#1b263d] bg-white dark:bg-[#0f1b31] shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#191919] dark:text-[#f6f7ff]" style={{ fontFamily: "Charter, Georgia, serif" }}>
                  Content Editor
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode("edit")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === "edit"
                        ? "bg-[#1a8917] text-white dark:bg-[#26c281]"
                        : "bg-[#f0e9dd] text-[#5b5241] dark:bg-[#1f2a44] dark:text-[#d1d7ef] hover:bg-[#e6dfd3] dark:hover:bg-[#25304a]"
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("split")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === "split"
                        ? "bg-[#1a8917] text-white dark:bg-[#26c281]"
                        : "bg-[#f0e9dd] text-[#5b5241] dark:bg-[#1f2a44] dark:text-[#d1d7ef] hover:bg-[#e6dfd3] dark:hover:bg-[#25304a]"
                    }`}
                  >
                    Split
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("preview")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === "preview"
                        ? "bg-[#1a8917] text-white dark:bg-[#26c281]"
                        : "bg-[#f0e9dd] text-[#5b5241] dark:bg-[#1f2a44] dark:text-[#d1d7ef] hover:bg-[#e6dfd3] dark:hover:bg-[#25304a]"
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>

              {/* Markdown Toolbar */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-[#faf5ec] dark:bg-[#0a121f] border border-[#e6dfd3] dark:border-[#1b263d]">
                  {/* Headings */}
                  <div className="flex items-center gap-1 pr-2 border-r border-[#e6dfd3] dark:border-[#25304a]">
                    <span className="text-xs text-[#6e6553] dark:text-[#9aa6c6] mr-1 font-medium">Headings:</span>
                    {markdownButtons.filter(btn => btn.group === "headings").map((btn, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={btn.action}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-[#0d1424] text-[#5b5241] dark:text-[#d1d7ef] border border-[#e6dfd3] dark:border-[#25304a] hover:bg-[#f0e9dd] dark:hover:bg-[#1f2a44] transition-colors"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                  
                  {/* Formatting */}
                  <div className="flex items-center gap-1 pr-2 border-r border-[#e6dfd3] dark:border-[#25304a]">
                    <span className="text-xs text-[#6e6553] dark:text-[#9aa6c6] mr-1 font-medium">Format:</span>
                    {markdownButtons.filter(btn => btn.group === "formatting").map((btn, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={btn.action}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-[#0d1424] text-[#5b5241] dark:text-[#d1d7ef] border border-[#e6dfd3] dark:border-[#25304a] hover:bg-[#f0e9dd] dark:hover:bg-[#1f2a44] transition-colors"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Code */}
                  <div className="flex items-center gap-1 pr-2 border-r border-[#e6dfd3] dark:border-[#25304a]">
                    <span className="text-xs text-[#6e6553] dark:text-[#9aa6c6] mr-1 font-medium">Code:</span>
                    {markdownButtons.filter(btn => btn.group === "code").map((btn, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={btn.action}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-[#0d1424] text-[#5b5241] dark:text-[#d1d7ef] border border-[#e6dfd3] dark:border-[#25304a] hover:bg-[#f0e9dd] dark:hover:bg-[#1f2a44] transition-colors"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Lists */}
                  <div className="flex items-center gap-1 pr-2 border-r border-[#e6dfd3] dark:border-[#25304a]">
                    <span className="text-xs text-[#6e6553] dark:text-[#9aa6c6] mr-1 font-medium">Lists:</span>
                    {markdownButtons.filter(btn => btn.group === "lists").map((btn, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={btn.action}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-[#0d1424] text-[#5b5241] dark:text-[#d1d7ef] border border-[#e6dfd3] dark:border-[#25304a] hover:bg-[#f0e9dd] dark:hover:bg-[#1f2a44] transition-colors"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Links & Images */}
                  <div className="flex items-center gap-1">
                    {markdownButtons.filter(btn => btn.group === "links").map((btn, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={btn.action}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-[#0d1424] text-[#5b5241] dark:text-[#d1d7ef] border border-[#e6dfd3] dark:border-[#25304a] hover:bg-[#f0e9dd] dark:hover:bg-[#1f2a44] transition-colors"
                      >
                        {btn.label}
                      </button>
                    ))}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#1a8917] dark:bg-[#26c281] text-white border border-[#1a8917] dark:border-[#26c281] hover:bg-[#0f730c] dark:hover:bg-[#1ea869] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? "Uploading..." : "📷 Upload Image"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Editor/Preview Area */}
              <div className={viewMode === "split" ? "flex gap-4" : ""} style={{ minHeight: "600px" }}>
                {(viewMode === "edit" || viewMode === "split") && (
                  <div className={viewMode === "split" ? "flex-1" : "w-full"}>
                    <textarea
                      ref={textareaRef}
                      name="body"
                      value={formState.body}
                      onChange={handleChange}
                      rows={30}
                      className="w-full px-4 py-3 rounded-2xl border border-[#e6dfd3] focus:outline-none focus:border-[#1a8917] bg-white text-sm text-[#333] placeholder:text-[#b1a992] dark:bg-[#0d1424] dark:text-[#dadff7] dark:border-[#25304a] dark:placeholder:text-[#7783a8] font-mono resize-none"
                      style={{ minHeight: "600px" }}
                      placeholder="Start writing your markdown here..."
                    />
                  </div>
                )}
                
                {(viewMode === "preview" || viewMode === "split") && (
                  <div className={viewMode === "split" ? "flex-1 overflow-y-auto" : "w-full"} style={{ maxHeight: "600px" }}>
                    <div className="prose prose-lg dark:prose-invert max-w-none p-4 rounded-xl bg-[#faf5ec] dark:bg-[#0a121f] border border-[#e6dfd3] dark:border-[#1b263d]" style={{ minHeight: "600px" }}>
                      {isPreviewLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-[#6e6553] dark:text-[#9aa6c6]">Loading preview...</div>
                        </div>
                      ) : previewContent ? (
                        <MDXRemote {...previewContent} />
                      ) : (
                        <div className="text-[#6e6553] dark:text-[#9aa6c6] italic">Preview will appear here...</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="medium-button inline-flex items-center justify-center px-6 py-3 text-sm"
                disabled={status.type === "loading"}
              >
                {status.type === "loading" ? "Saving…" : "Save post"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="medium-button-outline inline-flex items-center justify-center px-6 py-3 text-sm"
              >
                Reset form
              </button>
              {status.message && (
                <span
                  className={
                    status.type === "error"
                      ? "text-sm text-red-600 dark:text-red-400"
                      : status.type === "success"
                      ? "text-sm text-green-700 dark:text-green-400"
                      : "text-sm text-[#6e6553] dark:text-[#9aa6c6]"
                  }
                >
                  {status.message}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || session?.user?.email?.toLowerCase() !== (process.env.EDITOR_EMAIL || "sughoshpdixit@gmail.com").toLowerCase()) {
    return {
      redirect: {
        destination: "/writer/login",
        permanent: false,
      },
    };
  }

  // Clean session object to remove undefined values for serialization
  const cleanSession = {
    ...session,
    user: {
      ...session.user,
      image: session.user?.image || null,
      name: session.user?.name || null,
      email: session.user?.email || null,
    },
  };

  return {
    props: {
      session: cleanSession,
    },
  };
}
