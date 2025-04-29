"use client";

import Image from 'next/image';

// Sample featured comics data
const featuredComics = [
  {
    id: 1,
    title: 'Aventures Extraordinaires',
    image: '/assets/slide (6).jpg',
    price: '19,99 €'
  },
  {
    id: 2,
    title: 'Légendes du Passé',
    image: '/assets/slide (7).jpg',
    price: '24,50 €'
  },
  {
    id: 3,
    title: 'Monde Fantastique',
    image: '/assets/slide (8).jpg',
    price: '22,90 €'
  },
  {
    id: 4,
    title: 'Histoire Secrète',
    image: '/assets/slide (9).jpg',
    price: '18,95 €'
  }
];

const FeaturedComics = () => {
  return (
    <div className="py-16 px-8 bg-gray-100">
      <h2 className="text-3xl font-bold mb-8 text-center text-black">
        BD Populaires
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {featuredComics.map((comic) => (
          <div 
            key={comic.id}
            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-2 duration-300"
          >
            <div className="relative h-80 w-full">
              <Image
                src={comic.image}
                alt={comic.title}
                fill
                style={{ objectFit: 'cover' }}
              />
              
              {/* Price tag */}
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full font-semibold">
                {comic.price}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 text-black">{comic.title}</h3>
              <button 
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedComics; 