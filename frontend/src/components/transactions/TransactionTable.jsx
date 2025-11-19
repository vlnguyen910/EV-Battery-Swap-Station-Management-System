import TransactionStatusBadge from './TransactionStatusBadge';

export default function TransactionTable({ transactions, loading, onViewDetails }) {
    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(',', '');
    };

    const getUserInfo = (transaction) => {
        // Try to get user full name or username, fallback to user_id
        return transaction.user?.full_name ||
            transaction.user?.username ||
            transaction.user?.email?.split('@')[0] ||
            `User ${transaction.user_id}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!transactions || transactions.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No transactions found
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                                Transaction ID
                            </th>
                            <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                                Date & Time
                            </th>
                            <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                                User Info
                            </th>
                            <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                                Battery Out
                            </th>
                            <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                                Battery In
                            </th>
                            <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {transactions.map((transaction) => (
                            <tr
                                key={transaction.transaction_id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            >
                                <td className="h-[72px] px-4 py-2 text-gray-700 dark:text-gray-300 text-sm font-normal">
                                    {transaction.transaction_id}
                                </td>
                                <td className="h-[72px] px-4 py-2 text-gray-500 dark:text-gray-400 text-sm font-normal">
                                    {formatDateTime(transaction.createAt || transaction.created_at)}
                                </td>
                                <td className="h-[72px] px-4 py-2 text-gray-700 dark:text-gray-300 text-sm font-normal">
                                    {getUserInfo(transaction)}
                                </td>
                                <td className="h-[72px] px-4 py-2 text-gray-500 dark:text-gray-400 text-sm font-normal">
                                    {transaction.battery_returned_id || 'N/A'}
                                </td>
                                <td className="h-[72px] px-4 py-2 text-gray-500 dark:text-gray-400 text-sm font-normal">
                                    {transaction.battery_taken_id || 'N/A'}
                                </td>
                                <td className="h-[72px] px-4 py-2 text-sm font-normal">
                                    <TransactionStatusBadge status={transaction.status} />
                                </td>
                                <td className="h-[72px] px-4 py-2">
                                    <button
                                        onClick={() => onViewDetails && onViewDetails(transaction)}
                                        className="text-blue-600 dark:text-blue-400 text-sm font-medium cursor-pointer hover:underline"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
