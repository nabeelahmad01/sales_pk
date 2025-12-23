'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sales } from '@/data/mockData';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Get sales for a specific date
  const getSalesForDate = (day: number) => {
    const date = new Date(year, month, day);
    return sales.filter(sale => {
      const start = new Date(sale.startDate);
      const end = new Date(sale.endDate);
      return date >= start && date <= end;
    });
  };

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  return (
    <>
      <div className="calendar-page">
        <div className="container">
          {/* Header */}
          <div className="calendar-header">
            <div>
              <h1>📅 Sale Calendar</h1>
              <p>View all active and upcoming sales</p>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="calendar-nav">
            <button onClick={prevMonth} className="nav-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <h2 className="month-title">{monthNames[month]} {year}</h2>
            <button onClick={nextMonth} className="nav-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="calendar-container">
            <div className="calendar-weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>
            
            <div className="calendar-grid">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="calendar-day empty"></div>;
                }
                
                const daySales = getSalesForDate(day);
                const hasSales = daySales.length > 0;
                
                return (
                  <div 
                    key={day} 
                    className={`calendar-day ${isToday(day) ? 'today' : ''} ${hasSales ? 'has-sales' : ''}`}
                  >
                    <span className="day-number">{day}</span>
                    {hasSales && (
                      <div className="day-sales">
                        {daySales.slice(0, 3).map(sale => (
                          <Link 
                            href={`/sales/${sale.id}`} 
                            key={sale.id}
                            className="sale-dot"
                            title={`${sale.brandName}: ${sale.title}`}
                          >
                            <span className="sale-badge">{sale.discountPercentage}%</span>
                          </Link>
                        ))}
                        {daySales.length > 3 && (
                          <span className="more-sales">+{daySales.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-dot today-dot"></span>
              <span>Today</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot sale-dot-legend"></span>
              <span>Active Sale</span>
            </div>
          </div>

          {/* Upcoming Sales List */}
          <div className="upcoming-section">
            <h3>🔥 This Month's Sales</h3>
            <div className="upcoming-grid">
              {sales.filter(sale => {
                const end = new Date(sale.endDate);
                return end.getMonth() === month && end.getFullYear() === year;
              }).slice(0, 6).map(sale => (
                <Link href={`/sales/${sale.id}`} key={sale.id} className="upcoming-card">
                  <div className="upcoming-discount">{sale.discountPercentage}%</div>
                  <div className="upcoming-info">
                    <span className="upcoming-brand">{sale.brandName}</span>
                    <h4>{sale.title}</h4>
                    <span className="upcoming-date">
                      Ends: {new Date(sale.endDate).toLocaleDateString('en-PK', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .calendar-page {
          padding: 2rem 0 4rem;
          min-height: calc(100vh - 160px);
        }

        .calendar-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .calendar-header h1 {
          margin-bottom: 0.5rem;
        }

        .calendar-header p {
          color: var(--text-secondary);
        }

        .calendar-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .nav-btn {
          background: white;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 0.75rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .nav-btn:hover {
          border-color: var(--primary-purple);
          color: var(--primary-purple);
        }

        .month-title {
          font-size: 1.5rem;
          min-width: 200px;
          text-align: center;
        }

        .calendar-container {
          background: white;
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }

        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          background: var(--primary-gradient);
          color: white;
        }

        .weekday {
          padding: 1rem;
          text-align: center;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }

        .calendar-day {
          min-height: 100px;
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          position: relative;
        }

        .calendar-day.empty {
          background: var(--bg-light);
        }

        .calendar-day.today {
          background: rgba(139, 92, 246, 0.1);
        }

        .calendar-day.today .day-number {
          background: var(--primary-gradient);
          color: white;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .day-number {
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text-primary);
        }

        .day-sales {
          margin-top: 0.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .sale-dot {
          text-decoration: none;
        }

        .sale-badge {
          display: inline-block;
          background: linear-gradient(135deg, #EF4444, #F97316);
          color: white;
          font-size: 0.625rem;
          font-weight: 700;
          padding: 0.125rem 0.375rem;
          border-radius: var(--radius-full);
        }

        .more-sales {
          font-size: 0.625rem;
          color: var(--text-muted);
          padding: 0.125rem 0.25rem;
        }

        .calendar-legend {
          display: flex;
          gap: 2rem;
          justify-content: center;
          margin-top: 1.5rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .today-dot {
          background: var(--primary-gradient);
        }

        .sale-dot-legend {
          background: linear-gradient(135deg, #EF4444, #F97316);
        }

        .upcoming-section {
          margin-top: 3rem;
        }

        .upcoming-section h3 {
          margin-bottom: 1.5rem;
        }

        .upcoming-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .upcoming-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: white;
          padding: 1rem;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          text-decoration: none;
          transition: all var(--transition-normal);
        }

        .upcoming-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .upcoming-discount {
          background: var(--primary-gradient);
          color: white;
          font-size: 1.25rem;
          font-weight: 800;
          padding: 0.75rem;
          border-radius: var(--radius-lg);
          min-width: 60px;
          text-align: center;
        }

        .upcoming-brand {
          font-size: 0.75rem;
          color: var(--primary-purple);
          text-transform: uppercase;
          font-weight: 600;
        }

        .upcoming-info h4 {
          font-size: 0.875rem;
          margin: 0.25rem 0;
          color: var(--text-primary);
        }

        .upcoming-date {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        @media (max-width: 1024px) {
          .upcoming-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .calendar-day {
            min-height: 60px;
            padding: 0.25rem;
          }

          .weekday {
            padding: 0.5rem;
            font-size: 0.75rem;
          }

          .day-number {
            font-size: 0.75rem;
          }

          .sale-badge {
            font-size: 0.5rem;
            padding: 0.1rem 0.25rem;
          }

          .upcoming-grid {
            grid-template-columns: 1fr;
          }

          .calendar-legend {
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }
        }
      `}</style>
    </>
  );
}
