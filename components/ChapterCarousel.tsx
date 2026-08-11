'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CHAPTER_POSTS, ChapterPost } from '@/lib/chapterData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ChapterCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = CHAPTER_POSTS.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Auto-play timer
  useEffect(() => {
    if (!isPaused) {
      autoPlayTimer.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [isPaused, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      nextSlide(); // Swiped left -> next
    } else if (diff < -50) {
      prevSlide(); // Swiped right -> prev
    }

    touchStartX.current = null;
    setIsPaused(false);
  };

  const activePost = CHAPTER_POSTS[currentIndex];

  return (
    <div 
      className="w-full max-w-[360px] mx-auto bg-zinc-900/40 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm relative group p-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Image container */}
      <div 
        className="w-full aspect-[4/5] bg-zinc-950 rounded-2xl border border-zinc-850 overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full h-full relative overflow-hidden">
          {CHAPTER_POSTS.map((post, idx) => (
            <div
              key={post.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Previous/Next Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-zinc-950/80 hover:bg-emerald-600 border border-zinc-800 hover:border-emerald-500 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 duration-200"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-zinc-950/80 hover:bg-emerald-600 border border-zinc-800 hover:border-emerald-500 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 duration-200"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Slide index & Pagination Dots */}
      <div className="flex items-center justify-between mt-3 px-1 text-[10px]">
        <span className="text-zinc-500 font-mono font-bold uppercase tracking-wider">
          Slide {activePost.id} / {String(totalSlides).padStart(2, '0')}
        </span>

        <div className="flex space-x-1">
          {CHAPTER_POSTS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-4 bg-emerald-500' : 'w-1 bg-zinc-800 hover:bg-zinc-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
