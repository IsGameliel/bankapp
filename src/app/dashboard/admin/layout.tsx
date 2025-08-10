// /src/app/dashboard/admin/layout.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminIcons } from '../icons';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between">
        <div>
          <div className="text-2xl font-bold mb-6">Admin Panel</div>
          <nav className="flex flex-col gap-2">
            <Link href="/dashboard/admin" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800">
              {adminIcons.Overview && <adminIcons.Overview className="w-5 h-5" />} Overview
            </Link>
            <Link href="/dashboard/admin/users" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800">
              {adminIcons.Users && <adminIcons.Users className="w-5 h-5" />} Users
            </Link>
            <Link href="/dashboard/admin/loans" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800">
              {adminIcons.Loans && <adminIcons.Loans className="w-5 h-5" />} Loans
            </Link>
            <Link href="/dashboard/admin/transactions" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800">
              {adminIcons.Transactions && <adminIcons.Transactions className="w-5 h-5" />} Transactions
            </Link>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="mt-8 w-full px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
