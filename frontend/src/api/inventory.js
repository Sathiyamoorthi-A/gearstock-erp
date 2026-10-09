import api from './axios';

export const getAllParts = async (search = '') => {
  const response = await api.get('/parts', { params: { search } });
  return response.data;
};

export const getPartById = async (id) => {
  const response = await api.get(`/parts/${id}`);
  return response.data;
};

export const createPart = async (data) => {
  const response = await api.post('/parts', data);
  return response.data;
};

export const updatePart = async (id, data) => {
  const response = await api.put(`/parts/${id}`, data);
  return response.data;
};

export const deletePart = async (id) => {
  const response = await api.delete(`/parts/${id}`);
  return response.data;
};
