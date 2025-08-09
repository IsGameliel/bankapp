'use client';

import { useEffect, useState } from 'react';

export default function CustomerDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [user, setUser] = useState<{ name: string; email: string; accountNumber?: string; accountType?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-lg text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0D1B2A] text-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold tracking-wide">BankApp</h2>
        </div>
        <nav className="flex-1 mt-6">
          {['dashboard', 'deposit', 'transfer', 'transactions', 'profile', 'logout'].map((item) => (
            <button
              key={item}
              onClick={() => setActiveSection(item)}
              className={`w-full text-left px-6 py-3 hover:bg-[#1B263B] transition ${
                activeSection === item ? 'bg-[#1B263B]' : ''
              } capitalize`}
            >
              {item.replace('-', ' ')}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <div>
            <h1 className="text-3xl font-bold text-[#0D1B2A] mb-4">Customer Dashboard</h1>
            <p className="text-gray-600 mb-6">
              Welcome! {user?.email || 'Guest'} — Manage your account with ease.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Account Balance</h3>
                <p className="text-2xl font-bold text-green-600 mt-2">$5,200.00</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Recent Transactions</h3>
                <p className="text-sm text-gray-500 mt-2">Last: -$120.00 Grocery Store</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Profile Status</h3>
                <p className="text-sm text-gray-500 mt-2">Verified ✅</p>
              </div>
            </div>
          </div>
        )}

        {/* Deposit Section */}
        {activeSection === 'deposit' && (
          <div>
            <h1 className="text-2xl font-bold text-[#0D1B2A] mb-4">Deposit Funds</h1>
            <form className="bg-white p-6 rounded-xl shadow-md max-w-md">
              <label className="block mb-3">
                <span className="text-gray-700">Amount</span>
                <input
                  type="number"
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter amount"
                />
              </label>
              <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
                Deposit
              </button>
            </form>
          </div>
        )}

        {/* Transfer Section */}
        {activeSection === 'transfer' && (
          <div>
            <h1 className="text-2xl font-bold text-[#0D1B2A] mb-4">Transfer Money</h1>
            <form className="bg-white p-6 rounded-xl shadow-md max-w-md">
              <label className="block mb-3">
                <span className="text-gray-700">Recipient Email</span>
                <input
                  type="email"
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter recipient email"
                />
              </label>
              <label className="block mb-3">
                <span className="text-gray-700">Amount</span>
                <input
                  type="number"
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter amount"
                />
              </label>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                Transfer
              </button>
            </form>
          </div>
        )}

        {/* Transaction History */}
        {activeSection === 'transactions' && (
          <div>
            <h1 className="text-2xl font-bold text-[#0D1B2A] mb-4">Transaction History</h1>
            <table className="bg-white w-full rounded-xl shadow-md overflow-hidden">
              <thead className="bg-[#0D1B2A] text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">2025-08-01</td>
                  <td className="py-3 px-4">Transfer to John Doe</td>
                  <td className="py-3 px-4 text-red-500">- $150</td>
                  <td className="py-3 px-4 text-gray-600">Completed</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">2025-07-30</td>
                  <td className="py-3 px-4">Deposit</td>
                  <td className="py-3 px-4 text-green-500">+ $500</td>
                  <td className="py-3 px-4 text-gray-600">Completed</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="bg-white p-6 rounded-xl shadow-md max-w-lg">
            <h1 className="text-2xl font-bold text-[#0D1B2A] mb-4">Profile Information</h1>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700">Full Name:</span>
                <p className="text-gray-600">{user?.name || 'N/A'}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Email:</span>
                <p className="text-gray-600">{user?.email || 'N/A'}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Account Number:</span>
                <p className="text-gray-600">{user?.accountNumber || 'Not Available'}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Account Type:</span>
                <p className="text-gray-600">{user?.accountType || 'Not Available'}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}