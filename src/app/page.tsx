'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white border-opacity-50"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        <h1 className="relative text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg">
          BankEase
        </h1>
        <p className="relative text-lg md:text-2xl max-w-2xl leading-relaxed drop-shadow-md">
          The future of banking — Secure, fast, and effortless.  
          Your money, your control, anywhere, anytime.
        </p>

        <div className="relative mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/auth/login"
            className="bg-white text-blue-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:bg-gray-100 transition duration-300"
          >
            Get Started
          </Link>
          <Link
            href="/auth/register"
            className="bg-transparent border border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-700 transition duration-300"
          >
            Open an Account
          </Link>
        </div>

      </section>

      {/* Why BankEase Section */}
      <section className="py-20 px-6 bg-white">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Why Choose <span className="text-blue-600">BankEase</span>?
        </h2>
        <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              title: "🔒 Ironclad Security",
              description:
                "We use bank-grade encryption, advanced fraud detection, and two-factor authentication to keep your money safe 24/7.",
            },
            {
              title: "⚡ Instant Transfers",
              description:
                "Send and receive money in seconds — whether it's across the street or across the country.",
            },
            {
              title: "📊 Smart Financial Insights",
              description:
                "Track spending, monitor transactions, and gain insights that help you make better financial decisions.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-xl rounded-2xl p-8 text-center border hover:scale-105 hover:shadow-2xl transition-transform duration-300"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
