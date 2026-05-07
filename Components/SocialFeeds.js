import React, { useRef, useEffect } from "react";
import { TwitterTimelineEmbed } from "react-twitter-embed";

export default function SocialFeeds() {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full mt-10">
      {/* LinkedIn Section */}
      <div className="bg-white/80 dark:bg-[#1E1C1A]/80 border border-[#E0DDD9] dark:border-[#3D3A36] rounded-2xl p-6 shadow-soft relative group">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm uppercase tracking-[0.2em] font-semibold text-[#695f4b] dark:text-[#B8B4B0] flex items-center gap-2">
            <svg className="w-4 h-4 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            LinkedIn Highlights
          </h3>
          <div className="hidden sm:flex gap-2">
            <button onClick={scrollLeft} className="p-1 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button onClick={scrollRight} className="p-1 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
        
        {/* Carousel Container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="flex-shrink-0 w-[90%] sm:w-[80%] snap-center rounded-xl overflow-hidden border border-[#E0DDD9] dark:border-[#3D3A36] bg-white">
            <iframe
              src="https://www.linkedin.com/embed/feed/update/urn:li:share:7445867078013730817"
              height="600"
              width="100%"
              frameBorder="0"
              allowFullScreen=""
              title="Embedded post"
              className="bg-white w-full"
            ></iframe>
          </div>
          <div className="flex-shrink-0 w-[90%] sm:w-[80%] snap-center rounded-xl overflow-hidden border border-[#E0DDD9] dark:border-[#3D3A36] bg-white">
            <iframe
              src="https://www.linkedin.com/embed/feed/update/urn:li:share:7447290288059961345"
              height="600"
              width="100%"
              frameBorder="0"
              allowFullScreen=""
              title="Embedded post"
              className="bg-white w-full"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Twitter Section */}
      <div className="bg-white/80 dark:bg-[#1E1C1A]/80 border border-[#E0DDD9] dark:border-[#3D3A36] rounded-2xl p-6 shadow-soft">
        <h3 className="text-sm uppercase tracking-[0.2em] font-semibold text-[#695f4b] dark:text-[#B8B4B0] mb-6 flex items-center gap-2">
          <svg className="w-4 h-4 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 3.869H5.078z" />
          </svg>
          X (Twitter) Feed
        </h3>
        
        <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex-shrink-0 w-full sm:w-[90%] snap-center rounded-xl overflow-hidden border border-[#E0DDD9] dark:border-[#3D3A36] bg-gradient-to-br from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black p-8 flex flex-col items-center justify-center text-center shadow-lg relative group transition-transform hover:scale-[1.02]">
            <svg className="w-16 h-16 mb-6 opacity-90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 3.869H5.078z" />
            </svg>
            <h4 className="text-2xl font-bold mb-2">Connect on X</h4>
            <p className="text-gray-300 dark:text-gray-700 mb-8 max-w-[280px]">
              Join the conversation for real-time updates on tech, data science, and my latest writings.
            </p>
            <a 
              href="https://x.com/PSughosh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-black text-black dark:text-white rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors shadow-md"
            >
              <span>Follow @PSughosh</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
