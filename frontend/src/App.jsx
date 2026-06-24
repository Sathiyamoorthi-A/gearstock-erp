import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import PurchaseOrders from './pages/PurchaseOrders';
import SalesOrders from './pages/SalesOrders';
import Warehouses from './pages/Warehouses';
import Suppliers from './pages/Suppliers';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import Crm from './pages/Crm';
import Settings from './pages/Settings';

function ModuleRoute({ module, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const allowed = user.allowedModules ? user.allowedModules.split(',') : [];
  if (!allowed.includes(module)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<ModuleRoute module="dashboard"><Dashboard /></ModuleRoute>} />
            <Route path="inventory" element={<ModuleRoute module="inventory"><Inventory /></ModuleRoute>} />
            <Route path="purchase-orders" element={<ModuleRoute module="purchase-orders"><PurchaseOrders /></ModuleRoute>} />
            <Route path="sales-orders" element={<ModuleRoute module="sales-orders"><SalesOrders /></ModuleRoute>} />
            <Route path="warehouses" element={<ModuleRoute module="warehouses"><Warehouses /></ModuleRoute>} />
            <Route path="suppliers" element={<ModuleRoute module="suppliers"><Suppliers /></ModuleRoute>} />
            <Route path="customers" element={<ModuleRoute module="customers"><Customers /></ModuleRoute>} />
            <Route path="reports" element={<ModuleRoute module="reports"><Reports /></ModuleRoute>} />
            <Route path="crm" element={<ModuleRoute module="crm"><Crm /></ModuleRoute>} />
            <Route path="settings" element={<ModuleRoute module="settings"><Settings /></ModuleRoute>} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}


export default App;
