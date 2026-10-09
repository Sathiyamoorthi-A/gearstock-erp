import api from './axios';

export const getAllWarehouses = async () => {
  const response = await api.get('/warehouses');
  return response.data;
};

export const getWarehouseById = async (id) => {
  const response = await api.get(`/warehouses/${id}`);
  return response.data;
};

export const createWarehouse = async (data) => {
  const response = await api.post('/warehouses', data);
  return response.data;
};

export const updateWarehouse = async (id, data) => {
  const response = await api.put(`/warehouses/${id}`, data);
  return response.data;
};

export const deleteWarehouse = async (id) => {
  const response = await api.delete(`/warehouses/${id}`);
  return response.data;
};

export const getWarehouseStocks = async (warehouseId) => {
  const response = await api.get(`/warehouses/${warehouseId}/stocks`);
  return response.data;
};

export const updateWarehouseStock = async (warehouseId, partId, quantity) => {
  const response = await api.post(`/warehouses/${warehouseId}/stocks`, { partId, quantity });
  return response.data;
};
