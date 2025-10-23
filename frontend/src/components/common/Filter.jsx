import { useMemo, useState } from 'react';
import { useBattery } from '../../hooks/useContext';
import { Search } from 'lucide-react'; // dùng icon có sẵn trong lucide-react

const useBatteryModels = (batteries) => {
    return useMemo(() => {
        const models = [...new Set(batteries.map(b => b.model))];
        return models.sort();
    }, [batteries]);
};

export default function Filter({ filters, setFilters }) {
    const { batteries } = useBattery();
    const availableModels = useBatteryModels(batteries);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        // Use functional update to avoid stale `filters` value from props
        setFilters(prev => ({ ...prev, search: searchTerm.trim() }));
    };

    return (
        <div className="w-full">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Filters</h2>

                {/* Search bar */}
                <div className="flex items-center mb-6 gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search by Battery ID or Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white 
              focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium 
            focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Search
                    </button>
                </div>

                {/* Filters */}
                <div className="grid grid-rows-1 sm:grid-cols-3 gap-4">
                    {/* Model Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                        <div className="relative">
                            <select
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white 
                focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 appearance-none"
                                value={filters.model}
                                onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                            >
                                <option value="all">All Models</option>
                                {availableModels.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                            <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 
              text-gray-400 pointer-events-none"></i>
                        </div>
                    </div>

                    {/* State of Charge Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">State of Charge</label>
                        <div className="relative">
                            <select
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white 
                focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 appearance-none"
                                value={filters.soc}
                                onChange={(e) => setFilters({ ...filters, soc: e.target.value })}
                            >
                                <option value="all">All Levels</option>
                                <option value="low">Low (&lt;20%)</option>
                                <option value="high">High (≥80%)</option>
                            </select>
                            <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 
              text-gray-400 pointer-events-none"></i>
                        </div>
                    </div>

                    {/* State of Health Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">State of Health</label>
                        <div className="relative">
                            <select
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white 
                focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 appearance-none"
                                value={filters.soh}
                                onChange={(e) => setFilters({ ...filters, soh: e.target.value })}
                            >
                                <option value="all">All Conditions</option>
                                <option value="maintenance">Needs Maintenance (&lt;80%)</option>
                            </select>
                            <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 
              text-gray-400 pointer-events-none"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
