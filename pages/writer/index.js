import { useState } from "react";
import Head from "next/head";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../Lib/authOptions";
import { signOut, useSession } from "next-auth/react";

const initialFormState = {
  fileName: "DS-",
  id: "",
  title: "",
  author: "Sughosh P Dixit",
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

  if (!session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Writer Studio • Sughosh&apos;s Chronicles</title>
      </Head>
      <div className="min-h-screen bg-[#f7f5f2] dark:bg-[#050810] py-12">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-semibold text-[#191919] dark:text-[#f6f7ff]" style={{ fontFamily: "Charter, Georgia, serif" }}>
                Writer Studio
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
                <div className="space-y-2">
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
              <h2 className="text-xl font-semibold text-[#191919] dark:text-[#f6f7ff]" style={{ fontFamily: "Charter, Georgia, serif" }}>
                Body
              </h2>
              <textarea
                name="body"
                value={formState.body}
                onChange={handleChange}
                rows={24}
                className="w-full px-4 py-3 rounded-2xl border border-[#e6dfd3] focus:outline-none focus:border-[#1a8917] bg-white text-sm text-[#333] placeholder:text-[#b1a992] dark:bg-[#0d1424] dark:text-[#dadff7] dark:border-[#25304a] dark:placeholder:text-[#7783a8] font-mono"
              />
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

  return {
    props: {
      session,
    },
  };
}
