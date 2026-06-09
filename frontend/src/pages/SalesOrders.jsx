import { useState, useEffect } from 'react';
import { FiFilter, FiPlus } from 'react-icons/fi';
import { HiShoppingCart } from 'react-icons/hi2';
import { getAllOrders } from '../api/orders';
import styles from './SalesOrders.module.css';

const sampleOrders = [
  { id: '#SO-7831', customer: 'Rajesh Auto Garage', items: 5, total: 28400, date: '2026-04-29', status: 'Delivered' },
  { id: '#SO-7830', customer: 'City Motors Workshop', items: 3, total: 18900, date: '2026-04-28', status: 'Shipped' },
  { id: '#SO-7829', customer: 'Krishna Car Care', items: 8, total: 42600, date: '2026-04-28', status: 'Processing' },
  { id: '#SO-7828', customer: 'Highway Auto Services', items: 2, total: 15200, date: '2026-04-27', status: 'Delivered' },
  { id: '#SO-7827', customer: 'Patel Mechanic Works', items: 12, total: 56800, date: '2026-04-26', status: 'Delivered' },
  { id: '#SO-7826', customer: 'Star Auto Repairs', items: 4, total: 21000, date: '2026-04-25', status: 'Returned' },
  { id: '#SO-7825', customer: 'Quick Fix Automobiles', items: 6, total: 34200, date: '2026-04-24', status: 'Shipped' },
  { id: '#SO-7824', customer: 'Metro Auto Parts Retail', items: 15, total: 89000, date: '2026-04-23', status: 'Processing' },
];

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
  const [orders, setOrders] = useState(sampleOrders);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders('SALES');
        if (data && Array.isArray(data)) {
          const mapped = data.map(item => ({
            id: item.orderNumber || `#SO-${item.id}`,
            customer: item.customer ? item.customer.name : 'N/A',
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
        <h2 className={styles.pageTitle}>Sales Orders</h2>
        <div className={styles.controls}>
          <button className={styles.filterBtn} onClick={() => showToast('Order filtering is simulated in local view')}>
            <FiFilter size={15} />
            Filter
          </button>
          <button className={styles.createBtn} onClick={() => showToast('New Sales Order modal is under construction')}>
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
                  <td className={styles.customer}>{order.customer}</td>
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
            <HiShoppingCart className={styles.emptyIcon} />
            <p className={styles.emptyText}>No sales orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SalesOrders;
