import React from "react";
import { useAuth } from "../../hooks/useContext";
import { batteryService } from "../../services/batteryService";
import Filter from "../common/Filter"
import BatteryCard from "../batteries/BatteryCard"

/**
 * StaffInventory - Battery inventory management dashboard
 * Displays batteries from the staff's station
 */
export default function StaffInventory() {
    const { user } = useAuth();
    const [batteries, setBatteries] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const [filters, setFilters] = React.useState({
        model: "all",
        soc: "all",
        soh: "all",
        search: "",
    });

    // Fetch batteries by station_id
    React.useEffect(() => {
        const fetchBatteries = async () => {
            if (!user?.station_id) {
                setError("No station assigned to this staff");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await batteryService.getBatteriesByStationId(user.station_id);
                setBatteries(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                console.error("Error fetching batteries:", err);
                setError(err.message || "Failed to fetch batteries");
                setBatteries([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBatteries();
    }, [user?.station_id]);

    // Filter logic
    const filteredBatteries = React.useMemo(() => {
        if (!Array.isArray(batteries)) return [];
        return batteries.filter((battery) => {
            if (!battery) return false;
            // Search filter
            if (filters.search && filters.search.trim() !== "") {
                const q = filters.search.trim().toLowerCase();
                const batteryId = String(battery.battery_id || "").toLowerCase();
                const model = String(battery.model || "").toLowerCase();
                const name = String(battery.name || "").toLowerCase();
                const matchesId = batteryId.includes(q);
                const matchesModel = model.includes(q);
                const matchesName = name.includes(q);
                if (!matchesId && !matchesModel && !matchesName) return false;
            }
            // Model filter
            if (filters.model !== "all" && battery.model !== filters.model) return false;
            // SOC filter
            const percentage = battery.capacity && battery.current_charge
                ? Math.max(0, Math.min(100, Math.round((battery.current_charge / battery.capacity) * 100)))
                : 0;
            if (filters.soc === "low" && percentage >= 20) return false;
            if (filters.soc === "high" && percentage < 80) return false;
            // SOH filter
            if (filters.soh === "maintenance" && battery.soh >= 80) return false;
            if (filters.soh === "good" && battery.soh < 90) return false;
            return true;
        });
    }, [batteries, filters]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-900 text-xl">Loading batteries...</div>
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-900">Battery Inventory</h1>
                <p className="text-gray-500">Monitor and manage battery slot status at your station</p>
            </div>

            <Filter filters={filters} setFilters={setFilters} batteries={batteries} />

            {/* Battery Count */}
            <div className="mb-4 text-gray-600">
                Showing {filteredBatteries.length} of {batteries.length} batteries
            </div>

            {/* Battery grid */}
            {filteredBatteries.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No batteries match the selected filters</p>
                </div>
            ) : (
                <div className="flex flex-wrap justify-start gap-4">
                    {filteredBatteries.map(battery => (
                        <BatteryCard key={battery.battery_id} battery={battery} />
                    ))}
                </div>
            )}
        </div>
    )
}