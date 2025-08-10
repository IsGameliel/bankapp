"use client";

export default function TransferPage() {
  // You can add state and logic for transfer here as in the original dashboard
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0D1B2A] mb-4">Transfer Money</h1>
      <form className="bg-white p-6 rounded-xl shadow-md max-w-md">
        <label className="block mb-3">
          <span className="text-gray-700">Recipient Email</span>
          <input
            type="email"
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter recipient email"
          />
        </label>
        <label className="block mb-3">
          <span className="text-gray-700">Amount</span>
          <input
            type="number"
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter amount"
          />
        </label>
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
          Transfer
        </button>
      </form>
    </div>
  );
}
