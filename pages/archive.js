import Head from "next/head";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getAllBlogPosts, getProminentTopics } from "../Lib/Data";
import { generateSlug } from "../Lib/utils";
import { isProminentShelf } from "../Lib/postVisibility";
import {
  SITE_URL,
  siteOgImageUrl,
  SITE_OG_IMAGE_WIDTH,
  SITE_OG_IMAGE_HEIGHT,
  SITE_OG_IMAGE_ALT,
} from "../Lib/siteConfig";

export const getStaticProps = () => {
  const allBlogs = getAllBlogPosts();
  const topics = getProminentTopics();

  const archivePosts = allBlogs
    .filter((b) => b?.data?.isPublished && !isProminentShelf(b))
    .map((blog) => ({
      data: blog.data,
      readTime: blog.readTime,
    }))
    .sort((a, b) => {
      const da = Date.parse(a?.data?.Date);
      const db = Date.parse(b?.data?.Date);
      if (!Number.isNaN(da) && !Number.isNaN(db)) return db - da;
      if (!Number.isNaN(da)) return -1;
      if (!Number.isNaN(db)) return 1;
      return (Number(b?.data?.Id) || 0) - (Number(a?.data?.Id) || 0);
    });

  return {
    props: {
      posts: archivePosts,
      topics,
    },
  };
};

const PAGE_TITLE = "Archive — off the main shelf";
const PAGE_DESC =
  "Essays and notes that still live on this site but are kept off the home feed. Shareable by link; not highlighted in navigation or RSS.";

export default function ArchivePage({ posts, topics }) {
  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESC} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/archive`} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESC} />
        <meta property="og:image" content={siteOgImageUrl()} />
        <meta property="og:image:width" content={String(SITE_OG_IMAGE_WIDTH)} />
        <meta property="og:image:height" content={String(SITE_OG_IMAGE_HEIGHT)} />
        <meta property="og:image:alt" content={SITE_OG_IMAGE_ALT} />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="min-h-screen bg-[#FAF8F6] dark:bg-[#201E1C]">
        <Navbar topics={topics} />

        <main className="pt-24 pb-16 px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <header className="mb-12">
              <p className="text-xs uppercase tracking-[0.2em] text-[#9a8f75] dark:text-[#6E6B68] mb-3">
                Low profile
              </p>
              <h1
                className="text-3xl md:text-4xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-4"
                style={{ fontFamily: "Charter, Georgia, serif" }}
              >
                Archive
              </h1>
              <p className="text-[#6E6B68] dark:text-[#B8B4B0] leading-relaxed">
                {PAGE_DESC}{" "}
                <a href="/" className="text-[#C74634] dark:text-[#E8572A] hover:underline">
                  Back to the main shelf
                </a>
                .
              </p>
            </header>

            {posts.length === 0 ? (
              <p className="text-[#6E6B68] dark:text-[#B8B4B0]">
                Nothing is marked for the archive yet. Add{" "}
                <code className="text-sm px-1.5 py-0.5 rounded bg-[#E0DDD9]/60 dark:bg-[#3D3A36]">
                  prominentShelf: false
                </code>{" "}
                to a post&apos;s front matter to list it here.
              </p>
            ) : (
              <ul className="space-y-8">
                {posts.map((post) => (
                  <li key={post.data.Id} className="border-b border-[#E0DDD9] dark:border-[#3D3A36] pb-8 last:border-0">
                    <a
                      href={`/blogs/${generateSlug(post.data.Title)}`}
                      className="group block"
                    >
                      <h2
                        className="text-xl font-semibold text-[#161513] dark:text-[#F5F4F2] group-hover:text-[#C74634] dark:group-hover:text-[#E8572A] transition-colors mb-2"
                        style={{ fontFamily: "Charter, Georgia, serif" }}
                      >
                        {post.data.Title}
                      </h2>
                      <p className="text-sm text-[#6E6B68] dark:text-[#B8B4B0] mb-2 line-clamp-2">
                        {post.data.Abstract}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs text-[#9a8f75] dark:text-[#6E6B68]">
                        <span>{post.data.Date}</span>
                        {post.data.Topic && (
                          <>
                            <span aria-hidden>·</span>
                            <span>{post.data.Topic}</span>
                          </>
                        )}
                        {post.readTime?.text && (
                          <>
                            <span aria-hidden>·</span>
                            <span>{post.readTime.text}</span>
                          </>
                        )}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
