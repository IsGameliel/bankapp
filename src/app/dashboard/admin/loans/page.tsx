// /src/app/dashboard/admin/loans/page.tsx
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

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-[#0D1B2A]">Manage Loans</h2>
      {loading ? <p className="text-[#0D1B2A]">Loading loans...</p> : (
        <div className="bg-white p-4 rounded shadow">
          <table className="w-full table-auto text-[#0D1B2A]">
            <thead>
              <tr><th>Customer</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loans.map(l => (
                <tr key={l.id} className="border-t">
                  <td className="p-2">{l.user?.name} ({l.user?.email})</td>
                  <td className="p-2">{l.amount.toFixed(2)}</td>
                  <td className="p-2">{l.status}</td>
                  <td className="p-2">
                    {l.status === 'PENDING' && <>
                      <button onClick={() => updateLoan(l.id, 'APPROVED')} className="px-2 py-1 bg-green-600 text-white rounded mr-2">Approve</button>
                      <button onClick={() => updateLoan(l.id, 'REJECTED')} className="px-2 py-1 bg-red-600 text-white rounded">Reject</button>
                    </>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
