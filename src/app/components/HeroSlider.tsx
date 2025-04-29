"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Slider data with HD images and labels
const sliderData = [
  {
    id: 1,
    image: '/assets/slide.jpg',
    title: 'LA MAISON COQUINE',
    subtitle: 'Une nuit coquine dans la chambre du couple'
  },
  {
    id: 2,
    image: '/assets/slide2.jpg',
    title: 'AVENTURES FANTASTIQUES',
    subtitle: 'Découvrez un monde de mystères'
  },
  {
    id: 3,
    image: '/assets/slide3.jpg',
    title: 'HISTOIRES PASSIONNANTES',
    subtitle: 'Des récits qui captivent l\'imagination'
  },
  {
    id: 4,
    image: '/assets/slide4.jpg',
    title: 'UNIVERS COLORÉ',
    subtitle: 'Plongez dans des mondes vibrants'
  },
  {
    id: 5,
    image: '/assets/slide5.jpg',
    title: 'NOUVEAUTÉS',
    subtitle: 'Découvrez nos dernières publications'
  }
];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Auto-advance the slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === sliderData.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle manual navigation
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === sliderData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? sliderData.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh] 2xl:h-[90vh] overflow-hidden">
      {/* Main slider */}
      <div 
        key={currentIndex} 
        className="relative w-full h-full"
      >
        {/* Image */}
        <Image
          src={sliderData[currentIndex].image}
          alt={sliderData[currentIndex].title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
          quality={90}
          priority
          style={{ 
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          onLoadingComplete={() => setIsLoading(false)}
          className="transition-transform duration-500 ease-in-out hover:scale-105"
        />
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Text overlay */}
        <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-4 sm:left-8 md:left-16 max-w-[250px] sm:max-w-xs md:max-w-lg text-white z-10">
          <div className="bg-red-600 inline-block px-2 sm:px-3 md:px-4 py-1 sm:py-2 mb-2 sm:mb-3 md:mb-4 shadow-lg">
            <h2 className="text-base sm:text-xl md:text-2xl font-bold">{sliderData[currentIndex].title}</h2>
          </div>
          <p className="text-sm sm:text-base md:text-xl drop-shadow-lg">
            {sliderData[currentIndex].subtitle}
          </p>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 flex space-x-2 sm:space-x-3 md:space-x-4 z-10">
        <button 
          onClick={goToPrev}
          className="bg-white/20 backdrop-blur-md text-white p-2 sm:p-3 rounded-full hover:bg-white/30 transition-colors shadow-lg"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={goToNext}
          className="bg-white/20 backdrop-blur-md text-white p-2 sm:p-3 rounded-full hover:bg-white/30 transition-colors shadow-lg"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Slider indicators */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2 z-10">
        {sliderData.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full ${
              index === currentIndex ? 'bg-red-600' : 'bg-white/50'
            } transition-colors shadow-md`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider; 