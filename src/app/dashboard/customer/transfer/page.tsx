"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TransferPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"initiate" | "verify">("initiate");
  const [transferId, setTransferId] = useState<string | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");

  async function handleInitiate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setShowPinModal(true);
  }

  async function confirmPin(form: HTMLFormElement) {
    setLoading(true);
    setMessage("");
    setShowPinModal(false);

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ You need to be logged in to initiate a transfer.");
      setLoading(false);
      setPin("");
      return;
    }

    if (pin.length !== 4) {
      setMessage("❌ PIN must be 4 digits.");
      setLoading(false);
      setPin("");
      return;
    }

    const formData = new FormData(form);
    const amount = Number(formData.get("amount"));
    if (amount <= 0) {
      setMessage("❌ Amount must be greater than 0.");
      setLoading(false);
      setPin("");
      return;
    }

    const body = {
      token,
      amount,
      bankName: formData.get("bankName"),
      accountNumber: formData.get("accountNumber"),
      accountName: formData.get("accountName"),
      routingNumber: formData.get("routingNumber") || undefined,
      swiftCode: formData.get("swiftCode") || undefined,
      bankAddress: formData.get("bankAddress") || undefined,
      houseAddress: formData.get("houseAddress") || undefined,
      zipCode: formData.get("zipCode") || undefined,
      pin,
    };

    try {
      const res = await fetch("/api/user/transfer/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("Initiate response:", data);

      if (data.success) {
        setTransferId(data.transferId);
        setStep("verify");
        setMessage("📩 OTP has been sent to your email.");
      } else {
        setMessage(`❌ ${data.message}`);
        if (data.message === "Incorrect PIN") {
          setShowPinModal(true); // Reopen PIN modal for retry
        }
      }
    } catch (err) {
      setMessage("❌ Something went wrong.");
      console.error("Transfer Initiate Error:", err);
    } finally {
      setLoading(false);
      setPin("");
    }
  }

  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ You need to be logged in to verify the transfer.");
      setLoading(false);
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const otp = formData.get("otp")?.toString();
    if (!otp || otp.length !== 6) {
      setMessage("❌ OTP must be 6 digits.");
      setLoading(false);
      return;
    }

    const body = {
      token,
      transferId,
      otp,
    };

    try {
      const res = await fetch("/api/user/transfer/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("Verify response:", data);

      if (data.success) {
        const { transaction } = data;
        const query = new URLSearchParams({
          id: transaction.id,
          amount: transaction.amount.toString(),
          description: transaction.description || "",
          createdAt: transaction.createdAt,
          bankName: transaction.metadata.bankName || "",
          accountNumber: transaction.metadata.accountNumber || "",
          accountName: transaction.metadata.accountName || "",
          routingNumber: transaction.metadata.routingNumber || "",
          swiftCode: transaction.metadata.swiftCode || "",
          bankAddress: transaction.metadata.bankAddress || "",
          houseAddress: transaction.metadata.houseAddress || "",
          zipCode: transaction.metadata.zipCode || "",
        }).toString();
        router.push(`/dashboard/customer/transfer/success?${query}`);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage("❌ Something went wrong.");
      console.error("Transfer Verify Error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#415A77] px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
        <h1 className="text-3xl font-bold text-[#0D1B2A] mb-6 text-center flex items-center justify-center gap-2">
          <span className="text-blue-600">🏦</span>
          {step === "initiate" ? "New Transfer" : "Verify Transfer"}
        </h1>

        {step === "initiate" ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleInitiate(e);
            }}
            id="transferForm"
          >
            <label className="block">
              <span className="text-gray-800 font-medium">Amount</span>
              <input
                name="amount"
                type="number"
                required
                min="1"
                className="mt-1 w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
                placeholder="Enter amount"
              />
            </label>
            <label className="block">
              <span className="text-gray-800 font-medium">Bank Name</span>
              <input
                name="bankName"
                type="text"
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
                placeholder="Enter bank name"
              />
            </label>
            <label className="block">
              <span className="text-gray-800 font-medium">Account Number</span>
              <input
                name="accountNumber"
                type="text"
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
                placeholder="Enter account number"
              />
            </label>
            <label className="block">
              <span className="text-gray-800 font-medium">Account Name</span>
              <input
                name="accountName"
                type="text"
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
                placeholder="Enter account name"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-gray-800 font-medium">Routing No.</span>
                <input
                  name="routingNumber"
                  placeholder="Routing No."
                  className="mt-1 w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-800 font-medium">SWIFT Code</span>
                <input
                  name="swiftCode"
                  placeholder="SWIFT Code"
                  className="mt-1 w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-gray-800 font-medium">Bank Address</span>
              <input
                name="bankAddress"
                placeholder="Bank Address"
                className="mt-1 w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
              />
            </label>
            <label className="block">
              <span className="text-gray-800 font-medium">Home Address</span>
              <input
                name="houseAddress"
                placeholder="House Address"
                className="mt-1 w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
              />
            </label>
            <label className="block">
              <span className="text-gray-800 font-medium">Zip Code</span>
              <input
                name="zipCode"
                placeholder="Zip Code"
                className="mt-1 w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold shadow-md"
            >
              {loading ? "Processing..." : "Proceed"}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleVerify}>
            <label className="block">
              <span className="text-gray-800 font-medium">Enter OTP</span>
              <input
                name="otp"
                type="text"
                required
                maxLength={6}
                className="mt-1 w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
                placeholder="Enter 6-digit OTP"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-semibold shadow-md"
            >
              {loading ? "Verifying..." : "Confirm Transfer"}
            </button>
          </form>
        )}
        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-80">
            <h2 className="text-lg font-semibold text-center mb-4">
              🔒 Enter Transaction PIN
            </h2>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              maxLength={4}
              className="w-full p-3 border border-gray-300 rounded-xl text-center text-lg tracking-widest"
              placeholder="****"
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setPin("");
                }}
                className="flex-1 bg-gray-200 py-2 rounded-xl hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const form = document.getElementById("transferForm") as HTMLFormElement;
                  confirmPin(form);
                }}
                disabled={loading || pin.length !== 4}
                className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}