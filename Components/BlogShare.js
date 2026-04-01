import { FaTwitter } from "react-icons/fa";
import { generateSlug } from "../Lib/utils";
import { SITE_URL } from "../Lib/siteConfig";

function BlogShare({ data }) {
  return (
    <div className="flex items-center">
      <a
        className="bg-redwood-500 hover:bg-redwood-500 text-white px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center space-x-2 transition-colors"
        rel="noopener noreferrer"
        target="_blank"
        href={`https://twitter.com/intent/tweet?text=${
          data?.Title || ""
        } by @PSughosh
        &url=${SITE_URL}/blogs/${generateSlug(data?.Title || "")}
        &hashtags=${(data?.Tags || "").split(" ").join(",")}`}
      >
        <FaTwitter className="w-4 h-4" />
        <span className="hidden sm:inline">Tweet</span>
      </a>
    </div>
  );
}

export default BlogShare;
