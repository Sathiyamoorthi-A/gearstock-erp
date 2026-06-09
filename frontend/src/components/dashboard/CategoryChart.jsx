import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import styles from './CategoryChart.module.css';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const entry = payload[0];
  return (
    <div
      style={{
        background: 'rgba(15, 15, 23, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: '10px 14px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <p style={{ color: entry.payload.color, fontSize: 13, fontWeight: 600 }}>
        {entry.name}: {entry.value}%
      </p>
    </div>
  );
};

function CategoryChart({ data }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Parts by Category</h3>

      <div className={styles.chartWrapper}>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
                animationBegin={200}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color}
                    style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.3))' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.legend}>
          {data.map((item, idx) => (
            <div key={idx} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: item.color }}
              />
              <span>{item.name}</span>
              <span className={styles.legendValue}>{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryChart;
