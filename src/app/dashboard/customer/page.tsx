"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomerDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [user, setUser] = useState<{
    name: string;
    email: string;
    accountNumber?: string;
    accountType?: string;
    profilePicture?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editProfilePicture, setEditProfilePicture] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Logout function
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };

  // Open edit modal and set initial values
  const openEditProfile = () => {
    setEditName(user?.name || "");
    setEditProfilePicture(user?.profilePicture || "");
    setShowEdit(true);
  };

  // Handle profile update (calls API)
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, profilePicture: editProfilePicture }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setShowEdit(false);
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  // Handle file input change for profile picture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
          {['dashboard', 'deposit', 'transfer', 'transactions', 'profile'].map((item) => (
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
          <button
            onClick={handleLogout}
            className="w-full text-left px-6 py-3 hover:bg-red-700 transition text-red-300 capitalize"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <div>
            <h1 className="text-3xl font-bold text-[#0D1B2A] mb-4">Customer Dashboard</h1>
            <p className="text-gray-600 mb-6">
              Welcome! {user?.name || 'Guest'} — Manage your account with ease.
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
          <div className="bg-white p-6 rounded-xl shadow-md max-w-lg relative">
            <h1 className="text-2xl font-bold text-[#0D1B2A] mb-4">Profile Information</h1>
            <div className="flex flex-col items-center mb-6">
              <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden mb-2 border-4 border-[#0D1B2A]">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                  </svg>
                )}
              </div>
              <button
                onClick={openEditProfile}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            </div>
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

            {/* Edit Profile Modal */}
            {showEdit && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md relative">
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                    onClick={() => setShowEdit(false)}
                  >
                    &times;
                  </button>
                  <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-2 border-2 border-[#0D1B2A]">
                        {editProfilePicture ? (
                          <img src={editProfilePicture} alt="Profile Preview" className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      <button
                        type="button"
                        className="text-blue-600 underline text-sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Change Photo
                      </button>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
