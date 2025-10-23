import { useBattery } from "../../hooks/useContext";
import Filter from "../common/Filter"
import BatteryCard from "../batteries/BatteryCard"
import { useBatteryFilter } from "../../hooks/useBatteryHandler";

/**
 * StaffInventory - Battery inventory management dashboard
 * Displays real-time battery data from database with filtering capabilities
 * Uses current_charge field from database for battery percentage display
 */
export default function StaffInventory() {
    const { batteries, loading, error } = useBattery();
    const { filters, setFilters, filteredBatteries } = useBatteryFilter(batteries);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-white text-xl">Loading batteries...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500 text-xl">Error: {error}</div>
            </div>
        );
    }

    return (
        <div>
            <div>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Battery Inventory</h1>
                    <p className="text-gray-400">Monitor and manage battery slot status</p>
                </div>
            </div>

            <Filter filters={filters} setFilters={setFilters} />

            {/* Battery Count */}
            <div className="mb-4 text-gray-400">
                Showing {filteredBatteries.length} of {batteries.length} batteries
            </div>

            {/* Battery grid */}
            {filteredBatteries.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No batteries match the selected filters</p>
                </div>
            ) : (
                <div className="flex flex-wrap justify-start gap-4">
                    {filteredBatteries.map(battery => (
                        <BatteryCard key={battery.battery_id} battery={battery} />
                    ))}
                </div>
            )}

            {/* <div className="flex flex-wrap justify-left gap-4">
                {batteries.map(battery => (
                    <BatteryCard key={battery.battery_id} battery={battery} />
                ))}
            </div> */}
        </div>
    )
}