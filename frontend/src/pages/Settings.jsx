import { useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import styles from './Settings.module.css';

function Settings() {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || 'Admin User');
  const [email, setEmail] = useState(user?.email || 'admin@gearstock.in');
  const [department, setDepartment] = useState(user?.department || 'Inventory');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 00000');

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [lowStockNotifs, setLowStockNotifs] = useState(true);
  const [orderNotifs, setOrderNotifs] = useState(false);

  const [currency, setCurrency] = useState('INR (₹)');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST)');
  const [threshold, setThreshold] = useState(10);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    try {
      updateUser({
        fullName,
        email,
        department,
        phone
      });
      showToast('Profile information saved successfully');
    } catch (err) {
      showToast('Failed to save profile information', 'error');
    }
  };

  const handlePreferencesSave = (e) => {
    e.preventDefault();
    showToast('Preferences saved successfully');
  };

  const handleResetData = () => {
    if (window.confirm('WARNING: Are you sure you want to reset all database data? This action cannot be undone.')) {
      showToast('Database reset initiated... Please refresh in a moment', 'error');
    }
  };

  return (
    <div className={styles.page}>
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
          <span className={styles.toastText}>{toast.message}</span>
        </div>
      )}

      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Settings</h2>
        <p className={styles.pageSubtitle}>Manage your account and system preferences.</p>
      </div>

      {/* Profile Section */}
      <form onSubmit={handleProfileSave} className={styles.section} style={{ animationDelay: '0s' }}>
        <h3 className={styles.sectionTitle}>Profile Information</h3>
        <p className={styles.sectionDesc}>Update your personal information and contact details.</p>

        <div className={styles.fieldGroup}>
          <div className={styles.inputRow}>
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <input
                required
                className={styles.input}
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <input
                required
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>
          </div>
          <div className={styles.inputRow}>
            <div className={styles.field}>
              <label className={styles.label}>Department</label>
              <input
                required
                className={styles.input}
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Department"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Phone Number</label>
              <input
                className={styles.input}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
              />
            </div>
          </div>

          <button type="submit" className={styles.saveBtn}>
            <FiSave size={16} />
            Save Changes
          </button>
        </div>
      </form>

      {/* Notifications Section */}
      <div className={styles.section} style={{ animationDelay: '0.1s' }}>
        <h3 className={styles.sectionTitle}>Notifications</h3>
        <p className={styles.sectionDesc}>Configure how and when you receive alerts.</p>

        <div className={styles.fieldGroup}>
          <div className={styles.toggle}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Email Notifications</span>
              <span className={styles.toggleDesc}>Receive order updates and alerts via email</span>
            </div>
            <div
              className={`${styles.switch} ${emailNotifs ? styles.switchActive : ''}`}
              onClick={() => setEmailNotifs(!emailNotifs)}
            >
              <div className={styles.switchKnob} />
            </div>
          </div>

          <div className={styles.toggle}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Low Stock Alerts</span>
              <span className={styles.toggleDesc}>Get notified when inventory drops below threshold</span>
            </div>
            <div
              className={`${styles.switch} ${lowStockNotifs ? styles.switchActive : ''}`}
              onClick={() => setLowStockNotifs(!lowStockNotifs)}
            >
              <div className={styles.switchKnob} />
            </div>
          </div>

          <div className={styles.toggle}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Order Status Changes</span>
              <span className={styles.toggleDesc}>Notifications when order status is updated</span>
            </div>
            <div
              className={`${styles.switch} ${orderNotifs ? styles.switchActive : ''}`}
              onClick={() => setOrderNotifs(!orderNotifs)}
            >
              <div className={styles.switchKnob} />
            </div>
          </div>
        </div>
      </div>

      {/* System Settings Section */}
      <form onSubmit={handlePreferencesSave} className={styles.section} style={{ animationDelay: '0.2s' }}>
        <h3 className={styles.sectionTitle}>System Preferences</h3>
        <p className={styles.sectionDesc}>Configure system-wide display and formatting options.</p>

        <div className={styles.fieldGroup}>
          <div className={styles.inputRow}>
            <div className={styles.field}>
              <label className={styles.label}>Currency</label>
              <input
                required
                className={styles.input}
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Timezone</label>
              <input
                required
                className={styles.input}
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Low Stock Threshold</label>
            <input
              required
              className={styles.input}
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="Minimum quantity"
            />
          </div>

          <button type="submit" className={styles.saveBtn}>
            <FiSave size={16} />
            Save Preferences
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className={`${styles.section} ${styles.dangerSection}`} style={{ animationDelay: '0.3s' }}>
        <h3 className={styles.sectionTitle} style={{ color: '#f87171' }}>Danger Zone</h3>
        <p className={styles.sectionDesc}>Irreversible actions — proceed with caution.</p>

        <div className={styles.fieldGroup}>
          <div className={styles.toggle}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Reset All Data</span>
              <span className={styles.toggleDesc}>Clear all inventory, orders, and customer data</span>
            </div>
            <button type="button" className={styles.dangerBtn} onClick={handleResetData}>Reset Data</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
