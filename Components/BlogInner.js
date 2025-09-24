import { MDXRemote } from "next-mdx-remote";
import { BsThreeDots } from "react-icons/bs";
import Toc from "./Toc";

function BlogInner({ data, content, headings, readTime }) {
  const mdxComponents = {
    img: (props) => (
      <img
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        className="mx-auto my-4 rounded-md w-full md:w-auto"
        {...props}
      />
    ),
  };
  return (
    <div className="max-w-4xl mx-auto">
      {/* Medium-style article header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <img 
            src="/about.jpeg" 
            alt="Sughosh Dixit" 
            className="w-12 h-12 rounded-full"
          />
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{data.Author}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{data.Date} • {readTime}</div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" style={{fontFamily: 'Charter, Georgia, serif'}}>
          {data.Title}
        </h1>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {(data?.Tags || "").split(" ").filter(Boolean).map((tag) => (
            <span
              key={tag}
              className="article-tag"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Medium-style article image */}
      {data.HeaderImage && (
        <div className="mb-8">
          <img
            className="w-full h-96 object-cover rounded-lg"
            src={data.HeaderImage}
            alt="Article Image"
          />
        </div>
      )}

      {/* Medium-style article content */}
      <div className="article-content">
        <article className="prose prose-lg max-w-none">
          <MDXRemote {...content} components={mdxComponents} />
        </article>
      </div>

      {/* Medium-style article footer */}
      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/about.jpeg" 
              alt="Sughosh Dixit" 
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{data.Author}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Data Scientist & Tech Writer</div>
            </div>
          </div>
          <button className="medium-button">
            Follow
          </button>
        </div>
        
        <div className="mt-6 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <strong>In one line:</strong> The world is fragmenting into agile coalitions; India's path is confidence with realism.
        </div>
      </div>
    </div>
  );
}

export default BlogInner;
