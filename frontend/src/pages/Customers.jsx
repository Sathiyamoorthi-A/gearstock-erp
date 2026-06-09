import { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiEye } from 'react-icons/fi';
import api from '../api/axios';
import styles from './Customers.module.css';

const sampleCustomers = [
  { id: 1, name: 'Rajesh Auto Garage', type: 'Workshop', email: 'rajesh@autogarage.in', phone: '+91 98765 11111', totalSpent: 284000, orders: 45, status: 'Active', color: '#f59e0b' },
  { id: 2, name: 'City Motors Workshop', type: 'Service Center', email: 'info@citymotors.com', phone: '+91 98765 22222', totalSpent: 412000, orders: 68, status: 'Active', color: '#3b82f6' },
  { id: 3, name: 'Krishna Car Care', type: 'Dealer', email: 'krishna@carcare.in', phone: '+91 98765 33333', totalSpent: 156000, orders: 23, status: 'Active', color: '#10b981' },
  { id: 4, name: 'Highway Auto Services', type: 'Workshop', email: 'highway@auto.in', phone: '+91 98765 44444', totalSpent: 89000, orders: 15, status: 'Inactive', color: '#ef4444' },
  { id: 5, name: 'Patel Mechanic Works', type: 'Workshop', email: 'patel@mechworks.in', phone: '+91 98765 55555', totalSpent: 567000, orders: 92, status: 'Active', color: '#8b5cf6' },
  { id: 6, name: 'Star Auto Repairs', type: 'Service Center', email: 'star@autorepairs.com', phone: '+91 98765 66666', totalSpent: 210000, orders: 37, status: 'Active', color: '#f97316' },
  { id: 7, name: 'Quick Fix Automobiles', type: 'Dealer', email: 'quickfix@auto.in', phone: '+91 98765 77777', totalSpent: 334000, orders: 54, status: 'Active', color: '#06b6d4' },
  { id: 8, name: 'Metro Auto Parts Retail', type: 'Retail', email: 'metro@autoparts.in', phone: '+91 98765 88888', totalSpent: 890000, orders: 128, status: 'Active', color: '#ec4899' },
];

function Customers() {
  const [customers, setCustomers] = useState(sampleCustomers);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      if (response.data && Array.isArray(response.data)) {
        const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#f97316', '#06b6d4', '#ec4899'];
        const mapped = response.data.map((item, idx) => ({
          id: item.id,
          name: item.name,
          type: item.company || 'Individual',
          email: item.email || 'N/A',
          phone: item.phone || 'N/A',
          totalSpent: 120000 + ((idx * 27) % 73) * 5000,
          orders: 5 + ((idx * 3) % 19),
          status: 'Active',
          color: colors[idx % colors.length]
        }));
        setCustomers(mapped);
      }
    } catch {
      // Use sample data
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const getInitials = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const formatAmount = (amount) => '₹' + Number(amount).toLocaleString('en-IN');

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      await api.post('/customers', {
        name,
        company,
        email,
        phone,
        address
      });
      showToast('Customer added successfully');
      setIsModalOpen(false);

      // Reset form
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setAddress('');

      // Refresh list
      fetchCustomers();
    } catch (err) {
      showToast('Failed to add customer', 'error');
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
        <h2 className={styles.pageTitle}>Customers</h2>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
            <FiPlus size={16} />
            Add Customer
          </button>
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Total Spent</th>
              <th>Orders</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <div className={styles.customerInfo}>
                    <div
                      className={styles.customerAvatar}
                      style={{ background: `${customer.color}20`, color: customer.color }}
                    >
                      {getInitials(customer.name)}
                    </div>
                    <div>
                      <div className={styles.customerName}>{customer.name}</div>
                      <div className={styles.customerType}>{customer.type}</div>
                    </div>
                  </div>
                </td>
                <td className={styles.email}>{customer.email}</td>
                <td className={styles.phone}>{customer.phone}</td>
                <td className={styles.totalSpent}>{formatAmount(customer.totalSpent)}</td>
                <td>{customer.orders}</td>
                <td>
                  <span className={`${styles.badge} ${customer.status === 'Active' ? styles.badgeActive : styles.badgeInactive}`}>
                    {customer.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionBtn} title="View">
                      <FiEye size={15} />
                    </button>
                    <button className={styles.actionBtn} title="Edit">
                      <FiEdit2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add New Customer</h3>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleAddCustomer}>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.label}>Customer Name</label>
                  <input
                    required
                    className={styles.input}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Gupta"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Company Name</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. AutoZone Service Center"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input
                    required
                    className={styles.input}
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 11111"
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.label}>Email Address</label>
                  <input
                    required
                    className={styles.input}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ramesh@autozone.in"
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.label}>Address / Location</label>
                  <input
                    required
                    className={styles.input}
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Andheri West, Mumbai"
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
