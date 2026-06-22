import { useState, useEffect, useRef } from 'react';
import { FiPlus, FiTrash2, FiSearch, FiEdit2, FiXCircle } from 'react-icons/fi';
import { HiClipboardDocumentList } from 'react-icons/hi2';
import { getAllOrders, createOrder, updateOrderStatus, updateOrder, getOrderById } from '../api/orders';
import { getAllSuppliers } from '../api/suppliers';
import { getAllParts } from '../api/inventory';
import styles from './PurchaseOrders.module.css';

const statusMap = {
  'DELIVERED': styles.badgeDelivered,
  'IN_TRANSIT': styles.badgeTransit,
  'PENDING': styles.badgePending,
  'APPROVED': styles.badgeApproved,
  'CANCELLED': styles.badgeCancelled,
};

function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  const [partsList, setPartsList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  // New PO Form State
  const [supplierId, setSupplierId] = useState('');
  const [supplierSearch, setSupplierSearch] = useState('');
  const [showSupplierSuggestions, setShowSupplierSuggestions] = useState(false);
  const [activeSupplierSuggestionIndex, setActiveSupplierSuggestionIndex] = useState(0);

  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([]);

  // Refs for keyboard navigation and focus management
  const supplierInputRef = useRef(null);
  const partInputRefs = useRef([]);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders('PURCHASE');
      if (data && Array.isArray(data)) {
        const mapped = data.map(item => ({
          id: item.orderNumber || `#PO-${item.id}`,
          realId: item.id,
          supplier: item.supplier ? item.supplier.name : 'N/A',
          supplierId: item.supplier ? item.supplier.id : null,
          items: item.items ? item.items.length : 0,
          rawItems: item.items || [],
          total: item.totalAmount || 0,
          date: item.createdAt ? item.createdAt.substring(0, 10) : 'N/A',
          status: item.status,
          notes: item.notes || ''
        }));
        setOrders(mapped);
      }
    } catch (err) {
      console.error('Error fetching orders', err);
    }
  };

  const loadDependencies = async () => {
    try {
      const [suppliersData, partsData] = await Promise.all([
        getAllSuppliers(),
        getAllParts()
      ]);
      setSuppliersList(suppliersData || []);
      setPartsList(partsData || []);
    } catch (err) {
      console.warn('Error loading purchase order dependencies', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    loadDependencies();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      showToast('Failed to update order status', 'error');
    }
  };

  const handleOpenModal = () => {
    setEditingOrder(null);
    setNotes('');
    setSupplierId('');
    setSupplierSearch('');
    setShowSupplierSuggestions(false);
    setActiveSupplierSuggestionIndex(0);
    setItems([{
      partId: '',
      quantity: 1,
      unitPrice: 0,
      partSearchQuery: '',
      showSuggestions: false,
      activeSuggestionIndex: 0
    }]);
    setIsModalOpen(true);
    setTimeout(() => {
      if (supplierInputRef.current) {
        supplierInputRef.current.focus();
      }
    }, 100);
  };

  const handleEditOrder = async (order) => {
    try {
      const fullOrder = await getOrderById(order.realId);
      if (!fullOrder) {
        showToast('Could not load order details', 'error');
        return;
      }
      setEditingOrder(fullOrder);
      setNotes(fullOrder.notes || '');
      setSupplierId(fullOrder.supplier ? fullOrder.supplier.id : '');
      setSupplierSearch(fullOrder.supplier ? fullOrder.supplier.name : '');
      setShowSupplierSuggestions(false);
      setActiveSupplierSuggestionIndex(0);

      const loadedItems = (fullOrder.items || []).map(it => ({
        partId: it.part ? it.part.id : '',
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        partSearchQuery: it.part ? `${it.part.sku} — ${it.part.name}` : '',
        showSuggestions: false,
        activeSuggestionIndex: 0
      }));
      setItems(loadedItems.length > 0 ? loadedItems : [{
        partId: '', quantity: 1, unitPrice: 0, partSearchQuery: '', showSuggestions: false, activeSuggestionIndex: 0
      }]);
      setIsModalOpen(true);
    } catch (err) {
      showToast('Failed to load order for editing', 'error');
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'CANCELLED');
      showToast('Order cancelled successfully');
      setIsModalOpen(false);
      setEditingOrder(null);
      fetchOrders();
    } catch (err) {
      showToast('Failed to cancel order', 'error');
    }
  };

  const isEditable = editingOrder ? editingOrder.status === 'PENDING' : true;
  const canCancel = editingOrder && ['PENDING', 'APPROVED'].includes(editingOrder.status);

  const handleAddItemRow = () => {
    setItems(prev => [
      ...prev,
      {
        partId: '',
        quantity: 1,
        unitPrice: 0,
        partSearchQuery: '',
        showSuggestions: false,
        activeSuggestionIndex: 0
      }
    ]);
    // Focus the new line's input
    setTimeout(() => {
      const newIndex = items.length; // items.length evaluates to current length before set state merges
      if (partInputRefs.current[newIndex]) {
        partInputRefs.current[newIndex].focus();
      }
    }, 50);
  };

  const handleRemoveItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Autocomplete filter helpers
  const getFilteredSuppliers = () => {
    if (!supplierSearch) return suppliersList;
    const q = supplierSearch.toLowerCase();
    return suppliersList.filter(s => s.name.toLowerCase().includes(q));
  };

  const getFilteredParts = (query) => {
    if (!query) return [];
    const q = query.toLowerCase();
    return partsList.filter(p => p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q));
  };

  // Suppliers Keydown logic
  const handleSupplierKeyDown = (e) => {
    const filtered = getFilteredSuppliers();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSupplierSuggestionIndex(prev => 
        prev < filtered.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSupplierSuggestionIndex(prev => 
        prev > 0 ? prev - 1 : prev
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[activeSupplierSuggestionIndex]) {
        const selected = filtered[activeSupplierSuggestionIndex];
        setSupplierId(selected.id);
        setSupplierSearch(selected.name);
        setShowSupplierSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSupplierSuggestions(false);
    }
  };

  // Parts Keyboard Handlers
  const handlePartSearchChange = (index, value) => {
    setItems(items.map((it, i) => i === index ? {
      ...it,
      partSearchQuery: value,
      partId: '', // Reset if user changes selection
      unitPrice: 0,
      showSuggestions: true,
      activeSuggestionIndex: 0
    } : it));
  };

  const handlePartSearchKeyDown = (index, e) => {
    const item = items[index];
    const filtered = getFilteredParts(item.partSearchQuery);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setItems(items.map((it, i) => i === index ? {
        ...it,
        activeSuggestionIndex: it.activeSuggestionIndex < filtered.length - 1 
          ? it.activeSuggestionIndex + 1 
          : it.activeSuggestionIndex
      } : it));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setItems(items.map((it, i) => i === index ? {
        ...it,
        activeSuggestionIndex: it.activeSuggestionIndex > 0 
          ? it.activeSuggestionIndex - 1 
          : it.activeSuggestionIndex
      } : it));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[item.activeSuggestionIndex]) {
        const selected = filtered[item.activeSuggestionIndex];
        handleSelectPart(index, selected);
      }
    } else if (e.key === 'Escape') {
      setItems(items.map((it, i) => i === index ? { ...it, showSuggestions: false } : it));
    }
  };

  const handleSelectPart = (index, part) => {
    setItems(items.map((it, i) => i === index ? {
      ...it,
      partId: part.id,
      partSearchQuery: `${part.sku} — ${part.name}`,
      unitPrice: part.costPrice || part.price || 0, // PO: prefill cost price
      showSuggestions: false
    } : it));
  };

  const handleItemFieldChange = (index, field, value) => {
    setItems(items.map((it, i) => i === index ? {
      ...it,
      [field]: Number(value)
    } : it));
  };

  // Global hotkeys inside the modal
  const handleModalKeyDown = (e) => {
    // Alt + A to add part line
    if (e.altKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      handleAddItemRow();
    }
    // Ctrl + Enter to submit form
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Grand Total Calculation
  const grandTotal = items.reduce((sum, it) => sum + (it.quantity * it.unitPrice), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditable) return;
    if (!supplierId) {
      showToast('Please select a valid supplier from suggestions list', 'error');
      return;
    }
    const invalidItems = items.filter(it => !it.partId);
    if (invalidItems.length > 0) {
      showToast('Please select a valid part SKU/name for all rows', 'error');
      return;
    }

    const payload = {
      orderType: 'PURCHASE',
      status: 'PENDING',
      notes,
      totalAmount: grandTotal,
      supplier: { id: Number(supplierId) },
      items: items.map(it => ({
        part: { id: Number(it.partId) },
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice)
      }))
    };

    try {
      if (editingOrder) {
        await updateOrder(editingOrder.id, payload);
        showToast('Purchase Order updated successfully');
      } else {
        await createOrder(payload);
        showToast('Purchase Order created successfully');
      }
      setIsModalOpen(false);
      setEditingOrder(null);
      fetchOrders();
    } catch (err) {
      showToast(editingOrder ? 'Failed to update purchase order' : 'Failed to create purchase order', 'error');
    }
  };

  const formatAmount = (amount) => '₹' + Number(amount).toLocaleString('en-IN');

  const filteredSuppliersList = getFilteredSuppliers();

  return (
    <div className={styles.page}>
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
          <span className={styles.toastText}>{toast.message}</span>
        </div>
      )}

      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Purchase Orders</h2>
        <div className={styles.controls}>
          <button className={styles.createBtn} onClick={handleOpenModal}>
            <FiPlus size={16} />
            New PO
          </button>
        </div>
      </div>

      <div className={styles.tableCard}>
        {orders.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Supplier</th>
                <th>Items Count</th>
                <th>Total Value</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className={styles.orderId}>{order.id}</td>
                  <td>{order.supplier}</td>
                  <td>{order.items} items</td>
                  <td className={styles.amount}>{formatAmount(order.total)}</td>
                  <td className={styles.date}>{order.date}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${statusMap[order.status] || styles.badgePending}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEditOrder(order)}
                        title={order.status === 'PENDING' ? 'Edit Order' : 'View Order'}
                      >
                        <FiEdit2 size={14} />
                      </button>
                      {['PENDING', 'APPROVED'].includes(order.status) && (
                        <button
                          className={styles.cancelOrderBtn}
                          onClick={() => handleCancelOrder(order.realId)}
                          title="Cancel Order"
                        >
                          <FiXCircle size={14} />
                        </button>
                      )}
                      <select
                        className={styles.statusSelect}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.realId || order.id, e.target.value)}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="IN_TRANSIT">IN TRANSIT</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <HiClipboardDocumentList className={styles.emptyIcon} />
            <p className={styles.emptyText}>No purchase orders found</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onKeyDown={handleModalKeyDown}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingOrder ? `Edit Purchase Order ${editingOrder.orderNumber || '#PO-' + editingOrder.id}` : 'Create Purchase Order'}
                {editingOrder && !isEditable && <span className={styles.readOnlyBadge}>Read Only</span>}
              </h3>
              <button className={styles.closeBtn} onClick={() => { setIsModalOpen(false); setEditingOrder(null); }}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Supplier Lookup</label>
                  <div className={styles.autocompleteContainer}>
                    <div className={styles.lookupInputWrapper}>
                      <FiSearch className={styles.lookupIcon} />
                      <input
                        ref={supplierInputRef}
                        required
                        type="text"
                        disabled={!isEditable}
                        className={styles.inputLookup}
                        placeholder="Type supplier name..."
                        value={supplierSearch}
                        onChange={(e) => {
                          setSupplierSearch(e.target.value);
                          setSupplierId(''); // Clear selected ID
                          setShowSupplierSuggestions(true);
                          setActiveSupplierSuggestionIndex(0);
                        }}
                        onFocus={() => isEditable && setShowSupplierSuggestions(true)}
                        onBlur={() => {
                          // Delay to permit option selection click
                          setTimeout(() => setShowSupplierSuggestions(false), 200);
                        }}
                        onKeyDown={handleSupplierKeyDown}
                      />
                    </div>
                    {isEditable && showSupplierSuggestions && (
                      <ul className={styles.suggestionsList}>
                        {filteredSuppliersList.map((s, idx) => (
                          <li
                            key={s.id}
                            className={`${styles.suggestionItem} ${idx === activeSupplierSuggestionIndex ? styles.suggestionItemActive : ''}`}
                            onMouseDown={() => {
                              setSupplierId(s.id);
                              setSupplierSearch(s.name);
                              setShowSupplierSuggestions(false);
                            }}
                          >
                            <div className={styles.suggestionName}>{s.name}</div>
                            <div className={styles.suggestionSub}>{s.contactPerson || 'N/A'} — {s.phone || 'N/A'}</div>
                          </li>
                        ))}
                        {filteredSuppliersList.length === 0 && (
                          <li className={styles.suggestionNoMatch}>No suppliers found</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Notes</label>
                  <input
                    className={styles.input}
                    type="text"
                    disabled={!isEditable}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Restock electrical, urgent shipment"
                  />
                </div>
              </div>

              <div className={styles.itemsSection}>
                <div className={styles.sectionHeader}>
                  <h4 className={styles.label}>Parts / Order Items</h4>
                  {isEditable && (
                    <button type="button" className={styles.addItemBtn} onClick={handleAddItemRow} title="Shortcut: Alt + A">
                      <FiPlus size={14} /> Add Part <span style={{ fontSize: '10px', opacity: 0.7, marginLeft: '4px' }}>(Alt + A)</span>
                    </button>
                  )}
                </div>

                <table className={styles.itemsTable}>
                  <thead>
                    <tr>
                      <th style={{ width: '45%' }}>Part SKU / Name Lookup</th>
                      <th style={{ width: '20%' }}>Unit Cost (₹)</th>
                      <th style={{ width: '15%' }}>Quantity</th>
                      <th style={{ width: '15%' }}>Subtotal</th>
                      <th style={{ width: '5%' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => {
                      const filteredPartsList = getFilteredParts(item.partSearchQuery);
                      return (
                        <tr key={index}>
                          <td>
                            <div className={styles.autocompleteContainer}>
                              <div className={styles.lookupInputWrapper}>
                                <FiSearch className={styles.lookupIcon} />
                                <input
                                  ref={el => partInputRefs.current[index] = el}
                                  required
                                  type="text"
                                  disabled={!isEditable}
                                  className={styles.inputLookup}
                                  placeholder="Type part SKU or name..."
                                  value={item.partSearchQuery}
                                  onChange={(e) => handlePartSearchChange(index, e.target.value)}
                                  onFocus={() => {
                                    if (isEditable) {
                                      setItems(items.map((it, i) => i === index ? { ...it, showSuggestions: true } : it));
                                    }
                                  }}
                                  onBlur={() => {
                                    setTimeout(() => {
                                      setItems(items => items.map((it, i) => i === index ? { ...it, showSuggestions: false } : it));
                                    }, 200);
                                  }}
                                  onKeyDown={(e) => handlePartSearchKeyDown(index, e)}
                                />
                              </div>
                              {isEditable && item.showSuggestions && item.partSearchQuery && (
                                <ul className={styles.suggestionsList}>
                                  {filteredPartsList.map((p, idx) => (
                                    <li
                                      key={p.id}
                                      className={`${styles.suggestionItem} ${idx === item.activeSuggestionIndex ? styles.suggestionItemActive : ''}`}
                                      onMouseDown={() => handleSelectPart(index, p)}
                                    >
                                      <div className={styles.suggestionTitle}>
                                        <span className={styles.skuBadge}>{p.sku}</span> {p.name}
                                      </div>
                                      <div className={styles.suggestionMeta}>
                                        Cost: ₹{p.costPrice || p.price} | Stock: {p.quantity} | Cat: {p.categoryName}
                                      </div>
                                    </li>
                                  ))}
                                  {filteredPartsList.length === 0 && (
                                    <li className={styles.suggestionNoMatch}>No parts found</li>
                                  )}
                                </ul>
                              )}
                            </div>
                          </td>
                          <td>
                            <input
                              required
                              min="0"
                              disabled={!isEditable}
                              className={styles.input}
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleItemFieldChange(index, 'unitPrice', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              required
                              min="1"
                              disabled={!isEditable}
                              className={styles.input}
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemFieldChange(index, 'quantity', e.target.value)}
                            />
                          </td>
                          <td style={{ fontWeight: 600, paddingLeft: '8px' }}>
                            {formatAmount(item.quantity * item.unitPrice)}
                          </td>
                          <td>
                            {isEditable && (
                              <button
                                type="button"
                                className={styles.removeBtn}
                                onClick={() => handleRemoveItemRow(index)}
                                tabIndex={-1}
                              >
                                <FiTrash2 size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className={styles.grandTotalRow}>
                  <span>Grand Total:</span>
                  <span className={styles.grandTotalAmount}>{formatAmount(grandTotal)}</span>
                </div>
              </div>

              <div className={styles.modalFooter}>
                {canCancel && (
                  <button type="button" className={styles.cancelOrderBtnModal} onClick={() => handleCancelOrder(editingOrder.id)}>
                    <FiXCircle size={14} /> Cancel Order
                  </button>
                )}
                <div style={{ flex: 1 }} />
                <button type="button" className={styles.cancelBtn} onClick={() => { setIsModalOpen(false); setEditingOrder(null); }}>
                  {editingOrder ? 'Close' : 'Cancel'}
                </button>
                {isEditable && (
                  <button type="submit" className={styles.submitBtn}>
                    {editingOrder ? 'Update Order' : 'Save Purchase Order'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PurchaseOrders;
