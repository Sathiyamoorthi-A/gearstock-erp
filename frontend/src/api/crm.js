import api from './axios';

export const getFeedbacks = async () => {
  const response = await api.get('/crm/feedback');
  return response.data;
};

export const createFeedback = async (data) => {
  const response = await api.post('/crm/feedback', data);
  return response.data;
};

export const getNotificationsLog = async () => {
  const response = await api.get('/crm/notifications-log');
  return response.data;
};
