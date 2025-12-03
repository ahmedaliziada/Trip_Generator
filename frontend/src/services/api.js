import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    throw error;
  }
);

export const generateItinerary = async (data) => {
  const response = await api.post('/api/itinerary/generate', data);
  return response.data;
};

export const getItineraries = async () => {
  const response = await api.get('/api/itinerary');
  return response.data;
};

export const getItinerary = async (id) => {
  const response = await api.get(`/api/itinerary/${id}`);
  return response.data;
};

export const saveItinerary = async (data) => {
  const response = await api.post('/api/itinerary', data);
  return response.data;
};

export const updateItinerary = async (id, data) => {
  const response = await api.patch(`/api/itinerary/${id}`, data);
  return response.data;
};

export const deleteItinerary = async (id) => {
  const response = await api.delete(`/api/itinerary/${id}`);
  return response.data;
};

export const adjustItinerary = async (id, adjustment) => {
  const response = await api.post(`/api/itinerary/${id}/adjust`, {
    adjustment: adjustment
  });
  return response.data;
};