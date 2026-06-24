import api from './axios';
import {
  getLocalDailyPaymentSummary,
  getLocalUsers,
  updateLocalUserPermissions
} from './localStorageFallback';

export const getItemSales = async (period = 'month') => {
  try {
    const response = await api.get('/analytics/item-sales', { params: { period } });
    return response.data;
  } catch (err) {
    console.warn(`Backend item sales query failed for period ${period}, returning empty list`, err);
    return [];
  }
};

export const getDailyPaymentSummary = async () => {
  try {
    const response = await api.get('/payments/daily-summary');
    return response.data;
  } catch (err) {
    console.warn('Backend daily payment summary failed, using localStorage fallback', err);
    return getLocalDailyPaymentSummary();
  }
};

export const createPayment = async (data) => {
  try {
    const response = await api.post('/payments', data);
    return response.data;
  } catch (err) {
    console.warn('Backend payment creation failed', err);
    return { ...data, id: Date.now(), paymentDate: new Date().toISOString() };
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (err) {
    console.warn('Backend users lookup failed, using localStorage fallback', err);
    return getLocalUsers();
  }
};

export const updateUserPermissions = async (id, payload) => {
  try {
    const response = await api.put(`/users/${id}/permissions`, payload);
    return response.data;
  } catch (err) {
    console.warn(`Backend user permissions update failed for ID ${id}, using localStorage fallback`, err);
    return updateLocalUserPermissions(id, payload);
  }
};

export const getExportUrl = (format, type) => {
  const token = localStorage.getItem('gearstock_token');
  return `/api/reports/export?format=${format}&type=${type}${token ? `&token=${token}` : ''}`;
};

export const downloadReport = async (type, format) => {
  try {
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
  } catch (err) {
    console.warn('Backend report export failed, falling back to client-side CSV download:', err);
    triggerLocalCsvDownload(type);
  }
};

const triggerLocalCsvDownload = (type) => {
  let csvContent = "data:text/csv;charset=utf-8,";
  
  if (type === 'items') {
    csvContent += "SKU,Name,Category,Quantity,Price,CostPrice,Supplier\n";
    const parts = JSON.parse(localStorage.getItem('local_parts') || '[]');
    parts.forEach(p => {
      csvContent += `"${p.sku}","${p.name}","${p.categoryName}",${p.quantity},${p.price},${p.costPrice || 0},"${p.supplierName}"\n`;
    });
  } else if (type === 'orders') {
    csvContent += "OrderNumber,Type,Status,TotalAmount,Partner,Date\n";
    const orders = JSON.parse(localStorage.getItem('local_orders') || '[]');
    orders.forEach(o => {
      const partner = o.orderType === 'SALES' ? (o.customer?.name || 'N/A') : (o.supplier?.name || 'N/A');
      csvContent += `"${o.orderNumber}","${o.orderType}","${o.status}",${o.totalAmount},"${partner}","${o.createdAt}"\n`;
    });
  } else {
    // Default / Payments
    csvContent += "PaymentMethod,Amount\n";
    const summary = getLocalDailyPaymentSummary();
    csvContent += `Cash,${summary.cashTotal}\n`;
    csvContent += `UPI,${summary.upiTotal}\n`;
    csvContent += `Card,${summary.cardTotal}\n`;
    csvContent += `Bank Transfer,${summary.bankTransferTotal}\n`;
    csvContent += `Lending,${summary.lendingTotal}\n`;
  }

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${type}_offline_report_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

