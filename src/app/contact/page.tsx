'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function ContactPage() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setFormStatus('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setFormStatus(''), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-800 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white border-opacity-50"></div>
      </div>
    );
  }

  return (
    <main className="bg-gray-100 text-gray-900 pt-16">
      <Navbar />
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 bg-blue-900 text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Contact HuntingtonBank"
            layout="fill"
            objectFit="cover"
            className="opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-blue-900/60"></div>
        </div>
        <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Contact Us
        </h1>
        <p className="relative text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed">
          We’re here to help. Reach out with any questions or inquiries, and our team will respond promptly.
        </p>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-blue-900">
          Get in Touch
        </h2>
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-600 focus:ring-red-600 text-sm sm:text-base"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-600 focus:ring-red-600 text-sm sm:text-base"
                placeholder="Your Email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-600 focus:ring-red-600 text-sm sm:text-base"
                placeholder="Your Message"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white px-6 py-3 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:bg-red-700 hover:shadow-xl transition duration-300"
              >
                Send Message
              </button>
            </div>
            {formStatus && (
              <p className="text-center text-green-600 text-sm sm:text-base">{formStatus}</p>
            )}
          </form>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-blue-900">
          Our Contact Details
        </h2>
        <div className="grid gap-8 sm:gap-10 md:grid-cols-3 max-w-7xl mx-auto text-center">
          {[
            {
              title: 'Email Us',
              description: 'support@HuntingtonBank.com',
              link: 'mailto:support@HuntingtonBank.com',
            },
            {
              title: 'Call Us',
              description: '+1 (800) 123-4567',
              link: 'tel:+18001234567',
            },
            {
              title: 'Visit Us',
              description: '123 Finance St, Global City, 12345',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-6 text-center border border-gray-200"
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-blue-900">
                {item.title}
              </h3>
              {item.link ? (
                <Link
                  href={item.link}
                  className="text-gray-600 hover:text-blue-600 transition duration-300 text-sm sm:text-base"
                >
                  {item.description}
                </Link>
              ) : (
                <p className="text-gray-600 text-sm sm:text-base">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-blue-900 text-white text-center">
        <p className="text-sm sm:text-base">
          © 2025 HuntingtonBank. All rights reserved. Secure banking for a connected world.
        </p>
      </footer>
    </main>
  );
}