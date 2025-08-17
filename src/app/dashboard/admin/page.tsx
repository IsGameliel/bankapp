'use client';
import { useEffect, useState } from 'react';

export default function AdminIndex() {
  const [recentTxs, setRecentTxs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    users: 0,
    activeLoans: 0,
    totalTransactions: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(false);

  // Fetch dashboard stats
  async function fetchStats() {
  try {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    if (data.success && data.stats) {
      setStats({
        users: data.stats.totalUsers ?? 0,
        activeLoans: data.stats.activeLoans ?? 0,
        totalTransactions: data.stats.totalTransactions ?? 0,
        revenue: data.stats.totalRevenue ?? 0,
      });
    }
  } catch (err) {
    console.error('Failed to fetch stats', err);
  }
}

  // Fetch latest transactions
  async function fetchRecentTxs() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/transactions');
      const data = await res.json();
      if (data.success) {
        const sorted = data.transactions
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
          .slice(0, 5);
        setRecentTxs(sorted);
      }
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchStats();
    fetchRecentTxs();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0D1B2A]">Admin Dashboard</h1>
        <p className="text-[#1B263B] mt-2">
          Welcome back! Manage users, loans, and transactions efficiently.
        </p>
      </div>

      {/* Stat Cards with Bank-like Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-2xl shadow hover:scale-105 transition text-white">
          <h2 className="text-sm opacity-80">Total Users</h2>
          <p className="text-3xl font-bold mt-2">{stats.users.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-700 p-6 rounded-2xl shadow hover:scale-105 transition text-white">
          <h2 className="text-sm opacity-80">Active Loans</h2>
          <p className="text-3xl font-bold mt-2">{stats.activeLoans.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-6 rounded-2xl shadow hover:scale-105 transition text-white">
          <h2 className="text-sm opacity-80">Transactions</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalTransactions.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-6 rounded-2xl shadow hover:scale-105 transition text-white">
          <h2 className="text-sm opacity-80">Revenue</h2>
          <p className="text-3xl font-bold mt-2">
            ${stats.revenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold text-[#0D1B2A] mb-4">Recent Activity</h2>
        {loading ? (
          <p className="text-gray-500">Loading recent activities...</p>
        ) : (
          <ul className="space-y-3 text-sm text-[#1B263B]">
            {recentTxs.length === 0 ? (
              <p className="text-gray-500">No recent transactions</p>
            ) : (
              recentTxs.map((tx) => (
                <li
                  key={tx.id}
                  className="flex justify-between border-b pb-2 last:border-none last:pb-0"
                >
                  <span>
                    {tx.type === 'TRANSFER' && (
                      <>Transfer of <b>${tx.amount.toLocaleString()}</b> by {tx.user?.name}</>
                    )}
                    {tx.type === 'LOAN' && (
                      <>Loan <b>{tx.status}</b> for ${tx.amount.toLocaleString()}</>
                    )}
                    {tx.type !== 'TRANSFER' && tx.type !== 'LOAN' && (
                      <>Transaction of ${tx.amount.toLocaleString()}</>
                    )}
                  </span>
                  <span className="text-gray-500">
                    {new Date(tx.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
