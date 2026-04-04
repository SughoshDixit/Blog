import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { isProminentShelf } from "./postVisibility";

const dir = path.join(process.cwd(), "_content");

export const getAllBlogPosts = () => {
  const allFiles = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const allBlogs = allFiles.map((file) => {
    const filePath = path.join(dir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const readTime = readingTime(content);
    return { data, content, readTime };
  });

  return allBlogs;
};

export const getAllTopics = () => {
  const allFiles = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const allTopics = allFiles.map((file) => {
    const filePath = path.join(dir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    return data.Topic;
  });
  const filteredTopics = new Set(allTopics.filter((t) => t && typeof t === "string" && t.trim().length > 0));
  return [...filteredTopics];
};

/** Topics that have at least one published post on the main (prominent) shelf — for nav and home topic rail. */
export const getProminentTopics = () => {
  const allFiles = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const topics = new Set();
  for (const file of allFiles) {
    const filePath = path.join(dir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
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
