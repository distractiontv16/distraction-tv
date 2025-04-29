import { Suspense } from 'react';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import FeaturedComics from './components/FeaturedComics';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="w-full">
        <Suspense fallback={<div className="h-[600px] bg-gray-200 flex items-center justify-center">Chargement...</div>}>
          <HeroSlider />
        </Suspense>
      </section>
      
      {/* Featured Comics */}
      <section>
        <Suspense fallback={<div className="h-[400px] bg-gray-100 flex items-center justify-center">Chargement...</div>}>
          <FeaturedComics />
        </Suspense>
      </section>
    </main>
  );
}
