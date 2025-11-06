import { MDXRemote } from "next-mdx-remote";
import { BsThreeDots } from "react-icons/bs";
import Toc from "./Toc";
import { useEffect, useState, useRef } from "react";

function BlogInner({ data, content, headings, readTime }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const lottieAnimations = useRef(new Map());

  useEffect(() => {
    // Check if mobile viewport
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Load Lottie animations after component mounts and MDX content is rendered
    const loadLottieAnimations = async () => {
      if (typeof window === 'undefined') return;
      
      // Wait for element using MutationObserver for more reliable detection
      const waitForElement = (elementId) => {
        return new Promise((resolve) => {
          // Check if already exists
          const existing = document.getElementById(elementId);
          if (existing) {
            resolve(existing);
            return;
          }
          
          // Use MutationObserver to watch for element appearance
          const observer = new MutationObserver((mutations, obs) => {
            const element = document.getElementById(elementId);
            if (element) {
              obs.disconnect();
              resolve(element);
            }
          });
          
          // Start observing
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
          
          // Fallback timeout
          setTimeout(() => {
            observer.disconnect();
            const element = document.getElementById(elementId);
            resolve(element || null);
          }, 5000);
        });
      };
      
      console.log('Starting lottie animation loader...');
      
      // Wait for lottie-shape specifically
      const shapeElement = await waitForElement('lottie-shape');
      console.log('Shape element found:', shapeElement);
      
      // Also wait for celebration element
      const celebrationElement = await waitForElement('lottie-celebration');
      
      // Add a small delay to ensure DOM is fully rendered
      await new Promise(resolve => setTimeout(resolve, 300));
      
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
        
        // Skewness visualization animation (for DS-6)
        if (document.getElementById('lottie-visualization-skew')) {
          lottie.loadAnimation({
            container: document.getElementById('lottie-visualization-skew'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets5.lottiefiles.com/packages/lf20_2glqweqs.json'
          });
        }
        
        // Kurtosis visualization animation (for DS-6)
        if (document.getElementById('lottie-visualization-kurt')) {
          lottie.loadAnimation({
            container: document.getElementById('lottie-visualization-kurt'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets5.lottiefiles.com/packages/lf20_2glqweqs.json'
          });
        }
        
        // Celebration animation - Confetti/Party (only if not already handled)
        const celebrationEl = document.getElementById('lottie-celebration');
        if (celebrationEl && !lottieAnimations.current.has('lottie-celebration')) {
          try {
            const anim = lottie.loadAnimation({
              container: celebrationEl,
              renderer: 'svg',
              loop: true,
              autoplay: true,
              path: 'https://assets9.lottiefiles.com/packages/lf20_X6UEgW5AHj.json'
            });
            lottieAnimations.current.set('lottie-celebration', anim);
          } catch (error) {
            console.error('Error loading lottie-celebration animation:', error);
          }
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
        
        // Rank animation - Ranking/Stratification (for DS-4)
        if (document.getElementById('lottie-rank')) {
          lottie.loadAnimation({
            container: document.getElementById('lottie-rank'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets5.lottiefiles.com/packages/lf20_jcikwtux.json'
          });
        }
        
        // Robust statistics animation - Shield/Protection (for DS-5)
        if (document.getElementById('lottie-robust')) {
          lottie.loadAnimation({
            container: document.getElementById('lottie-robust'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets5.lottiefiles.com/packages/lf20_jcikwtux.json'
          });
        }
        
        // Shape/Statistics animation - Chart/Graph (for DS-6)
        if (shapeElement) {
          console.log('Loading lottie-shape animation into element:', shapeElement);
          
          // Check if animation already exists for this element
          if (lottieAnimations.current.has('lottie-shape')) {
            // Destroy existing animation
            const existingAnim = lottieAnimations.current.get('lottie-shape');
            if (existingAnim && existingAnim.destroy) {
              existingAnim.destroy();
            }
            lottieAnimations.current.delete('lottie-shape');
          }
          
          // Clear any existing content
          shapeElement.innerHTML = '';
          
          try {
            const anim = lottie.loadAnimation({
              container: shapeElement,
              renderer: 'svg',
              loop: true,
              autoplay: true,
              path: 'https://assets5.lottiefiles.com/packages/lf20_szlepvdj.json'
            });
            lottieAnimations.current.set('lottie-shape', anim);
            console.log('Lottie-shape animation loaded successfully!', anim);
          } catch (error) {
            console.error('Error loading lottie-shape animation:', error);
          }
        } else {
          console.warn('lottie-shape element not found in DOM');
        }
        
    };
    
    // Start loading immediately
    loadLottieAnimations();
    
    return () => {
      // Cleanup: destroy all animations
      lottieAnimations.current.forEach((anim) => {
        if (anim && anim.destroy) {
          anim.destroy();
        }
      });
      lottieAnimations.current.clear();
    };
  }, [content]);

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
    img: (props) => {
      // Special handling for header images and DS-6 images
      const isHeaderImage = props.src && props.src.includes('skewness_kurtosis_concept');
      const isDSImage = props.src && props.src.includes('/DS-6/');
      
      return (
        <img
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          className={`mx-auto my-4 rounded-md ${isHeaderImage || isDSImage ? 'w-full' : 'max-w-full'} h-auto ${isMobile ? 'cursor-pointer' : ''}`}
          style={{
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
            objectFit: 'contain'
          }}
          onClick={() => openModal(props.src, props.alt)}
          {...props}
        />
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
