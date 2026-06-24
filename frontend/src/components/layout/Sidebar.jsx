import { NavLink } from 'react-router-dom';
import {
  HiCog6Tooth,
  HiSquares2X2,
  HiCube,
  HiClipboardDocumentList,
  HiShoppingCart,
  HiTruck,
  HiChartBar,
  HiUsers,
  HiBuildingOffice2,
  HiChatBubbleLeftRight,
} from 'react-icons/hi2';
import { FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';


const mainNavItems = [
  { to: '/', icon: HiSquares2X2, label: 'Dashboard', end: true, module: 'dashboard' },
  { to: '/inventory', icon: HiCube, label: 'Inventory', module: 'inventory' },
  { to: '/purchase-orders', icon: HiClipboardDocumentList, label: 'Purchase Orders', badge: 12, module: 'purchase-orders' },
  { to: '/sales-orders', icon: HiShoppingCart, label: 'Sales Orders', module: 'sales-orders' },
];

const managementNavItems = [
  { to: '/warehouses', icon: HiBuildingOffice2, label: 'Warehouses', module: 'warehouses' },
  { to: '/suppliers', icon: HiTruck, label: 'Suppliers', module: 'suppliers' },
  { to: '/reports', icon: HiChartBar, label: 'Reports', module: 'reports' },
  { to: '/customers', icon: HiUsers, label: 'Customers', module: 'customers' },
  { to: '/crm', icon: HiChatBubbleLeftRight, label: 'CRM Feed', module: 'crm' },
];

const systemNavItems = [
  { to: '/settings', icon: FiSettings, label: 'Settings', module: 'settings' },
];


function Sidebar() {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'GS';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderNavItem = (item) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
        }
      >
        <Icon />
        <span>{item.label}</span>
        {item.badge && <span className={styles.badge}>{item.badge}</span>}
      </NavLink>
    );
  };

  const allowed = user?.allowedModules ? user.allowedModules.split(',') : [];

  const filterNavItems = (items) => {
    return items.filter(item => {
      if (!item.module) return true;
      return allowed.includes(item.module);
    });
  };

  const filteredMain = filterNavItems(mainNavItems);
  const filteredManagement = filterNavItems(managementNavItems);
  const filteredSystem = filterNavItems(systemNavItems);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <HiCog6Tooth />
        </div>
        <div className={styles.logoText}>
          <h2>GearStock ERP</h2>
          <span>PRO Edition</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {filteredMain.length > 0 && (
          <>
            <span className={styles.sectionLabel}>Main</span>
            {filteredMain.map(renderNavItem)}
          </>
        )}

        {filteredManagement.length > 0 && (
          <>
            <span className={styles.sectionLabel}>Management</span>
            {filteredManagement.map(renderNavItem)}
          </>
        )}

        {filteredSystem.length > 0 && (
          <>
            <span className={styles.sectionLabel}>System</span>
            {filteredSystem.map(renderNavItem)}
          </>
        )}
      </nav>

      <div className={styles.userCard}>
        <div className={styles.avatar}>
          {getInitials(user?.fullName || user?.username)}
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>
            {user?.fullName || user?.username || 'Admin User'}
          </div>
          <div className={styles.userRole}>
            {user?.department || 'Inventory Dept'}
          </div>
        </div>
        <button 
          onClick={logout} 
          className={styles.logoutBtn} 
          title="Logout"
        >
          <FiLogOut />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
