import React from 'react'

export default function RecommendationCard({ recommendation }) {
    const { station_id, station_name, priority, recommendation: recommendationText, reasons, suggested_improvements, estimated_impact } = recommendation

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH':
                return 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
            case 'MEDIUM':
                return 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300'
            case 'LOW':
                return 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
            default:
                return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
        }
    }

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'HIGH':
                return 'Ưu tiên: CAO'
            case 'MEDIUM':
                return 'Ưu tiên: TRUNG BÌNH'
            case 'LOW':
                return 'Ưu tiên: THẤP'
            default:
                return 'Ưu tiên: KHÔNG XÁC ĐỊNH'
        }
    }

    return (
        <div className="bg-white dark:bg-background-dark/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-6">
                {/* Station Header */}
                <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                    <h4 className="text-xl font-bold dark:text-white">{station_name}</h4>
                    <span className={`inline-flex items-center justify-center rounded-full ${getPriorityColor(priority)} px-3 py-1 text-sm font-medium`}>
                        {getPriorityLabel(priority)}
                    </span>
                </div>

                {/* Station Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-[#617589] dark:text-gray-400 mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-base">🏢</span>
                        <span>ID: {station_id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-base">📍</span>
                        <span>Trạm</span>
                    </div>
                </div>

                {/* Recommendation Details */}
                <div className="space-y-4">
                    {/* Recommendation */}
                    <div>
                        <h5 className="font-bold mb-2 dark:text-white">Đề xuất</h5>
                        <p className="text-[#617589] dark:text-gray-400">{recommendationText}</p>
                    </div>

                    {/* Reasons */}
                    <div>
                        <h5 className="font-bold mb-2 dark:text-white">Lý do</h5>
                        <ul className="list-disc list-inside space-y-1 text-[#617589] dark:text-gray-400">
                            {reasons && reasons.map((reason, ridx) => (
                                <li key={ridx}>{reason}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Suggested Improvements */}
                    <div>
                        <h5 className="font-bold mb-2 dark:text-white">Cải tiến được đề xuất</h5>
                        <ul className="space-y-1">
                            {suggested_improvements && suggested_improvements.map((improvement, iidx) => (
                                <li key={iidx} className="flex items-center gap-2 text-[#617589] dark:text-gray-400">
                                    <span className="text-lg text-green-500">✅</span>
                                    {improvement}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Estimated Impact */}
                    <div>
                        <p className="text-sm italic text-blue-500 dark:text-blue-400">
                            Tác động dự kiến: {estimated_impact}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
