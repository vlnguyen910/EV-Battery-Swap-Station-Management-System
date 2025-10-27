import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { swapService } from '../services/swapService';

export default function SwapHistory() {
  // Pagination state for swaps
  const [swapCurrentPage, setSwapCurrentPage] = useState(1);
  const [swapResultsPerPage, setSwapResultsPerPage] = useState(20);
  const [swapTotalResults, setSwapTotalResults] = useState(0);
  
  // Pagination state for payments
  const [paymentCurrentPage, setPaymentCurrentPage] = useState(1);
  const [paymentResultsPerPage, setPaymentResultsPerPage] = useState(20);
  const [paymentTotalResults, setPaymentTotalResults] = useState(0);
  
  // Sorting state
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'amount'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  
  // Filter state for swaps
  const [swapTimePeriod, setSwapTimePeriod] = useState('week'); // 'week', 'month', 'year'
  
  // Filter state for payments
  const [paymentTimePeriod, setPaymentTimePeriod] = useState('week'); // 'week', 'month', 'year'
  
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
  const filterByTimePeriod = (data, timePeriod) => {
    const now = new Date();
    const filtered = data.filter(item => {
      const itemDate = new Date(item.date);
      
      if (timePeriod === 'week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return itemDate >= oneWeekAgo;
      } else if (timePeriod === 'month') {
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return itemDate >= oneMonthAgo;
      } else if (timePeriod === 'year') {
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        return itemDate >= oneYearAgo;
      }
      return true;
    });
    
    return filtered;
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
        const filteredSwaps = filterByTimePeriod(transformedSwaps, swapTimePeriod);
        const filteredPayments = filterByTimePeriod(transformedPayments, paymentTimePeriod);
        
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
        
        // Update total results
        setSwapTotalResults(sortedSwaps.length);
        setPaymentTotalResults(sortedPayments.length);
        
        // Apply pagination to swaps
        const swapStartIndex = (swapCurrentPage - 1) * swapResultsPerPage;
        const swapEndIndex = swapStartIndex + swapResultsPerPage;
        const paginatedSwaps = sortedSwaps.slice(swapStartIndex, swapEndIndex);

        // Apply pagination to payments
        const paymentStartIndex = (paymentCurrentPage - 1) * paymentResultsPerPage;
        const paymentEndIndex = paymentStartIndex + paymentResultsPerPage;
        const paginatedPayments = sortedPayments.slice(paymentStartIndex, paymentEndIndex);
        
        setSwapHistory(paginatedSwaps);
        setPaymentHistory(paginatedPayments);
      } catch (error) {
        console.error('Error fetching history:', error);
        setSwapHistory([]);
        setPaymentHistory([]);
        setSwapTotalResults(0);
        setPaymentTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSwapHistory();
  }, [swapCurrentPage, swapResultsPerPage, paymentCurrentPage, paymentResultsPerPage, sortBy, sortOrder, swapTimePeriod, paymentTimePeriod, user?.id]);

  // Calculate pagination info for swaps
  const swapTotalPages = Math.ceil(swapTotalResults / swapResultsPerPage);
  const swapStartIndex = (swapCurrentPage - 1) * swapResultsPerPage + 1;
  const swapEndIndex = Math.min(swapCurrentPage * swapResultsPerPage, swapTotalResults);

  // Calculate pagination info for payments
  const paymentTotalPages = Math.ceil(paymentTotalResults / paymentResultsPerPage);
  const paymentStartIndex = (paymentCurrentPage - 1) * paymentResultsPerPage + 1;
  const paymentEndIndex = Math.min(paymentCurrentPage * paymentResultsPerPage, paymentTotalResults);

  // Handle sort
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setSwapCurrentPage(1); // Reset to first page when sorting
    setPaymentCurrentPage(1);
  };

  // Generate page numbers to display
  const getPageNumbers = (currentPage, totalPages) => {
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
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-7xl mx-auto">
        {/* Swap Transaction History Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Swap History</h2>
              
              {/* Results per page selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Show result:</span>
                <select
                  value={swapResultsPerPage}
                  onChange={(e) => {
                    setSwapResultsPerPage(parseInt(e.target.value));
                    setSwapCurrentPage(1);
                  }}
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
                  onClick={() => {
                    setSwapTimePeriod('week');
                    setSwapCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    swapTimePeriod === 'week'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => {
                    setSwapTimePeriod('month');
                    setSwapCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-sm font-medium border-l border-gray-300 transition-colors ${
                    swapTimePeriod === 'month'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => {
                    setSwapTimePeriod('year');
                    setSwapCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-sm font-medium border-l border-gray-300 transition-colors ${
                    swapTimePeriod === 'year'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Year
                </button>
              </div>
            </div>
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

          {/* Swap History Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {swapStartIndex} to {swapEndIndex} of {swapTotalResults} results
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSwapCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={swapCurrentPage === 1}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-1">
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </div>
                </button>
                
                {getPageNumbers(swapCurrentPage, swapTotalPages).map((pageNum, index) => (
                  pageNum === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={pageNum}
                      onClick={() => setSwapCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        pageNum === swapCurrentPage
                          ? 'bg-green-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                ))}
                
                <button
                  onClick={() => setSwapCurrentPage(prev => Math.min(swapTotalPages, prev + 1))}
                  disabled={swapCurrentPage === swapTotalPages}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Payment History Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Payment History</h2>
              
              {/* Results per page selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Show result:</span>
                <select
                  value={paymentResultsPerPage}
                  onChange={(e) => {
                    setPaymentResultsPerPage(parseInt(e.target.value));
                    setPaymentCurrentPage(1);
                  }}
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
                  onClick={() => {
                    setPaymentTimePeriod('week');
                    setPaymentCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    paymentTimePeriod === 'week'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => {
                    setPaymentTimePeriod('month');
                    setPaymentCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-sm font-medium border-l border-gray-300 transition-colors ${
                    paymentTimePeriod === 'month'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => {
                    setPaymentTimePeriod('year');
                    setPaymentCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-sm font-medium border-l border-gray-300 transition-colors ${
                    paymentTimePeriod === 'year'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Year
                </button>
              </div>
            </div>
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

          {/* Payment History Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {paymentStartIndex} to {paymentEndIndex} of {paymentTotalResults} results
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPaymentCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={paymentCurrentPage === 1}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-1">
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </div>
                </button>
                
                {getPageNumbers(paymentCurrentPage, paymentTotalPages).map((pageNum, index) => (
                  pageNum === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={pageNum}
                      onClick={() => setPaymentCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        pageNum === paymentCurrentPage
                          ? 'bg-green-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                ))}
                
                <button
                  onClick={() => setPaymentCurrentPage(prev => Math.min(paymentTotalPages, prev + 1))}
                  disabled={paymentCurrentPage === paymentTotalPages}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}
