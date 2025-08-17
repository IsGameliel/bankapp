"use client";
import { useEffect, useState } from "react";

export default function CustomerLoansPage() {
  const [amount, setAmount] = useState(0);
  const [duration, setDuration] = useState(""); // loan tenure
  const [purpose, setPurpose] = useState(""); // purpose of loan
  const [income, setIncome] = useState(""); // user monthly income
  const [employmentStatus, setEmploymentStatus] = useState(""); // job status

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
      body: JSON.stringify({ amount, durationMonths: Number(duration), purpose, monthlyIncome: Number(income), employmentStatus }),
    });
    const data = await res.json();
    if (data.success) {
      setSuccess("Loan request submitted!");
      setAmount(0);
      setDuration("");
      setPurpose("");
      setIncome("");
      setEmploymentStatus("");
      fetchLoans();
    } else {
      setError(data.message || "Failed to request loan");
    }
    setSubmitting(false);
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-[#0D1B2A]">Loan Application</h2>

      {/* Loan Request Form */}
      <form onSubmit={submitLoan} className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#0D1B2A] mb-1">Loan Amount</label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="border border-gray-300 rounded-lg p-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0D1B2A] mb-1">Loan Duration (Months)</label>
            <input
              type="number"
              min={1}
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-[#0D1B2A] mb-1">Purpose of Loan</label>
            <textarea
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full"
              rows={3}
              placeholder="e.g., Business expansion, Education, Medical bills"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0D1B2A] mb-1">Monthly Income</label>
            <input
              type="number"
              value={income}
              onChange={e => setIncome(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0D1B2A] mb-1">Employment Status</label>
            <select
              value={employmentStatus}
              onChange={e => setEmploymentStatus(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full"
              required
            >
              <option value="">Select</option>
              <option value="Employed">Employed</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Student">Student</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || amount <= 0}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium w-full md:w-auto"
        >
          {submitting ? "Submitting..." : "Submit Loan Request"}
        </button>

        {error && <p className="text-red-600 mt-3">{error}</p>}
        {success && <p className="text-green-600 mt-3">{success}</p>}
      </form>

      {/* Loan History */}
      <h3 className="text-xl font-semibold mb-4 text-[#0D1B2A]">Loan History</h3>
      {loading ? (
        <p className="text-gray-500">Loading loans...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Amount</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Status</th>
                <th className="p-3">Requested At</th>
              </tr>
            </thead>
            <tbody>
              {loans.map(l => (
                <tr key={l.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">${l.amount.toFixed(2)}</td>
                  <td className="p-3">{l.durationMonths} months</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        l.status === "APPROVED" ? "bg-green-100 text-green-700" :
                        l.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(l.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
