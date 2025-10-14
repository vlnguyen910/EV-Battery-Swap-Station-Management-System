import { BatteryProvider, useBattery } from "../../contexts/BatteryContext";
import Filter from "../common/Filter"
import BatteryCard from "../batteries/BatteryCard"

export default function StaffInventory() {
    const { batteries, loading, error, refreshBatteries } = useBattery();
    return (
        <div>
            <div>
                <div class="mb-8">
                    <h1 class="text-3xl font-bold mb-2">Battery Inventory</h1>
                    <p class="text-gray-400">Monitor and manage battery slot status</p>
                </div>
            </div>

            <Filter />

            {/* Battery stats*/}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-100 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-800">Available</h3>
                    <p className="text-2xl font-bold text-green-900">
                        {batteries.filter(b => b.status === 'full').length}
                    </p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-yellow-800">Charging</h3>
                    <p className="text-2xl font-bold text-yellow-900">
                        {batteries.filter(b => b.status === 'charging').length}
                    </p>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800">In Use</h3>
                    <p className="text-2xl font-bold text-blue-900">
                        {batteries.filter(b => b.status === 'taken').length}
                    </p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-red-800">Maintenance</h3>
                    <p className="text-2xl font-bold text-red-900">
                        {batteries.filter(b => b.status === 'defective').length}
                    </p>
                </div>
            </div>

            {/* Battery grid */}
            <div className="flex flex-wrap justify-center gap-6">
                {batteries.map(battery => (
                    <BatteryCard key={battery.battery_id} battery={battery} />
                ))}
            </div>
        </div>
    )
}