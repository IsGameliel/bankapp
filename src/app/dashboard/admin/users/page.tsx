// /src/app/dashboard/admin/users/page.tsx
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
    <div>
      <h2 className="text-2xl text-[#0D1B2A] font-semibold mb-4">User Control</h2>

      {/* Create form */}
      <form onSubmit={handleCreate} className="bg-white text-[#0D1B2A] p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-6 gap-3">
        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" className="p-2 border rounded md:col-span-1" />
        <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" className="p-2 border rounded md:col-span-1" />
        <input value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Password" type="password" className="p-2 border rounded md:col-span-1" />
        <select value={form.accountType} onChange={e => setForm({...form, accountType: e.target.value})} className="p-2 border rounded md:col-span-1">
          <option value="SAVINGS">SAVINGS</option>
          <option value="FIXED">FIXED</option>
          <option value="SALARY">SALARY</option>
          <option value="DEMAT">DEMAT</option>
        </select>
        <input value={form.balance} onChange={e => setForm({...form, balance: Number(e.target.value)})} placeholder="Balance" type="number" className="p-2 border rounded md:col-span-1" />
        <button disabled={creating} className="bg-blue-600 text-white px-4 py-2 rounded md:col-span-1">
          {creating ? 'Creating...' : 'Create Customer'}
        </button>
      </form>

      {/* Users table */}
      <div className="bg-white p-4 rounded shadow">
        {loading ? <p className="text-[#0D1B2A]">Loading users...</p> : (
          <table className="w-full table-auto text-[#0D1B2A]">
            <thead className="text-left">
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
              {users.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.accountNumber}</td>
                  <td className="p-2">{u.balance?.toFixed(2)}</td>
                  <td className="p-2">{(u as any).status ?? 'ACTIVE'}</td>
                  <td className="p-2">{u.accountType}</td>
                  <td className="p-2">
                    <button onClick={() => startEdit(u)} className="text-sm bg-gray-200 px-2 py-1 rounded mr-2">Edit</button>
                    <button onClick={() => handleDelete(u.id)} className="text-sm bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit modal / inline form */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Customer</h3>
            <form onSubmit={submitEdit} className="grid grid-cols-1 gap-3">
              <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="p-2 border rounded" />
              <input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="p-2 border rounded" />
              <input type="number" value={editForm.balance} onChange={e => setEditForm({...editForm, balance: Number(e.target.value)})} className="p-2 border rounded" />
              <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})} className="p-2 border rounded">
                <option value="ACTIVE">ACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
              <select value={editForm.accountType} onChange={e => setEditForm({...editForm, accountType: e.target.value})} className="p-2 border rounded">
                <option value="SAVINGS">SAVINGS</option>
                <option value="FIXED">FIXED</option>
                <option value="SALARY">SALARY</option>
                <option value="DEMAT">DEMAT</option>
              </select>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
