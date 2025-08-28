"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleEnterOffice = () => {
    router.push("/library");
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col overflow-hidden">
      {/* Navigation */}
      <nav className="px-6 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">
            Darian's Study
          </div>
          <div className="text-sm text-gray-600">
            Digital Library & Knowledge Hub
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-4 md:py-6 flex-1 flex items-center justify-center overflow-y-auto">
        <div className="max-w-7xl mx-auto text-center w-full max-h-full">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Welcome to My
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Digital Library
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
            A curated collection of knowledge, research, and insights spanning years of academic exploration and intellectual discovery.
          </p>

          {/* Description */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl border border-white/20">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                What You'll Find Here
              </h2>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">Thoughts and Ideas</h3>
                  <p className="text-sm text-gray-600">Personal reflections, creative concepts, and intellectual explorations.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">My Library of Digital Books</h3>
                  <p className="text-sm text-gray-600">A comprehensive collection of digital books and publications.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">Academic Works</h3>
                  <p className="text-sm text-gray-600">Research papers, studies, and scholarly articles from various fields.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="relative">
            <button
              onClick={handleEnterOffice}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Step Into My Office
              </span>
              <div className={`absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-transform duration-300 ${isHovered ? 'translate-x-0' : 'translate-x-full'}`}></div>
            </button>
          </div>

          {/* Additional Info */}
          <p className="text-xs text-gray-500 mt-4">
            Free access • No registration required • Updated regularly
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-gray-200/50 flex-shrink-0">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p className="text-sm">&copy; {new Date().getFullYear()} Darian's Study. A personal digital library for the curious mind.</p>
        </div>
      </footer>
    </div>
  );
}
