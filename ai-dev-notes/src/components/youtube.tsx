"use client";

import { useState } from "react";
import Image from "next/image";

interface YouTubeProps {
  id: string;
  title?: string;
}

export default function YouTube({ id, title = "YouTube video" }: YouTubeProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Extract YouTube ID from various URL formats
  const getVideoId = (input: string): string => {
    // If it's already just an ID
    if (input.length === 11 && !input.includes('/')) {
      return input;
    }

    // Handle various YouTube URL formats
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = input.match(regExp);
    return match && match[7].length === 11 ? match[7] : input;
  };

  const videoId = getVideoId(id);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="aspect-video my-6 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
      {!isLoaded ? (
        <div 
          className="relative w-full h-full cursor-pointer group"
          onClick={handleLoad}
        >
          {/* Thumbnail */}
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover"
            unoptimized
          />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all">
            <div className="bg-red-600 rounded-full p-4 group-hover:scale-110 transition-transform">
              <svg 
                className="w-8 h-8 text-white ml-1" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          
          {/* YouTube logo */}
          <div className="absolute top-4 right-4 bg-white rounded px-2 py-1">
            <span className="text-red-600 font-bold text-sm">YouTube</span>
          </div>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      )}
    </div>
  );
}