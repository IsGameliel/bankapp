'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from './components/Navbar';

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-800 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white border-opacity-50"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 bg-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/6802048/pexels-photo-6802048.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Global finance background"
            layout="fill"
            objectFit="cover"
            className="opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-blue-900/60"></div>
        </div>
        <h1 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
          Your World of Banking with HuntingtonBank
        </h1>
        <p className="relative text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl leading-relaxed">
          Open a multi-currency account with local bank details, fast transfers, and competitive rates—all in one platform.
        </p>
        <div className="relative mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/auth/register"
            className="bg-red-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:bg-red-700 hover:shadow-xl transition duration-300"
            aria-label="Sign up for a HuntingtonBank account"
          >
            Sign Up for Free
          </Link>
          <Link
            href="/auth/login"
            className="bg-transparent border-2 border-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-white hover:text-blue-900 transition duration-300"
            aria-label="Log in to your HuntingtonBank account"
          >
            Log In
          </Link>
        </div>
      </section>

      {/* Why HuntingtonBank Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-blue-900">
          Why Choose <span className="text-red-600">HuntingtonBank</span>?
        </h2>
        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {[
            {
              title: '🔒 Local Receiving Accounts',
              description: 'Receive funds in 20+ currencies with zero fees using local account details. No minimum balance required.',
              image: 'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
              title: '🛒 Marketplace Collections',
              description: 'Collect payments from 130+ marketplaces in one account, with fast withdrawals at low cost.',
              image: 'https://images.pexels.com/photos/5076516/pexels-photo-5076516.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
              title: '💳 Save with Card Payments',
              description: 'Pay for ads, subscriptions, and more with 0% FX fees in 15 currencies using the HuntingtonBank Card.',
              image: 'https://images.pexels.com/photos/4968630/pexels-photo-4968630.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
              title: '🌍 Global Payments',
              description: 'Send payments to 210+ countries in 100+ currencies, with funds arriving in hours at competitive rates.',
              image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="relative bg-white shadow-lg rounded-xl p-6 text-center border border-gray-200 hover:scale-105 hover:shadow-xl transition-transform duration-300"
            >
              <div className="mb-4">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={600}
                  height={400}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-blue-900">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tailored Solutions Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-blue-900">
          Tailored Solutions for Your Global Growth
        </h2>
        <div className="grid gap-8 sm:gap-10 md:grid-cols-3 max-w-7xl mx-auto">
          {[
            {
              title: 'E-commerce Seller Solution',
              description: 'Collect payments from 130+ marketplaces in 20+ currencies. Manage earnings and withdraw funds quickly at low cost.',
              image: 'https://images.pexels.com/photos/5076516/pexels-photo-5076516.jpeg?auto=compress&cs=tinysrgb&w=600',
              link: '/solutions/ecommerce',
            },
            {
              title: 'Corporate Payment Solution',
              description: 'Pay suppliers, employees, and VAT across 210+ regions with same-day or next-day payments in major currencies.',
              image: 'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=600',
              link: '/solutions/corporate',
            },
            {
              title: 'Pay with HuntingtonBank Card',
              description: 'Enjoy zero FX fees in 15 currencies and spend in 150+ currencies anywhere Mastercard is accepted.',
              image: 'https://images.pexels.com/photos/4968630/pexels-photo-4968630.jpeg?auto=compress&cs=tinysrgb&w=600',
              link: '/solutions/card',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="relative bg-white shadow-lg rounded-xl p-6 text-center border border-gray-200 hover:scale-105 hover:shadow-xl transition-transform duration-300"
            >
              <div className="mb-4">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={600}
                  height={400}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-blue-900">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {item.description}
              </p>
              <Link
                href={item.link}
                className="mt-4 inline-block text-blue-600 font-semibold hover:text-blue-800 transition duration-300"
                aria-label={`Learn more about ${item.title}`}
              >
                Explore More
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* About HuntingtonBank Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-blue-900">
          About <span className="text-red-600">HuntingtonBank</span>
        </h2>
        <div className="grid gap-8 sm:gap-10 md:grid-cols-3 max-w-7xl mx-auto text-center">
          {[
            { metric: '1M+', label: 'Customers Worldwide' },
            { metric: '210+', label: 'Regions Covered' },
            { metric: '$50B+', label: 'Total Transaction Value' },
          ].map((item, index) => (
            <div key={index} className="p-6">
              <h3 className="text-4xl font-bold text-red-600 mb-2">{item.metric}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{item.label}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-600 mt-8 max-w-3xl mx-auto text-sm sm:text-base">
          We partner with leading banks to ensure your money is safeguarded, offering secure and reliable banking solutions worldwide.
        </p>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-blue-900">
          Hear from Our Customers
        </h2>
        <div className="grid gap-8 sm:gap-10 md:grid-cols-3 max-w-7xl mx-auto">
          {[
            {
              quote: 'HuntingtonBank made setting up my account so simple and efficient. It’s a game-changer for my business!',
              author: 'Monica M., Company Director',
            },
            {
              quote: 'The transparency and ease of use with HuntingtonBank’s portal are unmatched. Great support team!',
              author: 'Russell D., Business Owner',
            },
            {
              quote: 'I feel secure making advance payments with HuntingtonBank. Their service is fast and reliable.',
              author: 'Raffi S., Entrepreneur',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-6 text-center border border-gray-200"
            >
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4">
                “{item.quote}”
              </p>
              <p className="text-blue-900 font-semibold">{item.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-blue-900 text-white text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          The Simpler Way to Bank Globally
        </h2>
        <p className="text-base sm:text-lg max-w-3xl mx-auto mb-8">
          Save money, time, and have peace of mind when managing your finances with HuntingtonBank.
        </p>
        <Link
          href="/auth/register"
          className="bg-red-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:bg-red-700 hover:shadow-xl transition duration-300"
          aria-label="Get started with HuntingtonBank"
        >
          Get Started
        </Link>
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