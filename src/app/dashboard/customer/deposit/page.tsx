"use client";

import { useState } from "react";

export default function DepositPage() {
  const [depositAmount, setDepositAmount] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositMessage, setDepositMessage] = useState<string | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0D1B2A] mb-4">Deposit Funds</h1>
      <form
        className="bg-white p-6 rounded-xl shadow-md max-w-md"
        onSubmit={async (e) => {
          e.preventDefault();
          setDepositLoading(true);
          setDepositMessage(null);
          try {
            const res = await fetch("/api/user/deposit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount: parseFloat(depositAmount) }),
            });
            const data = await res.json();
            if (data.success) {
              setDepositMessage("Deposit request submitted and is pending admin approval.");
              setDepositAmount("");
            } else {
              setDepositMessage(data.message || "Deposit failed.");
            }
          } catch (err) {
            setDepositMessage("Deposit failed.");
          } finally {
            setDepositLoading(false);
          }
        }}
      >
        <label className="block mb-3">
          <span className="text-gray-700">Amount</span>
          <input
            type="number"
            min="1"
            step="0.01"
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter amount"
            value={depositAmount}
            onChange={e => setDepositAmount(e.target.value)}
            required
            disabled={depositLoading}
          />
        </label>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          disabled={depositLoading}
        >
          {depositLoading ? "Processing..." : "Deposit"}
        </button>
        {depositMessage && (
          <div className="mt-4 text-center text-sm text-gray-700">{depositMessage}</div>
        )}
      </form>
    </div>
  );
}
