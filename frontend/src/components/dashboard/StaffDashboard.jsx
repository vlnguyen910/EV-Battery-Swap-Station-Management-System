import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useContext';
import { swapService } from '../../services/swapService';
import Card from '../common/Card';
import SwapHistory from '../swaps/SwapHistory';

export default function StaffDashboard() {
    const { user } = useAuth();
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get station info from logged-in user
    const stationName = user?.station?.station_name || 'Unknown Station';
    const stationId = user?.station_id;

    useEffect(() => {
        const fetchData = async () => {
            if (!stationId) return;

            setLoading(true);
            try {
                // Fetch recent swap transactions for this station
                const transactions = await swapService.getSwapTransactionsByStation(stationId);
                // Get only the 4 most recent transactions
                setRecentTransactions(Array.isArray(transactions) ? transactions.slice(0, 4) : []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [stationId]);

    return (
        <main className="flex-1 flex flex-col">
            {/* Header */}
            <header className="flex sticky top-0 items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-10 py-3 bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm z-10">
                <div className="flex items-center gap-8">
                    <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Staff Dashboard</h2>
                </div>
                <div className="flex flex-1 justify-end items-center gap-4">
                    <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
                        </svg>
                    </button>
                    {/* <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer"
                        style={{
                            backgroundImage: user?.avatar
                                ? `url(${user.avatar})`
                                : 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user?.username || 'staff') + '")'
                        }}
                        title={user?.full_name || user?.username || 'Staff'}
                    /> */}
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="flex flex-col gap-8">
                    {/* Welcome Section */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Welcome back, {user?.full_name || user?.username || 'Staff'}!
                        </h1>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"></path>
                            </svg>
                            <p className="text-base">
                                You are currently working at <span className="font-semibold text-gray-800 dark:text-gray-200">{stationName}</span>
                            </p>
                        </div>
                    </div>

                    {/* Battery Stats Cards */}
                    <Card type="battery-stats" />

                    {/* Recent Transactions Table */}
                    <SwapHistory
                        type="swap"
                        recentTransactions={recentTransactions}
                        loading={loading}
                    />
                </div>
            </div>
        </main>
    );
}
