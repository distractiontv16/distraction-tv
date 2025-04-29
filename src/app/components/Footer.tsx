"use client";

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-xl font-bold">DISTRACTION TV</span>
            </Link>
            <p className="text-sm mb-4">
              Le meilleur site pour découvrir des BD et dessins animés de qualité.
            </p>
            <div className="flex space-x-4 mt-4">
              <SocialLink href="#" icon={<FaFacebook />} label="Facebook" />
              <SocialLink href="#" icon={<FaTwitter />} label="Twitter" />
              <SocialLink href="#" icon={<FaInstagram />} label="Instagram" />
              <SocialLink href="#" icon={<FaYoutube />} label="YouTube" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <FooterLink href="/" text="Home" />
              <FooterLink href="/tendances" text="Tendances" />
              <FooterLink href="/categories" text="Categories" />
              <FooterLink href="/faq" text="FAQ" />
              <FooterLink href="/join" text="Join US" />
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <FooterLink href="/categories/action" text="Action" />
              <FooterLink href="/categories/comedie" text="Comédie" />
              <FooterLink href="/categories/romance" text="Romance" />
              <FooterLink href="/categories/aventure" text="Aventure" />
              <FooterLink href="/categories/drame" text="Drame" />
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="flex items-center space-x-2 mb-2">
              <FaEnvelope className="text-white" />
              <span>contact@distractiontv.com</span>
            </div>
            <p className="text-sm mt-4">
              Abonnez-vous à notre newsletter pour recevoir les dernières nouveautés
            </p>
            <div className="mt-2">
              <input
                type="email"
                placeholder="Votre email"
                className="w-full px-3 py-2 text-black rounded-md focus:outline-none"
              />
              <button className="w-full mt-2 bg-red-600 hover:bg-red-700 py-2 px-4 rounded-md transition-colors">
                S&apos;abonner
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} DISTRACTION TV. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

// Footer Link Component
const FooterLink = ({ href, text }: { href: string; text: string }) => {
  return (
    <li>
      <Link href={href} className="hover:text-gray-300 transition-colors">
        {text}
      </Link>
    </li>
  );
};

// Social Link Component
const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
  return (
    <a
      href={href}
      className="text-white hover:text-gray-300 transition-colors"
      aria-label={label}
    >
      {icon}
    </a>
  );
};

export default Footer; 