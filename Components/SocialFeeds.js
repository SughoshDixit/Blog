import React from "react";
import { TwitterTimelineEmbed } from "react-twitter-embed";

export default function SocialFeeds() {
  return (
    <div className="flex flex-col gap-8 w-full mt-10">
      {/* LinkedIn Section */}
      <div className="bg-white/80 dark:bg-[#1E1C1A]/80 border border-[#E0DDD9] dark:border-[#3D3A36] rounded-2xl p-6 shadow-soft">
        <h3 className="text-sm uppercase tracking-[0.2em] font-semibold text-[#695f4b] dark:text-[#B8B4B0] mb-6 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-[#0077b5]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
          LinkedIn Highlights
        </h3>
        <div className="flex flex-col gap-6 overflow-hidden items-center">
          <div className="w-full max-w-[504px] overflow-hidden rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white">
            <iframe
              src="https://www.linkedin.com/embed/feed/update/urn:li:share:7445867078013730817"
              height="970"
              width="100%"
              frameBorder="0"
              allowFullScreen=""
              title="Embedded post"
              className="bg-white"
            ></iframe>
          </div>
          <div className="w-full max-w-[504px] overflow-hidden rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white">
            <iframe
              src="https://www.linkedin.com/embed/feed/update/urn:li:share:7447290288059961345"
              height="863"
              width="100%"
              frameBorder="0"
              allowFullScreen=""
              title="Embedded post"
              className="bg-white"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Twitter Section */}
      <div className="bg-white/80 dark:bg-[#1E1C1A]/80 border border-[#E0DDD9] dark:border-[#3D3A36] rounded-2xl p-6 shadow-soft">
        <h3 className="text-sm uppercase tracking-[0.2em] font-semibold text-[#695f4b] dark:text-[#B8B4B0] mb-6 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-black dark:text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 3.869H5.078z" />
          </svg>
          X (Twitter) Feed
        </h3>
        <div className="w-full overflow-hidden rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white">
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName="PSughosh"
            options={{ height: 600 }}
            noHeader
            noFooter
            noBorders
            transparent
          />
        </div>
      </div>
    </div>
  );
}
