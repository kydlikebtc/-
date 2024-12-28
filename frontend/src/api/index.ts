import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

export const fetchIndicators = async () => {
  const response = await axios.get(`${API_BASE_URL}/indicators`);
  return response.data;
};

export const fetchIndicatorHistory = async (id: number) => {
  const response = await axios.get(`${API_BASE_URL}/indicators/${id}/history`);
  return response.data;
};
