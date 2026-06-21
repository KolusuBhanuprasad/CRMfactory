import React from 'react';

const MetricCard = ({ label, value, className = '', icon }) => {
  return (
    <div className={`glass-card metric-card ${className}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="metric-label">{label}</div>
          <div className="metric-value">{value}</div>
        </div>
        {icon && (
          <div style={{ color: 'rgba(255, 255, 255, 0.15)', transform: 'scale(1.5)' }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
