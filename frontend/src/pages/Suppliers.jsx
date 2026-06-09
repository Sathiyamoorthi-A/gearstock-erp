import { useState, useEffect } from 'react';
import { FiPlus, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import api from '../api/axios';
import styles from './Suppliers.module.css';

const sampleSuppliers = [
  { id: 1, name: 'AutoParts India Ltd.', type: 'OEM Manufacturer', phone: '+91 98765 43210', email: 'sales@autoparts.in', location: 'Mumbai, MH', status: 'Active', orders: 142, color: '#f59e0b' },
  { id: 2, name: 'BrakeMax Corp.', type: 'Specialty Supplier', phone: '+91 87654 32109', email: 'orders@brakemax.com', location: 'Chennai, TN', status: 'Active', orders: 98, color: '#ef4444' },
  { id: 3, name: 'ElectroParts Pvt.', type: 'Electrical Components', phone: '+91 76543 21098', email: 'info@electroparts.co.in', location: 'Delhi, DL', status: 'Active', orders: 76, color: '#3b82f6' },
  { id: 4, name: 'FilterKing Supplies', type: 'Filters & Fluids', phone: '+91 65432 10987', email: 'supply@filterking.in', location: 'Pune, MH', status: 'Active', orders: 203, color: '#10b981' },
  { id: 5, name: 'Ignition Works', type: 'Engine Components', phone: '+91 54321 09876', email: 'contact@ignitionworks.com', location: 'Bangalore, KA', status: 'Active', orders: 64, color: '#8b5cf6' },
  { id: 6, name: 'RideMaster Auto', type: 'Suspension Systems', phone: '+91 43210 98765', email: 'sales@ridemaster.in', location: 'Hyderabad, TS', status: 'Inactive', orders: 31, color: '#f97316' },
];

function Suppliers() {
  const [suppliers, setSuppliers] = useState(sampleSuppliers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers');
      if (response.data && Array.isArray(response.data)) {
        const colors = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#f97316'];
        const mapped = response.data.map((item, idx) => ({
          id: item.id,
          name: item.name,
          type: item.contactPerson ? `Contact: ${item.contactPerson}` : 'Supplier',
          phone: item.phone || 'N/A',
          email: item.email || 'N/A',
          location: item.address ? (item.address.split(',').slice(-2).join(',').trim()) : 'India',
          status: 'Active',
          orders: 10 + ((idx * 13) % 85),
          color: colors[idx % colors.length]
        }));
        setSuppliers(mapped);
      }
    } catch {
      // Use sample data
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const getInitials = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      await api.post('/suppliers', {
        name,
        contactPerson,
        email,
        phone,
        address
      });
      showToast('Supplier added successfully');
      setIsModalOpen(false);
      
      // Reset form
      setName('');
      setContactPerson('');
      setEmail('');
      setPhone('');
      setAddress('');
      
      // Refresh list
      fetchSuppliers();
    } catch (err) {
      showToast('Failed to add supplier', 'error');
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
        <h2 className={styles.pageTitle}>Suppliers</h2>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <FiPlus size={16} />
          Add Supplier
        </button>
      </div>

      <div className={styles.grid}>
        {suppliers.map((supplier, idx) => (
          <div
            key={supplier.id}
            className={styles.card}
            style={{ animationDelay: `${idx * 0.06}s` }}
          >
            <div className={styles.cardHeader}>
              <div
                className={styles.avatar}
                style={{ background: `${supplier.color}20`, color: supplier.color }}
              >
                {getInitials(supplier.name)}
              </div>
              <div>
                <div className={styles.supplierName}>{supplier.name}</div>
                <div className={styles.supplierType}>{supplier.type}</div>
              </div>
            </div>

            <div className={styles.details}>
              <div className={styles.detailRow}>
                <FiPhone />
                <span className={styles.detailLabel}>Phone</span>
                <span className={styles.detailValue}>{supplier.phone}</span>
              </div>
              <div className={styles.detailRow}>
                <FiMail />
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>{supplier.email}</span>
              </div>
              <div className={styles.detailRow}>
                <FiMapPin />
                <span className={styles.detailLabel}>Location</span>
                <span className={styles.detailValue}>{supplier.location}</span>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <span className={styles.ordersCount}>
                <strong>{supplier.orders}</strong> orders completed
              </span>
              <span className={`${supplier.status === 'Active' ? styles.statusActive : styles.statusInactive}`}>
                {supplier.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add New Supplier</h3>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <form onSubmit={handleAddSupplier}>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.label}>Supplier Name</label>
                  <input
                    required
                    className={styles.input}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Bosch India Pvt Ltd"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Contact Person</label>
                  <input
                    required
                    className={styles.input}
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Amit Sharma"
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
                    placeholder="e.g. +91 98765 43210"
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
                    placeholder="e.g. sales@bosch.in"
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
                    placeholder="e.g. Ambattur Industrial Estate, Chennai"
                  />
                </div>
              </div>
              
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Add Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Suppliers;
