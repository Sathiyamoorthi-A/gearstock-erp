import { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiX, FiMapPin } from 'react-icons/fi';
import { HiBuildingOffice2 } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import {
  getAllWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getWarehouseStocks,
  updateWarehouseStock
} from '../api/warehouses';
import { getAllParts } from '../api/inventory';
import styles from './Warehouses.module.css';

function Warehouses() {
  const { user } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState('');
  
  // Stock Drawer State
  const [selectedWh, setSelectedWh] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [isStockDrawerOpen, setIsStockDrawerOpen] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState('');
  const [adjustQuantity, setAdjustQuantity] = useState('');

  // Warehouse CRUD Modals
  const [isWhModalOpen, setIsWhModalOpen] = useState(false);
  const [whModalType, setWhModalType] = useState('add'); // 'add' or 'edit'
  const [selectedWhData, setSelectedWhData] = useState(null);
  const [whName, setWhName] = useState('');
  const [whCode, setWhCode] = useState('');
  const [whAddress, setWhAddress] = useState('');
  const [whActive, setWhActive] = useState(true);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const isEditor = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_WAREHOUSE_MGR';

  const fetchWarehouses = async () => {
    try {
      const data = await getAllWarehouses();
      if (data && Array.isArray(data)) {
        setWarehouses(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchParts = async () => {
    try {
      const data = await getAllParts();
      if (data && Array.isArray(data)) {
        setParts(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWarehouses();
    fetchParts();
  }, []);

  const handleOpenStocks = async (wh) => {
    setSelectedWh(wh);
    setIsStockDrawerOpen(true);
    try {
      const stockData = await getWarehouseStocks(wh.id);
      setStocks(stockData || []);
    } catch (err) {
      showToast('Failed to load warehouse stocks', 'error');
    }
  };

  const handleAdjustStockSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPartId || adjustQuantity === '') return;
    try {
      await updateWarehouseStock(selectedWh.id, Number(selectedPartId), Number(adjustQuantity));
      showToast('Warehouse stock adjusted successfully');
      
      // Reload stocks
      const stockData = await getWarehouseStocks(selectedWh.id);
      setStocks(stockData || []);
      
      // Reset input
      setSelectedPartId('');
      setAdjustQuantity('');
    } catch (err) {
      showToast('Failed to adjust stock', 'error');
    }
  };

  const openAddWhModal = () => {
    setWhModalType('add');
    setSelectedWhData(null);
    setWhName('');
    setWhCode('');
    setWhAddress('');
    setWhActive(true);
    setIsWhModalOpen(true);
  };

  const openEditWhModal = (wh) => {
    setWhModalType('edit');
    setSelectedWhData(wh);
    setWhName(wh.name);
    setWhCode(wh.code);
    setWhAddress(wh.address || '');
    setWhActive(wh.active);
    setIsWhModalOpen(true);
  };

  const handleWhSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: whName,
      code: whCode,
      address: whAddress,
      active: whActive
    };

    try {
      if (whModalType === 'add') {
        await createWarehouse(payload);
        showToast('Warehouse created successfully');
      } else {
        await updateWarehouse(selectedWhData.id, payload);
        showToast('Warehouse updated successfully');
      }
      setIsWhModalOpen(false);
      fetchWarehouses();
    } catch (err) {
      showToast('Operation failed', 'error');
    }
  };

  const handleDeleteWh = async (id) => {
    if (window.confirm('Are you sure you want to delete this warehouse? All stock records will be removed.')) {
      try {
        await deleteWarehouse(id);
        showToast('Warehouse deleted successfully');
        fetchWarehouses();
      } catch (err) {
        showToast('Failed to delete warehouse', 'error');
      }
    }
  };

  const filtered = warehouses.filter(wh => {
    const q = search.toLowerCase();
    return (
      wh.name.toLowerCase().includes(q) ||
      wh.code.toLowerCase().includes(q) ||
      (wh.address && wh.address.toLowerCase().includes(q))
    );
  });

  return (
    <div className={styles.page}>
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
          <span className={styles.toastText}>{toast.message}</span>
        </div>
      )}

      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Warehouse Management</h2>
          <p className={styles.pageSubtitle}>Track stock distribution, create storage locations, and manage inventory allocations.</p>
        </div>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search warehouses..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {isEditor && (
            <button className={styles.addBtn} onClick={openAddWhModal}>
              <FiPlus size={16} />
              Add Warehouse
            </button>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map(wh => (
          <div key={wh.id} className={styles.whCard}>
            <div>
              <div className={styles.whHeader}>
                <div className={styles.whInfo}>
                  <div className={styles.whIcon}>
                    <HiBuildingOffice2 />
                  </div>
                  <div>
                    <h4 className={styles.whName}>{wh.name}</h4>
                    <span className={styles.whCode}>{wh.code}</span>
                  </div>
                </div>
                <span className={`${styles.badge} ${wh.active ? styles.activeBadge : styles.inactiveBadge}`}>
                  {wh.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className={styles.whAddress}>
                <FiMapPin style={{ marginRight: 6, verticalAlign: 'middle', color: 'var(--text-muted)' }} />
                {wh.address || 'No address specified'}
              </p>
            </div>
            
            <div className={styles.whActions}>
              <button className={styles.viewStockBtn} onClick={() => handleOpenStocks(wh)}>
                View Stock Details
              </button>
              {isEditor && (
                <div className={styles.actionLeft}>
                  <button className={`${styles.iconBtn} ${styles.editBtn}`} onClick={() => openEditWhModal(wh)} title="Edit Warehouse">
                    <FiEdit2 size={14} />
                  </button>
                  <button className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteWh(wh.id)} title="Delete Warehouse">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No warehouses found.
          </div>
        )}
      </div>

      {/* Stock Drawer */}
      {isStockDrawerOpen && selectedWh && (
        <div className={styles.modalOverlay} onClick={() => setIsStockDrawerOpen(false)}>
          <div className={`${styles.modal} ${styles.drawer}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>Stock Details — {selectedWh.name}</h3>
                <span className={styles.whCode}>{selectedWh.code}</span>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsStockDrawerOpen(false)}>
                <FiX />
              </button>
            </div>

            <div className={styles.drawerContent}>
              {/* Adjust Stock Form (Managers only) */}
              {isEditor && (
                <form onSubmit={handleAdjustStockSubmit} className={styles.stockForm}>
                  <div className={styles.stockFormGroup}>
                    <label className={styles.label}>Select Part</label>
                    <select
                      required
                      className={styles.select}
                      value={selectedPartId}
                      onChange={(e) => setSelectedPartId(e.target.value)}
                    >
                      <option value="">-- Select Product --</option>
                      {parts.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.sku} - {p.name} (Available: {p.quantity})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.stockFormGroup} style={{ maxWidth: 120 }}>
                    <label className={styles.label}>Set Quantity</label>
                    <input
                      required
                      type="number"
                      min="0"
                      placeholder="Qty"
                      className={styles.input}
                      value={adjustQuantity}
                      onChange={(e) => setAdjustQuantity(e.target.value)}
                    />
                  </div>
                  <button type="submit" className={styles.submitBtn} style={{ padding: '10px 16px' }}>
                    Adjust
                  </button>
                </form>
              )}

              {/* Stock Table */}
              <div className={styles.stockTableCard}>
                <table className={styles.stockTable}>
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Part Description</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map(st => (
                      <tr key={st.id}>
                        <td>
                          <span className={styles.partSku}>{st.part?.sku || 'N/A'}</span>
                        </td>
                        <td>
                          <div className={styles.partName}>{st.part?.name || 'Unknown Part'}</div>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{st.part?.categoryName}</span>
                        </td>
                        <td>
                          <span className={styles.partQty} style={{ color: st.quantity <= (st.part?.reorderLevel || 10) ? 'var(--status-returned)' : 'var(--text-primary)' }}>
                            {st.quantity}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {stocks.length === 0 && (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                          No stock allocated to this warehouse yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warehouse CRUD Modal */}
      {isWhModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsWhModalOpen(false)}>
          <form onSubmit={handleWhSubmit} className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {whModalType === 'add' ? 'Add New Warehouse' : 'Edit Warehouse'}
              </h3>
              <button type="button" className={styles.closeBtn} onClick={() => setIsWhModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.field}>
                <label className={styles.label}>Warehouse Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Chennai Distribution Hub"
                  className={styles.input}
                  value={whName}
                  onChange={(e) => setWhName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Warehouse Code</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. WH-MAA-04"
                  className={styles.input}
                  value={whCode}
                  onChange={(e) => setWhCode(e.target.value)}
                  disabled={whModalType === 'edit'}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Address / Location</label>
                <textarea
                  required
                  placeholder="Enter location address details..."
                  className={styles.textarea}
                  value={whAddress}
                  onChange={(e) => setWhAddress(e.target.value)}
                />
              </div>

              <label className={`${styles.field} ${styles.checkboxField}`}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={whActive}
                  onChange={(e) => setWhActive(e.target.checked)}
                />
                <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Location is Active</span>
              </label>
            </div>

            <div className={styles.modalActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setIsWhModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn}>
                {whModalType === 'add' ? 'Create Location' : 'Save Details'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Warehouses;
