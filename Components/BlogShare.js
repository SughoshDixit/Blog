import { FaTwitter } from "react-icons/fa";

function BlogShare({ data }) {
  return (
    <div className="flex items-center">
      <a
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center space-x-2 transition-colors"
        rel="noopener noreferrer"
        target="_blank"
        href={`https://twitter.com/intent/tweet?text=${
          data?.Title || ""
        } by @PSughosh
        &url=sughoshblog.vercel.app/${String(
          (data?.Title || "").split(" ").join("-").toLowerCase()
        )}
        &hashtags=${(data?.Tags || "").split(" ").join(",")}`}
      >
        <FaTwitter className="w-4 h-4" />
        <span className="hidden sm:inline">Tweet</span>
      </a>
    </div>
  );
}

export default BlogShare;
