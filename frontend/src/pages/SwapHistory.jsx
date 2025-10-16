import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { generateSwapHistory } from '../data/mockData';

export default function SwapHistory() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const [totalResults, setTotalResults] = useState(0); // Will be updated after filtering
  
  // Sorting state
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'amount'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  
  // Filter state
  const [timePeriod, setTimePeriod] = useState('week'); // 'week', 'month', 'year'
  
  // Data state
  const [swapHistory, setSwapHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Total mock data count
  const TOTAL_MOCK_DATA = 230;

  // Filter data by time period
  const filterByTimePeriod = (data) => {
    const now = new Date();
    const filtered = data.filter(swap => {
      const swapDate = new Date(swap.date);
      
      if (timePeriod === 'week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return swapDate >= oneWeekAgo;
      } else if (timePeriod === 'month') {
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return swapDate >= oneMonthAgo;
      } else if (timePeriod === 'year') {
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        return swapDate >= oneYearAgo;
      }
      return true;
    });
    
    return filtered;
  };

  // Handle time period change
  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
    setCurrentPage(1); // Reset to first page
  };

  // Fetch data
  useEffect(() => {
    const fetchSwapHistory = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await swapHistoryService.getHistory({
        //   page: currentPage,
        //   limit: resultsPerPage,
        //   sortBy: sortBy,
        //   sortOrder: sortOrder
        // });
        
        // Mock data simulation
        await new Promise(resolve => setTimeout(resolve, 300));
        const mockData = generateSwapHistory(TOTAL_MOCK_DATA);
        
        // Apply time period filter
        const filteredByTime = filterByTimePeriod(mockData);
        
        // Apply sorting
        const sorted = [...filteredByTime].sort((a, b) => {
          if (sortBy === 'date') {
            const comparison = new Date(a.date) - new Date(b.date) || a.time.localeCompare(b.time);
            return sortOrder === 'asc' ? comparison : -comparison;
          } else if (sortBy === 'amount') {
            return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
          }
          return 0;
        });
        
        // Update total results based on filtered data
        setTotalResults(sorted.length);
        
        // Apply pagination
        const startIndex = (currentPage - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        const paginatedData = sorted.slice(startIndex, endIndex);
        
        setSwapHistory(paginatedData);
      } catch (error) {
        console.error('Error fetching swap history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSwapHistory();
  }, [currentPage, resultsPerPage, sortBy, sortOrder, timePeriod]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage + 1;
  const endIndex = Math.min(currentPage * resultsPerPage, totalResults);

  // Handle sort
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Handle results per page change
  const handleResultsPerPageChange = (value) => {
    setResultsPerPage(parseInt(value));
    setCurrentPage(1); // Reset to first page
  };

  // Handle page navigation
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Sort icon component
  const SortIcon = ({ column }) => {
    if (sortBy !== column) {
      return <ArrowUpDown size={16} className="text-gray-400" />;
    }
    return sortOrder === 'asc' 
      ? <ChevronUp size={16} className="text-green-600" />
      : <ChevronDown size={16} className="text-green-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Swap History</h1>
            
            {/* Results per page selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show result:</span>
              <select
                value={resultsPerPage}
                onChange={(e) => handleResultsPerPageChange(e.target.value)}
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
                onClick={() => handleTimePeriodChange('week')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  timePeriod === 'week'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => handleTimePeriodChange('month')}
                className={`px-4 py-2 text-sm font-medium border-l border-gray-300 transition-colors ${
                  timePeriod === 'month'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => handleTimePeriodChange('year')}
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

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {/* Date Column */}
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('date')}
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

                  {/* Amount Column */}
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('amount')}
                      className="flex items-center space-x-2 font-semibold text-gray-700 hover:text-green-600 transition-colors"
                    >
                      <span>Amount</span>
                      <SortIcon column="amount" />
                    </button>
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
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                        <span className="ml-3 text-gray-600">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : swapHistory.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No swap history found
                    </td>
                  </tr>
                ) : (
                  swapHistory.map((swap) => (
                    <tr key={swap.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-800">{swap.date}</td>
                      <td className="px-6 py-4 text-gray-600">{swap.location}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {swap.amount} {swap.amount === 1 ? 'battery' : 'batteries'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{swap.time}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <div className="flex items-center justify-between">
            {/* Showing info */}
            <div className="text-sm text-gray-600">
              showing {startIndex} - {endIndex} of {totalResults}
            </div>

            {/* Pagination controls */}
            <div className="flex items-center space-x-2">
              {/* Previous button */}
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </div>
              </button>

              {/* Page numbers */}
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      className={`px-4 py-2 rounded-md font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-green-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>

              {/* Next button */}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <span>Next</span>
                  <ChevronRight size={16} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
