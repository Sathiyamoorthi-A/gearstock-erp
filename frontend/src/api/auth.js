import api from './axios';

export const login = async (username, password) => {
  // No fallback — login requires a live server connection.
  // If backend is down, the user will see a clear error on the login page.
  const response = await api.post('/auth/login', { username, password });
  const { token, username: resUsername, fullName, role, department, allowedModules } = response.data;
  const user = { username: resUsername, fullName, role, department, allowedModules };

  localStorage.setItem('gearstock_token', token);
  localStorage.setItem('gearstock_user', JSON.stringify(user));

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

export const updateProfile = async (data) => {
  const response = await api.put('/auth/profile', data);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('gearstock_token');
  localStorage.removeItem('gearstock_user');
  // Also clear any stale local data keys from old fallback system
  localStorage.removeItem('local_parts');
  localStorage.removeItem('local_orders');
  localStorage.removeItem('local_customers');
  localStorage.removeItem('local_suppliers');
};
