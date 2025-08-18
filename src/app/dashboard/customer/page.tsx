"use client";

import { useEffect, useState } from "react";

export default function CustomerDashboard() {
  const [user, setUser] = useState<{ name: string; balance?: number } | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserAndTransactions() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You need to be logged in to view the dashboard.");
          setLoading(false);
          return;
        }

        const [userRes, txRes] = await Promise.all([
          fetch("/api/user", {
            method: "GET",
            credentials: "include", // Include cookies in the request
          }),
          fetch("/api/user/transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          }),
        ]);

        if (!userRes.ok) {
          throw new Error(`Failed to fetch user data: ${userRes.status} ${userRes.statusText}`);
        }
        if (!txRes.ok) {
          throw new Error(`Failed to fetch transactions: ${txRes.status} ${txRes.statusText}`);
        }

        const userData = await userRes.json();
        const txData = await txRes.json();

        if (userData.success) {
          setUser(userData.user);
        } else {
          setError(userData.message || "Failed to fetch user data");
        }

        if (txData.success) {
          setTransactions(txData.transactions);
        } else {
          setError(txData.message || "Failed to fetch transactions");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong while loading the dashboard");
        console.error("Dashboard Fetch Error:", err);
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-lg text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0D1B2A]">
            Welcome back, {user?.name || "Guest"} 👋
          </h1>
          <p className="text-gray-600">
            Manage your accounts, transfers, and transactions easily.
          </p>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Balance Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between">
            <h3 className="text-sm uppercase opacity-80">Account Balance</h3>
            <p className="text-3xl font-bold mt-2">
              ${user?.balance?.toLocaleString() || "0.00"}
            </p>
            <p className="text-xs mt-4 opacity-70">As of today</p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Quick Actions
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => (window.location.href = "/dashboard/customer/transfer")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Transfer
              </button>
              <button
                onClick={() => (window.location.href = "/dashboard/customer/loans")}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition"
              >
                Loans
              </button>
            </div>
          </div>

          {/* Profile */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">
              Profile Status
            </h3>
            <p className="text-sm text-gray-500 mt-2">Verified ✅</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Recent Transactions
            </h3>
            <a
              href="/dashboard/customer/transactions"
              className="text-blue-600 text-sm hover:underline"
            >
              View All
            </a>
          </div>
          {transactions.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {transactions.slice(0, 5).map((tx) => (
                <li
                  key={tx.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {tx.description || tx.type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.createdAt).toLocaleDateString()} •{" "}
                      <span
                        className={`${
                          tx.status === "SUCCESS"
                            ? "text-green-600"
                            : tx.status === "PENDING"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </p>
                  </div>
                  <p
                    className={`font-semibold ${
                      tx.type === "DEPOSIT" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "DEPOSIT" ? "+" : "-"}${tx.amount.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No recent transactions</p>
          )}
        </div>
      </div>
    </div>
  );
}