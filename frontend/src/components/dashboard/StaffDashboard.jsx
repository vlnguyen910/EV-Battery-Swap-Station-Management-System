import Card from "../common/Card";
import SwapHistory from "../swaps/SwapHistory";
import BatteryList from "../batteries/BatteryList";

export default function StaffDashboard() {
    return (
        <div className="p-6">
            {/* Tiêu đề */}
            <div className="bg-green-600 text-white p-6 rounded-lg shadow-xl mb-6">
                <h2 className="text-3xl font-extrabold">Staff Dashboard</h2>
                <p className="text-sm opacity-90 mt-1">
                    Tổng quan hoạt động và tồn kho tại trạm đổi pin hiện tại
                </p>
            </div>

            {/* 1. Metrics Cards */}
            <Card type="metrics" />

            {/* 2. Recent Transactions */}
            <SwapHistory type="swap" />

            {/* 3. Inventory Status */}
            <BatteryList type="inventory" />
        </div>
    );
}
