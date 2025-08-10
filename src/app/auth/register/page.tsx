'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error || 'Registration failed');
    } else {
      setMessage('✅ Registration successful! You can now log in.');
      setName('');
      setEmail('');
      setPassword('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white border-opacity-50"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#0D1B2A]">
          Create Your Account
        </h2>

        {/* Full Name */}
        <div className="flex items-center border rounded mb-4 px-3">
          <User className="text-gray-400 mr-2" size={20} />
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="flex items-center border rounded mb-4 px-3">
          <Mail className="text-gray-400 mr-2" size={20} />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center border rounded mb-4 px-3">
          <Lock className="text-gray-400 mr-2" size={20} />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Message */}
        {message && (
          <p
            className={`text-center text-sm mb-4 ${
              message.startsWith('✅') ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-blue-700 transition"
        >
          {loading ? 'Registering...' : <>Register <ArrowRight size={18} /></>}
        </button>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center mt-4">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>.
        </p>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </main>
  );
}
