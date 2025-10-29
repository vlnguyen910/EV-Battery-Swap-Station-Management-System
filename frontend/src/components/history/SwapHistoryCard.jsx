import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import FilterControls from './FilterControls';
import PaginationControls from './PaginationControls';

export default function SwapHistoryCard({
  swapHistory,
  loading,
  sortBy,
  sortOrder,
  onSort,
  // Filter props
  resultsPerPage,
  onResultsPerPageChange,
  timePeriod,
  onTimePeriodChange,
  // Pagination props
  currentPage,
  totalPages,
  totalResults,
  startIndex,
  endIndex,
  onPageChange,
  onPrevious,
  onNext
}) {
  const SortIcon = ({ column }) => {
    if (sortBy !== column) return <ArrowUpDown size={16} className="text-gray-400" />;
    return sortOrder === 'asc' ? (
      <ArrowUpDown size={16} className="text-green-600" />
    ) : (
      <ArrowUpDown size={16} className="text-green-600" />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <FilterControls
        title="Swap History"
        resultsPerPage={resultsPerPage}
        onResultsPerPageChange={onResultsPerPageChange}
        timePeriod={timePeriod}
        onTimePeriodChange={onTimePeriodChange}
      />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {/* Date Column */}
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort('date')}
                  className="flex items-center space-x-2 font-semibold text-gray-700 hover:text-green-600 transition-colors"
                >
                  <span>Date</span>
                  <SortIcon column="date" />
                </button>
              </th>

              {/* Location Column */}
              <th className="px-6 py-4 text-left">
                <span className="font-semibold text-gray-700">Location</span>
              </th>

              {/* Time Column */}
              <th className="px-6 py-4 text-left">
                <span className="font-semibold text-gray-700">Time</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    <span className="ml-3 text-gray-600">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : swapHistory.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                  No swap history found
                </td>
              </tr>
            ) : (
              swapHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-800">{item.date}</td>
                  <td className="px-6 py-4 text-gray-600">{item.location}</td>
                  <td className="px-6 py-4 text-gray-600">{item.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={totalResults}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={onPageChange}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </div>
  );
}
