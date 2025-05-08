"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Types pour les données
type Comic = {
  id: string;
  title: string;
  author: string;
  categories: string[];
  cover_image: string;
  description: string;
  created_at: string;
};

type Chapter = {
  id: string;
  comic_id: string;
  chapter_number: number;
  title: string;
  created_at: string;
  is_protected: boolean;
  is_pdf: boolean;
};

// Composant principal TrendingSeries
export default function TrendingSeries() {
  // État pour stocker les comics
  const [comics, setComics] = useState<Comic[]>([]);
  // État pour stocker les premiers chapitres de chaque comic
  const [firstChapters, setFirstChapters] = useState<Record<string, Chapter>>({});
  // État pour gérer le chargement
  const [loading, setLoading] = useState(true);

  // Effet pour charger les données au montage du composant
  useEffect(() => {
    async function fetchData() {
      try {
        // Récupérer les comics depuis l'API
        const response = await fetch('/api/comics');
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const comicsData = await response.json();
        
        // Supprimer la limite de 15 comics pour afficher tous les comics
        // const limitedComics = comicsData.slice(0, 15);
        const limitedComics = comicsData; // Utiliser tous les comics disponibles
        setComics(limitedComics);
        
        // Récupérer les chapitres depuis l'API
        const chaptersResponse = await fetch('/api/chapters');
        
        if (!chaptersResponse.ok) {
          throw new Error(`API request failed with status ${chaptersResponse.status}`);
        }
        
        const chaptersData = await chaptersResponse.json();
        
        // Trouver le premier chapitre pour chaque comic
        const firstChaptersMap: Record<string, Chapter> = {};
        
        limitedComics.forEach((comic: Comic) => {
          const comicChapters = chaptersData
            .filter((chapter: Chapter) => chapter.comic_id === comic.id)
            .sort((a: Chapter, b: Chapter) => a.chapter_number - b.chapter_number);
          
          if (comicChapters.length > 0) {
            firstChaptersMap[comic.id] = comicChapters[0];
          }
        });
        
        setFirstChapters(firstChaptersMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Rendu du skeleton loader pendant le chargement
  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">BD Disponibles</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">BD Disponibles</h2>
          <Link href="/browse" className="text-purple-600 hover:text-purple-800 transition-colors">
            Voir tout
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {comics.map((comic) => (
            <div key={comic.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <Link 
                href={firstChapters[comic.id] && !firstChapters[comic.id].is_protected
                  ? `/comic/${comic.id}/chapter/${firstChapters[comic.id].id}`
                  : `/comic/${comic.id}`}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={comic.cover_image}
                    alt={comic.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform hover:scale-105"
                  />
                  {firstChapters[comic.id]?.is_protected && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Premium
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{comic.title}</h3>
                  <p className="text-gray-600 text-sm">{comic.author}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {comic.categories.map((category, index) => (
                      <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}