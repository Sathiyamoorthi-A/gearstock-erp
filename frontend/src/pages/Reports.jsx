import { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import {
  HiChartBar,
  HiCube,
  HiCurrencyRupee,
  HiTruck,
  HiUsers,
  HiDocumentChartBar,
} from 'react-icons/hi2';
import { getLocalParts, getLocalOrders, getLocalCustomers, getLocalSuppliers } from '../api/localStorageFallback';
import { downloadReport } from '../api/reports';
import styles from './Reports.module.css';


const reportsList = [
  {
    id: 'sales',
    title: 'Sales Summary',
    description: 'Revenue trends, top-selling parts, and sales performance by period and category.',
    icon: HiCurrencyRupee,
    color: '#f59e0b',
    tag: 'Financial',
    tagBg: 'rgba(245, 158, 11, 0.1)',
    tagColor: '#fbbf24',
  },
  {
    id: 'inventory',
    title: 'Inventory Valuation',
    description: 'Current stock value, cost analysis, and inventory turnover ratios.',
    icon: HiCube,
    color: '#3b82f6',
    tag: 'Inventory',
    tagBg: 'rgba(59, 130, 246, 0.1)',
    tagColor: '#60a5fa',
  },
  {
    id: 'purchase',
    title: 'Purchase Analysis',
    description: 'Supplier spending, purchase trends, and cost comparison reports.',
    icon: HiTruck,
    color: '#10b981',
    tag: 'Procurement',
    tagBg: 'rgba(16, 185, 129, 0.1)',
    tagColor: '#34d399',
  },
  {
    id: 'customers',
    title: 'Customer Insights',
    description: 'Top customers, buying patterns, and retention analytics.',
    icon: HiUsers,
    color: '#8b5cf6',
    tag: 'CRM',
    tagBg: 'rgba(139, 92, 246, 0.1)',
    tagColor: '#a78bfa',
  },
  {
    id: 'stock',
    title: 'Stock Movement',
    description: 'Inward/outward movement log, batch tracking, and stock reconciliation.',
    icon: HiChartBar,
    color: '#ef4444',
    tag: 'Inventory',
    tagBg: 'rgba(239, 68, 68, 0.1)',
    tagColor: '#f87171',
  },
  {
    id: 'pnl',
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
  const [activeReport, setActiveReport] = useState(null);
  const [reportData, setReportData] = useState(null);

  const mapReportToExportType = (reportId) => {
    switch (reportId) {
      case 'inventory':
      case 'stock':
        return 'items';
      case 'sales':
      case 'purchase':
        return 'orders';
      case 'pnl':
      case 'customers':
      default:
        return 'statements';
    }
  };

  const handleExport = (reportId, format) => {
    const exportType = mapReportToExportType(reportId);
    downloadReport(exportType, format);
  };

  const formatAmount = (amount) => '₹' + Number(amount).toLocaleString('en-IN');


  const generateReport = (reportId) => {
    const parts = getLocalParts();
    const orders = getLocalOrders();
    const customers = getLocalCustomers();
    const suppliers = getLocalSuppliers();

    let data = {};

    if (reportId === 'sales') {
      const salesOrders = orders.filter(o => o.orderType === 'SALES' && o.status !== 'CANCELLED');
      const totalSales = salesOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      // Top Selling Parts Aggregation
      const partSalesMap = {};
      salesOrders.forEach(o => {
        if (o.items) {
          o.items.forEach(it => {
            const pId = it.part ? it.part.id : 'unknown';
            const pName = it.part ? it.part.name : 'Unknown Part';
            const pSku = it.part ? it.part.sku : 'N/A';
            if (!partSalesMap[pId]) {
              partSalesMap[pId] = { name: pName, sku: pSku, quantity: 0, revenue: 0 };
            }
            partSalesMap[pId].quantity += it.quantity;
            partSalesMap[pId].revenue += it.quantity * it.unitPrice;
          });
        }
      });

      const topSelling = Object.values(partSalesMap)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      data = {
        totalSales,
        ordersCount: salesOrders.length,
        avgOrderValue: salesOrders.length > 0 ? totalSales / salesOrders.length : 0,
        topSelling
      };
    } else if (reportId === 'inventory') {
      const totalParts = parts.reduce((sum, p) => sum + p.quantity, 0);
      const totalCostValue = parts.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0);
      const totalRetailValue = parts.reduce((sum, p) => sum + (p.quantity * p.price), 0);
      
      const categoryValuation = {};
      parts.forEach(p => {
        const cat = p.categoryName || 'Uncategorized';
        if (!categoryValuation[cat]) {
          categoryValuation[cat] = { name: cat, count: 0, val: 0 };
        }
        categoryValuation[cat].count += p.quantity;
        categoryValuation[cat].val += p.quantity * p.price;
      });

      data = {
        totalParts,
        totalCostValue,
        totalRetailValue,
        projectedMargin: totalRetailValue - totalCostValue,
        categoryValuation: Object.values(categoryValuation)
      };
    } else if (reportId === 'purchase') {
      const purchaseOrders = orders.filter(o => o.orderType === 'PURCHASE' && o.status !== 'CANCELLED');
      const totalPurchases = purchaseOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      const supplierSpendMap = {};
      purchaseOrders.forEach(o => {
        const supName = o.supplier ? o.supplier.name : 'Unknown Supplier';
        if (!supplierSpendMap[supName]) {
          supplierSpendMap[supName] = { name: supName, count: 0, spent: 0 };
        }
        supplierSpendMap[supName].count++;
        supplierSpendMap[supName].spent += o.totalAmount;
      });

      data = {
        totalPurchases,
        ordersCount: purchaseOrders.length,
        activeSuppliersCount: suppliers.length,
        supplierSpend: Object.values(supplierSpendMap).sort((a, b) => b.spent - a.spent)
      };
    } else if (reportId === 'customers') {
      const salesOrders = orders.filter(o => o.orderType === 'SALES' && o.status === 'DELIVERED');
      
      const customerSpentMap = {};
      customers.forEach(c => {
        customerSpentMap[c.id] = { name: c.name, company: c.company || 'Individual', count: 0, spent: 0 };
      });

      salesOrders.forEach(o => {
        if (o.customer && customerSpentMap[o.customer.id]) {
          customerSpentMap[o.customer.id].count++;
          customerSpentMap[o.customer.id].spent += o.totalAmount;
        }
      });

      const customerInsights = Object.values(customerSpentMap)
        .sort((a, b) => b.spent - a.spent)
        .slice(0, 6);

      data = {
        totalCustomers: customers.length,
        activePurchasers: Object.values(customerSpentMap).filter(c => c.count > 0).length,
        customerInsights
      };
    } else if (reportId === 'stock') {
      const lowStock = parts.filter(p => p.quantity <= p.reorderLevel);
      const totalQty = parts.reduce((sum, p) => sum + p.quantity, 0);

      // Inward and Outward aggregates
      let inwardAdded = 0;
      let outwardShipped = 0;
      orders.forEach(o => {
        if (o.status === 'DELIVERED') {
          const qty = o.items ? o.items.reduce((sum, it) => sum + it.quantity, 0) : 0;
          if (o.orderType === 'PURCHASE') {
            inwardAdded += qty;
          } else {
            outwardShipped += qty;
          }
        }
      });

      data = {
        totalStockQty: totalQty,
        lowStockAlerts: lowStock.length,
        inwardAdded,
        outwardShipped,
        lowStockItems: lowStock.slice(0, 5)
      };
    } else if (reportId === 'pnl') {
      const deliveredSales = orders.filter(o => o.orderType === 'SALES' && o.status === 'DELIVERED');
      const revenue = deliveredSales.reduce((sum, o) => sum + o.totalAmount, 0);

      // Calculate cost of goods sold (COGS) based on parts unit cost
      let cogs = 0;
      deliveredSales.forEach(o => {
        if (o.items) {
          o.items.forEach(it => {
            const cost = it.part ? it.part.costPrice : (it.unitPrice * 0.75); // Fallback margin if costPrice missing
            cogs += it.quantity * cost;
          });
        }
      });

      const grossProfit = revenue - cogs;
      const netMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

      // Restock purchase order values
      const deliveredPurchases = orders.filter(o => o.orderType === 'PURCHASE' && o.status === 'DELIVERED');
      const procurementExpense = deliveredPurchases.reduce((sum, o) => sum + o.totalAmount, 0);

      data = {
        revenue,
        cogs,
        grossProfit,
        netMargin,
        procurementExpense
      };
    }

    setReportData(data);
    setActiveReport(reportsList.find(r => r.id === reportId));
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Reports & Analytics</h2>
        <p className={styles.pageSubtitle}>Generate and view detailed reports for your business.</p>
      </div>

      <div className={styles.grid}>
        {reportsList.map((report, idx) => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              className={styles.card}
              onClick={() => generateReport(report.id)}
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

      {activeReport && reportData && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>{activeReport.title} Report</h3>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => handleExport(activeReport.id, 'pdf')}
                    style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.25)', fontSize: 11, padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}
                  >
                    Export PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport(activeReport.id, 'excel')}
                    style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.25)', fontSize: 11, padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}
                  >
                    Export Excel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport(activeReport.id, 'csv')}
                    style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-primary)', border: '1px solid rgba(245, 158, 11, 0.25)', fontSize: 11, padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}
                  >
                    Export CSV
                  </button>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setActiveReport(null)}>×</button>
            </div>


            {/* Sales Summary Report Content */}
            {activeReport.id === 'sales' && (
              <div>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Total Net Sales</div>
                    <div className={`${styles.summaryValue} ${styles.summaryValueHighlight}`}>
                      {formatAmount(reportData.totalSales)}
                    </div>
                  </div>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Orders Completed</div>
                    <div className={styles.summaryValue}>{reportData.ordersCount} orders</div>
                  </div>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Average Order Value</div>
                    <div className={styles.summaryValue}>{formatAmount(reportData.avgOrderValue)}</div>
                  </div>
                </div>

                <div className={styles.sectionTitle}>Top Selling Parts</div>
                <table className={styles.reportTable}>
                  <thead>
                    <tr>
                      <th>Part SKU</th>
                      <th>Part Name</th>
                      <th>Quantity Sold</th>
                      <th style={{ textAlign: 'right' }}>Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.topSelling.map((it, idx) => (
                      <tr key={idx}>
                        <td>{it.sku}</td>
                        <td>{it.name}</td>
                        <td style={{ fontWeight: 600 }}>{it.quantity} units</td>
                        <td className={styles.amount} style={{ textAlign: 'right' }}>
                          {formatAmount(it.revenue)}
                        </td>
                      </tr>
                    ))}
                    {reportData.topSelling.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                          No sales data recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Inventory Valuation Report Content */}
            {activeReport.id === 'inventory' && (
              <div>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Stock Retail Value</div>
                    <div className={`${styles.summaryValue} ${styles.summaryValueHighlight}`}>
                      {formatAmount(reportData.totalRetailValue)}
                    </div>
                  </div>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Stock Cost Value</div>
                    <div className={styles.summaryValue}>{formatAmount(reportData.totalCostValue)}</div>
                  </div>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Projected Margin</div>
                    <div className={`${styles.summaryValue} ${styles.summaryValueSuccess}`}>
                      {formatAmount(reportData.projectedMargin)}
                    </div>
                  </div>
                </div>

                <div className={styles.sectionTitle}>Valuation by Category</div>
                <table className={styles.reportTable}>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Parts Count</th>
                      <th style={{ textAlign: 'right' }}>Retail Valuation</th>
                      <th style={{ width: '30%' }}>Valuation Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.categoryValuation.map((cat, idx) => {
                      const share = reportData.totalRetailValue > 0 
                        ? (cat.val / reportData.totalRetailValue) * 100 
                        : 0;
                      return (
                        <tr key={idx}>
                          <td>{cat.name}</td>
                          <td style={{ fontWeight: 600 }}>{cat.count} items</td>
                          <td className={styles.amount} style={{ textAlign: 'right' }}>
                            {formatAmount(cat.val)}
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '11px', width: '36px' }}>{share.toFixed(0)}%</span>
                              <div className={styles.progressBarOuter} style={{ margin: 0, flexGrow: 1 }}>
                                <div 
                                  className={styles.progressBarInner} 
                                  style={{ width: `${share}%`, background: 'var(--accent-primary)' }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Purchase Analysis Report Content */}
            {activeReport.id === 'purchase' && (
              <div>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Total Spend (MTD)</div>
                    <div className={`${styles.summaryValue} ${styles.summaryValueHighlight}`}>
                      {formatAmount(reportData.totalPurchases)}
                    </div>
                  </div>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Purchase Orders</div>
                    <div className={styles.summaryValue}>{reportData.ordersCount} POs</div>
                  </div>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Registered Suppliers</div>
                    <div className={styles.summaryValue}>{reportData.activeSuppliersCount} suppliers</div>
                  </div>
                </div>

                <div className={styles.sectionTitle}>Spend by Supplier</div>
                <table className={styles.reportTable}>
                  <thead>
                    <tr>
                      <th>Supplier Name</th>
                      <th>Orders Placed</th>
                      <th style={{ textAlign: 'right' }}>Total Cost Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.supplierSpend.map((sup, idx) => (
                      <tr key={idx}>
                        <td>{sup.name}</td>
                        <td style={{ fontWeight: 600 }}>{sup.count} POs</td>
                        <td className={styles.amount} style={{ textAlign: 'right' }}>
                          {formatAmount(sup.spent)}
                        </td>
                      </tr>
                    ))}
                    {reportData.supplierSpend.length === 0 && (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                          No purchase history recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Customer Insights Report Content */}
            {activeReport.id === 'customers' && (
              <div>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Registered Accounts</div>
                    <div className={`${styles.summaryValue} ${styles.summaryValueHighlight}`}>
                      {reportData.totalCustomers} customers
                    </div>
                  </div>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Active Purchasers</div>
                    <div className={styles.summaryValue}>{reportData.activePurchasers} buyers</div>
                  </div>
                </div>

                <div className={styles.sectionTitle}>Top Customers by Revenue</div>
                <table className={styles.reportTable}>
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Company</th>
                      <th>Orders Completed</th>
                      <th style={{ textAlign: 'right' }}>Total Contribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.customerInsights.map((cust, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{cust.name}</td>
                        <td>{cust.company}</td>
                        <td>{cust.count} orders</td>
                        <td className={styles.amount} style={{ textAlign: 'right' }}>
                          {formatAmount(cust.spent)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Stock Movement Report Content */}
            {activeReport.id === 'stock' && (
              <div>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Stock Inward (Completed)</div>
                    <div className={`${styles.summaryValue} ${styles.summaryValueSuccess}`}>
                      +{reportData.inwardAdded} units
                    </div>
                  </div>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Stock Outward (Sales)</div>
                    <div className={`${styles.summaryValue} ${styles.summaryValueInfo}`}>
                      -{reportData.outwardShipped} units
                    </div>
                  </div>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Low Stock Alerts</div>
                    <div className={styles.summaryValue} style={{ color: 'var(--status-returned)' }}>
                      {reportData.lowStockAlerts} items
                    </div>
                  </div>
                </div>

                <div className={styles.sectionTitle}>Critical Low Stock Items</div>
                <table className={styles.reportTable}>
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Part Name</th>
                      <th>Category</th>
                      <th style={{ textAlign: 'right' }}>Remaining Units</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.lowStockItems.map((part, idx) => (
                      <tr key={idx}>
                        <td>{part.sku}</td>
                        <td>{part.name}</td>
                        <td>{part.categoryName}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--status-returned)' }}>
                          {part.quantity} units
                        </td>
                      </tr>
                    ))}
                    {reportData.lowStockItems.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: 'var(--status-delivered)' }}>
                          Excellent! No parts are currently below reorder levels.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Profit & Loss Report Content */}
            {activeReport.id === 'pnl' && (
              <div>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Net Sales Revenue</div>
                    <div className={`${styles.summaryValue} ${styles.summaryValueHighlight}`}>
                      {formatAmount(reportData.revenue)}
                    </div>
                  </div>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Cost of Goods (COGS)</div>
                    <div className={styles.summaryValue}>{formatAmount(reportData.cogs)}</div>
                  </div>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Gross Profit</div>
                    <div className={`${styles.summaryValue} ${styles.summaryValueSuccess}`}>
                      {formatAmount(reportData.grossProfit)}
                    </div>
                  </div>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Net Margin</div>
                    <div className={`${styles.summaryValue} ${styles.summaryValueInfo}`}>
                      {reportData.netMargin.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className={styles.sectionTitle}>Financial Breakdown</div>
                <table className={styles.reportTable}>
                  <thead>
                    <tr>
                      <th>Financial Indicator</th>
                      <th style={{ textAlign: 'right' }}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Delivered Sales Revenue (A)</td>
                      <td className={styles.amount} style={{ textAlign: 'right' }}>
                        {formatAmount(reportData.revenue)}
                      </td>
                    </tr>
                    <tr>
                      <td>Cost of Goods Sold (B)</td>
                      <td className={styles.amount} style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
                        -{formatAmount(reportData.cogs)}
                      </td>
                    </tr>
                    <tr style={{ borderTop: '1px solid var(--border-color)', fontWeight: 700 }}>
                      <td>Gross Profit (A - B)</td>
                      <td className={styles.amount} style={{ textAlign: 'right', color: 'var(--status-delivered)' }}>
                        {formatAmount(reportData.grossProfit)}
                      </td>
                    </tr>
                    <tr>
                      <td>Inventory Procurement Cost (Delivered Purchase Orders)</td>
                      <td className={styles.amount} style={{ textAlign: 'right' }}>
                        {formatAmount(reportData.procurementExpense)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.modalCloseBtn} 
                onClick={() => setActiveReport(null)}
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
