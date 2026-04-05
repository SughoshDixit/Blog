import { getAllBlogPosts, getProminentTopics } from "../../Lib/Data";
import { generateSlug } from "../../Lib/utils";
import readingTime from "reading-time";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import rehypeSlug from "rehype-slug";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import Head from "next/head";
import Script from "next/script";
import BlogInner from "../../Components/BlogInner";
import BlogShare from "../../Components/BlogShare";
import { remarkHeadingId } from "remark-custom-heading-id";
import { getHeadings } from "../../Lib/GetHeadings";
import ReadingProgress from "../../Components/ReadingProgress";
import ReadingProgressSync from "../../Components/ReadingProgressSync";
import RelatedPosts from "../../Components/RelatedPosts";
import BookmarkBtn from "../../Components/BookmarkBtn";
import ReadingHistory from "../../Components/ReadingHistory";
import PrintButton from "../../Components/PrintButton";
import PostSeries from "../../Components/PostSeries";
import ChanakyaShubhashita from "../../Components/ChanakyaShubhashita";
import PostNavigation from "../../Components/PostNavigation";
import LikeBtn from "../../Components/LikeBtn";
import Comments from "../../Components/Comments";
import { SITE_URL, siteOgImageUrl } from "../../Lib/siteConfig";

export const getStaticPaths = () => {
  const allBlogs = getAllBlogPosts();
  return {
    paths: allBlogs.map((blog) => ({
      params: {
        id: generateSlug(blog.data.Title),
      },
    })),
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const params = context.params;
  const allBlogs = getAllBlogPosts();
  const allTopics = getProminentTopics();

  const page = allBlogs.find(
    (blog) =>
      generateSlug(blog.data.Title) === params.id
  );

  if (!page) {
    return {
      notFound: true,
    };
  }

  const { data, content } = page;
  const readTime = readingTime(content).text;
  const mdxSource = await serialize(content, {
    scope: data,
    mdxOptions: {
      remarkPlugins: [remarkHeadingId],
      rehypePlugins: [rehypeSlug],
    },
  });

  const headings = await getHeadings(content);

  // Get all blogs for related posts (without content to reduce payload)
  const allBlogsForRelated = allBlogs.map((blog) => ({
    data: blog.data,
    readTime: blog.readTime,
  }));

  return {
    props: {
      data: data,
      content: mdxSource,
      id: params.id,
      headings: headings,
      topics: allTopics,
      readTime: readTime,
      allBlogs: allBlogsForRelated,
      currentPost: { data, content },
    },
  };
};

function BlogPost({ data, content, id, headings, topics, readTime, allBlogs, currentPost }) {
  // Build a fully-qualified OG image URL served from the live domain.
  // - Local paths like /BL-8/foo.jpg  → https://sughoshdixit.com/BL-8/foo.jpg
  // - External URLs (miro.medium.com) → used as-is
  // - Missing HeaderImage             → fall back to site-wide OG image
  const ogImage = data.HeaderImage
    ? data.HeaderImage.startsWith("http")
      ? data.HeaderImage
      : `${SITE_URL}${data.HeaderImage}`
    : siteOgImageUrl();

  return (
    <>
      <Head>
        <title>{data.Title}</title>
        <meta name="title" content={data.Title} />
        <meta name="description" content={data.Abstract} />
        <link rel="canonical" href={`${SITE_URL}/blogs/${id}`} />

        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${SITE_URL}/blogs/${id}`} />
        <meta property="og:title" content={data.Title} />
        <meta property="og:description" content={data.Abstract} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Sughosh Dixit" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${SITE_URL}/blogs/${id}`} />
        <meta property="twitter:title" content={data.Title} />
        <meta property="twitter:description" content={data.Abstract} />
        <meta property="twitter:image" content={ogImage} />
      </Head>

      <Script id="ld-json-article" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.Title,
          description: data.Abstract,
          image: [ogImage],
          author: {
            '@type': 'Person',
            name: data.Author,
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/blogs/${id}`,
          },
        })}
      </Script>

      <div className="min-h-screen relative bg-white dark:bg-gray-900">
        <ReadingProgress />
        <ReadingProgressSync slug={id} />
        <Navbar topics={topics} />
        <div className="pt-20">
          {/* best-effort visit counter per post */}
          <Script id="visit-counter" strategy="afterInteractive">
            {`fetch('/api/visits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pid: '${id}' }) }).catch(()=>{});`}
          </Script>
          
          {/* Medium-style article layout */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 overflow-x-hidden">
            <BlogInner data={data} content={content} headings={headings} readTime={readTime} allBlogs={allBlogs} postId={id} />
            
            {/* Reading History Tracker */}
            <ReadingHistory postId={id} postTitle={data.Title} postData={data} />

            {/* Chanakya Shubhashita Widget */}
            <ChanakyaShubhashita topic={data.Topic} blogId={id} blogTitle={data.Title} />

            {/* Medium-style engagement section */}
            <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div className="flex items-center justify-center sm:justify-start flex-wrap gap-x-6 gap-y-3">
                  <LikeBtn id={id} className="py-0" />
                  <BookmarkBtn postId={id} postTitle={data.Title} postData={data} />
                  <BlogShare data={data} />
                </div>
                <div className="flex items-center justify-center sm:justify-end gap-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {readTime}
                  </div>
                  <PrintButton />
                </div>
              </div>
            </div>

            <section
              className="mt-12 sm:mt-16 pt-8 border-t border-gray-200 dark:border-gray-700"
              aria-labelledby="post-comments-heading"
            >
              <h2
                id="post-comments-heading"
                className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6"
              >
                Discussion
              </h2>
              <Comments id={id} />
            </section>

            {/* Post Series */}
            <PostSeries 
              currentPost={currentPost} 
              allPosts={allBlogs} 
              seriesName={data.Series || data.series}
            />

            {/* Related Posts */}
            <RelatedPosts currentPost={currentPost} allBlogs={allBlogs} maxPosts={3} />

            {/* Post Navigation */}
            <PostNavigation currentPost={currentPost} allPosts={allBlogs} />
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
}

export default BlogPost;
