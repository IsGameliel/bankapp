'use client';

import { useState, useEffect } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
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
  

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error || 'Registration failed');
    } else {
      setMessage('Registration successful. You can now log in.');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {message && <p className="text-center text-sm text-red-500 mb-4">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </main>
  );
}
