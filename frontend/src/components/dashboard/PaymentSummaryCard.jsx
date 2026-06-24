import { FiDollarSign, FiSmartphone, FiCreditCard, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { HiCurrencyRupee } from 'react-icons/hi2';
import styles from './PaymentSummaryCard.module.css';

function PaymentSummaryCard({ summary }) {
  const formatAmount = (amt) => '₹' + Number(amt || 0).toLocaleString('en-IN');

  const {
    cashTotal = 0,
    upiTotal = 0,
    cardTotal = 0,
    bankTransferTotal = 0,
    lendingTotal = 0,
    overallTotal = 0
  } = summary || {};

  const total = overallTotal || 1; // Prevent division by zero

  const channels = [
    { label: 'Hard Cash', value: cashTotal, icon: FiDollarSign, color: '#10b981' },
    { label: 'UPI Payments', value: upiTotal, icon: FiSmartphone, color: '#3b82f6' },
    { label: 'Cards (Visa/Master)', value: cardTotal, icon: FiCreditCard, color: '#f59e0b' },
    { label: 'Bank Transfer', value: bankTransferTotal, icon: FiTrendingUp, color: '#8b5cf6' },
    { label: 'Lending / Credits', value: lendingTotal, icon: FiActivity, color: '#ef4444' }
  ];

  return (
    <div className={styles.card}>
      <div>
        <div className={styles.titleRow}>
          <h4 className={styles.title}>
            <HiCurrencyRupee className={styles.titleIcon} size={18} />
            Daily Checkout Accumulation
          </h4>
          <span className={styles.totalAmount}>{formatAmount(overallTotal)}</span>
        </div>

        <div className={styles.channelList}>
          {channels.map((channel, idx) => {
            const Icon = channel.icon;
            const pct = Math.min(100, Math.round((channel.value / total) * 100));
            return (
              <div key={idx} className={styles.channelItem}>
                <div className={styles.channelHeader}>
                  <div className={styles.channelInfo}>
                    <Icon style={{ color: channel.color }} />
                    <span>{channel.label}</span>
                  </div>
                  <span className={styles.channelValue}>{formatAmount(channel.value)} ({pct}%)</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div
                    className={styles.progressBarFill}
                    style={{
                      width: `${pct}%`,
                      backgroundColor: channel.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PaymentSummaryCard;
