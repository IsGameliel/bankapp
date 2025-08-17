'use client';
import { useEffect, useState } from 'react';

type User = {
  id: string;
  name?: string;
  email: string;
  balance: number;
  status?: string;
  accountType?: string;
  accountNumber?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', accountType: 'SAVINGS', balance: 0 });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', balance: 0, status: 'ACTIVE', accountType: 'SAVINGS' });

  async function fetchUsers() {
    setLoading(true);
    const res = await fetch('/api/admin/customers');
    const data = await res.json();
    if (data.success) setUsers(data.users);
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setForm({ name: '', email: '', password: '', accountType: 'SAVINGS', balance: 0 });
        fetchUsers();
      } else {
        alert(data.message || 'Create failed');
      }
    } catch (err) {
      console.error(err);
      alert('Create failed');
    } finally {
      setCreating(false);
    }
  }

  function startEdit(user: User) {
    setEditingId(user.id);
    setEditForm({
      name: user.name ?? '',
      email: user.email,
      balance: user.balance ?? 0,
      status: (user as any).status ?? 'ACTIVE',
      accountType: user.accountType ?? 'SAVINGS',
    });
  }

  async function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/customers/${editingId}`, {
        method: 'PATCH',
        body: JSON.stringify(editForm),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setEditingId(null);
        fetchUsers();
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this user? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/customers/${id}`, { method: 'DELETE' , headers: { 'Content-Type': 'application/json' }});
      const data = await res.json();
      if (data.success) fetchUsers(); else alert('Delete failed');
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  }

  return (
    <div className="p-4 md:p-6 bg-[#F5F7FA] min-h-screen">
      <h2 className="text-2xl font-bold text-[#0D1B2A] mb-6">👤 Customer Management</h2>

      {/* Create Form */}
      <form 
        onSubmit={handleCreate} 
        className="bg-white shadow-lg rounded-xl p-6 mb-8 grid grid-cols-1 md:grid-cols-6 gap-4 border"
      >
        <input 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})} 
          placeholder="Full Name" 
          className="p-3 border rounded-lg md:col-span-1 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input 
          value={form.email} 
          onChange={e => setForm({...form, email: e.target.value})} 
          placeholder="Email" 
          className="p-3 border rounded-lg md:col-span-1 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input 
          value={form.password} 
          onChange={e => setForm({...form, password: e.target.value})} 
          placeholder="Password" 
          type="password" 
          className="p-3 border rounded-lg md:col-span-1 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <select 
          value={form.accountType} 
          onChange={e => setForm({...form, accountType: e.target.value})} 
          className="p-3 border rounded-lg md:col-span-1 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="SAVINGS">SAVINGS</option>
          <option value="FIXED">FIXED</option>
          <option value="SALARY">SALARY</option>
          <option value="DEMAT">DEMAT</option>
        </select>
        <input 
          value={form.balance} 
          onChange={e => setForm({...form, balance: Number(e.target.value)})} 
          placeholder="Initial Balance" 
          type="number" 
          className="p-3 border rounded-lg md:col-span-1 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button 
          disabled={creating} 
          className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-4 py-2 rounded-lg md:col-span-1 shadow"
        >
          {creating ? 'Creating...' : 'Create Customer'}
        </button>
      </form>

      {/* Users Table */}
      {/* Users table */}
<div className="bg-white p-4 rounded shadow overflow-x-auto">
  {loading ? (
    <p className="text-[#0D1B2A]">Loading users...</p>
  ) : (
    <table className="w-full min-w-[700px] text-[#0D1B2A] text-sm md:text-base">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="p-2">Name</th>
          <th className="p-2">Email</th>
          <th className="p-2">Account#</th>
          <th className="p-2">Balance</th>
          <th className="p-2">Status</th>
          <th className="p-2">Account Type</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr
            key={u.id}
            className="border-t hover:bg-gray-50 transition-colors"
          >
            <td className="p-2">{u.name}</td>
            <td className="p-2 break-words max-w-[150px]">{u.email}</td>
            <td className="p-2">{u.accountNumber}</td>
            <td className="p-2">{u.balance?.toFixed(2)}</td>
            <td className="p-2">{(u as any).status ?? "ACTIVE"}</td>
            <td className="p-2">{u.accountType}</td>
            <td className="p-2 flex flex-wrap gap-2">
              <button
                onClick={() => startEdit(u)}
                className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(u.id)}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>


      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4 text-[#0D1B2A]">✏️ Edit Customer</h3>
            <form onSubmit={submitEdit} className="grid grid-cols-1 gap-4">
              <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <input type="number" value={editForm.balance} onChange={e => setEditForm({...editForm, balance: Number(e.target.value)})} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="ACTIVE">ACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
              <select value={editForm.accountType} onChange={e => setEditForm({...editForm, accountType: e.target.value})} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="SAVINGS">SAVINGS</option>
                <option value="FIXED">FIXED</option>
                <option value="SALARY">SALARY</option>
                <option value="DEMAT">DEMAT</option>
              </select>

              <div className="flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
