import api from './axios';

export const getStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getRevenueChart = async () => {
  const response = await api.get('/dashboard/revenue-chart');
  return response.data;
};

export const getCategoryDistribution = async () => {
  const response = await api.get('/dashboard/category-distribution');
  return response.data;
};

export const getRecentOrders = async () => {
  const response = await api.get('/dashboard/recent-orders');
  return response.data;
};

export const getLowStockAlerts = async () => {
  const response = await api.get('/dashboard/low-stock-alerts');
  return response.data;
};
