"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import TagChip from './tag-chip';

interface SearchResult {
  title: string;
  summary: string;
  tags: string[];
  slug: string;
  url: string;
  publishedAt: string;
}

interface SearchProps {
  placeholder?: string;
  maxResults?: number;
}

export default function Search({ placeholder = "Search posts...", maxResults = 5 }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchIndex, setSearchIndex] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Load search index on component mount
  useEffect(() => {
    const loadSearchIndex = async () => {
      try {
        const response = await fetch('/search-index.json');
        const data = await response.json();
        setSearchIndex(data);
      } catch (error) {
        console.error('Failed to load search index:', error);
      }
    };

    loadSearchIndex();
  }, []);

  // Initialize Fuse.js with search options
  const fuse = useMemo(() => {
    if (searchIndex.length === 0) return null;

    return new Fuse(searchIndex, {
      keys: [
        { name: 'title', weight: 3 },
        { name: 'summary', weight: 2 },
        { name: 'tags', weight: 1 }
      ],
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [searchIndex]);

  // Perform search when query changes
  useEffect(() => {
    if (!fuse || query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      const searchResults = fuse.search(query, { limit: maxResults });
      setResults(searchResults.map(result => result.item));
      setShowResults(true);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, fuse, maxResults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowResults(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => setShowResults(false), 200);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
        />
        
        {/* Search icon */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {isLoading ? (
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          ) : (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>

        {/* Clear button */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-8 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((post) => (
            <Link
              key={post.slug}
              href={post.url}
              className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              onClick={() => setShowResults(false)}
            >
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {post.summary}
              </p>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <TagChip key={tag} tag={tag} size="sm" />
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{post.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* No results message */}
      {showResults && query.trim().length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            No posts found for &ldquo;{query}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}