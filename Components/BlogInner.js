import { MDXRemote } from "next-mdx-remote";
import { BsThreeDots } from "react-icons/bs";
import Toc from "./Toc";
import { useEffect, useState, useRef } from "react";
import CopyCodeButton from "./CopyCodeButton";
import ShareSection from "./ShareSection";
import AuthorBio from "./AuthorBio";

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

function BlogInner({ data, content, headings, readTime, allBlogs }) {
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
    h2: (props) => {
      const { id, children, ...rest } = props;
      const headingText = typeof children === 'string' ? children : children?.props?.children || '';
      return (
        <h2 id={id} className="group relative" {...rest}>
          {children}
          {id && <ShareSection headingId={id} headingText={headingText} />}
        </h2>
      );
    },
    h3: (props) => {
      const { id, children, ...rest } = props;
      const headingText = typeof children === 'string' ? children : children?.props?.children || '';
      return (
        <h3 id={id} className="group relative" {...rest}>
          {children}
          {id && <ShareSection headingId={id} headingText={headingText} />}
        </h3>
      );
    },
    code: (props) => {
      // Handle inline code (not code blocks)
      const { className, children, ...rest } = props;
      const isInline = !className || !className.includes('language-');
      
      if (isInline) {
        return <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm" {...rest}>{children}</code>;
      }
      
      // For code blocks, return as-is (handled by pre component)
      return <code className={className} {...rest}>{children}</code>;
    },
    img: (props) => {
      // Special handling for header images and DS images
      const isHeaderImage = props.src && props.src.includes('skewness_kurtosis_concept');
      const isDSImage = props.src && (props.src.includes('/DS-6/') || props.src.includes('/DS-7/') || props.src.includes('/DS-11/') || props.src.includes('/DS-12/'));
      
      return (
        <div className={`my-6 flex justify-center ${isHeaderImage || isDSImage ? 'bg-gray-50 dark:bg-gray-900 p-4 rounded-lg' : ''}`}>
          <img
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            className={`rounded-md ${isHeaderImage || isDSImage ? 'w-full max-w-5xl' : 'max-w-full'} h-auto ${isMobile ? 'cursor-pointer hover:opacity-90' : 'hover:opacity-90'} transition-opacity`}
            style={{
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              visibility: 'visible',
              opacity: 1,
              objectFit: 'contain',
              width: isHeaderImage || isDSImage ? '100%' : 'auto',
              backgroundColor: 'transparent'
            }}
            onClick={() => openModal(props.src, props.alt)}
            onError={(e) => {
              console.error(`Image failed to load: ${props.src}`, props.alt);
              // Show error indicator but keep image visible
              e.target.style.border = '2px dashed #d1d5db';
              e.target.style.padding = '1rem';
              e.target.style.minHeight = '100px';
              e.target.alt = `Failed to load: ${props.alt || props.src}`;
              // Add error overlay
              const parent = e.target.parentElement;
              if (parent && !parent.querySelector('.image-load-error')) {
                const errorOverlay = document.createElement('div');
                errorOverlay.className = 'image-load-error absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 bg-opacity-75 rounded-md';
                errorOverlay.innerHTML = `<span class="text-xs text-gray-500 dark:text-gray-400">Image not found</span>`;
                parent.style.position = 'relative';
                parent.appendChild(errorOverlay);
              }
            }}
            onLoad={(e) => {
              // Remove error indicators on successful load
              const parent = e.target.parentElement;
              const errorOverlay = parent?.querySelector('.image-load-error');
              if (errorOverlay) {
                errorOverlay.remove();
              }
              e.target.style.border = 'none';
              e.target.style.padding = '0';
            }}
            {...props}
          />
        </div>
      );
    },
    pre: (props) => {
      const { children, ...rest } = props;
      
      // Extract code string from children
      let codeString = '';
      if (children) {
        if (typeof children === 'string') {
          codeString = children;
        } else if (children.props) {
          // Handle code element inside pre
          if (children.props.children) {
            if (typeof children.props.children === 'string') {
              codeString = children.props.children;
            } else if (Array.isArray(children.props.children)) {
              codeString = children.props.children
                .map(c => typeof c === 'string' ? c : (c?.props?.children || ''))
                .join('');
            }
          } else {
            codeString = String(children.props.children || '');
          }
        } else if (Array.isArray(children)) {
          codeString = children
            .map(c => typeof c === 'string' ? c : (c?.props?.children || ''))
            .join('');
        }
      }
      
      return (
        <div className="relative overflow-x-auto my-6 group" style={{ maxWidth: '100%' }}>
          {codeString && <CopyCodeButton code={codeString} />}
          <pre className="overflow-x-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm whitespace-pre" style={{ maxWidth: '100%' }} {...rest}>
            {children}
          </pre>
        </div>
      );
    },
    table: (props) => (
      <div className="overflow-x-auto my-6" style={{ maxWidth: '100%' }}>
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
    <div className="max-w-4xl mx-auto w-full overflow-x-hidden">
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
        <div className="mb-8 rounded-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 header-image-container" style={{ 
          minHeight: '200px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            className="w-full h-auto object-contain"
            src={data.HeaderImage}
            alt="Article Header Image"
            loading="eager"
            style={{ 
              maxHeight: '500px',
              cursor: 'pointer',
              display: 'block',
              visibility: 'visible',
              opacity: 1,
              width: '100%',
              height: 'auto',
              padding: '1rem'
            }}
            onError={(e) => {
              console.error(`Header image failed to load: ${data.HeaderImage}`);
              // Show error state without hiding container
              const parent = e.target.parentElement;
              e.target.style.display = 'none';
              if (parent && !parent.querySelector('.image-error')) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'image-error text-center p-8';
                errorDiv.style.cssText = 'color: #6b7280; background-color: #f9fafb; border: 2px dashed #d1d5db; border-radius: 0.5rem; width: 100%;';
                errorDiv.innerHTML = `
                  <div>
                    <p class="font-semibold mb-2" style="color: #374151;">Image not found</p>
                    <p class="text-sm mb-2">
                      <code style="background-color: #e5e7eb; padding: 0.25rem 0.5rem; border-radius: 0.25rem; color: #1f2937;">${data.HeaderImage.split('/').pop()}</code>
                    </p>
                    <p class="text-xs" style="color: #9ca3af;">Please ensure the image exists in the public directory.</p>
                  </div>
                `;
                parent.appendChild(errorDiv);
              }
            }}
            onLoad={(e) => {
              // Remove any error messages if image loads successfully
              const parent = e.target.parentElement;
              const errorDiv = parent?.querySelector('.image-error');
              if (errorDiv) {
                errorDiv.remove();
              }
              // Ensure image is visible
              e.target.style.display = 'block';
              e.target.style.visibility = 'visible';
              e.target.style.opacity = '1';
            }}
            onClick={() => openModal(data.HeaderImage, "Article Header Image")}
          />
        </div>
      )}

      {/* Medium-style article content with TOC */}
      <div className="flex gap-8 w-full">
        {/* Main content */}
        <div className="flex-1 article-content min-w-0 w-full">
          <article className="prose prose-sm sm:prose-lg max-w-none break-words overflow-x-hidden">
            <MDXRemote {...content} components={mdxComponents} />
          </article>
        </div>
        
        {/* TOC Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Toc headings={headings} />
        </div>
      </div>

      {/* Enhanced Author Bio Section */}
      <AuthorBio data={data} allBlogs={allBlogs} />

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
