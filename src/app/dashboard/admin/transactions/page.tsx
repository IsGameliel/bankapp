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

  function statusBadge(status: string) {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";
    if (status === "SUCCESS") return <span className={`${base} bg-green-100 text-green-700`}>SUCCESS</span>;
    if (status === "PENDING") return <span className={`${base} bg-yellow-100 text-yellow-700`}>PENDING</span>;
    if (status === "FAILED") return <span className={`${base} bg-red-100 text-red-700`}>FAILED</span>;
    return status;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-3xl font-bold text-[#0D1B2A]">Transaction Histories</h2>

      {loading ? (
        <p className="text-[#1B263B]">Loading transactions...</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white p-6 rounded-2xl shadow-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#0D1B2A] text-white text-sm uppercase">
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {txs.map((t, i) => (
                  <tr
                    key={t.id}
                    className={`border-b hover:bg-gray-50 transition ${i % 2 === 0 ? "bg-gray-50/40" : "bg-white"}`}
                  >
                    <td className="p-3 text-sm text-gray-700">{new Date(t.createdAt).toLocaleString()}</td>
                    <td className="p-3 text-sm text-gray-700">{t.user?.name}</td>
                    <td className="p-3 text-sm text-gray-700">{t.type}</td>
                    <td className="p-3 text-sm font-semibold text-[#0D1B2A]">₦{t.amount.toFixed(2)}</td>
                    <td className="p-3 text-sm text-gray-600">{t.description}</td>
                    <td className="p-3 text-sm">
                      {editId === t.id ? (
                        <select
                          value={editStatus}
                          onChange={e => setEditStatus(e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                          disabled={saving}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="SUCCESS">SUCCESS</option>
                          <option value="FAILED">FAILED</option>
                        </select>
                      ) : (
                        statusBadge(t.status)
                      )}
                    </td>
                    <td className="p-3 text-sm">
                      {editId === t.id ? (
                        <>
                          <button
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mr-2 disabled:opacity-50"
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
                          >
                            Save
                          </button>
                          <button
                            className="text-gray-500 hover:text-gray-700 underline"
                            disabled={saving}
                            onClick={() => { setEditId(null); setEditStatus(''); }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                          onClick={() => {
                            setEditId(t.id);
                            setEditStatus(t.status);
                          }}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {txs.map(t => (
              <div key={t.id} className="bg-white rounded-xl shadow p-4 space-y-2 border">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</span>
                  {statusBadge(t.status)}
                </div>
                <div className="text-[#0D1B2A] font-semibold">₦{t.amount.toFixed(2)}</div>
                <div className="text-sm text-gray-600">{t.type} — {t.description}</div>
                <div className="text-sm text-gray-700">By {t.user?.name}</div>
                <div className="pt-2">
                  {editId === t.id ? (
                    <div className="space-x-2">
                      <select
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                        disabled={saving}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="SUCCESS">SUCCESS</option>
                        <option value="FAILED">FAILED</option>
                      </select>
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:opacity-50"
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
                      >
                        Save
                      </button>
                      <button
                        className="text-gray-500 hover:text-gray-700 underline"
                        disabled={saving}
                        onClick={() => { setEditId(null); setEditStatus(''); }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      onClick={() => {
                        setEditId(t.id);
                        setEditStatus(t.status);
                      }}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
