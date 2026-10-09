import api from './axios';

export const getItemSales = async (period = 'month') => {
  const response = await api.get('/analytics/item-sales', { params: { period } });
  return response.data;
};

export const getDailyPaymentSummary = async () => {
  const response = await api.get('/payments/daily-summary');
  return response.data;
};

export const createPayment = async (data) => {
  const response = await api.post('/payments', data);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const updateUserPermissions = async (id, payload) => {
  const response = await api.put(`/users/${id}/permissions`, payload);
  return response.data;
};

export const getExportUrl = (format, type) => {
  const token = localStorage.getItem('gearstock_token');
  return `/api/reports/export?format=${format}&type=${type}${token ? `&token=${token}` : ''}`;
};

export const downloadReport = async (type, format) => {
  const response = await api.get('/reports/export', {
    params: { type, format },
    responseType: 'blob'
  });

  const blob = new Blob([response.data], { type: response.headers['content-type'] });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const extension = format === 'excel' ? 'xlsx' : format;
  link.setAttribute('download', `${type}_report_${Date.now()}.${extension}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
