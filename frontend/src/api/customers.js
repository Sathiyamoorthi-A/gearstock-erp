import api from './axios';
import { getLocalCustomers, saveLocalCustomer, updateLocalCustomer, deleteLocalCustomer } from './localStorageFallback';

export const getAllCustomers = async (search = '') => {
  try {
    const response = await api.get('/customers', { params: { search } });
    if (response.data && Array.isArray(response.data)) {
      localStorage.setItem('local_customers', JSON.stringify(response.data));
    }
    return response.data;
  } catch (err) {
    console.warn('Backend customers retrieval failed, using localStorage fallback', err);
    return getLocalCustomers(search);
  }
};

export const getCustomerById = async (id) => {
  try {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  } catch (err) {
    console.warn(`Backend customer lookup for ID ${id} failed, using localStorage fallback`, err);
    const list = getLocalCustomers();
    return list.find(c => c.id === Number(id) || c.id === id);
  }
};

export const createCustomer = async (data) => {
  try {
    const response = await api.post('/customers', data);
    return response.data;
  } catch (err) {
    console.warn('Backend customer creation failed, using localStorage fallback', err);
    return saveLocalCustomer(data);
  }
};

export const updateCustomer = async (id, data) => {
  try {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  } catch (err) {
    console.warn(`Backend customer update for ID ${id} failed, using localStorage fallback`, err);
    return updateLocalCustomer(id, data);
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  } catch (err) {
    console.warn(`Backend customer deletion for ID ${id} failed, using localStorage fallback`, err);
    return deleteLocalCustomer(id);
  }
};
