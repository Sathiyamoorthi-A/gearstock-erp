import api from './axios';
import {
  getLocalDashboardStats,
  getLocalDashboardRevenueChart,
  getLocalDashboardCategoryDistribution,
  getLocalDashboardRecentOrders,
  getLocalDashboardLowStockAlerts
} from './localStorageFallback';

export const getStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (err) {
    console.warn('Backend dashboard stats failed, using localStorage fallback', err);
    return getLocalDashboardStats();
  }
};

export const getRevenueChart = async () => {
  try {
    const response = await api.get('/dashboard/revenue-chart');
    return response.data;
  } catch (err) {
    console.warn('Backend dashboard revenue chart failed, using localStorage fallback', err);
    return getLocalDashboardRevenueChart();
  }
};

export const getCategoryDistribution = async () => {
  try {
    const response = await api.get('/dashboard/category-distribution');
    return response.data;
  } catch (err) {
    console.warn('Backend dashboard category distribution failed, using localStorage fallback', err);
    return getLocalDashboardCategoryDistribution();
  }
};

export const getRecentOrders = async () => {
  try {
    const response = await api.get('/dashboard/recent-orders');
    return response.data;
  } catch (err) {
    console.warn('Backend dashboard recent orders failed, using localStorage fallback', err);
    return getLocalDashboardRecentOrders();
  }
};

export const getLowStockAlerts = async () => {
  try {
    const response = await api.get('/dashboard/low-stock-alerts');
    return response.data;
  } catch (err) {
    console.warn('Backend dashboard low stock alerts failed, using localStorage fallback', err);
    return getLocalDashboardLowStockAlerts();
  }
};
