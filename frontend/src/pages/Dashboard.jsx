import { useState, useEffect } from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import CategoryChart from '../components/dashboard/CategoryChart';
import RecentOrders from '../components/dashboard/RecentOrders';
import LowStockAlerts from '../components/dashboard/LowStockAlerts';
import * as dashboardApi from '../api/dashboard';
import styles from './Dashboard.module.css';

/* ── Fallback sample data (used when backend is unavailable) ── */
const sampleStats = [
  { label: 'Total Parts', value: '12,847', change: '+4.5%', changeText: 'vs last month', color: '#f59e0b' },
  { label: 'Active Orders', value: '384', change: '+12.3%', changeText: 'vs last month', color: '#3b82f6' },
  { label: 'Revenue (MTD)', value: '₹18.4L', change: '+8.1%', changeText: 'vs last month', color: '#10b981' },
  { label: 'Low Stock Items', value: '23', change: '-2.4%', changeText: 'vs last month', color: '#ef4444' },
];

const sampleRevenue = [
  { date: '1/4', revenue: 42000, orders: 18 },
  { date: '5/4', revenue: 58000, orders: 24 },
  { date: '9/4', revenue: 51000, orders: 20 },
  { date: '13/4', revenue: 73000, orders: 31 },
  { date: '17/4', revenue: 62000, orders: 27 },
  { date: '21/4', revenue: 89000, orders: 35 },
  { date: '25/4', revenue: 78000, orders: 32 },
  { date: '29/4', revenue: 95000, orders: 40 },
];

const sampleCategories = [
  { name: 'Engine Parts', value: 35, color: '#f59e0b' },
  { name: 'Electrical', value: 22, color: '#3b82f6' },
  { name: 'Brakes', value: 18, color: '#ef4444' },
  { name: 'Suspension', value: 12, color: '#10b981' },
  { name: 'Body Parts', value: 8, color: '#8b5cf6' },
  { name: 'Oils & Fluids', value: 5, color: '#f97316' },
];

const sampleOrders = [
  { id: '#ORD-9841', part: 'Brake Disc Set — Ceramic Pro', qty: 4, amount: 18400, status: 'Delivered' },
  { id: '#ORD-9840', part: 'Alternator Assembly — 120A', qty: 2, amount: 12600, status: 'In Transit' },
  { id: '#ORD-9839', part: 'Suspension Coil Spring Kit', qty: 6, amount: 9200, status: 'Pending' },
  { id: '#ORD-9838', part: 'Oil Filter — Premium Multi', qty: 24, amount: 4800, status: 'Delivered' },
  { id: '#ORD-9837', part: 'Headlight Assembly — LED', qty: 1, amount: 22500, status: 'Returned' },
];

const sampleAlerts = [
  { id: 1, name: 'Timing Belt Kit — Premium', sku: 'SKU-TB-4421', category: 'Engine Parts', remaining: 3 },
  { id: 2, name: 'Brake Caliper — Front Left', sku: 'SKU-BC-1102', category: 'Brakes', remaining: 5 },
  { id: 3, name: 'Spark Plug Set — Iridium', sku: 'SKU-SP-8834', category: 'Engine Parts', remaining: 7 },
  { id: 4, name: 'Power Steering Pump', sku: 'SKU-PS-2209', category: 'Steering', remaining: 2 },
  { id: 5, name: 'Clutch Plate — Heavy Duty', sku: 'SKU-CP-6617', category: 'Transmission', remaining: 4 },
];

function Dashboard() {
  const [stats, setStats] = useState(sampleStats);
  const [revenue, setRevenue] = useState(sampleRevenue);
  const [categories, setCategories] = useState(sampleCategories);
  const [orders, setOrders] = useState(sampleOrders);
  const [alerts, setAlerts] = useState(sampleAlerts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, revenueRes, catRes, ordersRes, alertsRes] = await Promise.allSettled([
          dashboardApi.getStats(),
          dashboardApi.getRevenueChart(),
          dashboardApi.getCategoryDistribution(),
          dashboardApi.getRecentOrders(),
          dashboardApi.getLowStockAlerts(),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value) {
          const statsData = statsRes.value;
          const mappedStats = [
            {
              label: 'Total SKUs',
              value: statsData.totalSkus !== undefined ? statsData.totalSkus.toLocaleString() : '0',
              change: `+${statsData.newSkusThisMonth || 0} new`,
              changeText: 'this month',
              color: '#f59e0b'
            },
            {
              label: 'Orders Today',
              value: statsData.ordersToday !== undefined ? statsData.ordersToday.toLocaleString() : '0',
              change: (statsData.orderChangePercent || 0) >= 0 ? `+${statsData.orderChangePercent || 0}%` : `${statsData.orderChangePercent || 0}%`,
              changeText: 'vs yesterday',
              color: '#3b82f6'
            },
            {
              label: 'Revenue MTD',
              value: statsData.revenueMtd !== undefined 
                ? (statsData.revenueMtd >= 100000 
                  ? `₹${(statsData.revenueMtd / 100000).toFixed(1)}L` 
                  : `₹${(statsData.revenueMtd / 1000).toFixed(1)}K`)
                : '₹0.0',
              change: (statsData.revenueChangePercent || 0) >= 0 ? `+${statsData.revenueChangePercent || 0}%` : `${statsData.revenueChangePercent || 0}%`,
              changeText: 'vs last month',
              color: '#10b981'
            },
            {
              label: 'Low Stock Items',
              value: statsData.lowStockItems !== undefined ? statsData.lowStockItems.toLocaleString() : '0',
              change: (statsData.lowStockChange || 0) >= 0 ? `+${statsData.lowStockChange || 0}` : `${statsData.lowStockChange || 0}`,
              changeText: 'from last week',
              color: '#ef4444'
            }
          ];
          setStats(mappedStats);
        }
        if (revenueRes.status === 'fulfilled' && revenueRes.value) setRevenue(revenueRes.value);
        if (catRes.status === 'fulfilled' && catRes.value) setCategories(catRes.value);
        if (ordersRes.status === 'fulfilled' && ordersRes.value) {
          const mappedOrders = ordersRes.value.map(item => ({
            id: item.orderId,
            part: item.partDescription,
            qty: item.quantity,
            amount: item.amount,
            status: item.status
          }));
          setOrders(mappedOrders);
        }
        if (alertsRes.status === 'fulfilled' && alertsRes.value) {
          const mappedAlerts = alertsRes.value.map((item, idx) => ({
            id: idx + 1,
            name: item.partName,
            sku: item.sku,
            category: item.category,
            remaining: item.remaining
          }));
          setAlerts(mappedAlerts);
        }
      } catch {
        // Use sample data on error — already set as defaults
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.statsGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`${styles.skeletonCard} skeleton`} />
          ))}
        </div>
        <div className={styles.chartsRow}>
          <div className={`${styles.skeletonChart} skeleton`} />
          <div className={`${styles.skeletonChart} skeleton`} />
        </div>
        <div className={styles.bottomRow}>
          <div className={`${styles.skeletonTable} skeleton`} />
          <div className={`${styles.skeletonTable} skeleton`} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} index={idx} />
        ))}
      </div>

      <div className={styles.chartsRow}>
        <RevenueChart data={revenue} />
        <CategoryChart data={categories} />
      </div>

      <div className={styles.bottomRow}>
        <RecentOrders orders={orders} />
        <LowStockAlerts alerts={alerts} />
      </div>
    </div>
  );
}

export default Dashboard;
