import axios from 'axios';
import config from '../utils/config';

// Create axios instance with default config
const api = axios.create({
  baseURL: config.API.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Direct Facebook Graph API calls
export const facebookGraphApi = {
  // Search for Facebook pages using the Graph API directly
  searchPages: async (searchTerm, accessToken) => {
    try {
      const response = await axios.get(`${config.FACEBOOK.GRAPH_API_URL}/search`, {
        params: {
          q: searchTerm,
          type: 'page',
          access_token: accessToken,
          fields: 'id,name,category,link,picture',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching Facebook pages:', error);
      throw error;
    }
  },
};

// Facebook Page API (through our backend)
export const facebookPageApi = {
  // Search for Facebook pages
  searchPages: async (searchTerm, accessToken) => {
    try {
      // First try direct Graph API call
      return await facebookGraphApi.searchPages(searchTerm, accessToken);
    } catch (error) {
      // Fall back to our backend API if direct call fails
      const response = await api.get(`/pages/search`, {
        params: {
          q: searchTerm,
          access_token: accessToken,
        },
      });
      return response.data;
    }
  },

  // Add a Facebook page to monitor
  addPage: async (pageData) => {
    try {
      const response = await api.post('/pages/', pageData);
      return response.data;
    } catch (error) {
      console.error('Error adding Facebook page:', error);
      throw error;
    }
  },

  // Get all monitored Facebook pages
  getPages: async () => {
    try {
      const response = await api.get('/pages/');
      return response.data;
    } catch (error) {
      console.error('Error getting Facebook pages:', error);
      throw error;
    }
  },

  // Delete a Facebook page from monitoring
  deletePage: async (pageId) => {
    try {
      const response = await api.delete(`/pages/${pageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting Facebook page:', error);
      throw error;
    }
  },

  // Fetch events from a specific Facebook page
  fetchPageEvents: async (pageId) => {
    try {
      const response = await api.post(`/pages/${pageId}/fetch`);
      return response.data;
    } catch (error) {
      console.error('Error fetching events from Facebook page:', error);
      throw error;
    }
  },
};

// Event API
export const eventApi = {
  // Get all events with pagination and filtering
  getEvents: async (params = {}) => {
    try {
      const response = await api.get('/events/', { params });
      return response.data;
    } catch (error) {
      console.error('Error getting events:', error);
      throw error;
    }
  },

  // Get a specific event by ID
  getEvent: async (eventId) => {
    try {
      const response = await api.get(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting event details:', error);
      throw error;
    }
  },

  // Get events for a specific page (using filter parameter instead of dedicated endpoint)
  getPageEvents: async (pageId, params = {}) => {
    try {
      // Use the events endpoint with page_id filter parameter
      const queryParams = { ...params, page_id: pageId };
      const response = await api.get('/events/', { params: queryParams });
      return response.data;
    } catch (error) {
      console.error('Error getting page events:', error);
      throw error;
    }
  }
};

export default api;
