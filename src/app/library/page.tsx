"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { api, FileInfo, PaginatedS3Response } from "../../utils/api";

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  // Fetch files from S3 on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        console.log('Fetching files from API...');
        const response = await api.listFiles(currentPage, pageSize, debouncedSearchQuery);
        console.log('API response:', response);
        setFiles(response.files);
        setTotalPages(response.total_pages);
        setTotalFiles(response.total_count);
        setHasNext(response.has_next);
        setHasPrevious(response.has_previous);
        setError(null);
      } catch (err) {
        console.error('Error fetching files:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch files');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [currentPage, pageSize, debouncedSearchQuery]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Memoized categories calculation
  const categories = useMemo(() => {
    return ["all", ...Array.from(new Set(files.map(file => {
      const pathParts = file.key.split('/');
      return pathParts.length > 1 ? pathParts[0] : 'root';
    })))];
  }, [files]);

  // Memoized filtered files (now only handles category filtering since search is server-side)
  const filteredFiles = useMemo(() => {
    if (selectedCategory === "all") {
      return files; // No filtering needed
    }
    
    return files.filter(file => {
      const fileCategory = file.key.split('/')[0] || 'root';
      return fileCategory === selectedCategory;
    });
  }, [files, selectedCategory]);

  // Memoized file icon function
  const getFileIcon = useCallback((fileKey: string) => {
    const extension = fileKey.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'doc':
      case 'docx':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'txt':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'mp4':
      case 'avi':
      case 'mov':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'mp3':
      case 'wav':
      case 'flac':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  }, []);

  // Memoized file size formatter
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                Darian's Study
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-lg text-gray-600">Digital Library</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('http://localhost:8181/api/health');
                    const data = await response.json();
                    console.log('Health check:', data);
                    alert(`Backend health: ${data.status}\nS3 connected: ${data.s3_connected}`);
                  } catch (error) {
                    console.error('Health check failed:', error);
                    alert('Backend connection failed. Make sure the server is running on port 8181.');
                  }
                }}
                className="p-2 rounded-lg bg-green-100 hover:bg-green-200 transition-colors text-green-700"
                title="Test backend connection"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title={viewMode === "grid" ? "Switch to list view" : "Switch to grid view"}
              >
                {viewMode === "grid" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search library contents..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count and Controls */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">
              Showing {filteredFiles.length} of {totalFiles} files (Page {currentPage} of {totalPages})
            </p>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing page size
              }}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={async () => {
                try {
                  await api.refreshCache();
                  // Refetch current page
                  const response = await api.listFiles(currentPage, pageSize, debouncedSearchQuery);
                  setFiles(response.files);
                  setTotalPages(response.total_pages);
                  setTotalFiles(response.total_count);
                  setHasNext(response.has_next);
                  setHasPrevious(response.has_previous);
                } catch (error) {
                  console.error('Failed to refresh cache:', error);
                }
              }}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              title="Refresh cache"
            >
              🔄 Refresh
            </button>
            {files.length > 0 && (
              <button
                onClick={() => {
                  const firstFile = files[0];
                  console.log('Testing download with first file:', firstFile.key);
                  const testUrl = `http://localhost:8181/api/files/download/${encodeURIComponent(firstFile.key)}`;
                  console.log('Test URL:', testUrl);
                  window.open(testUrl, '_blank');
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Test Download
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading files...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Error loading files</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* File List */}
        {!loading && !error && (
          <div className="space-y-2">
            {filteredFiles.length === 0 && debouncedSearchQuery && (
              <div className="text-center py-8">
                <p className="text-gray-500">No files found matching "{debouncedSearchQuery}"</p>
              </div>
            )}
            {filteredFiles.map((file) => (
              <div
                key={file.key}
                className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => {
                  console.log('File clicked:', file.key);
                  try {
                    api.downloadFile(file.key);
                  } catch (error) {
                    console.error('Download error:', error);
                    alert(`Failed to download ${file.key}: ${error}`);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {getFileIcon(file.key)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                        {file.key.split('/').pop()}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {file.key}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{new Date(file.last_modified).toLocaleDateString()}</span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-4">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!hasPrevious}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!hasNext}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
