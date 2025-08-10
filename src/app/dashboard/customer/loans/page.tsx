"use client";
import { useEffect, useState } from "react";

export default function CustomerLoansPage() {
  const [amount, setAmount] = useState(0);
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchLoans() {
    setLoading(true);
    const res = await fetch("/api/user/loans");
    const data = await res.json();
    if (data.success) setLoans(data.loans);
    setLoading(false);
  }

  useEffect(() => { fetchLoans(); }, []);

  async function submitLoan(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/user/loans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const data = await res.json();
    if (data.success) {
      setSuccess("Loan request submitted!");
      setAmount(0);
      fetchLoans();
    } else {
      setError(data.message || "Failed to request loan");
    }
    setSubmitting(false);
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-[#0D1B2A]">My Loans</h2>
      <form onSubmit={submitLoan} className="mb-6 bg-white p-4 rounded shadow">
        <label className="block mb-2 text-[#0D1B2A]">Loan Amount</label>
        <input
          type="number"
          min={1}
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          className="border p-2 rounded w-full mb-2"
          required
        />
        <button type="submit" disabled={submitting || amount <= 0} className="bg-blue-600 text-white px-4 py-2 rounded">
          {submitting ? "Submitting..." : "Request Loan"}
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </form>
      {loading ? <p>Loading loans...</p> : (
        <div className="bg-white p-4 rounded shadow">
          <table className="w-full table-auto text-[#0D1B2A]">
            <thead>
              <tr><th>Amount</th><th>Status</th><th>Requested At</th></tr>
            </thead>
            <tbody>
              {loans.map(l => (
                <tr key={l.id} className="border-t">
                  <td className="p-2">{l.amount.toFixed(2)}</td>
                  <td className="p-2">{l.status}</td>
                  <td className="p-2">{new Date(l.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
