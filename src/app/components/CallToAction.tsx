"use client";

import Image from 'next/image';
import Link from 'next/link';

const CallToAction = () => {
  return (
    <div className="relative w-full py-20">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/assets/action.jpg"
          alt="Call to Action"
          fill
          priority
          className="object-cover"
          unoptimized={true}
        />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[300px] pb-10">
        {/* Description */}
        <p className="text-white text-xl mb-6 font-semibold text-center max-w-2xl px-4">
          Accédez à du contenu exclusif et des mises à jour en avant-première avec notre abonnement VIP
        </p>
        
        {/* Large Button */}
        <Link 
          href="#" 
          className="px-8 py-4 bg-red-600 text-white text-xl font-bold uppercase rounded-lg hover:bg-red-700 transition-colors duration-300 transform hover:scale-105"
        >
          Abonnez vous au VIP maintenant!
        </Link>
      </div>
    </div>
  );
};

export default CallToAction; 