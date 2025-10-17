import api from './api';

export const swapHistoryService = {
  // Get swap history for current user with pagination and sorting
  getHistory: async (params = {}) => {
    try {
      const { page = 1, limit = 20, sortBy = 'date', sortOrder = 'desc' } = params;
      
      const response = await api.get('/swap-history', {
        params: {
          page,
          limit,
          sortBy,
          sortOrder
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching swap history:', error);
      throw error;
    }
  },

  // Get swap history for specific user (admin/staff view)
  getUserHistory: async (userId, params = {}) => {
    try {
      const { page = 1, limit = 20, sortBy = 'date', sortOrder = 'desc' } = params;
      
      const response = await api.get(`/swap-history/user/${userId}`, {
        params: {
          page,
          limit,
          sortBy,
          sortOrder
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching swap history for user ${userId}:`, error);
      throw error;
    }
  },

  // Get single swap record details
  getSwapDetails: async (swapId) => {
    try {
      const response = await api.get(`/swap-history/${swapId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching swap details ${swapId}:`, error);
      throw error;
    }
  },

  // Get swap statistics
  getStatistics: async (params = {}) => {
    try {
      const response = await api.get('/swap-history/statistics', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching swap statistics:', error);
      throw error;
    }
  },

  // Export swap history to CSV
  exportHistory: async (params = {}) => {
    try {
      const response = await api.get('/swap-history/export', {
        params,
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `swap-history-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error exporting swap history:', error);
      throw error;
    }
  }
};

export default swapHistoryService;