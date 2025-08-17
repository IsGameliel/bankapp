'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { adminIcons } from '../icons';

const adminLinks = [
  { href: '/dashboard/admin', label: 'Overview', icon: adminIcons.Overview },
  { href: '/dashboard/admin/users', label: 'Users', icon: adminIcons.Users },
  { href: '/dashboard/admin/loans', label: 'Loans', icon: adminIcons.Loans },
  { href: '/dashboard/admin/transactions', label: 'Transactions', icon: adminIcons.Transactions },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-[#0D1B2A] text-white flex flex-col shadow-lg transform transition-transform duration-300 z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-6 border-b border-[#1B263B] flex items-center justify-between lg:justify-center">
          <h2 className="text-2xl font-bold tracking-wide">Admin Panel</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-300 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 mt-6 overflow-y-auto">
          <ul className="space-y-1">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-3 px-6 py-3 rounded-lg hover:bg-[#1B263B] transition font-medium text-gray-200 hover:text-white"
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

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top navbar (mobile only) */}
        <header className="lg:hidden flex items-center justify-between bg-[#0D1B2A] text-white px-4 py-3 shadow-md">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button onClick={() => setIsOpen(!isOpen)}>
            <Menu size={28} />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
