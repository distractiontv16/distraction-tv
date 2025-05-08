import { Suspense } from 'react';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import FeaturedTitles from './components/FeaturedTitles';
import FeaturedSeries from './components/FeaturedSeries';
import TrendingSeries from './components/TrendingSeries';
import MoreSeries from './components/MoreSeries';
import Footer from './components/Footer';
import CallToAction from './components/CallToAction';
import ComingSoon from './components/ComingSoon';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black flex flex-col">
      {/* Navbar - Fixed at the top */}
      <Navbar />
      
      {/* Hero Section - Responsive height based on viewport with increased margin */}
      <section className="w-full mt-20 md:mt-24">
        <Suspense fallback={
          <div className="h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh] bg-gray-200 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <HeroSlider />
        </Suspense>
      </section>
      
      {/* Featured Titles Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <Suspense fallback={
          <div className="h-[300px] bg-white flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <FeaturedTitles />
        </Suspense>
      </section>
      
      {/* Featured Series Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <Suspense fallback={
          <div className="h-[300px] bg-white flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <FeaturedSeries />
        </Suspense>
      </section>
      
      {/* Trending Series Section - Maintenant avec les BD disponibles */}
      <section className="w-full max-w-7xl mx-auto mt-12">
        <Suspense fallback={
          <div className="h-[300px] bg-white flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <TrendingSeries />
        </Suspense>
      </section>
      
      {/* More Series Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <Suspense fallback={
          <div className="h-[300px] bg-white flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <MoreSeries />
        </Suspense>
      </section>
      
      {/* Call to Action */}
      <section className="w-full mt-12">
        <Suspense fallback={
          <div className="h-[200px] bg-white flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <CallToAction />
        </Suspense>
      </section>
      
      {/* Coming Soon */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <Suspense fallback={
          <div className="h-[300px] bg-white flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <ComingSoon />
        </Suspense>
      </section>
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
