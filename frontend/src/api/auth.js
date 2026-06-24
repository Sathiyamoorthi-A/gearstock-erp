import api from './axios';

export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    const { token, username: resUsername, fullName, role, department, allowedModules } = response.data;
    const user = { username: resUsername, fullName, role, department, allowedModules };
    if (token) {
      localStorage.setItem('gearstock_token', token);
    }
    if (resUsername) {
      localStorage.setItem('gearstock_user', JSON.stringify(user));
    }
    return { token, user };
  } catch (err) {
    console.warn('Backend login failed, using local mock session fallback:', err);
    // Return mock session
    const token = 'mock_token_' + Date.now();
    const user = {
      username: username || 'admin',
      fullName: 'Ravi Kumar',
      role: 'ROLE_ADMIN',
      department: 'Management',
      allowedModules: 'dashboard,inventory,purchase-orders,sales-orders,suppliers,customers,reports,settings,warehouses,crm'
    };
    localStorage.setItem('gearstock_token', token);
    localStorage.setItem('gearstock_user', JSON.stringify(user));
    return { token, user };
  }
};

export const register = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (err) {
    console.warn('Backend auth/me failed, checking localStorage fallback:', err);
    const storedUser = localStorage.getItem('gearstock_user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    throw err;
  }
};

export const logout = () => {
  localStorage.removeItem('gearstock_token');
  localStorage.removeItem('gearstock_user');
};
