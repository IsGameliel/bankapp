"use client";

import { useState } from "react";

export default function TransferPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // stop page refresh
    setLoading(true);
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const body = {
      amount: Number(formData.get("amount")),
      bankName: formData.get("bankName"),
      accountNumber: formData.get("accountNumber"),
      accountName: formData.get("accountName"),
      routingNumber: formData.get("routingNumber"),
      swiftCode: formData.get("swiftCode"),
      bankAddress: formData.get("bankAddress"),
      houseAddress: formData.get("houseAddress"),
      zipCode: formData.get("zipCode"),
    };

    try {
      const res = await fetch("/api/user/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("✅ Transfer successful!");
        form.reset();
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage("❌ Something went wrong.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-[#0D1B2A] mb-6 text-center">
          Transfer Money
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-gray-700">Amount</span>
            <input
              name="amount"
              type="number"
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter amount"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Bank Name</span>
            <input
              name="bankName"
              type="text"
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter bank name"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Account Number</span>
            <input
              name="accountNumber"
              type="text"
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter account number"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Account Name</span>
            <input
              name="accountName"
              type="text"
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter account name"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Routing Number</span>
            <input
              name="routingNumber"
              type="text"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter routing number"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">SWIFT Code</span>
            <input
              name="swiftCode"
              type="text"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter SWIFT code"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Bank Address</span>
            <input
              name="bankAddress"
              type="text"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter bank address"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">House Address</span>
            <input
              name="houseAddress"
              type="text"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter house address"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Zip Code</span>
            <input
              name="zipCode"
              type="text"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter zip code"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {loading ? "Processing..." : "Transfer"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
