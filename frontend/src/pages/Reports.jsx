import { FiArrowRight } from 'react-icons/fi';
import {
  HiChartBar,
  HiCube,
  HiCurrencyRupee,
  HiTruck,
  HiUsers,
  HiDocumentChartBar,
} from 'react-icons/hi2';
import styles from './Reports.module.css';

const reports = [
  {
    title: 'Sales Summary',
    description: 'Revenue trends, top-selling parts, and sales performance by period and category.',
    icon: HiCurrencyRupee,
    color: '#f59e0b',
    tag: 'Financial',
    tagBg: 'rgba(245, 158, 11, 0.1)',
    tagColor: '#fbbf24',
  },
  {
    title: 'Inventory Valuation',
    description: 'Current stock value, cost analysis, and inventory turnover ratios.',
    icon: HiCube,
    color: '#3b82f6',
    tag: 'Inventory',
    tagBg: 'rgba(59, 130, 246, 0.1)',
    tagColor: '#60a5fa',
  },
  {
    title: 'Purchase Analysis',
    description: 'Supplier spending, purchase trends, and cost comparison reports.',
    icon: HiTruck,
    color: '#10b981',
    tag: 'Procurement',
    tagBg: 'rgba(16, 185, 129, 0.1)',
    tagColor: '#34d399',
  },
  {
    title: 'Customer Insights',
    description: 'Top customers, buying patterns, and retention analytics.',
    icon: HiUsers,
    color: '#8b5cf6',
    tag: 'CRM',
    tagBg: 'rgba(139, 92, 246, 0.1)',
    tagColor: '#a78bfa',
  },
  {
    title: 'Stock Movement',
    description: 'Inward/outward movement log, batch tracking, and stock reconciliation.',
    icon: HiChartBar,
    color: '#ef4444',
    tag: 'Inventory',
    tagBg: 'rgba(239, 68, 68, 0.1)',
    tagColor: '#f87171',
  },
  {
    title: 'Profit & Loss',
    description: 'Net profit margins, expense breakdowns, and financial health overview.',
    icon: HiDocumentChartBar,
    color: '#f97316',
    tag: 'Financial',
    tagBg: 'rgba(249, 115, 22, 0.1)',
    tagColor: '#fb923c',
  },
];

function Reports() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Reports & Analytics</h2>
        <p className={styles.pageSubtitle}>Generate and view detailed reports for your business.</p>
      </div>

      <div className={styles.grid}>
        {reports.map((report, idx) => {
          const Icon = report.icon;
          return (
            <div
              key={idx}
              className={styles.card}
              style={{ animationDelay: `${idx * 0.06}s` }}
            >
              <style>{`
                .${styles.card}:nth-child(${idx + 1})::before {
                  background: ${report.color};
                }
              `}</style>
              <div
                className={styles.cardIcon}
                style={{ background: `${report.color}15`, color: report.color }}
              >
                <Icon />
              </div>
              <h3 className={styles.cardTitle}>{report.title}</h3>
              <p className={styles.cardDesc}>{report.description}</p>
              <div className={styles.cardFooter}>
                <span
                  className={styles.cardTag}
                  style={{ background: report.tagBg, color: report.tagColor }}
                >
                  {report.tag}
                </span>
                <span className={styles.generateBtn}>
                  Generate <FiArrowRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Reports;
