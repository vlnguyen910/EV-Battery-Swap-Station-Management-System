import { ca } from "zod/v4/locales";

export default function TransactionStatusBadge({ status }) {
    const statusConfig = {
        completed: {
            bg: 'bg-green-100 dark:bg-green-900/50',
            text: 'text-green-700 dark:text-green-300',
            dot: 'bg-green-500',
            label: 'Completed'
        },
        cancelled: {
            bg: 'bg-gray-100 dark:bg-gray-900/50',
            text: 'text-gray-700 dark:text-gray-300',
            dot: 'bg-gray-500',
            label: 'Cancelled'
        },
        // 'in-progress': {
        //   bg: 'bg-amber-100 dark:bg-amber-900/50',
        //   text: 'text-amber-800 dark:text-amber-300',
        //   dot: 'bg-amber-500',
        //   label: 'In Progress'
        // },
        // pending: {
        //   bg: 'bg-blue-100 dark:bg-blue-900/50',
        //   text: 'text-blue-700 dark:text-blue-300',
        //   dot: 'bg-blue-500',
        //   label: 'Pending'
        // },
        failed: {
            bg: 'bg-red-100 dark:bg-red-900/50',
            text: 'text-red-700 dark:text-red-300',
            dot: 'bg-red-500',
            label: 'Failed'
        }
    };

    const config = statusConfig[status] || statusConfig.completed;

    return (
        <div className={`inline-flex items-center gap-1.5 rounded-full ${config.bg} px-2 py-1 text-xs font-medium ${config.text}`}>
            <span className={`size-2 rounded-full ${config.dot}`}></span>
            {config.label}
        </div>
    );
}
