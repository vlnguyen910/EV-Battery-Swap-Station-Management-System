import React from 'react'

export default function Filter() {
    return (
        <div className="w-full">
            <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
                <h2 class="text-xl font-semibold mb-4">Filters</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Model</label>
                        <div class="relative">
                            <select class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                                <option value="all">All Models</option>
                                <option value="Model X">Model X</option>
                                <option value="Model Y">Model Y</option>
                            </select>
                            <i class="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">State of Charge</label>
                        <div class="relative">
                            <select class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                                <option value="all">All Levels</option>
                                <option value="low">Low (&lt;20%)</option>
                                <option value="high">High (≥80%)</option>
                            </select>
                            <i class="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">State of Health</label>
                        <div class="relative">
                            <select class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
                                <option value="all">All Conditions</option>
                                <option value="maintenance">Needs Maintenance (&lt;80%)</option>
                            </select>
                            <i class="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
