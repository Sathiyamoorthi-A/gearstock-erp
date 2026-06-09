import { Link } from 'react-router-dom';
import styles from './RecentOrders.module.css';

const statusBadgeMap = {
  'DELIVERED': styles.badgeDelivered,
  'IN_TRANSIT': styles.badgeTransit,
  'PENDING': styles.badgePending,
  'RETURNED': styles.badgeReturned,
  'CANCELLED': styles.badgeCancelled,
};

const formatAmount = (amount) => {
  return '₹' + Number(amount).toLocaleString('en-IN');
};

function RecentOrders({ orders }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Orders</h3>
        <Link to="/sales-orders" className={styles.viewAll}>
          View all →
        </Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Part Description</th>
            <th style={{ textAlign: 'center' }}>Qty</th>
            <th>Amount</th>
            <th style={{ textAlign: 'right' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={idx}>
              <td className={styles.orderId}>{order.id}</td>
              <td className={styles.partName}>{order.part}</td>
              <td className={styles.qty}>{order.qty}</td>
              <td className={styles.amount}>{formatAmount(order.amount)}</td>
              <td className={styles.statusCell}>
                <span
                  className={`${styles.badge} ${statusBadgeMap[order.status] || styles.badgePending}`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentOrders;
