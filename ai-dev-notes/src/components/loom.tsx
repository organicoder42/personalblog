"use client";

import { useState } from "react";

interface LoomProps {
  id: string;
  title?: string;
}

export default function Loom({ id, title = "Loom video" }: LoomProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Extract Loom ID from various URL formats
  const getVideoId = (input: string): string => {
    // If it's already just an ID
    if (input.length > 10 && !input.includes('/')) {
      return input;
    }

    // Handle Loom URL formats
    const regExp = /^.*loom\.com\/(share|embed)\/([a-zA-Z0-9]+).*/;
    const match = input.match(regExp);
    return match && match[2] ? match[2] : input;
  };

  const videoId = getVideoId(id);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="aspect-video my-6 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
      {!isLoaded ? (
        <div 
          className="relative w-full h-full cursor-pointer group flex items-center justify-center"
          onClick={handleLoad}
        >
          {/* Placeholder with Loom branding */}
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <svg 
                  className="w-8 h-8 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <div className="font-semibold mb-1">Click to load Loom video</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
            </div>
          </div>
          
          {/* Loom logo */}
          <div className="absolute top-4 right-4">
            <div className="bg-white rounded px-2 py-1 flex items-center">
              <div className="w-4 h-4 bg-purple-600 rounded-full mr-2"></div>
              <span className="text-purple-600 font-bold text-sm">Loom</span>
            </div>
          </div>
        </div>
      ) : (
        <iframe
          src={`https://www.loom.com/embed/${videoId}`}
          title={title}
          allow="fullscreen"
          allowFullScreen
          className="w-full h-full"
        />
      )}
    </div>
  );
}