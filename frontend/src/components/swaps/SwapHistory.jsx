
// import SwapRequest from "./SwapRequest";

const statusClassMap = {
  scheduled: { text: "text-yellow-700", bg: "bg-yellow-100" },
  cancelled: { text: "text-red-700", bg: "bg-red-100" },
  completed: { text: "text-green-700", bg: "bg-green-100" },
};

export default function SwapHistory({ type = "swap" }) {
  const RecentTransactions = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Recent Swap Transactions</h2>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      </div>
    </div>
  );

  if (type === "swap") return <RecentTransactions />;
  return null;
}
