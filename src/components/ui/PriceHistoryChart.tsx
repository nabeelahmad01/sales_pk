'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriceHistoryItem {
  price: number;
  date: Date | string;
}

interface PriceHistoryChartProps {
  priceHistory: PriceHistoryItem[];
  currentPrice: number;
}

export default function PriceHistoryChart({ priceHistory, currentPrice }: PriceHistoryChartProps) {
  // Add current price to history if not already there
  const history = [...priceHistory];
  if (history.length === 0) {
    // Generate mock history for demo
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i * 5);
      const variance = Math.random() * 500 - 250;
      history.push({
        date: date.toISOString(),
        price: currentPrice + variance + (i * 100),
      });
    }
    history.push({ date: new Date().toISOString(), price: currentPrice });
  }

  const labels = history.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' });
  });

  const prices = history.map(item => item.price);
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);
  const isAtLowest = currentPrice <= lowestPrice;

  const data = {
    labels,
    datasets: [
      {
        label: 'Price (PKR)',
        data: prices,
        fill: true,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        pointBackgroundColor: prices.map((p, i) => 
          i === prices.length - 1 ? '#10b981' : '#8b5cf6'
        ),
        pointRadius: prices.map((_, i) => 
          i === prices.length - 1 ? 8 : 4
        ),
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e1b4b',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => `Rs. ${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11,
          },
          callback: (value: any) => `Rs. ${(value / 1000).toFixed(0)}k`,
        },
      },
    },
  };

  return (
    <div className="price-chart-container">
      <div className="chart-header">
        <h4>📊 Price History</h4>
        {isAtLowest && (
          <span className="lowest-badge">🔥 Lowest Price!</span>
        )}
      </div>
      
      <div className="chart-stats">
        <div className="stat">
          <span className="stat-label">Highest</span>
          <span className="stat-value high">Rs. {highestPrice.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Lowest</span>
          <span className="stat-value low">Rs. {lowestPrice.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Current</span>
          <span className="stat-value current">Rs. {currentPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="chart-wrapper">
        <Line data={data} options={options as any} />
      </div>

      <style jsx>{`
        .price-chart-container {
          background: white;
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          box-shadow: var(--shadow-md);
        }

        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .chart-header h4 {
          margin: 0;
          font-size: 1rem;
        }

        .lowest-badge {
          background: linear-gradient(135deg, #10b981, #34d399);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .chart-stats {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .stat-value {
          font-size: 0.875rem;
          font-weight: 600;
        }

        .stat-value.high {
          color: #EF4444;
        }

        .stat-value.low {
          color: #10b981;
        }

        .stat-value.current {
          color: var(--primary-purple);
        }

        .chart-wrapper {
          height: 200px;
        }

        @media (max-width: 640px) {
          .chart-stats {
            gap: 1rem;
          }

          .stat-value {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
