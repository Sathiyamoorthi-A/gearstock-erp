import api from './axios';
import { getLocalParts, saveLocalPart, updateLocalPart, deleteLocalPart } from './localStorageFallback';

export const getAllParts = async (search = '') => {
  try {
    const response = await api.get('/parts', { params: { search } });
    if (response.data && Array.isArray(response.data)) {
      localStorage.setItem('local_parts', JSON.stringify(response.data));
    }
    return response.data;
  } catch (err) {
    console.warn('Backend parts retrieval failed, using localStorage fallback', err);
    return getLocalParts(search);
  }
};

export const getPartById = async (id) => {
  try {
    const response = await api.get(`/parts/${id}`);
    return response.data;
  } catch (err) {
    console.warn(`Backend parts lookup for ID ${id} failed, using localStorage fallback`, err);
    const parts = getLocalParts();
    return parts.find(p => p.id === Number(id) || p.id === id);
  }
};

export const createPart = async (data) => {
  try {
    const response = await api.post('/parts', data);
    return response.data;
  } catch (err) {
    console.warn('Backend parts creation failed, using localStorage fallback', err);
    return saveLocalPart(data);
  }
};

export const updatePart = async (id, data) => {
  try {
    const response = await api.put(`/parts/${id}`, data);
    return response.data;
  } catch (err) {
    console.warn(`Backend parts update for ID ${id} failed, using localStorage fallback`, err);
    return updateLocalPart(id, data);
  }
};

export const deletePart = async (id) => {
  try {
    const response = await api.delete(`/parts/${id}`);
    return response.data;
  } catch (err) {
    console.warn(`Backend parts deletion for ID ${id} failed, using localStorage fallback`, err);
    return deleteLocalPart(id);
  }
};
