'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const router = useRouter();
  
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error || 'Login failed');
    } else {
      setMessage('OTP sent to your email');
      setUserId(data.userId); // Store userId to verify OTP later
      setStep('otp');
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error || 'Invalid OTP');
    } else {
      setMessage('Login successful! Redirecting...');
      const role = data.role?.toUpperCase();
      const redirectPath = data.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/customer';
      console.log('OTP verified. Redirecting to:', redirectPath);
      router.push(redirectPath);
      // TODO: Save token/session and redirect user
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={step === 'credentials' ? handleLogin : handleOtpVerify}
        className="bg-white p-8 rounded-lg shadow max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {step === 'credentials' && (
          <>
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
          </>
        )}

        {step === 'otp' && (
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full p-3 border rounded mb-4"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        )}

        {message && (
          <p className="text-center text-sm text-red-500 mb-4">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          {loading
            ? step === 'credentials'
              ? 'Verifying...'
              : 'Verifying OTP...'
            : step === 'credentials'
            ? 'Login'
            : 'Submit OTP'}
        </button>
      </form>
    </main>
  );
}
