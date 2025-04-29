"use client";

import Link from 'next/link';
import { useState } from 'react';
import { FaHome, FaFire, FaList, FaQuestion, FaUserPlus } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">DISTRACTION TV</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center justify-center space-x-8">
            <NavLink href="/" icon={<FaHome className="mr-1" />} text="Home" />
            <NavLink href="/tendances" icon={<FaFire className="mr-1" />} text="Tendances" />
            <NavLink href="/categories" icon={<FaList className="mr-1" />} text="Categories" />
            <NavLink href="/faq" icon={<FaQuestion className="mr-1" />} text="FAQ" />
            <NavLink href="/join" icon={<FaUserPlus className="mr-1" />} text="Join US" />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-purple-600"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <HiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <HiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <MobileNavLink href="/" icon={<FaHome className="mr-2" />} text="Home" />
          <MobileNavLink href="/tendances" icon={<FaFire className="mr-2" />} text="Tendances" />
          <MobileNavLink href="/categories" icon={<FaList className="mr-2" />} text="Categories" />
          <MobileNavLink href="/faq" icon={<FaQuestion className="mr-2" />} text="FAQ" />
          <MobileNavLink href="/join" icon={<FaUserPlus className="mr-2" />} text="Join US" />
        </div>
      </div>
    </nav>
  );
};

// Desktop Navigation Link Component
const NavLink = ({ href, icon, text }: { href: string, icon: React.ReactNode, text: string }) => {
  return (
    <Link 
      href={href} 
      className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-600 transition-colors"
    >
      {icon}
      {text}
    </Link>
  );
};

// Mobile Navigation Link Component
const MobileNavLink = ({ href, icon, text }: { href: string, icon: React.ReactNode, text: string }) => {
  return (
    <Link
      href={href}
      className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-purple-600 transition-colors"
    >
      {icon}
      {text}
    </Link>
  );
};

export default Navbar; 