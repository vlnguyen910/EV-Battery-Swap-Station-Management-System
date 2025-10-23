import { useMemo } from 'react';
import { useBattery } from '../../hooks/useContext';

// Extract unique models from batteries for filter options
const useBatteryModels = (batteries) => {
    return useMemo(() => {
        const models = [...new Set(batteries.map(b => b.model))];
        return models.sort();
    }, [batteries]);
};

export default function Filter({ filters, setFilters }) {
    const { batteries } = useBattery();
    const availableModels = useBatteryModels(batteries);

    return (
        <div className="w-full">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Filters</h2>
                {/* Thay đổi ở đây: grid-cols-1 sm:grid-cols-3 thay vì md:grid-cols-3 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Model Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                        <div className="relative">
                            <select
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                                value={filters.model}
                                onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                            >
                                <option value="all">All Models</option>
                                {availableModels.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                            <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                        </div>
                    </div>

                    {/* State of Charge Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">State of Charge</label>
                        <div className="relative">
                            <select
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                                value={filters.soc}
                                onChange={(e) => setFilters({ ...filters, soc: e.target.value })}
                            >
                                <option value="all">All Levels</option>
                                <option value="low">Low (&lt;20%)</option>
                                <option value="high">High (≥80%)</option>
                            </select>
                            <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                        </div>
                    </div>

                    {/* State of Health Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">State of Health</label>
                        <div className="relative">
                            <select
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                                value={filters.soh}
                                onChange={(e) => setFilters({ ...filters, soh: e.target.value })}
                            >
                                <option value="all">All Conditions</option>
                                <option value="maintenance">Needs Maintenance (&lt;80%)</option>
                            </select>
                            <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// export default function Filter() {
//     return (
//         <div className="w-full">
//             <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
//                 <h2 class="text-xl font-semibold mb-4">Filters</h2>
//                 <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

//                     <div>
//                         <label class="block text-sm font-medium text-gray-300 mb-2">Model</label>
//                         <div class="relative">
//                             <select class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
//                                 <option value="all">All Models</option>
//                                 <option value="Model X">Model X</option>
//                                 <option value="Model Y">Model Y</option>
//                             </select>
//                             <i class="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
//                         </div>
//                     </div>

//                     <div>
//                         <label class="block text-sm font-medium text-gray-300 mb-2">State of Charge</label>
//                         <div class="relative">
//                             <select class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
//                                 <option value="all">All Levels</option>
//                                 <option value="low">Low (&lt;20%)</option>
//                                 <option value="high">High (≥80%)</option>
//                             </select>
//                             <i class="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
//                         </div>
//                     </div>

//                     <div>
//                         <label class="block text-sm font-medium text-gray-300 mb-2">State of Health</label>
//                         <div class="relative">
//                             <select class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
//                                 <option value="all">All Conditions</option>
//                                 <option value="maintenance">Needs Maintenance (&lt;80%)</option>
//                             </select>
//                             <i class="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
