"use client";

import { useState } from "react";


export default function WithdrawalPage() {
  const [amount, setAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bank, setBank] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/user/withdrawal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          recipientName,
          accountNumber,
          bank,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Withdrawal request submitted and is pending admin approval.");
        setAmount("");
        setRecipientName("");
        setAccountNumber("");
        setBank("");
      } else {
        setMessage(data.message || "Withdrawal failed.");
      }
    } catch (err) {
      setMessage("Withdrawal failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0D1B2A] mb-4">Withdraw Funds</h1>
      <form
        className="bg-white p-6 rounded-xl shadow-md max-w-md"
        onSubmit={handleWithdraw}
      >
        <label className="block mb-3">
          <span className="text-gray-700">Recipient Account Name</span>
          <input
            type="text"
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter recipient's account name"
            value={recipientName}
            onChange={e => setRecipientName(e.target.value)}
            required
            disabled={loading}
          />
        </label>
        <label className="block mb-3">
          <span className="text-gray-700">Recipient Account Number</span>
          <input
            type="text"
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter account number"
            value={accountNumber}
            onChange={e => setAccountNumber(e.target.value)}
            required
            disabled={loading}
          />
        </label>
        <label className="block mb-3">
          <span className="text-gray-700">Bank</span>
          <input
            type="text"
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter bank name"
            value={bank}
            onChange={e => setBank(e.target.value)}
            required
            disabled={loading}
          />
        </label>
        <label className="block mb-3">
          <span className="text-gray-700">Amount</span>
          <input
            type="number"
            min="1"
            step="0.01"
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            disabled={loading}
          />
        </label>
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
          disabled={loading}
        >
          {loading ? "Processing..." : "Withdraw"}
        </button>
        {message && (
          <div className="mt-4 text-center text-sm text-gray-700">{message}</div>
        )}
      </form>
    </div>
  );
}
