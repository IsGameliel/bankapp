"use client";

import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

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

  const statusColors: Record<string, string> = {
    SUCCESS: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    FAILED: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold text-[#0D1B2A] mb-6">
        Transaction History
      </h1>

      {loading ? (
        <div className="text-gray-600">Loading transactions...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : transactions.length === 0 ? (
        <div className="text-gray-600">No transactions found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="w-full text-sm bg-white">
            <thead className="bg-[#0D1B2A] text-white">
              <tr>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">{tx.description || "-"}</td>
                  <td
                      className={`py-3 px-4 font-semibold ${
                        tx.type === "DEPOSIT"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {tx.type === "DEPOSIT" ? "+" : "-"}${tx.amount}
                    </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[tx.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {tx.metadata ? (
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="text-blue-600 hover:underline"
                      >
                        View Receipt
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setSelectedTx(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-[#0D1B2A]">
              Transaction Receipt
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedTx.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Amount:</strong>{" "}
                <span className="text-blue-700 font-semibold">
                  ${selectedTx.amount}
                </span>
              </p>
              <p>
                <strong>Type:</strong> {selectedTx.type}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    statusColors[selectedTx.status] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {selectedTx.status}
                </span>
              </p>
            </div>

            <hr className="my-4" />

            {selectedTx.metadata && (
              <div>
                <h3 className="font-semibold mb-3 text-[#0D1B2A]">
                  Bank Details
                </h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <strong>Bank Name:</strong>{" "}
                    {selectedTx.metadata.bankName}
                  </p>
                  <p>
                    <strong>Account Number:</strong>{" "}
                    {selectedTx.metadata.accountNumber}
                  </p>
                  <p>
                    <strong>Account Name:</strong>{" "}
                    {selectedTx.metadata.accountName}
                  </p>
                  <p>
                    <strong>Routing Number:</strong>{" "}
                    {selectedTx.metadata.routingNumber}
                  </p>
                  <p>
                    <strong>SWIFT Code:</strong>{" "}
                    {selectedTx.metadata.swiftCode}
                  </p>
                  <p>
                    <strong>Bank Address:</strong>{" "}
                    {selectedTx.metadata.bankAddress}
                  </p>
                  <p>
                    <strong>House Address:</strong>{" "}
                    {selectedTx.metadata.houseAddress}
                  </p>
                  <p>
                    <strong>Zip Code:</strong>{" "}
                    {selectedTx.metadata.zipCode}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => setSelectedTx(null)}
                className="bg-[#0D1B2A] text-white px-5 py-2 rounded-lg hover:bg-[#1B263B] transition"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
