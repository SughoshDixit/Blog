import { AiOutlineArrowRight } from "react-icons/ai";
import Link from "next/link";

function BlogHeader({ data, content, readTime }) {
  return (
    <Link
      href={`/blogs/${String((data?.Title || "").split(" ").join("-").toLowerCase())}`}
    >
      <div className="cursor-pointer group p-6 flex flex-col items-start rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-shadow duration-200">
        <span className="inline-block py-1 px-2 rounded bg-gray-100 dark:bg-redwood-500 text-redwood-500 dark:text-gray-200 text-sm font-medium tracking-widest">
          {(data?.Tags || "").split(" ")[0] || "General"}
        </span>
        <h2 className="sm:text-2xl text-xl title-font font-semibold text-gray-700 mt-4 mb-4 dark:text-gray-100 group-hover:text-redwood-500 dark:group-hover:text-redwood-500">
          {data.Title}
        </h2>
        <p className="leading-relaxed mb-5 text-gray-800 dark:text-gray-200">
          {data.Abstract}..
        </p>

        <div className="flex items-center flex-wrap pb-2 border-t border-gray-200 mt-auto w-full justify-between dark:border-gray-700 pt-4">
          <a className="text-redwood-500 inline-flex items-center dark:text-redwood-500 group-hover:text-redwood-500 dark:group-hover:text-redwood-500 transition-colors">
            Learn More{" "}
            <span className="pl-1">
              <AiOutlineArrowRight />
            </span>
          </a>

          <a className="inline-flex items-center">
            <span className="flex-grow flex flex-col pl-4">
              <span className="text-gray-900 text-xs tracking-widest mt-0.5 dark:text-redwood-500">
                {readTime}
              </span>
            </span>
          </a>
        </div>
      </div>
    </Link>
  );
}

export default BlogHeader;
