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
} from 'react-icons/hi2';
import { FiSettings } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

const mainNavItems = [
  { to: '/', icon: HiSquares2X2, label: 'Dashboard', end: true },
  { to: '/inventory', icon: HiCube, label: 'Inventory' },
  { to: '/purchase-orders', icon: HiClipboardDocumentList, label: 'Purchase Orders', badge: 12 },
  { to: '/sales-orders', icon: HiShoppingCart, label: 'Sales Orders' },
];

const managementNavItems = [
  { to: '/suppliers', icon: HiTruck, label: 'Suppliers' },
  { to: '/reports', icon: HiChartBar, label: 'Reports' },
  { to: '/customers', icon: HiUsers, label: 'Customers' },
];

const systemNavItems = [
  { to: '/settings', icon: FiSettings, label: 'Settings' },
];

function Sidebar() {
  const { user } = useAuth();

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
        <span className={styles.sectionLabel}>Main</span>
        {mainNavItems.map(renderNavItem)}

        <span className={styles.sectionLabel}>Management</span>
        {managementNavItems.map(renderNavItem)}

        <span className={styles.sectionLabel}>System</span>
        {systemNavItems.map(renderNavItem)}
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
      </div>
    </aside>
  );
}

export default Sidebar;
