import api from './axios';
import {
  getLocalFeedbacks,
  saveLocalFeedback,
  getLocalNotificationsLog
} from './localStorageFallback';

export const getFeedbacks = async () => {
  try {
    const response = await api.get('/crm/feedback');
    return response.data;
  } catch (err) {
    console.warn('Backend feedbacks retrieval failed, using localStorage fallback', err);
    return getLocalFeedbacks();
  }
};

export const createFeedback = async (data) => {
  try {
    const response = await api.post('/crm/feedback', data);
    return response.data;
  } catch (err) {
    console.warn('Backend feedback creation failed, using localStorage fallback', err);
    return saveLocalFeedback(data);
  }
};

export const getNotificationsLog = async () => {
  try {
    const response = await api.get('/crm/notifications-log');
    return response.data;
  } catch (err) {
    console.warn('Backend notification logs retrieval failed, using localStorage fallback', err);
    return getLocalNotificationsLog();
  }
};
