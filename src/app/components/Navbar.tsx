"use client";

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-black text-white">
      {/* Logo */}
      <div className="flex flex-col items-center">
        <Link href="/">
          <h1 className="text-4xl font-bold text-red-600">
            DISTRACTION TV
          </h1>
        </Link>
        <p className="text-sm">
          Bienvenue sur le meilleur site de BD et dessins animés
        </p>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-8">
        <NavLink href="/">ACCUEIL</NavLink>
        <NavLink href="/series">TOUTES LES SÉRIES</NavLink>
        <NavLink href="/titres">TOUS LES TITRES</NavLink>
        <NavLink href="/faq">FAQ</NavLink>
        <NavLink href="/contact">CONTACT</NavLink>
      </div>

      {/* Auth Buttons */}
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200">
          CONNEXION
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          INSCRIVEZ-VOUS
        </button>
      </div>
    </nav>
  );
};

// Navigation Link Component
const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
  return (
    <Link href={href} className="hover:text-red-500 transition-colors">
      {children}
    </Link>
  );
};

export default Navbar; 