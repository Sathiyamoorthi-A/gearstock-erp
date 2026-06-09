import { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { HiCube } from 'react-icons/hi2';
import { getAllParts, createPart, updatePart, deletePart } from '../api/inventory';
import api from '../api/axios';
import styles from './Inventory.module.css';

const sampleParts = [
  { id: 1, sku: 'SKU-TB-4421', name: 'Timing Belt Kit — Premium', description: 'Premium timing belt kit', category: 'Engine Parts', qty: 3, reorderLevel: 5, price: 2450, costPrice: 1600, supplier: 'AutoParts India Ltd.' },
  { id: 2, sku: 'SKU-BC-1102', name: 'Brake Caliper — Front Left', description: 'Front brake caliper', category: 'Brakes', qty: 5, reorderLevel: 5, price: 3800, costPrice: 2500, supplier: 'BrakeMax Corp.' },
  { id: 3, sku: 'SKU-SP-8834', name: 'Spark Plug Set — Iridium', description: 'Set of iridium spark plugs', category: 'Engine Parts', qty: 7, reorderLevel: 10, price: 1200, costPrice: 800, supplier: 'Ignition Works' },
];

const categoriesList = ['Engine', 'Electrical', 'Brakes', 'Suspension', 'Body', 'Oils & Fluids'];

function Inventory() {
  const [parts, setParts] = useState(sampleParts);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [selectedPart, setSelectedPart] = useState(null);

  // Form State
  const [formSku, setFormSku] = useState('');
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState('Engine');
  const [formQty, setFormQty] = useState(0);
  const [formReorder, setFormReorder] = useState(10);
  const [formPrice, setFormPrice] = useState(0);
  const [formCost, setFormCost] = useState(0);
  const [formSupplier, setFormSupplier] = useState('Bosch India Pvt Ltd');

  // Lists from DB
  const [suppliersList, setSuppliersList] = useState([]);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchSuppliersList = async () => {
      try {
        const response = await api.get('/suppliers');
        if (response.data && Array.isArray(response.data)) {
          setSuppliersList(response.data.map(s => s.name));
        }
      } catch (err) {
        setSuppliersList([
          'Bosch India Pvt Ltd',
          'NGK Spark Plugs India',
          'Brembo Brake Systems',
          'Monroe India',
          'Denso Corporation',
          'Mahle Filter Systems',
          'Valeo India',
          'Exide Industries'
        ]);
      }
    };
    fetchSuppliersList();
  }, []);

  useEffect(() => {
    const fetchParts = async () => {
      setLoading(true);
      try {
        const data = await getAllParts(search);
        if (data && Array.isArray(data)) {
          const mapped = data.map(item => ({
            id: item.id,
            sku: item.sku,
            name: item.name,
            description: item.description || '',
            category: item.categoryName || 'Uncategorized',
            qty: item.quantity,
            reorderLevel: item.reorderLevel !== undefined ? item.reorderLevel : 10,
            price: item.price,
            costPrice: item.costPrice || 0,
            supplier: item.supplierName || 'N/A'
          }));
          setParts(mapped);
        }
      } catch {
        // Fallback to sample data
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchParts, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openAddModal = () => {
    setModalType('add');
    setSelectedPart(null);
    setFormSku('');
    setFormName('');
    setFormDesc('');
    setFormCategory('Engine');
    setFormQty(0);
    setFormReorder(10);
    setFormPrice(0);
    setFormCost(0);
    setFormSupplier(suppliersList[0] || 'Bosch India Pvt Ltd');
    setIsModalOpen(true);
  };

  const openEditModal = (part) => {
    setModalType('edit');
    setSelectedPart(part);
    setFormSku(part.sku);
    setFormName(part.name);
    setFormDesc(part.description || '');
    setFormCategory(part.category === 'Uncategorized' ? 'Engine' : part.category);
    setFormQty(part.qty);
    setFormReorder(part.reorderLevel);
    setFormPrice(part.price);
    setFormCost(part.costPrice);
    setFormSupplier(part.supplier === 'N/A' ? (suppliersList[0] || 'Bosch India Pvt Ltd') : part.supplier);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      try {
        await deletePart(id);
        setParts(prev => prev.filter(p => p.id !== id));
        showToast('Part deleted successfully');
      } catch (err) {
        showToast('Failed to delete part', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      sku: formSku,
      name: formName,
      description: formDesc,
      categoryName: formCategory,
      quantity: Number(formQty),
      reorderLevel: Number(formReorder),
      price: Number(formPrice),
      costPrice: Number(formCost),
      supplierName: formSupplier
    };

    try {
      if (modalType === 'add') {
        const newPart = await createPart(payload);
        setParts(prev => [
          ...prev,
          {
            id: newPart.id,
            sku: newPart.sku,
            name: newPart.name,
            description: newPart.description || '',
            category: newPart.categoryName || 'Uncategorized',
            qty: newPart.quantity,
            reorderLevel: newPart.reorderLevel,
            price: newPart.price,
            costPrice: newPart.costPrice,
            supplier: newPart.supplierName || 'N/A'
          }
        ]);
        showToast('Part added successfully');
      } else {
        const updated = await updatePart(selectedPart.id, payload);
        setParts(prev => prev.map(p => p.id === selectedPart.id ? {
          id: updated.id,
          sku: updated.sku,
          name: updated.name,
          description: updated.description || '',
          category: updated.categoryName || 'Uncategorized',
          qty: updated.quantity,
          reorderLevel: updated.reorderLevel,
          price: updated.price,
          costPrice: updated.costPrice,
          supplier: updated.supplierName || 'N/A'
        } : p));
        showToast('Part updated successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast('Failed to save part details', 'error');
    }
  };

  const filteredParts = parts.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const formatPrice = (price) => '₹' + Number(price).toLocaleString('en-IN');

  return (
    <div className={styles.page}>
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
          <span className={styles.toastText}>{toast.message}</span>
        </div>
      )}

      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Inventory Management</h2>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search parts, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className={styles.addBtn} onClick={openAddModal}>
            <FiPlus size={16} />
            Add Part
          </button>
        </div>
      </div>

      <div className={styles.tableCard}>
        {filteredParts.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Part Name</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Supplier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParts.map((part) => (
                <tr key={part.id}>
                  <td className={styles.sku}>{part.sku}</td>
                  <td className={styles.partName}>{part.name}</td>
                  <td>
                    <span className={styles.category}>{part.category}</span>
                  </td>
                  <td>
                    <span className={`${styles.qty} ${part.qty <= part.reorderLevel ? styles.qtyLow : styles.qtyOk}`}>
                      {part.qty}
                    </span>
                  </td>
                  <td className={styles.price}>{formatPrice(part.price)}</td>
                  <td className={styles.supplier}>{part.supplier}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={`${styles.actionBtn} ${styles.editBtn}`} title="Edit" onClick={() => openEditModal(part)}>
                        <FiEdit2 size={15} />
                      </button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete" onClick={() => handleDelete(part.id)}>
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <HiCube className={styles.emptyIcon} />
            <p className={styles.emptyText}>No parts found</p>
            <p className={styles.emptySubtext}>Try adjusting your search or add a new part</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {modalType === 'add' ? 'Add New Part' : 'Edit Part Details'}
              </h3>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>SKU Code</label>
                  <input
                    required
                    className={styles.input}
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="e.g. BSH-ALT-1490"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Part Name</label>
                  <input
                    required
                    className={styles.input}
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Bosch Alternator"
                  />
                </div>
                
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    className={styles.textarea}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Enter part description and details..."
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <select
                    className={styles.select}
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                  >
                    {categoriesList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Supplier</label>
                  <select
                    className={styles.select}
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                  >
                    {suppliersList.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Quantity in Stock</label>
                  <input
                    required
                    min="0"
                    className={styles.input}
                    type="number"
                    value={formQty}
                    onChange={(e) => setFormQty(e.target.value)}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Reorder Level</label>
                  <input
                    required
                    min="0"
                    className={styles.input}
                    type="number"
                    value={formReorder}
                    onChange={(e) => setFormReorder(e.target.value)}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Selling Price (₹)</label>
                  <input
                    required
                    min="0"
                    className={styles.input}
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cost Price (₹)</label>
                  <input
                    required
                    min="0"
                    className={styles.input}
                    type="number"
                    value={formCost}
                    onChange={(e) => setFormCost(e.target.value)}
                  />
                </div>
              </div>
              
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {modalType === 'add' ? 'Add Part' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
