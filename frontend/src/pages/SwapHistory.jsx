import React, { useState, useEffect, useMemo } from 'react';
import { paymentService } from '../services/paymentService';
import { swapService } from '../services/swapService';
import SwapHistoryCard from '../components/history/SwapHistoryCard';
import PaymentHistoryCard from '../components/history/PaymentHistoryCard';

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

  // Handler functions for Swap History
  const handleSwapResultsPerPageChange = (value) => {
    setSwapResultsPerPage(value);
    setSwapCurrentPage(1);
  };

  const handleSwapTimePeriodChange = (period) => {
    setSwapTimePeriod(period);
    setSwapCurrentPage(1);
  };

  const handleSwapPageChange = (pageNum) => {
    setSwapCurrentPage(pageNum);
  };

  const handleSwapPrevious = () => {
    setSwapCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleSwapNext = () => {
    setSwapCurrentPage(prev => Math.min(swapTotalPages, prev + 1));
  };

  // Handler functions for Payment History
  const handlePaymentResultsPerPageChange = (value) => {
    setPaymentResultsPerPage(value);
    setPaymentCurrentPage(1);
  };

  const handlePaymentTimePeriodChange = (period) => {
    setPaymentTimePeriod(period);
    setPaymentCurrentPage(1);
  };

  const handlePaymentPageChange = (pageNum) => {
    setPaymentCurrentPage(pageNum);
  };

  const handlePaymentPrevious = () => {
    setPaymentCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handlePaymentNext = () => {
    setPaymentCurrentPage(prev => Math.min(paymentTotalPages, prev + 1));
  };

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-7xl mx-auto">
        <SwapHistoryCard
          swapHistory={swapHistory}
          loading={loading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          resultsPerPage={swapResultsPerPage}
          onResultsPerPageChange={handleSwapResultsPerPageChange}
          timePeriod={swapTimePeriod}
          onTimePeriodChange={handleSwapTimePeriodChange}
          currentPage={swapCurrentPage}
          totalPages={swapTotalPages}
          totalResults={swapTotalResults}
          startIndex={swapStartIndex}
          endIndex={swapEndIndex}
          onPageChange={handleSwapPageChange}
          onPrevious={handleSwapPrevious}
          onNext={handleSwapNext}
        />

        <PaymentHistoryCard
          paymentHistory={paymentHistory}
          loading={loading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          resultsPerPage={paymentResultsPerPage}
          onResultsPerPageChange={handlePaymentResultsPerPageChange}
          timePeriod={paymentTimePeriod}
          onTimePeriodChange={handlePaymentTimePeriodChange}
          currentPage={paymentCurrentPage}
          totalPages={paymentTotalPages}
          totalResults={paymentTotalResults}
          startIndex={paymentStartIndex}
          endIndex={paymentEndIndex}
          onPageChange={handlePaymentPageChange}
          onPrevious={handlePaymentPrevious}
          onNext={handlePaymentNext}
        />
      </div>
    </div>
  );
}
