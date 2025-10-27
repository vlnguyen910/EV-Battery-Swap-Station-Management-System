import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { swapService } from '../services/swapService';

export default function SwapHistory() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const [totalResults, setTotalResults] = useState(0);
  
  // Sorting state
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'amount'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  
  // Filter state
  const [timePeriod, setTimePeriod] = useState('week'); // 'week', 'month', 'year'
  
  // Data state
  const [swapHistory, setSwapHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get user from localStorage
  const user = useMemo(() => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }, []);

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
      if (!user?.id) {
        console.warn('No user ID found');
        setSwapHistory([]);
        setPaymentHistory([]);
        setTotalResults(0);
        return;
      }

      setLoading(true);
      try {
        // Fetch both swap transactions and payments in parallel
        const [swapTransactions, payments] = await Promise.all([
          swapService.getAllSwapTransactionsByUserId(user.id),
          paymentService.getPaymentByUserId(user.id)
        ]);
        
        console.log('Swap transactions from API:', swapTransactions);
        console.log('Payments from API:', payments);
        
        // Transform swap transactions to UI format
        const transformedSwaps = (swapTransactions || []).map(transaction => ({
          id: `swap-${transaction.transaction_id}`,
          type: 'swap',
          date: transaction.createAt 
            ? new Date(transaction.createAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })
            : 'N/A',
          time: transaction.createAt 
            ? new Date(transaction.createAt).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })
            : 'N/A',
          location: `Station ${transaction.station_id}`,
          amount: 1, // Each transaction is 1 battery swap
          timestamp: transaction.createAt ? new Date(transaction.createAt).getTime() : 0,
          status: transaction.status,
          batteryTaken: transaction.battery_taken_id,
          batteryReturned: transaction.battery_returned_id,
          rawData: transaction
        }));

        // Transform payments to UI format
        const transformedPayments = (payments || []).map(payment => ({
          id: `payment-${payment.payment_id}`,
          type: 'payment',
          date: payment.created_at 
            ? new Date(payment.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })
            : 'N/A',
          time: payment.created_at 
            ? new Date(payment.created_at).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })
            : 'N/A',
          location: payment.package?.name || payment.order_info || 'Payment',
          amount: parseFloat(payment.amount || 0),
          timestamp: payment.created_at ? new Date(payment.created_at).getTime() : 0,
          status: payment.status,
          method: payment.method,
          packageName: payment.package?.name,
          rawData: payment
        }));

        // Apply time period filter to both
        const filteredSwaps = filterByTimePeriod(transformedSwaps);
        const filteredPayments = filterByTimePeriod(transformedPayments);
        
        // Apply sorting to swaps
        const sortedSwaps = [...filteredSwaps].sort((a, b) => {
          if (sortBy === 'date') {
            const comparison = a.timestamp - b.timestamp;
            return sortOrder === 'asc' ? comparison : -comparison;
          } else if (sortBy === 'amount') {
            return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
          }
          return 0;
        });

        // Apply sorting to payments
        const sortedPayments = [...filteredPayments].sort((a, b) => {
          if (sortBy === 'date') {
            const comparison = a.timestamp - b.timestamp;
            return sortOrder === 'asc' ? comparison : -comparison;
          } else if (sortBy === 'amount') {
            return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
          }
          return 0;
        });
        
        // Update total results (combined count)
        setTotalResults(sortedSwaps.length + sortedPayments.length);
        
        // Apply pagination to swaps
        const swapStartIndex = (currentPage - 1) * resultsPerPage;
        const swapEndIndex = swapStartIndex + resultsPerPage;
        const paginatedSwaps = sortedSwaps.slice(swapStartIndex, swapEndIndex);

        // Apply pagination to payments
        const paymentStartIndex = (currentPage - 1) * resultsPerPage;
        const paymentEndIndex = paymentStartIndex + resultsPerPage;
        const paginatedPayments = sortedPayments.slice(paymentStartIndex, paymentEndIndex);
        
        setSwapHistory(paginatedSwaps);
        setPaymentHistory(paginatedPayments);
      } catch (error) {
        console.error('Error fetching history:', error);
        setSwapHistory([]);
        setPaymentHistory([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSwapHistory();
  }, [currentPage, resultsPerPage, sortBy, sortOrder, timePeriod, user?.id]);

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
            <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
            
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

        {/* Swap Transaction History Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Swap History</h2>
          </div>
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
                  swapHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-800">{item.date}</td>
                      <td className="px-6 py-4 text-gray-600">{item.location}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {item.amount} {item.amount === 1 ? 'battery' : 'batteries'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{item.time}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment History Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Payment History</h2>
          </div>
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

                  {/* Package/Description Column */}
                  <th className="px-6 py-4 text-left">
                    <span className="font-semibold text-gray-700">Package</span>
                  </th>

                  {/* Amount Column */}
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('amount')}
                      className="flex items-center space-x-2 font-semibold text-gray-700 hover:text-green-600 transition-colors"
                    >
                      <span>Price</span>
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
                ) : paymentHistory.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No payment history found
                    </td>
                  </tr>
                ) : (
                  paymentHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-800">{item.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-gray-800">{item.location}</span>
                          <span className="text-xs text-gray-500 mt-1">
                            {item.method?.toUpperCase()} • {item.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          item.status === 'success' 
                            ? 'bg-blue-100 text-blue-800' 
                            : item.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.amount.toLocaleString()} VND
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{item.time}</td>
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
