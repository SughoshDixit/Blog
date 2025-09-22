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
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 md:flex md:gap-8">
      <div className="md:flex-1 rounded-lg shadow-lg bg-white dark:bg-gray-900 pb-8">
        <img
          className="object-cover w-full h-72"
          src={data.HeaderImage}
          alt="Article Image"
        />

        <div className="p-4">
          <div className="flex flex-col items-center">
            <div className="flex flex-wrap gap-2 justify-center">
              {(data?.Tags || "").split(" ").filter(Boolean).map((tag) => (
                <p
                  key={tag}
                  className="inline-block px-3 py-1 mb-2 text-xs font-semibold tracking-wider text-gray-50 uppercase rounded-full bg-indigo-500 dark:bg-indigo-600"
                >
                  {tag}
                </p>
              ))}
            </div>
            <a className="block mt-2 text-2xl sm:text-4xl font-semibold text-gray-800 dark:text-gray-100">
              {data.Title}
            </a>
            {readTime && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{readTime}</p>
            )}

            <p className="text-5xl pt-2">
              <BsThreeDots />
            </p>

            {/* Mobile TOC */}
            <div className="md:hidden mb-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <details>
                <summary className="px-3 py-2 cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-200">On this page</summary>
                <div className="px-3 pb-2">
                  <Toc headings={headings} />
                </div>
              </details>
            </div>

            <article className="prose prose-sm sm:prose md:prose-lg max-w-none md:max-w-prose py-7 dark:prose-dark ">
              <MDXRemote {...content} components={mdxComponents} />
            </article>

            <div className="mt-3">
              <div className="flex items-center flex-col">
                <p className="text-5xl pb-2">
                  <BsThreeDots />
                </p>
                <p className="text-2xl pb-2">Thanks for reading!!!</p>
                <p className="mx-2 font-semibold text-gray-700 dark:text-gray-100">
                  {data.Author}
                </p>
                <p className="text-sm font-medium leading-4 text-gray-600 dark:text-gray-200">
                  Author
                </p>
              <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-md p-3 max-w-prose">
                <strong>In one line:</strong> The world is fragmenting into agile coalitions; India’s path is confidence with realism.
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block md:w-72 lg:w-80 ml-auto">
        <Toc headings={headings} />
      </div>
    </div>
  );
}

export default BlogInner;
