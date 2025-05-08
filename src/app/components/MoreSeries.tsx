"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Données des séries supplémentaires - exemple avec 24 éléments (4 colonnes x 6 rangées)
const moreSeriesData = [
  {
    id: 1,
    title: "PLAISIR EN SOLO",
    logo: "/assets/logos/jerk-off-logo.png",
    image: "/assets/series/jerk-off.jpg",
    description: "BD Gonzo ! Pas de détours, directement dans l'action ! Notre mission est d'exploser avec beaucoup de coquineries sur les gens qui aiment le plaisir en solo !",
    link: "#"
  },
  {
    id: 2,
    title: "L'ÉTALON INTELLO",
    logo: "/assets/logos/nerd-stallion-logo.png",
    image: "/assets/series/nerd-stallion.jpg",
    description: "Suivez les aventures du mince Martin... Il n'était pas ébranlé par l'étiquette \"intello\" et a vu dans sa personnalité introvertie un moyen de séduire les femmes !",
    link: "#"
  },
  {
    id: 3,
    title: "LES PERVERS DU CAMPUS",
    logo: "/assets/logos/college-perverts-logo.png",
    image: "/assets/series/college-perverts.jpg",
    description: "Des BD incroyables et perverses sur un groupe d'étudiants qui adorent s'amuser follement... Et une étudiante timide qui arrive pour secouer encore plus ce campus !",
    link: "#"
  },
  {
    id: 4,
    title: "C'EST UNE MAISON DE FOUS",
    logo: "/assets/logos/madhouse-logo.png",
    image: "/assets/series/madhouse.jpg",
    description: "Une série d'histoires inspirées d'événements réels ! C'est une Maison de Fous, un endroit sans règles ni lois. Ici, les tabous sont brisés et la perversion est permise !",
    link: "#"
  },
  {
    id: 5,
    title: "LA FERME DES PAYSANS",
    logo: "/assets/logos/hillbilly-farm-logo.png",
    image: "/assets/series/hillbilly-farm.jpg",
    description: "Bienvenue à la campagne où les relations familiales sont bien différentes de ce que vous connaissez. Un endroit où les tabous n'existent pas !",
    link: "#"
  },
  {
    id: 6,
    title: "MA TANTE, MA COUSINE ET MOI",
    logo: "/assets/logos/aunt-cousin-logo.png",
    image: "/assets/series/aunt-cousin.jpg",
    description: "Suivez les aventures d'un jeune homme qui va vivre chez sa tante et sa cousine après le départ de ses parents à l'étranger. Ce qui l'attend dépasse tout ce qu'il pouvait imaginer !",
    link: "#"
  },
  {
    id: 7,
    title: "TALES OF FORBIDDEN LUST",
    logo: "/assets/logos/tales-logo.png",
    image: "/assets/series/tales.jpg",
    description: "Ancient stories of passion and forbidden desires, where the line between right and wrong is blurred by overwhelming lust and primal temptations.",
    link: "#"
  },
  {
    id: 8,
    title: "THE FLINTSTONES",
    logo: "/assets/logos/flintstones-logo.png",
    image: "/assets/series/flintstones.jpg",
    description: "Have you ever wondered what life in the stone age was really like? This exciting series will show you the raw and unfiltered side of prehistoric family life!",
    link: "#"
  },
  // Additional items to fill 4 columns x 6 rows (24 total)
  {
    id: 9,
    title: "OFFICE AFFAIRS",
    logo: "/assets/logos/office-affairs-logo.png",
    image: "/assets/series/office-affairs.jpg",
    description: "The corporate world is full of stress and tension. Follow these office workers as they find unconventional ways to release that tension!",
    link: "#"
  },
  {
    id: 10,
    title: "SUBURBAN SECRETS",
    logo: "/assets/logos/suburban-secrets-logo.png",
    image: "/assets/series/suburban-secrets.jpg",
    description: "Behind the perfect facades of suburban homes lie dark and twisted secrets. Neighbors who seem normal by day reveal their true nature behind closed doors.",
    link: "#"
  },
  {
    id: 11,
    title: "BEACH PARTY",
    logo: "/assets/logos/beach-party-logo.png",
    image: "/assets/series/beach-party.jpg",
    description: "Sun, sand, and sin! Join these young adults on their beach vacation where inhibitions disappear as quickly as their swimsuits!",
    link: "#"
  },
  {
    id: 12,
    title: "FANTASY REALM",
    logo: "/assets/logos/fantasy-realm-logo.png",
    image: "/assets/series/fantasy-realm.jpg",
    description: "In this magical world of elves, orcs and mystical beings, conventional morality doesn't exist. Follow these adventures where magic and desire intertwine.",
    link: "#"
  },
  {
    id: 13,
    title: "SPACE EXPLORERS",
    logo: "/assets/logos/space-explorers-logo.png",
    image: "/assets/series/space-explorers.jpg",
    description: "In the vast emptiness of space, human connection becomes more important than ever. These explorers find unique ways to maintain their sanity during long voyages.",
    link: "#"
  },
  {
    id: 14,
    title: "DOCTOR'S OFFICE",
    logo: "/assets/logos/doctors-office-logo.png",
    image: "/assets/series/doctors-office.jpg",
    description: "Medical professionals with very unconventional treatment methods. Their patients come in with one problem and leave with a very different kind of relief!",
    link: "#"
  },
  {
    id: 15,
    title: "STEP BY STEP",
    logo: "/assets/logos/step-by-step-logo.png",
    image: "/assets/series/step-by-step.jpg",
    description: "When two families blend together, the new relationships can be complicated. These step-siblings and parents navigate their new dynamic in unexpected ways.",
    link: "#"
  },
  {
    id: 16,
    title: "MIDNIGHT CLUB",
    logo: "/assets/logos/midnight-club-logo.png",
    image: "/assets/series/midnight-club.jpg",
    description: "An exclusive underground club where the elite come to indulge their darkest fantasies away from the public eye. What happens after midnight stays at the club.",
    link: "#"
  },
  {
    id: 17,
    title: "TEACHER'S PET",
    logo: "/assets/logos/teachers-pet-logo.png",
    image: "/assets/series/teachers-pet.jpg",
    description: "Some students will do absolutely anything for better grades. These educators find themselves in complicated situations with very determined students.",
    link: "#"
  },
  {
    id: 18,
    title: "NEIGHBOR'S WIFE",
    logo: "/assets/logos/neighbors-wife-logo.png",
    image: "/assets/series/neighbors-wife.jpg",
    description: "The grass always seems greener on the other side, especially when your neighbor's wife is sunbathing in the garden. Temptation is just a fence away!",
    link: "#"
  },
  {
    id: 19,
    title: "POOL BOY ADVENTURES",
    logo: "/assets/logos/pool-boy-logo.png",
    image: "/assets/series/pool-boy.jpg",
    description: "Being a pool boy in an upscale neighborhood comes with unexpected perks. These wealthy housewives offer much more than just a fair wage!",
    link: "#"
  },
  {
    id: 20,
    title: "BABYSITTER DIARIES",
    logo: "/assets/logos/babysitter-logo.png",
    image: "/assets/series/babysitter.jpg",
    description: "After the kids go to sleep, these babysitters find themselves in compromising positions with employers who have very specific requests.",
    link: "#"
  },
  {
    id: 21,
    title: "ROYAL SCANDAL",
    logo: "/assets/logos/royal-scandal-logo.png",
    image: "/assets/series/royal-scandal.jpg",
    description: "Behind the walls of the palace, the royal family indulges in debauchery that would shock the kingdom. Power, privilege, and passion create a dangerous combination.",
    link: "#"
  },
  {
    id: 22,
    title: "WILD WEST SALOON",
    logo: "/assets/logos/wild-west-logo.png",
    image: "/assets/series/wild-west.jpg",
    description: "In the lawless frontier, the saloon girls provide more than just drinks. These cowboys find comfort and release after long days on the dusty trail.",
    link: "#"
  },
  {
    id: 23,
    title: "VIKING CONQUESTS",
    logo: "/assets/logos/viking-logo.png",
    image: "/assets/series/viking.jpg",
    description: "The fearsome warriors from the north take what they want without asking. Their conquests extend beyond land and treasure to include the local women.",
    link: "#"
  },
  {
    id: 24,
    title: "THE EXCHANGE STUDENT",
    logo: "/assets/logos/exchange-student-logo.png",
    image: "/assets/series/exchange-student.jpg",
    description: "When a foreign exchange student moves in, cultural differences lead to misunderstandings and unexpected situations that quickly become very intimate!",
    link: "#"
  }
];

const MoreSeries = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12; // 4 columns x 3 rows
  const totalPages = Math.ceil(moreSeriesData.length / itemsPerPage);
  
  // Get current page items
  const getCurrentItems = () => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return moreSeriesData.slice(start, end);
  };
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  return (
    <div className="py-10 bg-white">
      {/* Title with black background strip */}
      <div className="relative mb-8">
        <div className="absolute left-0 bg-black h-10 w-16"></div>
        <h2 className="text-3xl md:text-4xl font-black text-black pl-20 uppercase">
          PLUS DE SÉRIES
        </h2>
      </div>
      
      {/* Grid Container - exactly 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10 px-4">
        {getCurrentItems().map((series) => (
          <div key={series.id} className="flex flex-col items-center">
            {/* Logo at top */}
            <div className="relative h-14 mb-4 flex items-center justify-center">
              <h3 className="text-base md:text-lg font-bold text-center px-2">{series.title}</h3>
            </div>
            
            {/* Main Image with overlay on hover */}
            <div className="relative w-full aspect-[4/3] overflow-hidden group">
              <Image
                src={series.image}
                alt={series.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                style={{ objectFit: 'cover' }}
                className="group-hover:scale-110 transition-transform duration-500"
                unoptimized={true}
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
            </div>
            
            {/* Series Title */}
            <h3 className="text-xl font-bold mb-2 text-center uppercase">
              {series.title}
            </h3>
            
            {/* Series Description */}
            <p className="text-sm text-gray-700 mb-4 text-center">
              {series.description}
            </p>
            
            {/* See More Button */}
            <Link 
              href={series.link}
              className="px-6 py-2 bg-red-600 text-white font-bold uppercase text-center rounded hover:bg-red-700 transition-colors duration-300 mt-auto"
            >
              VOIR PLUS
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={prevPage}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-200"
          >
            <FaChevronLeft className="text-gray-700" />
          </button>
          
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`w-8 h-8 rounded-full ${
                  currentPage === idx 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors duration-200`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          
          <button
            onClick={nextPage}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-200"
          >
            <FaChevronRight className="text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MoreSeries;