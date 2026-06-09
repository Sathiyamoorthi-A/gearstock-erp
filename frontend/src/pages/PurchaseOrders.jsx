import { useState, useEffect } from 'react';
import { FiFilter, FiPlus } from 'react-icons/fi';
import { HiClipboardDocumentList } from 'react-icons/hi2';
import { getAllOrders } from '../api/orders';
import styles from './PurchaseOrders.module.css';

const sampleOrders = [
  { id: '#PO-4201', supplier: 'AutoParts India Ltd.', items: 12, total: 145600, date: '2026-04-28', status: 'Pending' },
  { id: '#PO-4200', supplier: 'BrakeMax Corp.', items: 8, total: 89200, date: '2026-04-27', status: 'Approved' },
  { id: '#PO-4199', supplier: 'ElectroParts Pvt.', items: 5, total: 52800, date: '2026-04-26', status: 'In Transit' },
  { id: '#PO-4198', supplier: 'FilterKing Supplies', items: 24, total: 38400, date: '2026-04-25', status: 'Delivered' },
  { id: '#PO-4197', supplier: 'Ignition Works', items: 16, total: 67200, date: '2026-04-24', status: 'Delivered' },
  { id: '#PO-4196', supplier: 'RideMaster Auto', items: 6, total: 31500, date: '2026-04-23', status: 'Pending' },
  { id: '#PO-4195', supplier: 'SteerTech Systems', items: 3, total: 23400, date: '2026-04-22', status: 'Cancelled' },
  { id: '#PO-4194', supplier: 'BrightBeam Optics', items: 10, total: 112000, date: '2026-04-21', status: 'Delivered' },
];

const statusMap = {
  'DELIVERED': styles.badgeDelivered,
  'IN_TRANSIT': styles.badgeTransit,
  'PENDING': styles.badgePending,
  'APPROVED': styles.badgeApproved,
  'CANCELLED': styles.badgeCancelled,
};

function PurchaseOrders() {
  const [orders, setOrders] = useState(sampleOrders);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders('PURCHASE');
        if (data && Array.isArray(data)) {
          const mapped = data.map(item => ({
            id: item.orderNumber || `#PO-${item.id}`,
            supplier: item.supplier ? item.supplier.name : 'N/A',
            items: item.items ? item.items.length : 0,
            total: item.totalAmount || 0,
            date: item.createdAt ? item.createdAt.substring(0, 10) : 'N/A',
            status: item.status
          }));
          setOrders(mapped);
        }
      } catch {
        // Use sample data
      }
    };
    fetchOrders();
  }, []);

  const formatAmount = (amount) => '₹' + Number(amount).toLocaleString('en-IN');

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
          <button className={styles.filterBtn} onClick={() => showToast('Order filtering is simulated in local view')}>
            <FiFilter size={15} />
            Filter
          </button>
          <button className={styles.createBtn} onClick={() => showToast('New Purchase Order modal is under construction')}>
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
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx}>
                  <td className={styles.orderId}>{order.id}</td>
                  <td>{order.supplier}</td>
                  <td>{order.items}</td>
                  <td className={styles.amount}>{formatAmount(order.total)}</td>
                  <td className={styles.date}>{order.date}</td>
                  <td>
                    <span className={`${styles.badge} ${statusMap[order.status] || styles.badgePending}`}>
                      {order.status}
                    </span>
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
    </div>
  );
}

export default PurchaseOrders;
