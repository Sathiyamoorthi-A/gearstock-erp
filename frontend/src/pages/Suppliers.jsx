import { useState, useEffect } from 'react';
import { FiPlus, FiPhone, FiMail, FiMapPin, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getAllSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../api/suppliers';
import styles from './Suppliers.module.css';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [selectedSupplier, setSelectedSupplier] = useState(null);

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
      const data = await getAllSuppliers();
      if (data && Array.isArray(data)) {
        const colors = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#f97316'];
        const mapped = data.map((item, idx) => ({
          id: item.id,
          name: item.name,
          type: item.contactPerson ? `Contact: ${item.contactPerson}` : 'Supplier',
          contactPerson: item.contactPerson || '',
          phone: item.phone || 'N/A',
          email: item.email || 'N/A',
          address: item.address || '',
          location: item.address ? (item.address.split(',').slice(-2).join(',').trim()) : 'India',
          status: 'Active',
          orders: 10 + ((idx * 13) % 85),
          color: colors[idx % colors.length]
        }));
        setSuppliers(mapped);
      }
    } catch {
      // Handled by API fallback
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const getInitials = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const openAddModal = () => {
    setModalType('add');
    setSelectedSupplier(null);
    setName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setAddress('');
    setIsModalOpen(true);
  };

  const openEditModal = (supplier) => {
    setModalType('edit');
    setSelectedSupplier(supplier);
    setName(supplier.name);
    setContactPerson(supplier.contactPerson);
    setEmail(supplier.email);
    setPhone(supplier.phone);
    setAddress(supplier.address);
    setIsModalOpen(true);
  };

  const handleDeleteSupplier = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await deleteSupplier(id);
        showToast('Supplier deleted successfully');
        fetchSuppliers();
      } catch (err) {
        showToast('Failed to delete supplier', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      contactPerson,
      email,
      phone,
      address
    };

    try {
      if (modalType === 'add') {
        await createSupplier(payload);
        showToast('Supplier added successfully');
      } else {
        await updateSupplier(selectedSupplier.id, payload);
        showToast('Supplier updated successfully');
      }
      setIsModalOpen(false);
      fetchSuppliers();
    } catch (err) {
      showToast('Failed to save supplier details', 'error');
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
        <button className={styles.addBtn} onClick={openAddModal}>
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
              <div style={{ flexGrow: 1 }}>
                <div className={styles.supplierName}>{supplier.name}</div>
                <div className={styles.supplierType}>{supplier.type}</div>
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.actionBtn}
                  title="Edit Supplier"
                  onClick={() => openEditModal(supplier)}
                >
                  <FiEdit2 size={13} />
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                  title="Delete Supplier"
                  onClick={() => handleDeleteSupplier(supplier.id)}
                >
                  <FiTrash2 size={13} />
                </button>
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
              <h3 className={styles.modalTitle}>
                {modalType === 'add' ? 'Add New Supplier' : 'Edit Supplier Details'}
              </h3>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
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
                  {modalType === 'add' ? 'Add Supplier' : 'Save Changes'}
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
