import { useState, useEffect } from 'react';
import { FiMessageSquare, FiSend, FiStar, FiMail, FiMessageCircle } from 'react-icons/fi';
import { HiHeart } from 'react-icons/hi2';
import { getFeedbacks, createFeedback, getNotificationsLog } from '../api/crm';
import { getAllCustomers } from '../api/customers';
import { getAllOrders } from '../api/orders';
import styles from './Crm.module.css';

function Crm() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      const fbData = await getFeedbacks();
      if (fbData && Array.isArray(fbData)) setFeedbacks(fbData);

      const logData = await getNotificationsLog();
      if (logData && Array.isArray(logData)) setLogs(logData);

      const custData = await getAllCustomers();
      if (custData && Array.isArray(custData)) setCustomers(custData);

      const ordData = await getAllOrders();
      if (ordData && Array.isArray(ordData)) {
        // Only show Sales Orders that are Delivered for selection
        setOrders(ordData.filter(o => o.orderType === 'SALES'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll logs every 10 seconds to show simulated notifications in real-time
    const interval = setInterval(async () => {
      try {
        const logData = await getNotificationsLog();
        if (logData && Array.isArray(logData)) setLogs(logData);
      } catch (err) {}
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId || !comments) return;

    try {
      const payload = {
        customerId: Number(selectedCustomerId),
        rating,
        comments
      };
      if (selectedOrderId) {
        payload.orderId = Number(selectedOrderId);
      }

      await createFeedback(payload);
      showToast('Feedback submitted successfully');
      
      // Reset form
      setSelectedCustomerId('');
      setSelectedOrderId('');
      setRating(5);
      setComments('');

      // Refresh list
      const fbData = await getFeedbacks();
      if (fbData && Array.isArray(fbData)) setFeedbacks(fbData);
    } catch (err) {
      showToast('Failed to submit feedback', 'error');
    }
  };

  const renderStars = (count, interactive = false) => {
    const starList = [];
    for (let i = 1; i <= 5; i++) {
      starList.push(
        interactive ? (
          <button
            key={i}
            type="button"
            className={`${styles.starBtn} ${i <= rating ? styles.starActive : ''}`}
            onClick={() => setRating(i)}
          >
            <FiStar fill={i <= rating ? 'currentColor' : 'none'} />
          </button>
        ) : (
          <FiStar
            key={i}
            fill={i <= count ? 'currentColor' : 'none'}
            style={{ color: i <= count ? 'var(--accent-primary)' : 'var(--text-muted)' }}
          />
        )
      );
    }
    return starList;
  };

  return (
    <div className={styles.page}>
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
          <span className={styles.toastText}>{toast.message}</span>
        </div>
      )}

      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Customer Relationship Management</h2>
        <p className={styles.pageSubtitle}>Monitor customer reviews, submit product ratings, and view simulated automation logs.</p>
      </div>

      <div className={styles.contentLayout}>
        {/* Left Panel: Feedbacks & Submission Form */}
        <div className={styles.leftPanel}>
          <form onSubmit={handleFeedbackSubmit} className={`${styles.card} ${styles.feedbackFormCard}`}>
            <h4 className={styles.cardTitle}>
              <HiHeart className={styles.cardTitleIcon} />
              Log Customer Review
            </h4>

            <div className={styles.formGroup}>
              <div className={styles.field}>
                <label className={styles.label}>Customer</label>
                <select
                  required
                  className={styles.select}
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                >
                  <option value="">-- Select Customer --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ''}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Associated Order (Optional)</label>
                <select
                  className={styles.select}
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                >
                  <option value="">-- Select Order --</option>
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber} (₹{o.totalAmount.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Rating</label>
                <div className={styles.ratingField}>
                  {renderStars(rating, true)}
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 8 }}>
                    ({rating} / 5 Stars)
                  </span>
                </div>
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Comments</label>
                <textarea
                  required
                  placeholder="Enter customer feedback remarks..."
                  className={styles.textarea}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <FiSend size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Submit Feedback
            </button>
          </form>

          {/* Feedback Feed */}
          <div className={styles.card} style={{ flex: 1, minHeight: 0 }}>
            <h4 className={styles.cardTitle}>
              <FiMessageSquare className={styles.cardTitleIcon} />
              Recent Feedbacks
            </h4>
            <div className={styles.scrollContainer}>
              <div className={styles.feedbackList}>
                {feedbacks.map(fb => (
                  <div key={fb.id} className={styles.feedbackItem}>
                    <div className={styles.feedbackHeader}>
                      <span className={styles.customerName}>{fb.customer?.name || 'Anonymous Customer'}</span>
                      <span className={styles.feedbackDate}>
                        {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : 'N/A'}
                      </span>
                    </div>
                    <div className={styles.stars}>{renderStars(fb.rating)}</div>
                    <p className={styles.feedbackText}>"{fb.comments}"</p>
                    {fb.order && (
                      <span style={{ display: 'inline-block', fontSize: 10.5, color: 'var(--accent-primary)', marginTop: 8, background: 'rgba(245, 158, 11, 0.08)', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace' }}>
                        Order Ref: {fb.order.orderNumber}
                      </span>
                    )}
                  </div>
                ))}
                {feedbacks.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                    No reviews logged yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Automation Logs Timeline */}
        <div className={styles.rightPanel}>
          <div className={`${styles.card} ${styles.timelineCard}`}>
            <h4 className={styles.cardTitle}>
              <FiMail className={styles.cardTitleIcon} />
              Simulated SMS & Email Logs
            </h4>
            <div className={styles.scrollContainer}>
              <div className={styles.timeline}>
                {logs.map((log, idx) => (
                  <div key={log.id || idx} className={styles.timelineItem}>
                    <div className={`${styles.timelineDot} ${idx === 0 ? styles.timelineDotActive : ''}`} />
                    <div className={styles.logHeader}>
                      <span className={styles.logTitle}>Status Changed to: {log.status}</span>
                      <span className={styles.logTime}>{log.timestamp}</span>
                    </div>
                    <div className={styles.logCustomer}>
                      To: {log.customer} (Ref: {log.orderNo})
                    </div>
                    
                    <div className={styles.logContent}>
                      <div className={styles.logMeta}>
                        <span className={styles.smsBadge}>
                          <FiMessageCircle size={12} style={{ color: 'var(--accent-primary)' }} />
                          SMS Sent
                        </span>
                      </div>
                      <div className={styles.logPart} style={{ fontFamily: 'monospace', fontSize: 11, background: 'rgba(0,0,0,0.2)', padding: 8, borderRadius: 4 }}>
                        {log.smsText}
                      </div>

                      <div className={styles.logMeta} style={{ marginTop: 4 }}>
                        <span className={styles.emailBadge}>
                          <FiMail size={12} style={{ color: 'var(--status-transit)' }} />
                          Email Dispatched
                        </span>
                      </div>
                      <div className={styles.logPart} style={{ border: '1px solid var(--border-subtle)', padding: 10, borderRadius: 4 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                          Subj: {log.emailSubject}
                        </div>
                        <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', fontSize: 11.5 }}>
                          {log.emailBody}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {logs.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                    No automated notifications recorded yet. Create or edit an order to trigger.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Crm;
