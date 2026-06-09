import { useLocation } from 'react-router-dom';
import { FiSearch, FiBell } from 'react-icons/fi';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

const pageTitles = {
  '/': 'Dashboard',
  '/inventory': 'Inventory Management',
  '/purchase-orders': 'Purchase Orders',
  '/sales-orders': 'Sales Orders',
  '/suppliers': 'Suppliers',
  '/customers': 'Customers',
  '/reports': 'Reports & Analytics',
  '/settings': 'Settings',
};

function Header() {
  const location = useLocation();
  const { user } = useAuth();
  const title = pageTitles[location.pathname] || 'Dashboard';
  const today = format(new Date(), 'EEEE, dd MMM yyyy');

  const getInitials = (name) => {
    if (!name) return 'GS';
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <span className={styles.date}>{today}</span>
      </div>

      <div className={styles.searchBar}>
        <FiSearch className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search parts, orders..."
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn} title="Notifications">
          <FiBell />
          <span className={styles.notifBadge} />
        </button>
        <div className={styles.headerAvatar} title={user?.fullName || 'User'}>
          {getInitials(user?.fullName || user?.username)}
        </div>
      </div>
    </header>
  );
}

export default Header;
