'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Lock, KeyRound, ArrowRight } from 'lucide-react';

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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (message === 'Login successful! Redirecting...' && redirectPath) {
      const timer = setTimeout(() => router.push(redirectPath), 1200);
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
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 px-4">
      {/* Form Container */}
      <form
        onSubmit={step === 'credentials' ? handleLogin : handleOtpVerify}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full relative z-10"
      >
        {/* Step Indicator */}
        <div className="flex justify-center mb-4">
          <span className={`px-3 py-1 text-sm rounded-full ${step === 'credentials' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
            Step 1: Login
          </span>
          <span className={`px-3 py-1 text-sm rounded-full ml-2 ${step === 'otp' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
            Step 2: OTP
          </span>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center text-[#0D1B2A]">Welcome Back</h2>

        {step === 'credentials' && (
          <>
            <div className="flex items-center border rounded mb-4 px-3">
              <Mail className="text-gray-400 mr-2" size={20} />
              <input
                type="email"
                placeholder="Email address"
                className="w-full p-3 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

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

            {/* Forgot Password */}
            <div className="flex justify-end mb-4">
              <Link href="/auth/forgot-password" className="text-blue-600 text-sm hover:underline">
                Forgot password?
              </Link>
            </div>
          </>
        )}

        {step === 'otp' && (
          <div className="flex items-center border rounded mb-4 px-3">
            <KeyRound className="text-gray-400 mr-2" size={20} />
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-3 outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
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
          className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-blue-700 transition"
        >
          {loading
            ? step === 'credentials'
              ? 'Verifying...'
              : 'Verifying OTP...'
            : step === 'credentials'
            ? <>Login <ArrowRight size={18} /></>
            : <>Submit OTP <ArrowRight size={18} /></>}
        </button>

        {/* Sign Up Link */}
        {step === 'credentials' && (
          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Create one
            </Link>
          </p>
        )}
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
