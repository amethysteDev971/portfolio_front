// src/Components/Footer/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#A371DE] text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Amethyste Design. Tous droits réservés.
          </p>
        </div>
        <div className="flex space-x-4">
          <a href="/" className="text-sm hover:underline">
            Accueil
          </a>
          <a href="/about" className="text-sm hover:underline">
            À propos
          </a>
          <a href="/services" className="text-sm hover:underline">
            Projets
          </a>
          <a href="/contact" className="text-sm hover:underline">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
