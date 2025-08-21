"use client";

import { useState, useEffect } from "react";

type TransferForm = {
  userId: string;
  amount: number | "";
  bankName: string;
  accountNumber: string;
  accountName: string;
  routingNumber?: string | null;
  swiftCode?: string | null;
  bankAddress?: string | null;
  houseAddress?: string | null;
  zipCode?: string | null;
  scheduledAt: string;
  status: "PENDING" | "SCHEDULED" | "COMPLETED" | "FAILED";
};

export default function NewTransferForm() {
  const [form, setForm] = useState<TransferForm>({
    userId: "",
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    routingNumber: "",
    swiftCode: "",
    bankAddress: "",
    houseAddress: "",
    zipCode: "",
    scheduledAt: "",
    status: "PENDING",
  });

  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (data.success) {
          setCustomers(data.users);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      ...form,
      amount: form.amount === "" ? 0 : Number(form.amount),
      routingNumber: form.routingNumber || null,
      swiftCode: form.swiftCode || null,
      bankAddress: form.bankAddress || null,
      houseAddress: form.houseAddress || null,
      zipCode: form.zipCode || null,
    };

    try {
      const res = await fetch("/api/admin/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Transfer + Transaction created successfully!");
        setForm({
          userId: "",
          amount: "",
          bankName: "",
          accountNumber: "",
          accountName: "",
          routingNumber: "",
          swiftCode: "",
          bankAddress: "",
          houseAddress: "",
          zipCode: "",
          scheduledAt: "",
          status: "PENDING",
        });
      } else {
        alert("❌ Failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("❌ Something went wrong. Please try again.");
      console.error(err);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#0D1B2A] mb-6">
        💸 Create Transfer
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md space-y-5"
      >
        {/* Select Customer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Customer
          </label>
          {loading ? (
            <p className="text-gray-500">Loading customers...</p>
          ) : (
            <select
              className="border p-3 rounded-lg w-full"
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
              required
            >
              <option value="">-- Choose a customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || "Unnamed"} ({c.email}) -{" "}
                  {c.accountNumber ?? "No Acc #"}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="Enter amount"
            className="border p-3 rounded-lg w-full"
            value={form.amount}
            onChange={(e) =>
              setForm({
                ...form,
                amount: e.target.value ? Number(e.target.value) : "",
              })
            }
            required
          />
        </div>

        {/* Bank Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Bank Name"
            className="border p-3 rounded-lg w-full"
            value={form.bankName}
            onChange={(e) => setForm({ ...form, bankName: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Account Number"
            className="border p-3 rounded-lg w-full"
            value={form.accountNumber}
            onChange={(e) =>
              setForm({ ...form, accountNumber: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Account Name"
            className="border p-3 rounded-lg w-full"
            value={form.accountName}
            onChange={(e) =>
              setForm({ ...form, accountName: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Routing Number"
            className="border p-3 rounded-lg w-full"
            value={form.routingNumber ?? ""}
            onChange={(e) =>
              setForm({ ...form, routingNumber: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="SWIFT Code"
            className="border p-3 rounded-lg w-full"
            value={form.swiftCode ?? ""}
            onChange={(e) => setForm({ ...form, swiftCode: e.target.value })}
          />
          <input
            type="text"
            placeholder="Bank Address"
            className="border p-3 rounded-lg w-full"
            value={form.bankAddress ?? ""}
            onChange={(e) => setForm({ ...form, bankAddress: e.target.value })}
          />
          <input
            type="text"
            placeholder="House Address"
            className="border p-3 rounded-lg w-full"
            value={form.houseAddress ?? ""}
            onChange={(e) =>
              setForm({ ...form, houseAddress: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="ZIP Code"
            className="border p-3 rounded-lg w-full"
            value={form.zipCode ?? ""}
            onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
          />
        </div>

        {/* Scheduled Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scheduled Date
          </label>
          <input
            type="datetime-local"
            className="border p-3 rounded-lg w-full"
            value={form.scheduledAt}
            onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            className="border p-3 rounded-lg w-full"
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as TransferForm["status"],
              })
            }
          >
            <option value="PENDING">Pending</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-xl font-semibold shadow-md hover:scale-[1.02] transition"
        >
          🚀 Create Transfer
        </button>
      </form>
    </div>
  );
}
