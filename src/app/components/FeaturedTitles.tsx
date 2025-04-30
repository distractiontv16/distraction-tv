"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Sample featured titles data
const featuredTitles = [
  {
    id: 1,
    title: 'WIFE SWAP BETWEEN NEIGHBORS',
    studio: 'THE SIMPTOONS',
    image: '/assets/featured1.jpg'
  },
  {
    id: 2,
    title: 'WEDDING ANNIVERSARY',
    studio: 'THE NAUGHTY HOME ANIMATION',
    image: '/assets/featured2.jpg'
  },
  {
    id: 3,
    title: 'THE SLUTTY COLLEGE GIRL',
    studio: 'THE NAUGHTY HOME ANIMATION',
    image: '/assets/featured3.jpg'
  },
  {
    id: 4,
    title: 'NAUGHTY ADVENTURES',
    studio: 'THE SIMPTOONS',
    image: '/assets/featured1.jpg'
  },
  {
    id: 5,
    title: 'SECRET DESIRES',
    studio: 'THE NAUGHTY HOME ANIMATION',
    image: '/assets/featured2.jpg'
  },
  {
    id: 6,
    title: 'FORBIDDEN PLEASURES',
    studio: 'THE NAUGHTY HOME ANIMATION',
    image: '/assets/featured3.jpg'
  }
];

const FeaturedTitles = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollButtons);
      // Initial check
      checkScrollButtons();
      return () => slider.removeEventListener('scroll', checkScrollButtons);
    }
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-10 bg-white relative">
      {/* Title with black background strip */}
      <div className="relative mb-8">
        <div className="absolute left-0 bg-black h-10 w-16"></div>
        <h2 className="text-3xl md:text-4xl font-black text-black pl-20 uppercase">
          FEATURED TITLES
        </h2>
      </div>
      
      {/* Navigation Buttons */}
      <button 
        onClick={scrollLeft}
        className={`absolute left-2 top-1/2 z-30 p-2 rounded-full bg-white/80 shadow-lg ${!canScrollLeft ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-white'}`}
        disabled={!canScrollLeft}
        aria-label="Previous titles"
      >
        <FaChevronLeft className="text-black w-6 h-6" />
      </button>
      
      <button 
        onClick={scrollRight}
        className={`absolute right-2 top-1/2 z-30 p-2 rounded-full bg-white/80 shadow-lg ${!canScrollRight ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-white'}`}
        disabled={!canScrollRight}
        aria-label="Next titles"
      >
        <FaChevronRight className="text-black w-6 h-6" />
      </button>
      
      {/* Slider Container */}
      <div 
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto pb-6 px-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {featuredTitles.map((title) => (
          <div 
            key={title.id}
            className="min-w-[300px] md:min-w-[350px] flex-shrink-0 snap-start overflow-hidden border border-gray-200 rounded-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={title.image}
                alt={title.title}
                fill
                sizes="(max-width: 640px) 300px, 350px"
                style={{ 
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                className="transition-transform duration-300 hover:scale-105"
                unoptimized={true}
                loading="eager"
              />
              
              {/* Gradient overlay and info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 text-white">
                <h3 className="text-xl font-bold leading-tight">
                  {title.title}
                </h3>
                <p className="text-sm text-gray-300 mt-1">
                  {title.studio}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Custom scrollbar styling for WebKit browsers */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default FeaturedTitles; 