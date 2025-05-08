"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Données des séries à venir
const comingSoonData = [
  {
    id: 1,
    title: "LES AMIS D'ANDY",
    studio: "L'ANIMATION COQUINE MAISON",
    image: "/assets/series/nerd-stallion.jpg"
  },
  {
    id: 2,
    title: "COUP PAR DERRIÈRE",
    studio: "PLAISIR EN SOLO",
    image: "/assets/series/jerk-off.jpg"
  },
  {
    id: 3,
    title: "UN WEEKEND TRÈS COQUIN",
    studio: "LE JEU PORNO COQUIN",
    image: "/assets/series/madhouse.jpg"
  }
  // You can add more items if needed
];

const ComingSoon = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 3;
  const totalItems = comingSoonData.length;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= totalItems ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? totalItems - 1 : prevIndex - 1
    );
  };

  // Create a circular array to handle the carousel
  const getVisibleItems = () => {
    const items = [];
    for (let i = 0; i < itemsToShow; i++) {
      const index = (currentIndex + i) % totalItems;
      items.push(comingSoonData[index]);
    }
    return items;
  };

  return (
    <div className="py-10 bg-white">
      {/* Title with black background strip */}
      <div className="relative mb-8">
        <div className="absolute left-0 bg-black h-10 w-16"></div>
        <h2 className="text-3xl md:text-4xl font-black text-black pl-20 uppercase">
          À VENIR
        </h2>
      </div>
      
      {/* Carousel container */}
      <div className="relative max-w-7xl mx-auto px-4">
        {/* Navigation arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white w-10 h-10 flex items-center justify-center rounded-full"
        >
          <FaChevronLeft />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white w-10 h-10 flex items-center justify-center rounded-full"
        >
          <FaChevronRight />
        </button>
        
        {/* Items container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {getVisibleItems().map((item) => (
            <div key={item.id} className="relative border border-gray-300">
              {/* Image */}
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="hover:scale-105 transition-transform duration-300"
                  unoptimized={true}
                />
              </div>
              
              {/* Text overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4">
                <h3 className="text-xl font-bold text-white uppercase">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-300 uppercase">
                  {item.studio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;