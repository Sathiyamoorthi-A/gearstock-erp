import { useState, useEffect, useRef } from 'react';
import { FiPlus, FiTrash2, FiSearch, FiEdit2, FiXCircle } from 'react-icons/fi';
import { HiShoppingCart } from 'react-icons/hi2';
import { getAllOrders, createOrder, updateOrderStatus, updateOrder, getOrderById } from '../api/orders';
import { getAllCustomers } from '../api/customers';
import { getAllParts } from '../api/inventory';
import { createPayment } from '../api/reports';
import styles from './SalesOrders.module.css';


const statusMap = {
  'DELIVERED': styles.badgeDelivered,
  'IN_TRANSIT': styles.badgeTransit,
  'PENDING': styles.badgePending,
  'SHIPPED': styles.badgeShipped,
  'PROCESSING': styles.badgeProcessing,
  'RETURNED': styles.badgeReturned,
  'CANCELLED': styles.badgeCancelled,
};

function SalesOrders() {
  const [orders, setOrders] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [partsList, setPartsList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null); // null = create mode, object = edit mode

  // New Sale Form State
  const [customerId, setCustomerId] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [activeCustomerSuggestionIndex, setActiveCustomerSuggestionIndex] = useState(0);

  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');


  // Refs for keyboard navigation and focus management
  const customerInputRef = useRef(null);
  const partInputRefs = useRef([]);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders('SALES');
      if (data && Array.isArray(data)) {
        const mapped = data.map(item => ({
          id: item.orderNumber || `#SO-${item.id}`,
          realId: item.id,
          customer: item.customer ? item.customer.name : 'N/A',
          customerId: item.customer ? item.customer.id : null,
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
      console.error('Error fetching sales orders', err);
    }
  };

  const loadDependencies = async () => {
    try {
      const [customersData, partsData] = await Promise.all([
        getAllCustomers(),
        getAllParts()
      ]);
      setCustomersList(customersData || []);
      setPartsList(partsData || []);
    } catch (err) {
      console.warn('Error loading sales order dependencies', err);
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
    setCustomerId('');
    setCustomerSearch('');
    setPaymentMethod('CASH');
    setShowCustomerSuggestions(false);
    setActiveCustomerSuggestionIndex(0);
    // Initialize with one empty line row
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
      if (customerInputRef.current) {
        customerInputRef.current.focus();
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
      setCustomerId(fullOrder.customer ? fullOrder.customer.id : '');
      setCustomerSearch(fullOrder.customer ? fullOrder.customer.name : '');
      setShowCustomerSuggestions(false);
      setActiveCustomerSuggestionIndex(0);

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
  const canCancel = editingOrder && ['PENDING', 'PROCESSING'].includes(editingOrder.status);

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
    // Focus the new line's lookup field
    setTimeout(() => {
      const newIndex = items.length;
      if (partInputRefs.current[newIndex]) {
        partInputRefs.current[newIndex].focus();
      }
    }, 50);
  };

  const handleRemoveItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Autocomplete filter helpers
  const getFilteredCustomers = () => {
    if (!customerSearch) return customersList;
    const q = customerSearch.toLowerCase();
    return customersList.filter(c => c.name.toLowerCase().includes(q) || (c.company && c.company.toLowerCase().includes(q)));
  };

  const getFilteredParts = (query) => {
    if (!query) return [];
    const q = query.toLowerCase();
    return partsList.filter(p => p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q));
  };

  // Customers Keydown logic
  const handleCustomerKeyDown = (e) => {
    const filtered = getFilteredCustomers();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveCustomerSuggestionIndex(prev => 
        prev < filtered.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveCustomerSuggestionIndex(prev => 
        prev > 0 ? prev - 1 : prev
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[activeCustomerSuggestionIndex]) {
        const selected = filtered[activeCustomerSuggestionIndex];
        setCustomerId(selected.id);
        setCustomerSearch(selected.name);
        setShowCustomerSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowCustomerSuggestions(false);
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
      unitPrice: part.price || 0, // Sales: prefill selling price
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
    if (!customerId) {
      showToast('Please select a valid customer from suggestions list', 'error');
      return;
    }
    const invalidItems = items.filter(it => !it.partId);
    if (invalidItems.length > 0) {
      showToast('Please select a valid part SKU/name for all rows', 'error');
      return;
    }

    const payload = {
      orderType: 'SALES',
      status: 'PENDING',
      notes,
      totalAmount: grandTotal,
      customer: { id: Number(customerId) },
      items: items.map(it => ({
        part: { id: Number(it.partId) },
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice)
      }))
    };

    try {
      if (editingOrder) {
        await updateOrder(editingOrder.id, payload);
        showToast('Sales Order updated successfully');
      } else {
        // Verify stock levels before selling (only for new orders)
        let insStock = true;
        items.forEach(it => {
          const partObj = partsList.find(p => p.id === Number(it.partId));
          if (partObj && partObj.quantity < it.quantity) {
            insStock = false;
            showToast(`Insufficient stock for ${partObj.name}. Available: ${partObj.quantity}`, 'error');
          }
        });
        if (!insStock) return;
        const savedOrder = await createOrder(payload);
        try {
          await createPayment({
            orderId: savedOrder.id,
            amount: grandTotal,
            paymentMethod: paymentMethod,
            transactionId: 'TXN-' + Date.now()
          });
        } catch (payErr) {
          console.error('Failed to log payment on checkout', payErr);
        }
        showToast('Sales Order created successfully');
      }
      setIsModalOpen(false);
      setEditingOrder(null);
      fetchOrders();
    } catch (err) {
      showToast(editingOrder ? 'Failed to update sales order' : 'Failed to create sales order', 'error');
    }
  };


  const formatAmount = (amount) => '₹' + Number(amount).toLocaleString('en-IN');

  const filteredCustomersList = getFilteredCustomers();

  return (
    <div className={styles.page}>
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
          <span className={styles.toastText}>{toast.message}</span>
        </div>
      )}

      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Sales Orders</h2>
        <div className={styles.controls}>
          <button className={styles.createBtn} onClick={handleOpenModal}>
            <FiPlus size={16} />
            New Sale
          </button>
        </div>
      </div>

      <div className={styles.tableCard}>
        {orders.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
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
                  <td className={styles.customer}>{order.customer}</td>
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
                      {['PENDING', 'PROCESSING'].includes(order.status) && (
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
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="RETURNED">RETURNED</option>
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
            <HiShoppingCart className={styles.emptyIcon} />
            <p className={styles.emptyText}>No sales orders found</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onKeyDown={handleModalKeyDown}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingOrder ? `Edit Sales Order ${editingOrder.orderNumber || '#SO-' + editingOrder.id}` : 'Create Sales Order'}
                {editingOrder && !isEditable && <span className={styles.readOnlyBadge}>Read Only</span>}
              </h3>
              <button className={styles.closeBtn} onClick={() => { setIsModalOpen(false); setEditingOrder(null); }}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Customer Lookup</label>
                  <div className={styles.autocompleteContainer}>
                    <div className={styles.lookupInputWrapper}>
                      <FiSearch className={styles.lookupIcon} />
                      <input
                        ref={customerInputRef}
                        required
                        type="text"
                        disabled={!isEditable}
                        className={styles.inputLookup}
                        placeholder="Type customer name or garage..."
                        value={customerSearch}
                        onChange={(e) => {
                          setCustomerSearch(e.target.value);
                          setCustomerId(''); // Clear selected ID
                          setShowCustomerSuggestions(true);
                          setActiveCustomerSuggestionIndex(0);
                        }}
                        onFocus={() => isEditable && setShowCustomerSuggestions(true)}
                        onBlur={() => {
                          // Delay to permit option selection click
                          setTimeout(() => setShowCustomerSuggestions(false), 200);
                        }}
                        onKeyDown={handleCustomerKeyDown}
                      />
                    </div>
                    {isEditable && showCustomerSuggestions && (
                      <ul className={styles.suggestionsList}>
                        {filteredCustomersList.map((c, idx) => (
                          <li
                            key={c.id}
                            className={`${styles.suggestionItem} ${idx === activeCustomerSuggestionIndex ? styles.suggestionItemActive : ''}`}
                            onMouseDown={() => {
                              setCustomerId(c.id);
                              setCustomerSearch(c.name);
                              setShowCustomerSuggestions(false);
                            }}
                          >
                            <div className={styles.suggestionName}>{c.name}</div>
                            <div className={styles.suggestionSub}>{c.company || 'Individual'} — {c.phone}</div>
                          </li>
                        ))}
                        {filteredCustomersList.length === 0 && (
                          <li className={styles.suggestionNoMatch}>No customers found</li>
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
                    placeholder="e.g. Standard garage delivery, COD"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Payment Method</label>
                  <select
                    className={styles.input}
                    disabled={!isEditable || !!editingOrder}
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="CASH">CASH (Hard Cash)</option>
                    <option value="UPI">UPI (Online/Scan)</option>
                    <option value="CARD">CARD (Visa/Mastercard)</option>
                    <option value="BANK_TRANSFER">BANK TRANSFER (IMPS/NEFT)</option>
                    <option value="LENDING">LENDING (Credit Account)</option>
                  </select>
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
                      <th style={{ width: '20%' }}>Unit Price (₹)</th>
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
                                        Price: ₹{p.price} | Stock: {p.quantity} | Cat: {p.categoryName}
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
                    {editingOrder ? 'Update Order' : 'Save Sales Order'}
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

export default SalesOrders;
