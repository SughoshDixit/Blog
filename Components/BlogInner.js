import { MDXRemote } from "next-mdx-remote";
import { BsThreeDots } from "react-icons/bs";
import Toc from "./Toc";
import { useEffect, useState, useRef } from "react";

const LOTTIE_ANIMATIONS = {
  boxplotIntro: "https://assets10.lottiefiles.com/packages/lf20_tutvdkg0.json",
  analyticsPulse: "https://assets7.lottiefiles.com/packages/lf20_t9gkkhz4.json",
  adjustedGuard: "/lottie/adjusted_guard.json",
  skewTuning: "/lottie/skew_tuning.json",
  densityRadar: "/lottie/density_radar.json",
  classicalVsRobust: "/lottie/classical_vs_robust.json",
  breakdownFortress: "/lottie/breakdown_fortress.json",
  robustWorkflow: "/lottie/robust_workflow.json"
};

function BlogInner({ data, content, headings, readTime }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile viewport
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const LottiePlayer = ({ animation, height = 220, width = 220, loop = true, caption, className, style }) => {
    const containerRef = useRef(null);

    useEffect(() => {
      let instance;

      const load = async () => {
        if (!animation || !LOTTIE_ANIMATIONS[animation]) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(`Unknown Lottie animation key: ${animation}`);
          }
          return;
        }

        try {
          const { default: lottie } = await import("lottie-web");
          if (!containerRef.current) return;

          containerRef.current.innerHTML = "";

          const animationSource = LOTTIE_ANIMATIONS[animation];
          const isLocalAsset =
            typeof animationSource === "string" && animationSource.startsWith("/lottie/");

          let animationConfig = {
            container: containerRef.current,
            renderer: "svg",
            loop,
            autoplay: true
          };

          if (isLocalAsset) {
            const response = await fetch(animationSource);
            if (!response.ok) {
              throw new Error(
                `Failed to fetch local Lottie asset (${animationSource}): ${response.status}`
              );
            }
            const animationData = await response.json();

            if (!animationData || typeof animationData !== "object") {
              throw new Error(`Invalid animation data received for ${animation}`);
            }

            animationConfig = { ...animationConfig, animationData };
          } else {
            animationConfig = { ...animationConfig, path: animationSource };
          }

          instance = lottie.loadAnimation(animationConfig);
        } catch (error) {
          console.error(`Failed to load Lottie animation ${animation}:`, error);
        }
      };

      load();

      return () => {
        instance?.destroy();
      };
    }, [animation, loop]);

    const parsedHeight = typeof height === "string" ? parseInt(height, 10) || 220 : height;
    const parsedWidth = typeof width === "string" ? parseInt(width, 10) || 220 : width;

    return (
      <div className="my-10 text-center">
        <div
          ref={containerRef}
          className={className}
          style={{
            margin: "0 auto",
            height: parsedHeight,
            width: "100%",
            maxWidth: parsedWidth,
            ...style
          }}
        />
        {caption && (
          <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 italic">
            {caption}
          </p>
        )}
      </div>
    );
  };

  const openModal = (src, alt) => {
    if (isMobile) {
      setSelectedImage({ src, alt });
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
      }
    };
    
    if (selectedImage) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  const mdxComponents = {
    Lottie: (props) => <LottiePlayer {...props} />,
    img: (props) => {
      // Special handling for header images and DS-6/DS-7 images
      const isHeaderImage = props.src && props.src.includes('skewness_kurtosis_concept');
      const isDSImage = props.src && (props.src.includes('/DS-6/') || props.src.includes('/DS-7/'));
      
      return (
        <div className="my-6 flex justify-center">
          <img
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            className={`rounded-md ${isHeaderImage || isDSImage ? 'w-full max-w-5xl' : 'max-w-full'} h-auto ${isMobile ? 'cursor-pointer' : ''}`}
            style={{
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'contain',
              width: isHeaderImage || isDSImage ? '100%' : 'auto'
            }}
            onClick={() => openModal(props.src, props.alt)}
            onError={(e) => {
              // Hide broken images gracefully
              console.warn(`Image failed to load: ${props.src}`);
              e.target.style.display = 'none';
            }}
            {...props}
          />
        </div>
      );
    },
    table: (props) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700" {...props} />
      </div>
    ),
    thead: (props) => (
      <thead className="bg-gray-100 dark:bg-gray-800" {...props} />
    ),
    tbody: (props) => (
      <tbody {...props} />
    ),
    tr: (props) => (
      <tr className="border-b border-gray-200 dark:border-gray-700" {...props} />
    ),
    th: (props) => {
      // Default to center alignment for numeric columns, left for text
      const { children, ...rest } = props;
      const isNumeric = typeof children === 'string' && /^[≈<>−+\d\s\.]+$/.test(String(children).trim());
      const alignClass = isNumeric ? 'text-center' : 'text-left';
      return (
        <th className={`px-4 py-2 ${alignClass} font-semibold border border-gray-300 dark:border-gray-700`} {...rest}>
          {children}
        </th>
      );
    },
    td: (props) => {
      // Default to center alignment for numeric columns, left for text
      const { children, ...rest } = props;
      const isNumeric = typeof children === 'string' && /^[≈<>−+\d\s\.]+$/.test(String(children).trim());
      const alignClass = isNumeric ? 'text-center' : 'text-left';
      return (
        <td className={`px-4 py-2 ${alignClass} border border-gray-300 dark:border-gray-700`} {...rest}>
          {children}
        </td>
      );
    },
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
            className={`w-full h-48 sm:h-64 lg:h-96 object-cover rounded-lg ${isMobile ? 'cursor-pointer' : ''}`}
            src={data.HeaderImage}
            alt="Article Image"
            onClick={() => openModal(data.HeaderImage, "Article Image")}
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

      {/* Image Modal for Mobile */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl max-h-[90vh] overflow-auto w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <div className="flex items-center justify-end">
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogInner;
