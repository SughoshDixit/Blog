import { getAllBlogPosts, getAllTopics } from "../../Lib/Data";
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
import Comments from "../../Components/Comments";
import { SWRConfig } from "swr";
import { remarkHeadingId } from "remark-custom-heading-id";
import { getHeadings } from "../../Lib/GetHeadings";
import LikeBtn from "../../Components/LikeBtn";

export const getStaticPaths = () => {
  const allBlogs = getAllBlogPosts();
  return {
    paths: allBlogs.map((blog) => ({
      params: {
        id: String(blog.data.Title.split(" ").join("-").toLowerCase()),
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
      String(blog.data.Title.split(" ").join("-").toLowerCase()) === params.id
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

  return {
    props: {
      data: data,
      content: mdxSource,
      id: params.id,
      headings: headings,
      topics: allTopics,
      readTime: readTime,
    },
  };
};

function BlogPost({ data, content, id, headings, topics, readTime }) {
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
        <Navbar topics={topics} />
        <div className="pt-20">
          {/* best-effort visit counter per post */}
          <Script id="visit-counter" strategy="afterInteractive">
            {`fetch('/api/visits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pid: '${id}' }) }).catch(()=>{});`}
          </Script>
          
          {/* Medium-style article layout */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <BlogInner data={data} content={content} headings={headings} readTime={readTime} />
            
            {/* Medium-style engagement section */}
            <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div className="flex items-center justify-center sm:justify-start space-x-6">
                  <LikeBtn id={id} />
                  <BlogShare data={data} />
                </div>
                <div className="text-center sm:text-right text-sm text-gray-500 dark:text-gray-400">
                  {readTime}
                </div>
              </div>
            </div>

            {/* Medium-style comments section */}
            <div className="mt-16">
              <SWRConfig>
                <Comments id={id} />
              </SWRConfig>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
}

export default BlogPost;
