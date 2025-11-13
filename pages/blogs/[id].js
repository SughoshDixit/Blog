import { getAllBlogPosts, getAllTopics } from "../../Lib/Data";
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
import RelatedPosts from "../../Components/RelatedPosts";
import BookmarkBtn from "../../Components/BookmarkBtn";
import ReadingHistory from "../../Components/ReadingHistory";
import PrintButton from "../../Components/PrintButton";
import PostSeries from "../../Components/PostSeries";
import ChanakyaShubhashita from "../../Components/ChanakyaShubhashita";

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
  const allTopics = getAllTopics();

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
  return (
    <>
      <Head>
        <title>{data.Title}</title>
        <meta name="title" content={data.Title} />
        <meta name="description" content={data.Abstract} />
        <link rel="canonical" href={`https://sughoshblog.vercel.app/blogs/${id}`} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sughoshdixit.github.io/" />
        <meta property="og:title" content={data.Title} />
        <meta property="og:description" content={data.Abstract} />
        <meta
          property="og:image"
          content={`https://raw.githubusercontent.com/SughoshDixit/Blog/main/public${data.HeaderImage}`}
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://sughoshdixit.github.io/" />
        <meta property="twitter:title" content={data.Title} />
        <meta property="twitter:description" content={data.Abstract} />
        <meta
          property="twitter:image"
          content={`https://raw.githubusercontent.com/SughoshDixit/Blog/main/public${data.HeaderImage}`}
        />
      </Head>

      <Script id="ld-json-article" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.Title,
          description: data.Abstract,
          image: [`https://raw.githubusercontent.com/SughoshDixit/Blog/main/public${data.HeaderImage}`],
          author: {
            '@type': 'Person',
            name: data.Author,
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://sughoshblog.vercel.app/blogs/${id}`,
          },
        })}
      </Script>

      <div className="min-h-screen relative bg-white dark:bg-gray-900">
        <ReadingProgress />
        <Navbar topics={topics} />
        <div className="pt-20">
          {/* best-effort visit counter per post */}
          <Script id="visit-counter" strategy="afterInteractive">
            {`fetch('/api/visits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pid: '${id}' }) }).catch(()=>{});`}
          </Script>
          
          {/* Medium-style article layout */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 overflow-x-hidden">
            <BlogInner data={data} content={content} headings={headings} readTime={readTime} allBlogs={allBlogs} />
            
            {/* Reading History Tracker */}
            <ReadingHistory postId={id} postTitle={data.Title} postData={data} />

            {/* Chanakya Shubhashita Widget */}
            <ChanakyaShubhashita topic={data.Topic} blogId={id} blogTitle={data.Title} />

            {/* Medium-style engagement section */}
            <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div className="flex items-center justify-center sm:justify-start space-x-6">
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

            {/* Post Series */}
            <PostSeries 
              currentPost={currentPost} 
              allPosts={allBlogs} 
              seriesName={data.Series || data.series}
            />

            {/* Related Posts */}
            <RelatedPosts currentPost={currentPost} allBlogs={allBlogs} maxPosts={3} />
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
}

export default BlogPost;
