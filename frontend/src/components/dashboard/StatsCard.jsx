import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import styles from './StatsCard.module.css';

function StatsCard({ label, value, change, changeText, color, index = 0 }) {
  const isPositive = change && !change.startsWith('-');

  return (
    <div
      className={styles.card}
      style={{ animationDelay: `${index * 0.08}s`, '--accent-border': color }}
    >
      <div
        className={styles.card}
        style={{ display: 'contents' }}
      />
      <style>{`
        .${styles.card}::before {
          background: ${color || 'var(--accent-primary)'};
        }
      `}</style>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
      {change && (
        <div className={styles.change}>
          <span className={isPositive ? styles.changePositive : styles.changeNegative}>
            {isPositive ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
            {change}
          </span>
          {changeText && <span className={styles.changeText}>{changeText}</span>}
        </div>
      )}
    </div>
  );
}

export default StatsCard;
