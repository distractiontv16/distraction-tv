"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Slider data with images and labels
const sliderData = [
  {
    id: 1,
    image: '/assets/slide (1).jpg',
    title: 'LA MAISON COQUINE',
    subtitle: 'Une nuit coquine dans la chambre du couple'
  },
  {
    id: 2,
    image: '/assets/slide (2).jpg',
    title: 'AVENTURES FANTASTIQUES',
    subtitle: 'Découvrez un monde de mystères'
  },
  {
    id: 3,
    image: '/assets/slide (3).jpg',
    title: 'HISTOIRES PASSIONNANTES',
    subtitle: 'Des récits qui captivent l\'imagination'
  },
  {
    id: 4,
    image: '/assets/slide (4).jpg',
    title: 'UNIVERS COLORÉ',
    subtitle: 'Plongez dans des mondes vibrants'
  },
  {
    id: 5,
    image: '/assets/slide (5).jpg',
    title: 'NOUVEAUTÉS',
    subtitle: 'Découvrez nos dernières publications'
  }
];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
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
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Main slider */}
      <div key={currentIndex} className="relative w-full h-full">
        {/* Image */}
        <Image
          src={sliderData[currentIndex].image}
          alt={sliderData[currentIndex].title}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        {/* Text overlay */}
        <div className="absolute bottom-16 left-16 max-w-lg text-white">
          <div className="bg-red-600 inline-block px-4 py-2 mb-4">
            <h2 className="text-2xl font-bold">{sliderData[currentIndex].title}</h2>
          </div>
          <p className="text-xl">
            {sliderData[currentIndex].subtitle}
          </p>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="absolute bottom-8 right-8 flex space-x-4">
        <button 
          onClick={goToPrev}
          className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={goToNext}
          className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Slider indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {sliderData.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-red-600' : 'bg-white/50'
            } transition-colors`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider; 