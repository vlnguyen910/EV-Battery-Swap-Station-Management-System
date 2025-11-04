import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { useStation, useSwap } from '../../hooks/useContext';
import { vehicleService } from '../../services/vehicleService';

export default function AutoSwapDialog({ open, onOpenChange, userId, onSuccess }) {
    const { stations } = useStation();
    const { swapBatteries } = useSwap();
    const [loading, setLoading] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [error, setError] = useState(null);
    const [stationSearch, setStationSearch] = useState('');
    const [selectedStation, setSelectedStation] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    const [formData, setFormData] = useState({
        user_id: userId || '',
        vehicle_id: '',
        station_id: '',
    });

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
            setError(null);
        }
    }, [open, userId]);

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

    // Filter stations with available batteries
    const availableStations = (stations || []).filter(station => {
        const batteries = station.batteries || [];
        const fullBatteries = batteries.filter(b => String(b.status || '').toLowerCase() === 'full');
        return fullBatteries.length > 0;
    });

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
        setError(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!formData.vehicle_id) {
            setError('Please select a vehicle');
            return;
        }

        if (!formData.station_id) {
            setError('Please select a station');
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

            console.log('Auto swap payload:', payload);
            const response = await swapBatteries(payload);
            console.log('Auto swap success:', response);

            // Success - close dialog and notify parent
            onOpenChange(false);
            if (onSuccess) {
                onSuccess(response);
            }
        } catch (err) {
            console.error('Auto swap error:', err);
            const errorMsg = err?.response?.data?.message || err.message || 'Failed to perform battery swap';
            setError(errorMsg);
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

                    {/* Station Selection with Search */}
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

                            {/* Suggestions Dropdown */}
                            {showSuggestions && stationSearch && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {filteredStations.length > 0 ? (
                                        filteredStations.map((station) => {
                                            const fullBatteries = (station.batteries || []).filter(
                                                b => String(b.status || '').toLowerCase() === 'full'
                                            );
                                            return (
                                                <div
                                                    key={station.station_id}
                                                    onClick={() => handleSelectStation(station)}
                                                    className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                                                >
                                                    <div className="font-medium text-gray-900">{station.name}</div>
                                                    <div className="text-sm text-gray-600">{station.address}</div>
                                                    <div className="text-xs text-green-600 mt-1">
                                                        {fullBatteries.length} batteries available
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="p-3 text-sm text-gray-500 text-center">
                                            No stations found matching "{stationSearch}"
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

                        {availableStations.length === 0 && (
                            <p className="text-sm text-gray-500 mt-1">No stations with available batteries</p>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                            <p className="text-sm text-red-700">{error}</p>
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
