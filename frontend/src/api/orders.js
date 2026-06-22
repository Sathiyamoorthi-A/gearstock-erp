import api from './axios';
import { getLocalOrders, saveLocalOrder, updateLocalOrderStatus, updateLocalOrder } from './localStorageFallback';

export const getAllOrders = async (type = '') => {
  try {
    const response = await api.get('/orders', { params: { type } });
    // Cache it to local storage as we fetch
    if (response.data && Array.isArray(response.data)) {
      // Fetching only filters by type, so we load the existing list, merge/overwrite for this type, and save
      const currentOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
      const filteredOther = currentOrders.filter(o => o.orderType !== type);
      const merged = [...filteredOther, ...response.data];
      localStorage.setItem('local_orders', JSON.stringify(merged));
    }
    return response.data;
  } catch (err) {
    console.warn('Backend orders retrieval failed, using localStorage fallback', err);
    return getLocalOrders(type);
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (err) {
    console.warn(`Backend order lookup for ID ${id} failed, using localStorage fallback`, err);
    const orders = getLocalOrders();
    return orders.find(o => o.id === Number(id) || o.id === id);
  }
};

export const createOrder = async (data) => {
  try {
    const response = await api.post('/orders', data);
    return response.data;
  } catch (err) {
    console.warn('Backend order creation failed, using localStorage fallback', err);
    return saveLocalOrder(data);
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  } catch (err) {
    console.warn(`Backend order status update for ID ${id} failed, using localStorage fallback`, err);
    return updateLocalOrderStatus(id, status);
  }
};

export const updateOrder = async (id, data) => {
  try {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
  } catch (err) {
    console.warn(`Backend order update for ID ${id} failed, using localStorage fallback`, err);
    return updateLocalOrder(id, data);
  }
};
