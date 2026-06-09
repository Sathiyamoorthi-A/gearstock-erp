import api from './axios';

export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  const { token, username: resUsername, fullName, role, department } = response.data;
  const user = { username: resUsername, fullName, role, department };
  if (token) {
    localStorage.setItem('gearstock_token', token);
  }
  if (resUsername) {
    localStorage.setItem('gearstock_user', JSON.stringify(user));
  }
  return { token, user };
};

export const register = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('gearstock_token');
  localStorage.removeItem('gearstock_user');
};
