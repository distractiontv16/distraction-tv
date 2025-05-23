"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Données des titres en vedette
const featuredTitles = [
  {
    id: 1,
    title: 'ÉCHANGE D\'ÉPOUSES ENTRE VOISINS',
    studio: 'LES SIMPTOONS',
    image: '/assets/featured1.jpg'
  },
  {
    id: 2,
    title: 'ANNIVERSAIRE DE MARIAGE',
    studio: 'L\'ANIMATION COQUINE MAISON',
    image: '/assets/featured2.jpg'
  },
  {
    id: 3,
    title: 'L\'ÉTUDIANTE DÉVERGONDÉE',
    studio: 'L\'ANIMATION COQUINE MAISON',
    image: '/assets/featured3.jpg'
  },
  {
    id: 4,
    title: 'AVENTURES COQUINES',
    studio: 'LES SIMPTOONS',
    image: '/assets/featured1.jpg'
  },
  {
    id: 5,
    title: 'DÉSIRS SECRETS',
    studio: 'L\'ANIMATION COQUINE MAISON',
    image: '/assets/featured2.jpg'
  },
  {
    id: 6,
    title: 'PLAISIRS INTERDITS',
    studio: 'L\'ANIMATION COQUINE MAISON',
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
          TITRES EN VEDETTE
        </h2>
      </div>
      
      {/* Navigation Buttons */}
      <button 
        onClick={scrollLeft}
        className={`absolute left-2 top-1/2 z-30 p-2 rounded-full bg-white/80 shadow-lg ${!canScrollLeft ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-white'}`}
        disabled={!canScrollLeft}
        aria-label="Titres précédents"
      >
        <FaChevronLeft className="text-black w-6 h-6" />
      </button>
      
      <button 
        onClick={scrollRight}
        className={`absolute right-2 top-1/2 z-30 p-2 rounded-full bg-white/80 shadow-lg ${!canScrollRight ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-white'}`}
        disabled={!canScrollRight}
        aria-label="Titres suivants"
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
            className="min-w-[300px] md:min-w-[350px] flex-shrink-0 snap-start overflow-hidden border border-gray-200 rounded-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
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
              
              {/* Overlay with stats on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="text-white text-center px-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-yellow-400 text-lg">★</span>
                    <span className="text-lg font-bold">4.5</span>
                  </div>
                  <div className="text-sm">1.2K vues</div>
                </div>
              </div>
              
              {/* Title overlay */}
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