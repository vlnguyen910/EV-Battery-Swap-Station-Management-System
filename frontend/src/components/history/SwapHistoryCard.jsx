import React, { useState } from 'react';
import { ArrowUpDown, Eye } from 'lucide-react';
import FilterControls from './FilterControls';
import PaginationControls from './PaginationControls';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

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
  const [selectedSwap, setSelectedSwap] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleViewDetail = (swap) => {
    setSelectedSwap(swap);
    setDetailOpen(true);
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return <ArrowUpDown size={16} className="text-gray-400" />;
    return sortOrder === 'asc' ? (
      <ArrowUpDown size={16} className="text-blue-600" />
    ) : (
      <ArrowUpDown size={16} className="text-blue-600" />
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

              {/* VIN Column */}
              <th className="px-6 py-4 text-left">
                <span className="font-semibold text-gray-700">VIN</span>
              </th>

              {/* Time Column */}
              <th className="px-6 py-4 text-left">
                <span className="font-semibold text-gray-700">Time</span>
              </th>

              {/* Detail Column */}
              <th className="px-6 py-4 text-center">
                <span className="font-semibold text-gray-700">Detail</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : swapHistory.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  No swap history found
                </td>
              </tr>
            ) : (
              swapHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-800">{item.date}</td>
                  <td className="px-6 py-4 text-gray-600">{item.location}</td>
                  <td className="px-6 py-4 text-gray-600">{item.vin}</td>
                  <td className="px-6 py-4 text-gray-600">{item.time}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetail(item)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Detail</span>
                      </Button>
                    </div>
                  </td>
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

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Swap Transaction Details</DialogTitle>
          </DialogHeader>

          {selectedSwap && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">{selectedSwap.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium text-gray-900">{selectedSwap.time}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{selectedSwap.location}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Vehicle VIN</p>
                <p className="font-medium text-gray-900">{selectedSwap.vin}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Battery Taken</p>
                  <p className="font-medium text-gray-900">{selectedSwap.batteryTaken || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Battery Returned</p>
                  <p className="font-medium text-gray-900">{selectedSwap.batteryReturned || 'N/A'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${selectedSwap.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                  }`}>
                  {selectedSwap.status || 'N/A'}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button onClick={() => setDetailOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
