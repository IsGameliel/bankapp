// /src/app/dashboard/admin/transactions/page.tsx
'use client';
import { useEffect, useState } from 'react';

export default function AdminTransactionsPage() {
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<string>('');
  const [saving, setSaving] = useState(false);

  async function fetchTxs() {
    setLoading(true);
    const res = await fetch('/api/admin/transactions');
    const data = await res.json();
    if (data.success) setTxs(data.transactions);
    setLoading(false);
  }

  useEffect(() => { fetchTxs(); }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-[#0D1B2A]">Transaction Histories</h2>
      {loading ? <p className="text-[#0D1B2A]">Loading transactions...</p> : (
        <div className="bg-white p-4 rounded shadow">
          <table className="w-full table-auto">
            <thead>
              <tr className='text-[#0D1B2A]'><th>Date</th><th>User</th><th>Type</th><th>Amount</th><th>Description</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {txs.map(t => (
                <tr key={t.id} className="border-t text-gray-700">
                  <td className="p-2">{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="p-2">{t.user?.name}</td>
                  <td className="p-2">{t.type}</td>
                  <td className="p-2">{t.amount.toFixed(2)}</td>
                  <td className="p-2">{t.description}</td>
                  <td className="p-2">{editId === t.id ? (
                    <select
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value)}
                      className="border rounded px-2 py-1"
                      disabled={saving}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="SUCCESS">SUCCESS</option>
                      <option value="FAILED">FAILED</option>
                    </select>
                  ) : t.status}
                  </td>
                  <td className="p-2">
                    {editId === t.id ? (
                      <button
                        className="bg-green-600 text-white px-2 py-1 rounded mr-2 disabled:opacity-50"
                        disabled={saving}
                        onClick={async () => {
                          setSaving(true);
                          await fetch(`/api/admin/transactions/${t.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: editStatus }),
                          });
                          setEditId(null);
                          setEditStatus('');
                          setSaving(false);
                          fetchTxs();
                        }}
                      >Save</button>
                    ) : (
                      <button
                        className="bg-blue-600 text-white px-2 py-1 rounded"
                        onClick={() => {
                          setEditId(t.id);
                          setEditStatus(t.status);
                        }}
                      >Edit</button>
                    )}
                    {editId === t.id && (
                      <button
                        className="ml-2 text-gray-500 underline"
                        disabled={saving}
                        onClick={() => { setEditId(null); setEditStatus(''); }}
                      >Cancel</button>
                    )}
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
