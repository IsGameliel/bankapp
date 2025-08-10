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
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const router = useRouter();

  // Simulate initial page load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Redirect after OTP verification
  useEffect(() => {
    if (message === 'Login successful! Redirecting...' && redirectPath) {
      const timer = setTimeout(() => {
        router.push(redirectPath);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [message, redirectPath, router]);

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
      setUserId(data.userId);
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
      if (data.token) {
      localStorage.setItem('token', data.token);
      }
      
      setMessage('Login successful! Redirecting...');
      const path = data.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/customer';
      setRedirectPath(path);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Form */}
      <form
        onSubmit={step === 'credentials' ? handleLogin : handleOtpVerify}
        className="bg-white p-8 rounded-lg shadow max-w-md w-full relative z-10"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#0D1B2A]">Login</h2>

        {step === 'credentials' && (
          <>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded mb-4 text-[#0D1B2A]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded mb-4 text-[#0D1B2A]"
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
          <p
            className={`text-center text-sm mb-4 ${
              message.includes('successful') ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0D1B2A] text-white py-3 rounded hover:bg-blue-700 transition"
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

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
        </div>
      )}
    </main>
  );
}
