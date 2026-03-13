import { useState } from "react";
import { useRouter } from "next/router";
import { FaRobot, FaImage, FaVideo, FaEye, FaMagic, FaTimes, FaFilter } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import fs from "fs";
import path from "path";

export const getStaticProps = async () => {
  const aiDir = path.join(process.cwd(), "public", "AI");
  let aiImages = [];

  try {
    const files = fs.readdirSync(aiDir);
    aiImages = files.map((file, index) => {
      const filePath = path.join(aiDir, file);
      const stats = fs.statSync(filePath);
      const isVideo = file.endsWith('.mp4') || file.endsWith('.mov') || file.endsWith('.avi');

      let title = file.replace(/\.[^/.]+$/, "");
      let description = "";
      let category = "general";
      let tags = [];

      if (title.includes("replicate-prediction")) {
        title = "AI Generated Art";
        description = "Creative artwork generated using AI models";
        category = "replicate";
        tags = ["AI Art", "Generated", "Creative"];
      } else if (title.includes("LFC") || title.includes("football") || title.includes("soccer")) {
        title = "Football Content";
        description = "Football and sports related AI content";
        category = "sports";
        tags = ["Football", "Sports", "LFC"];
      } else if (title.includes("RM") || title.includes("Real Madrid")) {
        title = "Real Madrid Content";
        description = "Real Madrid football club AI content";
        category = "sports";
        tags = ["Real Madrid", "Football", "Sports"];
      } else if (title.includes("knee slide") || title.includes("celebration")) {
        title = "Football Celebration";
        description = "Football celebration moment captured";
        category = "sports";
        tags = ["Celebration", "Football", "Moment"];
      } else if (title.includes("Coding") || title.includes("programming")) {
        title = "Programming & Coding";
        description = "Programming and coding related content";
        category = "tech";
        tags = ["Programming", "Coding", "Tech"];
      } else if (title.includes("Paris-Fashion-Week") || title.includes("fashion")) {
        title = "Fashion Week Content";
        description = "Fashion and style related AI content";
        category = "fashion";
        tags = ["Fashion", "Style", "Paris"];
      } else if (title.includes("winning-matchball") || title.includes("trophy")) {
        title = "Victory Moment";
        description = "Winning and achievement moment";
        category = "sports";
        tags = ["Victory", "Achievement", "Success"];
      } else if (title.includes("2025myyear") || title.includes("personal")) {
        title = "Personal Year Reflection";
        description = "Personal reflection and year summary";
        category = "personal";
        tags = ["Personal", "Reflection", "Year"];
      } else if (title.includes("WhatsApp")) {
        title = "Personal Moment";
        description = "Personal captured moment";
        category = "personal";
        tags = ["Personal", "Moment", "Memory"];
      } else if (title.includes("Screenshot")) {
        title = "Screen Capture";
        description = "Screenshot or screen capture content";
        category = "tech";
        tags = ["Screenshot", "Screen", "Capture"];
      } else {
        title = "AI Generated Content";
        description = "Creative content generated using AI";
        category = "general";
        tags = ["AI", "Generated", "Creative"];
      }

      return {
        id: index,
        src: `/AI/${encodeURIComponent(file)}`,
        title,
        description,
        category,
        tags,
        type: isVideo ? 'video' : 'image',
        date: stats.mtime.toLocaleDateString()
      };
    });
  } catch (error) {
    console.error("Error reading AI directory:", error);
  }

  return {
    props: {
      topics: ["AI", "Technology", "Creative", "Sports", "Personal"],
      aiImages
    }
  };
};

function AIGallery({ topics, aiImages }) {
  const router = useRouter();
  const basePath = router.basePath || "";
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');

  const categories = [
    { id: 'all', name: 'All Content', icon: FaMagic },
    { id: 'replicate', name: 'Replicate AI', icon: FaRobot },
    { id: 'sports', name: 'Sports', icon: FaImage },
    { id: 'portraits', name: 'Portraits', icon: FaImage },
    { id: 'tech', name: 'Technology', icon: FaRobot },
    { id: 'fashion', name: 'Fashion', icon: FaImage },
    { id: 'personal', name: 'Personal', icon: FaImage },
    { id: 'general', name: 'General', icon: FaImage }
  ];

  const filteredContent = filter === 'all'
    ? aiImages
    : aiImages.filter(item => item.category === filter);

  const openModal = (item) => setSelectedImage(item);
  const closeModal = () => setSelectedImage(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF8F6' }}>
      <Navbar topics={topics} />

      {/* Redwood Hero */}
      <div className="pt-20 pb-12" style={{ backgroundColor: '#FAF8F6' }}>
        <div className="max-w-5xl mx-auto px-6">
          {/* Redwood-style breadcrumb bar */}
          <div className="flex items-center space-x-2 text-sm mb-8 pt-6" style={{ color: '#6E6B68' }}>
            <span>Labs</span>
            <span>/</span>
            <span style={{ color: '#C74634', fontWeight: 500 }}>AI Gallery</span>
          </div>

          <div className="flex items-start space-x-6 mb-2">
            {/* Redwood icon panel */}
            <div
              className="flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#C74634' }}
            >
              <FaRobot className="text-2xl text-white" />
            </div>
            <div>
              <h1
                className="text-4xl font-semibold mb-3"
                style={{ fontFamily: 'DM Sans, sans-serif', color: '#161513', letterSpacing: '-0.02em' }}
              >
                AI Gallery
              </h1>
              <p className="text-lg max-w-2xl" style={{ color: '#6E6B68', lineHeight: 1.6 }}>
                A curated collection of AI-generated images, videos, and creative content —
                from custom LoRA models to diffusion art.
              </p>
            </div>
          </div>

          {/* Redwood divider */}
          <div className="mt-8 mb-0" style={{ borderBottom: '1px solid #E0DDD9' }} />
        </div>
      </div>

      {/* Redwood Filter Bar */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E0DDD9' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center space-x-1 overflow-x-auto py-0 no-scrollbar">
            <FaFilter className="flex-shrink-0 mr-3 text-sm" style={{ color: '#6E6B68' }} />
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = filter === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setFilter(category.id)}
                  className="flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors focus:outline-none"
                  style={{
                    color: isActive ? '#C74634' : '#6E6B68',
                    borderBottom: isActive ? '2px solid #C74634' : '2px solid transparent',
                    backgroundColor: 'transparent',
                    marginBottom: '-1px',
                  }}
                >
                  <IconComponent className="text-xs" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Count bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm" style={{ color: '#6E6B68' }}>
            {filteredContent.length} item{filteredContent.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredContent.map((item) => (
            <div
              key={item.id}
              onClick={() => openModal(item)}
              className="group cursor-pointer overflow-hidden transition-all duration-200"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E0DDD9',
                borderRadius: '6px',
                boxShadow: '0 1px 3px rgba(22,21,19,0.06)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(199,70,52,0.12)';
                e.currentTarget.style.borderColor = '#C74634';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(22,21,19,0.06)';
                e.currentTarget.style.borderColor = '#E0DDD9';
              }}
            >
              {/* Thumbnail */}
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: '1', backgroundColor: '#F1EFED' }}
              >
                {item.type === 'video' ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                      style={{ backgroundColor: '#C74634' }}
                    >
                      <FaVideo className="text-white text-lg" />
                    </div>
                    <p className="text-xs font-medium" style={{ color: '#6E6B68' }}>AI Video</p>
                  </div>
                ) : (
                  <>
                    <img
                      src={`${basePath}${item.src}`}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = "none";
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    <div
                      className="absolute inset-0 flex-col items-center justify-center"
                      style={{ display: "none", backgroundColor: '#F1EFED' }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                        style={{ backgroundColor: '#E0DDD9' }}
                      >
                        <FaImage style={{ color: '#B8B4B0' }} />
                      </div>
                      <p className="text-xs" style={{ color: '#B8B4B0' }}>Image</p>
                    </div>
                  </>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4">
                <h3
                  className="text-sm font-semibold mb-1 truncate"
                  style={{ color: '#161513', fontFamily: 'DM Sans, sans-serif' }}
                >
                  {item.title}
                </h3>
                <p className="text-xs mb-3 line-clamp-2" style={{ color: '#6E6B68' }}>
                  {item.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: '#FDF3F1',
                        color: '#A73A2C',
                        border: '1px solid #F5C4BB',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#B8B4B0' }}>{item.date}</span>
                  <div className="flex items-center space-x-1 text-xs font-medium" style={{ color: '#C74634' }}>
                    <FaEye className="text-xs" />
                    <span>View</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <div
            className="text-center py-20 rounded-lg"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0DDD9' }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: '#FDF3F1' }}
            >
              <FaRobot className="text-2xl" style={{ color: '#C74634' }} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#161513' }}>
              No content found
            </h3>
            <p className="text-sm" style={{ color: '#6E6B68' }}>
              Try selecting a different category or check back later.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(22,21,19,0.8)' }}
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col"
            style={{
              backgroundColor: '#FAF8F6',
              borderRadius: '8px',
              boxShadow: '0 24px 64px rgba(22,21,19,0.4)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid #E0DDD9', backgroundColor: '#FFFFFF' }}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded flex items-center justify-center"
                  style={{ backgroundColor: '#C74634' }}
                >
                  {selectedImage.type === 'video'
                    ? <FaVideo className="text-white text-xs" />
                    : <FaImage className="text-white text-xs" />
                  }
                </div>
                <div>
                  <h2 className="text-base font-semibold" style={{ color: '#161513' }}>
                    {selectedImage.title}
                  </h2>
                  <p className="text-xs" style={{ color: '#6E6B68' }}>
                    {selectedImage.date}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded flex items-center justify-center transition-colors"
                style={{ color: '#6E6B68' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F1EFED'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Media */}
            <div
              className="flex-1 overflow-auto flex items-center justify-center p-6"
              style={{ backgroundColor: '#201E1C', minHeight: 0 }}
            >
              {selectedImage.type === 'video' ? (
                <video
                  className="max-w-full max-h-[55vh] rounded"
                  controls
                  autoPlay
                  style={{ objectFit: 'contain' }}
                >
                  <source src={`${basePath}${selectedImage.src}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={`${basePath}${selectedImage.src}`}
                  alt={selectedImage.title}
                  className="max-w-full max-h-[55vh] rounded"
                  style={{ objectFit: 'contain' }}
                />
              )}
            </div>

            {/* Modal Footer */}
            <div
              className="px-6 py-4 flex-shrink-0"
              style={{ borderTop: '1px solid #E0DDD9', backgroundColor: '#FFFFFF' }}
            >
              <p className="text-sm mb-3" style={{ color: '#6E6B68' }}>
                {selectedImage.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedImage.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: '#FDF3F1',
                      color: '#A73A2C',
                      border: '1px solid #F5C4BB',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default AIGallery;
