"use client";

import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/user/transactions");
        const data = await res.json();
        if (data.success) setTransactions(data.transactions);
        else setError(data.message || "Failed to fetch transactions");
      } catch {
        setError("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0D1B2A] mb-4">Transaction History</h1>
      {loading ? (
        <div className="text-gray-600">Loading transactions...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : transactions.length === 0 ? (
        <div className="text-gray-600">No transactions found.</div>
      ) : (
        <table className="bg-white w-full rounded-xl shadow-md overflow-hidden">
          <thead className="bg-[#0D1B2A] text-white">
            <tr>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id} className="border-b text-gray-700 hover:bg-gray-100">
                <td className="py-3 px-4">{new Date(tx.createdAt).toLocaleString()}</td>
                <td className="py-3 px-4">{tx.description || '-'}</td>
                <td className={`py-3 px-4 ${tx.type === 'DEPOSIT' ? 'text-green-500' : tx.type === 'WITHDRAWAL' ? 'text-red-500' : ''}`}>{tx.type === 'WITHDRAWAL' ? '-' : '+'}${tx.amount}</td>
                <td className="py-3 px-4">{tx.type}</td>
                <td className="py-3 px-4">{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
