'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
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
    <main className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md">BankEase</h1>
        <p className="text-lg md:text-xl max-w-2xl drop-shadow-sm">
          Your Trusted Digital Banking Partner — Manage your money securely and effortlessly.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/auth/login"
            className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-200 transition"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="bg-transparent border border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition"
          >
            Register
          </Link>
        </div>
      </section>

      {/* Why BankEase Section */}
      <section className="py-20 px-6 bg-[url('/bg-pattern.png')] bg-cover bg-fixed">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">Why BankEase?</h2>
        <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              title: "🔒 Secure Transfers",
              description: "Transfer funds safely with end-to-end encryption and smart validation.",
            },
            {
              title: "🧑‍💼 Admin Control",
              description: "Admins can credit accounts, manage users, and monitor transactions easily.",
            },
            {
              title: "📈 Transaction History",
              description: "View detailed logs of your activity to track all credits and debits.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="backdrop-blur-md bg-white/30 border border-white/20 shadow-xl rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">{item.title}</h3>
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
