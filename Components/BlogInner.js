import { MDXRemote } from "next-mdx-remote";
import { BsThreeDots } from "react-icons/bs";
import Toc from "./Toc";
import { useEffect } from "react";

function BlogInner({ data, content, headings, readTime }) {
  useEffect(() => {
    // Load Lottie animations after component mounts
    const loadLottieAnimations = async () => {
      if (typeof window !== 'undefined') {
        const lottie = (await import('lottie-web')).default;
        
        // Challenge animation - Rocket (distinct: lf20_2glqweqs)
        if (document.getElementById('lottie-challenge')) {
          lottie.loadAnimation({
            container: document.getElementById('lottie-challenge'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets5.lottiefiles.com/packages/lf20_2glqweqs.json'
          });
        }
        
        // Math animation - Calculator/Math (distinct: lf20_1pxqjqps)
        if (document.getElementById('lottie-math')) {
          lottie.loadAnimation({
            container: document.getElementById('lottie-math'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets5.lottiefiles.com/packages/lf20_1pxqjqps.json'
          });
        }
        
        // Visualization animation - Data Chart/Analytics (distinct: working URL)
        if (document.getElementById('lottie-visualization')) {
          lottie.loadAnimation({
            container: document.getElementById('lottie-visualization'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets5.lottiefiles.com/packages/lf20_2glqweqs.json'
          });
        }
        
        // Celebration animation - Confetti/Party
        if (document.getElementById('lottie-celebration')) {
          lottie.loadAnimation({
            container: document.getElementById('lottie-celebration'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets9.lottiefiles.com/packages/lf20_X6UEgW5AHj.json'
          });
        }
        
        // Parsing animation - Code/Text Processing (for DS-2)
        if (document.getElementById('lottie-parsing')) {
          lottie.loadAnimation({
            container: document.getElementById('lottie-parsing'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets9.lottiefiles.com/packages/lf20_V9t630.json'
          });
        }
        
        // Algorithm animation - Process/Flowchart (for DS-2)
        if (document.getElementById('lottie-algorithm')) {
          lottie.loadAnimation({
            container: document.getElementById('lottie-algorithm'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets9.lottiefiles.com/packages/lf20_jcikwtux.json'
          });
        }
        
        // Stats animation - Analytics/Statistics (for DS-3)
        if (document.getElementById('lottie-stats')) {
          lottie.loadAnimation({
            container: document.getElementById('lottie-stats'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets5.lottiefiles.com/packages/lf20_szlepvdj.json'
          });
        }
      }
    };
    
    loadLottieAnimations();
  }, []);

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
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
          />
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{data.Author}</div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{data.Date} • {readTime}</div>
          </div>
        </div>
        
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight" style={{fontFamily: 'Charter, Georgia, serif'}}>
          {data.Title}
        </h1>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {(data?.Tags || "").split(" ").filter(Boolean).map((tag) => (
            <span
              key={tag}
              className="article-tag text-xs sm:text-sm"
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
            className="w-full h-48 sm:h-64 lg:h-96 object-cover rounded-lg"
            src={data.HeaderImage}
            alt="Article Image"
          />
        </div>
      )}

      {/* Medium-style article content with TOC */}
      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 article-content">
          <article className="prose prose-sm sm:prose-lg max-w-none">
            <MDXRemote {...content} components={mdxComponents} />
          </article>
        </div>
        
        {/* TOC Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Toc headings={headings} />
        </div>
      </div>

      {/* Medium-style article footer */}
      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img 
              src="/about.jpeg" 
              alt="Sughosh Dixit" 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
            />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{data.Author}</div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Data Scientist & Tech Writer</div>
            </div>
          </div>
          <button className="medium-button text-sm px-4 py-2 w-full sm:w-auto">
            Follow
          </button>
        </div>
        
        <div className="mt-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
          <strong>In one line:</strong> Footballer, Musician by Passion, Data Science by Profession, Civilizationalist by Ideology
        </div>
      </div>
    </div>
  );
}

export default BlogInner;
