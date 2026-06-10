import api from './axios';
import { getLocalSuppliers, saveLocalSupplier, updateLocalSupplier, deleteLocalSupplier } from './localStorageFallback';

export const getAllSuppliers = async (search = '') => {
  try {
    const response = await api.get('/suppliers', { params: { search } });
    if (response.data && Array.isArray(response.data)) {
      localStorage.setItem('local_suppliers', JSON.stringify(response.data));
    }
    return response.data;
  } catch (err) {
    console.warn('Backend suppliers retrieval failed, using localStorage fallback', err);
    return getLocalSuppliers(search);
  }
};

export const getSupplierById = async (id) => {
  try {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  } catch (err) {
    console.warn(`Backend supplier lookup for ID ${id} failed, using localStorage fallback`, err);
    const list = getLocalSuppliers();
    return list.find(s => s.id === Number(id) || s.id === id);
  }
};

export const createSupplier = async (data) => {
  try {
    const response = await api.post('/suppliers', data);
    return response.data;
  } catch (err) {
    console.warn('Backend supplier creation failed, using localStorage fallback', err);
    return saveLocalSupplier(data);
  }
};

export const updateSupplier = async (id, data) => {
  try {
    const response = await api.put(`/suppliers/${id}`, data);
    return response.data;
  } catch (err) {
    console.warn(`Backend supplier update for ID ${id} failed, using localStorage fallback`, err);
    return updateLocalSupplier(id, data);
  }
};

export const deleteSupplier = async (id) => {
  try {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  } catch (err) {
    console.warn(`Backend supplier deletion for ID ${id} failed, using localStorage fallback`, err);
    return deleteLocalSupplier(id);
  }
};
