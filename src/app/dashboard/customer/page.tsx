"use client";

import { useEffect, useState } from "react";

export default function CustomerDashboard() {
  const [user, setUser] = useState<{
    name: string;
    balance?: number;
  } | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserAndTransactions() {
      try {
        const [userRes, txRes] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/user/transactions")
        ]);
        const userData = await userRes.json();
        const txData = await txRes.json();
        if (userData.success) setUser(userData.user);
        if (txData.success) setTransactions(txData.transactions);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchUserAndTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-lg text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#0D1B2A] mb-4">Customer Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Welcome! {user?.name || 'Guest'} — Manage your account with ease.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Account Balance</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">${user?.balance}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Recent Transactions</h3>
          {transactions.length > 0 ? (
            <p className="text-sm text-gray-500 mt-2">
              Last: {transactions[0].type === 'WITHDRAWAL' ? '-' : '+'}${transactions[0].amount} {transactions[0].description ? transactions[0].description : ''} <span className="ml-2 text-xs text-gray-400">({transactions[0].status})</span>
            </p>
          ) : (
            <p className="text-sm text-gray-400 mt-2">No recent transactions</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Profile Status</h3>
          <p className="text-sm text-gray-500 mt-2">Verified ✅</p>
        </div>
      </div>
    </div>
  );
}
