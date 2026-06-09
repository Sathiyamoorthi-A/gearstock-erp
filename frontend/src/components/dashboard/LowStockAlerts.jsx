import { FiAlertTriangle } from 'react-icons/fi';
import styles from './LowStockAlerts.module.css';

function LowStockAlerts({ alerts }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Low Stock Alerts</h3>
        <span className={styles.count}>{alerts.length}</span>
      </div>

      <div className={styles.list}>
        {alerts.map((alert) => {
          const isCritical = alert.remaining <= 3;
          return (
            <div
              key={alert.id}
              className={`${styles.alertItem} ${
                isCritical ? styles.alertCritical : styles.alertWarning
              }`}
            >
              <div
                className={`${styles.alertIcon} ${
                  isCritical ? styles.alertIconCritical : styles.alertIconWarning
                }`}
              >
                <FiAlertTriangle />
              </div>

              <div className={styles.alertInfo}>
                <div className={styles.alertName}>{alert.name}</div>
                <div className={styles.alertMeta}>
                  {alert.sku} · {alert.category}
                </div>
              </div>

              <span
                className={`${styles.remaining} ${
                  isCritical ? styles.remainingCritical : styles.remainingWarning
                }`}
              >
                {alert.remaining}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LowStockAlerts;
