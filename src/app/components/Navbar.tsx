'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-blue-900 text-white w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold">
              HuntingtonBank
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-red-600 transition duration-300">
              Home
            </Link>
            <Link href="/about" className="hover:text-red-600 transition duration-300">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-red-600 transition duration-300">
              Contact
            </Link>
            <Link href="/help" className="hover:text-red-600 transition duration-300">
              Help Center
            </Link>
            <Link
              href="/auth/login"
              className="bg-red-600 px-4 py-2 rounded-full hover:bg-red-700 transition duration-300"
            >
              Log In
            </Link>
            <Link
              href="/auth/register"
              className="border-2 border-white px-4 py-2 rounded-full hover:bg-white hover:text-blue-900 transition duration-300"
            >
              Sign Up
            </Link>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-blue-900">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link
              href="/"
              className="block text-white hover:text-red-600 transition duration-300"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block text-white hover:text-red-600 transition duration-300"
              onClick={toggleMenu}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="block text-white hover:text-red-600 transition duration-300"
              onClick={toggleMenu}
            >
              Contact
            </Link>
            <Link
              href="/help"
              className="block text-white hover:text-red-600 transition duration-300"
              onClick={toggleMenu}
            >
              Help Center
            </Link>
            <Link
              href="/auth/login"
              className="block bg-red-600 px-4 py-2 rounded-full text-center hover:bg-red-700 transition duration-300"
              onClick={toggleMenu}
            >
              Log In
            </Link>
            <Link
              href="/auth/register"
              className="block border-2 border-white px-4 py-2 rounded-full text-center hover:bg-white hover:text-blue-900 transition duration-300"
              onClick={toggleMenu}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}