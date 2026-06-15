import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiBell } from 'react-icons/fi';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { getAllParts } from '../../api/inventory';
import { getAllOrders } from '../../api/orders';
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
  const navigate = useNavigate();
  const { user } = useAuth();
  const title = pageTitles[location.pathname] || 'Dashboard';
  const today = format(new Date(), 'EEEE, dd MMM yyyy');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const [parts, orders] = await Promise.all([
          getAllParts(),
          getAllOrders()
        ]);
        
        const list = [];
        
        // 1. Critical stock alerts
        if (parts && Array.isArray(parts)) {
          const lowStock = parts.filter(p => p.quantity <= p.reorderLevel);
          lowStock.slice(0, 3).forEach(p => {
            list.push({
              text: `Low Stock: ${p.sku} (${p.name}) has only ${p.quantity} left.`,
              time: 'System Alert',
              color: '#ef4444',
              path: '/inventory'
            });
          });
        }

        // 2. Recent order updates
        if (orders && Array.isArray(orders)) {
          const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
          sortedOrders.forEach(o => {
            const orderNum = o.orderNumber || `#ORD-${o.id}`;
            list.push({
              text: `Order ${orderNum} is currently ${o.status}.`,
              time: o.orderType === 'SALES' ? 'Sales Order' : 'Purchase Order',
              color: o.orderType === 'SALES' ? '#10b981' : '#3b82f6',
              path: o.orderType === 'SALES' ? '/sales-orders' : '/purchase-orders'
            });
          });
        }

        setNotifications(list);
      } catch (err) {
        console.warn('Failed to load notifications from APIs, using fallback static alerts', err);
        setNotifications([
          { text: 'Mahle Oil Filter is below reorder level (3 left).', time: 'System Alert', color: '#ef4444', path: '/inventory' },
          { text: 'New Sales Order #ORD-9841 created.', time: 'Sales Order', color: '#10b981', path: '/sales-orders' },
          { text: 'Supplier Bosch India Pvt Ltd registered.', time: 'System Alert', color: '#3b82f6', path: '/suppliers' }
        ]);
      }
    };
    loadNotifications();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        <div className={styles.notificationWrapper} ref={notifRef}>
          <button 
            className={styles.iconBtn} 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            title="Notifications"
          >
            <FiBell />
            {notifications.length > 0 && <span className={styles.notifBadge} />}
          </button>
          
          {isDropdownOpen && (
            <div className={styles.notifDropdown}>
              <div className={styles.notifHeader}>
                <h3>Alerts & Notifications</h3>
                <span className={styles.notifCount}>{notifications.length} Active</span>
              </div>
              <div className={styles.notifList}>
                {notifications.map((n, idx) => (
                  <div 
                    key={idx} 
                    className={styles.notifItem} 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      if (n.path) navigate(n.path);
                    }}
                  >
                    <div className={styles.notifDot} style={{ background: n.color }} />
                    <div className={styles.notifContent}>
                      <div className={styles.notifText}>{n.text}</div>
                      <div className={styles.notifTime}>{n.time}</div>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                    No pending alerts
                  </div>
                )}
              </div>
              <div className={styles.notifUserSection}>
                <div className={styles.notifUserTitle}>Active Session Info</div>
                <div className={styles.notifUserDetail}>
                  <strong>{user?.fullName || user?.username || 'Ravi Kumar'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  <span>Dept: {user?.department || 'Management'}</span>
                  <span>Role: {user?.role?.replace('ROLE_', '') || 'ADMIN'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.headerAvatar} title={user?.fullName || 'User'}>
          {getInitials(user?.fullName || user?.username)}
        </div>
      </div>
    </header>
  );
}

export default Header;
