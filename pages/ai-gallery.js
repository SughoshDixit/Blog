import { useState } from "react";
import { FaRobot, FaImage, FaVideo, FaEye, FaMagic } from "react-icons/fa";
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
      
      // Generate descriptive titles based on filename
      let title = file.replace(/\.[^/.]+$/, ""); // Remove extension
      let description = "";
      let category = "general";
      let tags = [];
      
      // Categorize and title based on filename patterns
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
        src: `/AI/${file}`,
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

  const openModal = (item) => {
    setSelectedImage(item);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen relative bg-white dark:bg-gray-900">
      <Navbar topics={topics} />
      
      {/* Medium-style hero section */}
      <div className="pt-20 pb-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <FaRobot className="text-6xl text-purple-600" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6" style={{fontFamily: 'Charter, Georgia, serif'}}>
              AI Gallery
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore my collection of AI-generated images, videos, and creative content. 
              From custom LoRA models to diffusion art, discover the intersection of technology and creativity.
            </p>
          </div>
        </div>
      </div>

      {/* Medium-style filter tabs */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-colors ${
                  filter === category.id
                    ? 'medium-button'
                    : 'medium-button-outline'
                }`}
              >
                <IconComponent />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredContent.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => openModal(item)}
            >
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {item.type === 'video' ? (
                  <video 
                    className="w-full h-full object-cover"
                    poster={item.src}
                    preload="metadata"
                  >
                    <source src={item.src} type="video/mp4" />
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <FaVideo className="text-4xl text-gray-400 mb-2" />
                        <p className="text-gray-500">AI Generated Video</p>
                      </div>
                    </div>
                  </video>
                ) : (
                  <img 
                    src={item.src} 
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                )}
                <div className="w-full h-full flex items-center justify-center absolute inset-0 bg-gray-200 dark:bg-gray-700" style={{display: 'none'}}>
                  <div className="text-center">
                    <FaImage className="text-4xl text-gray-400 mb-2" />
                    <p className="text-gray-500">AI Generated Image</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{item.date}</span>
                  <div className="flex items-center space-x-2">
                    <FaEye className="text-indigo-500" />
                    <span>View</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <FaRobot className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No content found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try selecting a different category or check back later for new AI creations.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedImage.title}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {selectedImage.type === 'video' ? (
                <video 
                  className="w-full h-auto max-h-[60vh] object-contain"
                  controls
                  autoPlay
                >
                  <source src={selectedImage.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img 
                  src={selectedImage.src} 
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
              )}
              
              <div className="mt-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {selectedImage.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedImage.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Created: {selectedImage.date}
                </div>
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