import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { isProminentShelf } from "./postVisibility";

const dir = path.join(process.cwd(), "_content");

/**
 * Parsing every markdown file with gray-matter + reading-time is the most
 * expensive thing these helpers do, and it used to run on every call (and
 * three times per page). We cache the parsed result and only re-parse when the
 * folder actually changes — detected via a cheap signature (file count + newest
 * mtime). Stat calls are far cheaper than read + parse, so dev hot-reload stays
 * correct while build/runtime avoid redundant work.
 */
let _cache = null; // { sig: string, posts: Array }

const listMarkdownFiles = () =>
  fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

const dirSignature = (files) => {
  let maxMtime = 0;
  for (const f of files) {
    const m = fs.statSync(path.join(dir, f)).mtimeMs;
    if (m > maxMtime) maxMtime = m;
  }
  return `${files.length}:${maxMtime}`;
};

const loadPosts = () => {
  const files = listMarkdownFiles();
  const sig = dirSignature(files);
  if (_cache && _cache.sig === sig) return _cache.posts;

  const posts = files.map((file) => {
    const fileContent = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(fileContent);
    return { data, content, readTime: readingTime(content) };
  });

  _cache = { sig, posts };
  return posts;
};

export const getAllBlogPosts = () => loadPosts();

export const getAllTopics = () => {
  const topics = loadPosts()
    .map((p) => p.data.Topic)
    .filter((t) => t && typeof t === "string" && t.trim().length > 0);
  return [...new Set(topics)];
};

/** Topics that have at least one published post on the main (prominent) shelf — for nav and home topic rail. */
export const getProminentTopics = () => {
  const topics = new Set();
  for (const post of loadPosts()) {
    const { data } = post;
    if (
      data.isPublished &&
      isProminentShelf({ data }) &&
      data.Topic &&
      typeof data.Topic === "string" &&
      data.Topic.trim().length > 0
    ) {
      topics.add(data.Topic);
    }
  }
  return [...topics];
};
