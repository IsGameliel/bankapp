"use client";

import { useEffect, useState, useRef } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    accountNumber?: string;
    accountType?: string;
    profilePicture?: string;
    balance?: number;
    tier?: string;
  } | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editProfilePicture, setEditProfilePicture] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const openEditProfile = () => {
    setEditName(user?.name || "");
    setEditProfilePicture(user?.profilePicture || "");
    setShowEdit(true);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          profilePicture: editProfilePicture,
        }),
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
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-2xl p-6 shadow-lg flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white overflow-hidden border-4 border-white shadow">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-full h-full text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
              </svg>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.name || "N/A"}</h1>
            <p className="text-sm opacity-80">{user?.email}</p>
            <span className="inline-block mt-1 text-xs bg-white text-blue-700 px-3 py-1 rounded-full font-semibold">
              {user?.tier || "Standard"}
            </span>
          </div>
        </div>
        <button
          onClick={openEditProfile}
          className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
        >
          Edit
        </button>
      </div>

      {/* Account Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm font-semibold text-gray-500">Account Number</h2>
          <p className="text-lg font-bold text-gray-800">
            {user?.accountNumber || "Not Available"}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm font-semibold text-gray-500">Account Type</h2>
          <p className="text-lg font-bold text-gray-800">
            {user?.accountType || "Not Available"}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 col-span-1 md:col-span-2">
          <h2 className="text-sm font-semibold text-gray-500">Balance</h2>
          <p className="text-2xl font-bold text-green-600">
            ₦{user?.balance?.toLocaleString() || "0.00"}
          </p>
        </div>
      </div>

      {/* Edit Modal */}
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
                    <img
                      src={editProfilePicture}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-full h-full text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
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
                  onChange={(e) => setEditName(e.target.value)}
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
  );
}
