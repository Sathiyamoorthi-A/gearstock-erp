import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { HiShoppingCart } from 'react-icons/hi2';
import { getAllOrders, createOrder, updateOrderStatus } from '../api/orders';
import { getAllCustomers } from '../api/customers';
import { getAllParts } from '../api/inventory';
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

  // New Sale Form State
  const [customerId, setCustomerId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([]);

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
          items: item.items ? item.items.length : 0,
          total: item.totalAmount || 0,
          date: item.createdAt ? item.createdAt.substring(0, 10) : 'N/A',
          status: item.status
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
      if (customersData && customersData.length > 0) {
        setCustomerId(customersData[0].id);
      }
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
    setNotes('');
    if (customersList.length > 0) {
      setCustomerId(customersList[0].id);
    }
    // Pre-fill with one empty item row
    if (partsList.length > 0) {
      setItems([{
        partId: partsList[0].id,
        quantity: 1,
        unitPrice: partsList[0].price || 0
      }]);
    } else {
      setItems([]);
    }
    setIsModalOpen(true);
  };

  const handleAddItemRow = () => {
    if (partsList.length === 0) {
      showToast('No parts available to add', 'error');
      return;
    }
    setItems([
      ...items,
      {
        partId: partsList[0].id,
        quantity: 1,
        unitPrice: partsList[0].price || 0
      }
    ]);
  };

  const handleRemoveItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemPartChange = (index, selectedPartId) => {
    const partObj = partsList.find(p => p.id === Number(selectedPartId));
    if (!partObj) return;

    setItems(items.map((it, i) => i === index ? {
      ...it,
      partId: partObj.id,
      unitPrice: partObj.price || 0
    } : it));
  };

  const handleItemFieldChange = (index, field, value) => {
    setItems(items.map((it, i) => i === index ? {
      ...it,
      [field]: Number(value)
    } : it));
  };

  // Grand Total Calculation
  const grandTotal = items.reduce((sum, it) => sum + (it.quantity * it.unitPrice), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      showToast('Please add at least one part to the order', 'error');
      return;
    }

    // Verify stock levels before selling (optional but nice)
    let insStock = true;
    items.forEach(it => {
      const partObj = partsList.find(p => p.id === Number(it.partId));
      if (partObj && partObj.quantity < it.quantity) {
        insStock = false;
        showToast(`Insufficient stock for ${partObj.name}. Available: ${partObj.quantity}`, 'error');
      }
    });

    if (!insStock) return;

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
      await createOrder(payload);
      showToast('Sales Order created successfully');
      setIsModalOpen(false);
      fetchOrders();
    } catch (err) {
      showToast('Failed to create sales order', 'error');
    }
  };

  const formatAmount = (amount) => '₹' + Number(amount).toLocaleString('en-IN');

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
                <th>Update Status</th>
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
                    <select
                      className={`${styles.badge} ${statusMap[order.status] || styles.badgePending}`}
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
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Create Sales Order</h3>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Select Customer</label>
                  <select
                    required
                    className={styles.select}
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                  >
                    {customersList.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Notes</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Standard garage delivery, COD"
                  />
                </div>
              </div>

              <div className={styles.itemsSection}>
                <div className={styles.sectionHeader}>
                  <h4 className={styles.label}>Parts / Order Items</h4>
                  <button type="button" className={styles.addItemBtn} onClick={handleAddItemRow}>
                    <FiPlus size={14} /> Add Part
                  </button>
                </div>

                <table className={styles.itemsTable}>
                  <thead>
                    <tr>
                      <th style={{ width: '40%' }}>Part SKU / Name</th>
                      <th style={{ width: '20%' }}>Unit Price (₹)</th>
                      <th style={{ width: '15%' }}>Quantity</th>
                      <th style={{ width: '20%' }}>Subtotal</th>
                      <th style={{ width: '5%' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <select
                            className={styles.select}
                            value={item.partId}
                            onChange={(e) => handleItemPartChange(index, e.target.value)}
                          >
                            {partsList.map(p => (
                              <option key={p.id} value={p.id}>{p.sku} — {p.name} (Stock: {p.quantity})</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            required
                            min="0"
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
                          <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => handleRemoveItemRow(index)}
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className={styles.grandTotalRow}>
                  <span>Grand Total:</span>
                  <span className={styles.grandTotalAmount}>{formatAmount(grandTotal)}</span>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Save Sales Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesOrders;
