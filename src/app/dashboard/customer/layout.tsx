
"use client";


import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../../globals.css';
import { customerIcons } from '../icons';

const sidebarLinks = [
  { href: '/dashboard/customer', label: 'Dashboard' },
  { href: '/dashboard/customer/transactions', label: 'Transactions' },
  { href: '/dashboard/customer/deposit', label: 'Deposit' },
  { href: '/dashboard/customer/withdrawal', label: 'Withdrawal' },
  { href: '/dashboard/customer/transfer', label: 'Transfer' },
  { href: '/dashboard/customer/loans', label: 'Loans' },
  { href: '/dashboard/customer/profile', label: 'Profile' },
];


export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-[#0D1B2A] text-white flex flex-col shadow-lg">
        <div className="p-6 border-b border-[#1B263B]">
          <h2 className="text-2xl font-bold tracking-wide">BankApp</h2>
        </div>
        <nav className="flex-1 mt-6">
          <ul className="space-y-2">
            {sidebarLinks.map(link => {
              const Icon = customerIcons[link.label as keyof typeof customerIcons];
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-3 px-6 py-3 rounded-lg hover:bg-[#1B263B] transition font-medium text-white"
                    prefetch={false}
                  >
                    {Icon && <Icon className="w-5 h-5" />} {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-6 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 bg-white">{children}</main>
    </div>
  );
}
