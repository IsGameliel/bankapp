'use client';
import { useEffect, useState } from 'react';

export default function AdminLoansPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchLoans() {
    setLoading(true);
    const res = await fetch('/api/admin/loans');
    const data = await res.json();
    if (data.success) setLoans(data.loans);
    setLoading(false);
  }

  useEffect(() => { fetchLoans(); }, []);

  async function updateLoan(id: string, status: string) {
    const res = await fetch(`/api/admin/loans/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (data.success) fetchLoans(); else alert('Failed');
  }

  function statusBadge(status: string) {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";
    if (status === "APPROVED") return <span className={`${base} bg-green-100 text-green-700`}>APPROVED</span>;
    if (status === "PENDING") return <span className={`${base} bg-yellow-100 text-yellow-700`}>PENDING</span>;
    if (status === "REJECTED") return <span className={`${base} bg-red-100 text-red-700`}>REJECTED</span>;
    return status;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#0D1B2A]">Loan Management</h2>
      <p className="text-[#1B263B]">Review and manage customer loan requests.</p>

      {loading ? (
        <p className="text-[#1B263B]">Loading loans...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loans.map((l) => (
            <div
              key={l.id}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition"
            >
              <div>
                <h3 className="text-lg font-semibold text-[#0D1B2A]">{l.user?.name}</h3>
                <p className="text-sm text-gray-600">{l.user?.email}</p>

                <div className="mt-3">
                  <p className="text-sm text-gray-500">Loan Amount</p>
                  <p className="text-xl font-bold text-[#0D1B2A]">${l.amount.toFixed(2)}</p>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-gray-500">Status</p>
                  {statusBadge(l.status)}
                </div>
              </div>

              {l.status === 'PENDING' && (
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => updateLoan(l.id, 'APPROVED')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateLoan(l.id, 'REJECTED')}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
