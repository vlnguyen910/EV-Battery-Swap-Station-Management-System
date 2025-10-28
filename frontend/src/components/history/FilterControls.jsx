import React from 'react';

export default function FilterControls({ 
  resultsPerPage, 
  onResultsPerPageChange, 
  timePeriod, 
  onTimePeriodChange,
  title
}) {
  return (
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Show result:</span>
          <select
            value={resultsPerPage}
            onChange={(e) => onResultsPerPageChange(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="1">1</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      {/* Time Period Filter */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 mr-2">Show by:</span>
        <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
          <button
            onClick={() => onTimePeriodChange('week')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              timePeriod === 'week'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => onTimePeriodChange('month')}
            className={`px-4 py-2 text-sm font-medium border-l border-gray-300 transition-colors ${
              timePeriod === 'month'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => onTimePeriodChange('year')}
            className={`px-4 py-2 text-sm font-medium border-l border-gray-300 transition-colors ${
              timePeriod === 'year'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Year
          </button>
        </div>
      </div>
    </div>
  );
}
