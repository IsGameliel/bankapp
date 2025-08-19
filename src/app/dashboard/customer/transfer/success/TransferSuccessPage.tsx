// app/dashboard/customer/transfer/success/TransferSuccessPage.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function TransferSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get transaction details from URL query params
  const transaction = {
    id: searchParams.get("id"),
    amount: Number(searchParams.get("amount") || 0),
    description: searchParams.get("description"),
    createdAt: searchParams.get("createdAt"),
    metadata: {
      bankName: searchParams.get("bankName"),
      accountNumber: searchParams.get("accountNumber"),
      accountName: searchParams.get("accountName"),
      routingNumber: searchParams.get("routingNumber") || "",
      swiftCode: searchParams.get("swiftCode") || "",
      bankAddress: searchParams.get("bankAddress") || "",
      houseAddress: searchParams.get("houseAddress") || "",
      zipCode: searchParams.get("zipCode") || "",
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
        <div className="mb-6">
          <svg
            className="w-16 h-16 text-green-600 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h1 className="text-2xl font-bold text-[#0D1B2A] mt-4">
            Transfer Successful!
          </h1>
          <p className="text-gray-600 mt-2">Your transfer has been completed.</p>
        </div>

        <div className="text-left space-y-2 text-sm text-gray-700">
          <p>
            <strong>Transaction ID:</strong> {transaction.id || "-"}
          </p>
          <p>
            <strong>Amount:</strong>{" "}
            <span className="text-red-600 font-semibold">
              -${transaction.amount.toLocaleString()}
            </span>
          </p>
          <p>
            <strong>Description:</strong> {transaction.description || "-"}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {transaction.createdAt
              ? new Date(transaction.createdAt).toLocaleString()
              : "-"}
          </p>
          <hr className="my-4" />
          <h3 className="font-semibold text-gray-800">Recipient Details</h3>
          <p>
            <strong>Bank Name:</strong> {transaction.metadata.bankName || "-"}
          </p>
          <p>
            <strong>Account Number:</strong>{" "}
            {transaction.metadata.accountNumber || "-"}
          </p>
          <p>
            <strong>Account Name:</strong>{" "}
            {transaction.metadata.accountName || "-"}
          </p>
          <p>
            <strong>Routing Number:</strong>{" "}
            {transaction.metadata.routingNumber || "-"}
          </p>
          <p>
            <strong>SWIFT Code:</strong> {transaction.metadata.swiftCode || "-"}
          </p>
          <p>
            <strong>Bank Address:</strong>{" "}
            {transaction.metadata.bankAddress || "-"}
          </p>
          <p>
            <strong>House Address:</strong>{" "}
            {transaction.metadata.houseAddress || "-"}
          </p>
          <p>
            <strong>Zip Code:</strong> {transaction.metadata.zipCode || "-"}
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard/customer")}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold shadow-md"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
