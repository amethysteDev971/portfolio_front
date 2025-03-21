import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo et navigation en desktop */}
          <div className="flex items-center">
            <div className="flex items-center">
              {/* Le logo devient un lien vers la home */}
              <Link to="/">
                <img src="/logo.svg" alt="Logo Amethyste Design" className="h-8 w-auto mr-2" />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="/"
                  className="text-gray-900 hover:bg-red-950 hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Accueil
                </a>
                <a
                  href="/about"
                  className="text-gray-900 hover:bg-red-950 hover:text-white px-3 py-2 text-sm font-medium"
                >
                  À propos
                </a>
                <a
                  href="/services"
                  className="text-gray-900 hover:bg-red-950 hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Projets
                </a>
                <a
                  href="/contact"
                  className="text-gray-900 hover:bg-red-950 hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="/contact"
                  className="btn-action text-white hover:bg-red-900 hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Discutons de votre projet
                </a>
              </div>
            </div>
            {/* Bouton mobile */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
                aria-label="Ouvrir le menu principal"
              >
                {isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="/"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Accueil
            </a>
            <a
              href="/about"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              À propos
            </a>
            <a
              href="/services"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Services
            </a>
            <a
              href="/contact"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
