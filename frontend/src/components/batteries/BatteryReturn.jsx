import React from 'react'

export default function BatteryReturn() {
    return (
        <div><div class="bg-gray-800 border border-gray-700 rounded-lg p-6">

            <h2 class="text-xl font-semibold mb-6 flex items-center">
                <i class="ri-search-line mr-2 text-blue-400"></i>
                Physical Condition Assessment
            </h2>

            <div class="space-y-6">

                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Battery ID</label>
                    <input
                        placeholder="Scan or enter Battery ID"
                        class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        value=""
                        spellcheck="false"
                        data-ms-editor="true"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-3">Physical Condition</label>
                    <div class="grid grid-cols-1 gap-3">

                        <label class="flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 border-gray-600 hover:border-gray-500">
                            <input class="sr-only" type="radio" value="normal" name="condition" />
                            <div class="w-6 h-6 flex items-center justify-center mr-3 text-green-400">
                                <i class="ri-check-line"></i>
                            </div>
                            <div>
                                <div class="font-medium">Normal</div>
                                <div class="text-sm text-gray-400">Battery is in good condition with no visible damage</div>
                            </div>
                        </label>

                        <label class="flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 border-gray-600 hover:border-gray-500">
                            <input class="sr-only" type="radio" value="minor" name="condition" />
                            <div class="w-6 h-6 flex items-center justify-center mr-3 text-yellow-400">
                                <i class="ri-alert-line"></i>
                            </div>
                            <div>
                                <div class="font-medium">Minor Damage</div>
                                <div class="text-sm text-gray-400">Minor scratches or cosmetic damage that doesn't affect performance</div>
                            </div>
                        </label>

                        <label class="flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 border-gray-600 hover:border-gray-500">
                            <input class="sr-only" type="radio" value="impact" name="condition" />
                            <div class="w-6 h-6 flex items-center justify-center mr-3 text-red-400">
                                <i class="ri-close-line"></i>
                            </div>
                            <div>
                                <div class="font-medium">Impact Damage</div>
                                <div class="text-sm text-gray-400">Significant damage that may affect battery safety or performance</div>
                            </div>
                        </label>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Additional Notes (Optional)</label>
                    <textarea
                        placeholder="Describe any specific damage or observations..."
                        rows="4"
                        maxlength="500"
                        class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        spellcheck="false"
                        data-ms-editor="true"
                    ></textarea>
                    <div class="text-xs text-gray-400 mt-1">0/500 characters</div>
                </div>

                <div class="pt-4">
                    <button
                        class="font-medium rounded-lg transition-colors duration-200 whitespace-nowrap cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg w-full"
                        disabled=""
                    >
                        <i class="ri-check-double-line mr-2"></i>
                        Check-in Battery
                    </button>
                </div>
            </div>
        </div></div>
    )
}
