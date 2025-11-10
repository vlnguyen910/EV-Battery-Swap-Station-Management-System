import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { useStation } from '../../hooks/useContext';
import { swappingService } from '../../services/swappingService';
import { vehicleService } from '../../services/vehicleService';
import { batteryService } from '../../services/batteryService';

export default function AutoSwapDialog({ open, onOpenChange, userId, onSuccess }) {
    const { stations, getAvailableStations, loading: stationsLoading } = useStation();
    // Fetch available stations when dialog opens if not already loaded
    useEffect(() => {
        if (open && (!stations || stations.length === 0)) {
            getAvailableStations();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);
    const [loading, setLoading] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [errors, setErrors] = useState([]);
    const [stationSearch, setStationSearch] = useState('');
    const [selectedStation, setSelectedStation] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    const [formData, setFormData] = useState({
        user_id: userId || '',
        vehicle_id: '',
        station_id: '',
    });

    // State to hold stations with batteries info
    const [stationsWithBatteries, setStationsWithBatteries] = useState([]);

    // Map backend error responses to friendly UI messages
    const mapServerErrorToMessage = (resp) => {
        const msgs = [];
        const raw = resp?.message ?? resp?.error ?? null;

        if (Array.isArray(raw)) {
            raw.forEach(r => msgs.push(String(r)));
        } else if (typeof raw === 'string' && raw) {
            msgs.push(raw);
        } else if (resp && typeof resp === 'string') {
            msgs.push(resp);
        }

        // Fallback
        if (msgs.length > 0) return msgs;
        return ['Đã xảy ra lỗi khi đổi pin, vui lòng thử lại sau.'];
    };

    // Fetch user's vehicles when dialog opens
    useEffect(() => {
        const fetchVehicles = async () => {
            if (!open || !userId) return;

            try {
                const vehiclesData = await vehicleService.getVehicleByUserId(userId);
                const vehiclesList = Array.isArray(vehiclesData) ? vehiclesData : [];
                setVehicles(vehiclesList);

                // Auto-select first active vehicle if available
                const activeVehicle = vehiclesList.find(v => v.status === 'active');
                if (activeVehicle) {
                    setFormData(prev => ({ ...prev, vehicle_id: activeVehicle.vehicle_id }));
                }
            } catch (err) {
                console.error('Error fetching vehicles:', err);
                setVehicles([]);
            }
        };

        fetchVehicles();
    }, [open, userId]);


    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            setFormData({ user_id: userId || '', vehicle_id: '', station_id: '' });
            setStationSearch('');
            setSelectedStation(null);
            setShowSuggestions(false);
            setErrors([]);
        }
    }, [open, userId]);

    // Fetch available stations when dialog opens if not already loaded
    useEffect(() => {
        if (open && (!stations || stations.length === 0)) {
            getAvailableStations();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch batteries for each station when stations change
    useEffect(() => {
        const fetchBatteryData = async () => {
            if (!stations || stations.length === 0) {
                setStationsWithBatteries([]);
                return;
            }
            const stationsWithBatteryCounts = await Promise.all(
                stations.map(async (station) => {
                    try {
                        const stationId = station.station_id || station.id;
                        if (!stationId) return { ...station, available: 0, total: 0 };
                        const batteries = await batteryService.getBatteriesByStationId(stationId);
                        const availableBatteries = batteries.filter(
                            battery => battery.status === 'full' || battery.status === 'available'
                        ).length;
                        const totalBatteries = batteries.length;
                        return {
                            ...station,
                            station_id: stationId,
                            available: availableBatteries,
                            total: totalBatteries,
                        };
                    } catch (error) {
                        return { ...station, available: 0, total: 0 };
                    }
                })
            );
            setStationsWithBatteries(stationsWithBatteryCounts);
        };
        fetchBatteryData();
    }, [stations]);

    // Use stationsWithBatteries for rendering
    const availableStations = stationsWithBatteries;

    // Filter stations by search query
    const filteredStations = availableStations.filter(station => {
        const searchLower = stationSearch.toLowerCase();
        const name = (station.name || '').toLowerCase();
        const address = (station.address || '').toLowerCase();
        return name.includes(searchLower) || address.includes(searchLower);
    });

    const handleStationSearch = (e) => {
        const value = e.target.value;
        setStationSearch(value);
        setShowSuggestions(true);

        // Clear selection if user types after selecting
        if (selectedStation) {
            setSelectedStation(null);
            setFormData(prev => ({ ...prev, station_id: '' }));
        }
    };

    const handleSelectStation = (station) => {
        setSelectedStation(station);
        setStationSearch(station.name);
        setFormData(prev => ({ ...prev, station_id: station.station_id }));
        setShowSuggestions(false);
        setErrors([]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        // Validation
        if (!formData.vehicle_id) {
            setErrors(['Please select a vehicle']);
            return;
        }

        if (!formData.station_id) {
            setErrors(['Please select a station']);
            return;
        }

        setLoading(true);

        try {
            // Call swapBatteries API (auto-swap endpoint)
            const payload = {
                user_id: parseInt(formData.user_id, 10),
                vehicle_id: parseInt(formData.vehicle_id, 10),
                station_id: parseInt(formData.station_id, 10),
            };

            console.log('🚀 Auto swap payload:', payload);
            const response = await swappingService.swapBatteries(payload);
            console.log('✅ Auto swap success:', response);

            // Success - close dialog and notify parent
            onOpenChange(false);

            // Show success alert
            alert('Battery swap completed successfully!');

            if (onSuccess) {
                onSuccess(response);
            }
        } catch (err) {
            console.error('❌ Auto swap error:', err);
            const resp = err?.response?.data;
            const errorMessages = mapServerErrorToMessage(resp);
            setErrors(errorMessages);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Auto Battery Swap</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Vehicle Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Vehicle
                        </label>
                        <select
                            name="vehicle_id"
                            value={formData.vehicle_id}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">-- Select Vehicle --</option>
                            {vehicles.map((vehicle) => (
                                <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                                    {vehicle.vin} - {vehicle.battery_model || 'Unknown Model'}
                                    {vehicle.status === 'active' ? ' (Active)' : ''}
                                </option>
                            ))}
                        </select>
                        {vehicles.length === 0 && (
                            <p className="text-sm text-gray-500 mt-1">No vehicles found</p>
                        )}
                    </div>

                    {/* Station Selection with Search and List */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search Station
                        </label>
                        <div className="relative" ref={searchRef}>
                            <input
                                type="text"
                                value={stationSearch}
                                onChange={handleStationSearch}
                                onFocus={() => setShowSuggestions(true)}
                                placeholder="Type station name to search..."
                                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                autoComplete="off"
                            />

                            {/* Always show available stations in a scrollable box */}
                            {showSuggestions && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {(stationSearch ? filteredStations : availableStations).length > 0 ? (
                                        (stationSearch ? filteredStations : availableStations).map((station) => (
                                            <div
                                                key={station.station_id}
                                                onClick={() => handleSelectStation(station)}
                                                className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                                            >
                                                <div className="font-medium text-gray-900">{station.name}</div>
                                                <div className="text-sm text-gray-600">{station.address}</div>
                                                <div className="text-xs text-green-600 mt-1">
                                                    {station.available} batteries available
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-3 text-sm text-gray-500 text-center">
                                            {stationSearch
                                                ? `No stations found matching "${stationSearch}"`
                                                : 'No stations with available batteries'}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Selected Station Display */}
                            {selectedStation && !showSuggestions && (
                                <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                                    <div className="text-sm font-medium text-blue-900">{selectedStation.name}</div>
                                    <div className="text-xs text-blue-700">{selectedStation.address}</div>
                                </div>
                            )}
                        </div>

                        {stationsLoading ? (
                            <p className="text-sm text-gray-500 mt-1">Loading stations...</p>
                        ) : availableStations.length === 0 && (
                            <p className="text-sm text-gray-500 mt-1">No stations with available batteries</p>
                        )}
                    </div>

                    {/* Error Messages */}
                    {errors && errors.length > 0 && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                            {errors.length === 1 ? (
                                <p className="text-sm text-red-700">{errors[0]}</p>
                            ) : (
                                <ul className="list-disc ml-5 text-sm text-red-700">
                                    {errors.map((err, idx) => (
                                        <li key={idx}>{err}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !formData.vehicle_id || !formData.station_id}
                        >
                            {loading ? 'Processing...' : 'Confirm Swap'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
