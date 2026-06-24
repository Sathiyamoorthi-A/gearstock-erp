import api from './axios';
import {
  getLocalWarehouses,
  saveLocalWarehouse,
  updateLocalWarehouse,
  deleteLocalWarehouse,
  getLocalWarehouseStocks,
  updateLocalWarehouseStock
} from './localStorageFallback';

export const getAllWarehouses = async () => {
  try {
    const response = await api.get('/warehouses');
    return response.data;
  } catch (err) {
    console.warn('Backend warehouses retrieval failed, using localStorage fallback', err);
    return getLocalWarehouses();
  }
};

export const getWarehouseById = async (id) => {
  try {
    const response = await api.get(`/warehouses/${id}`);
    return response.data;
  } catch (err) {
    console.warn(`Backend warehouse lookup for ID ${id} failed, using localStorage fallback`, err);
    const list = getLocalWarehouses();
    return list.find(w => w.id === Number(id) || w.id === id);
  }
};

export const createWarehouse = async (data) => {
  try {
    const response = await api.post('/warehouses', data);
    return response.data;
  } catch (err) {
    console.warn('Backend warehouse creation failed, using localStorage fallback', err);
    return saveLocalWarehouse(data);
  }
};

export const updateWarehouse = async (id, data) => {
  try {
    const response = await api.put(`/warehouses/${id}`, data);
    return response.data;
  } catch (err) {
    console.warn(`Backend warehouse update for ID ${id} failed, using localStorage fallback`, err);
    return updateLocalWarehouse(id, data);
  }
};

export const deleteWarehouse = async (id) => {
  try {
    const response = await api.delete(`/warehouses/${id}`);
    return response.data;
  } catch (err) {
    console.warn(`Backend warehouse deletion for ID ${id} failed, using localStorage fallback`, err);
    return deleteLocalWarehouse(id);
  }
};

export const getWarehouseStocks = async (warehouseId) => {
  try {
    const response = await api.get(`/warehouses/${warehouseId}/stocks`);
    return response.data;
  } catch (err) {
    console.warn(`Backend warehouse stocks retrieval for ID ${warehouseId} failed, using localStorage fallback`, err);
    return getLocalWarehouseStocks(warehouseId);
  }
};

export const updateWarehouseStock = async (warehouseId, partId, quantity) => {
  try {
    const response = await api.post(`/warehouses/${warehouseId}/stocks`, { partId, quantity });
    return response.data;
  } catch (err) {
    console.warn(`Backend warehouse stock update failed, using localStorage fallback`, err);
    return updateLocalWarehouseStock(warehouseId, partId, quantity);
  }
};
