import React from 'react';
import { Link } from 'react-router-dom';

const OpportunityCard = ({ opportunity, currentUser, onDelete }) => {
  const {
    _id,
    customerName,
    contactName,
    contactEmail,
    contactPhone,
    requirementSummary,
    estimatedDealValue,
    stage,
    priority,
    nextFollowUpDate,
    notes,
    owner,
  } = opportunity;

  const isOwner = currentUser && owner && (currentUser._id === owner._id || currentUser.id === owner._id);

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Format follow-up date
  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Check if follow-up is overdue
  const isDateOverdue = () => {
    if (!nextFollowUpDate || stage === 'Won' || stage === 'Lost') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(nextFollowUpDate) < today;
  };

  return (
    <div className={`glass-card opportunity-card ${isOwner ? 'is-owner animate-fade-in' : 'animate-fade-in'}`}>
      <div>
        <div className="opportunity-header">
          <h3 className="opportunity-company" title={customerName}>{customerName}</h3>
          <div className="opportunity-value">{formatCurrency(estimatedDealValue)}</div>
        </div>

        <div className="opportunity-contact">
          <div className="opportunity-contact-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>{contactName}</span>
          </div>
          <div className="opportunity-contact-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <span style={{ wordBreak: 'break-all' }}>{contactEmail}</span>
          </div>
          {contactPhone && (
            <div className="opportunity-contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>{contactPhone}</span>
            </div>
          )}
        </div>

        <p className="opportunity-summary">{requirementSummary}</p>

        <div className="opportunity-badges">
          <span className={`badge badge-stage-${stage.toLowerCase().replace(' ', '-')}`}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'currentColor',
              display: 'inline-block'
            }} />
            {stage}
          </span>
          <span className={`badge badge-priority-${priority.toLowerCase()}`}>
            {priority} Priority
          </span>
        </div>

        {nextFollowUpDate && (
          <div className={`date-follow-up ${isDateOverdue() ? 'overdue' : ''}`} style={{ marginBottom: '1rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
            <span>Follow-up: {formatDate(nextFollowUpDate)} {isDateOverdue() && '(Overdue)'}</span>
          </div>
        )}

        {notes && (
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--text-dim)',
            background: 'rgba(0, 0, 0, 0.15)',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            borderLeft: '2px solid var(--text-dim)',
            marginTop: '0.5rem',
            marginBottom: '1rem',
            fontStyle: 'italic'
          }}>
            "{notes}"
          </div>
        )}
      </div>

      <div className="opportunity-footer">
        <div className="opportunity-owner">
          <span>Owner</span>
          <span className="opportunity-owner-name">{owner ? owner.name : 'Unknown'}</span>
        </div>

        {isOwner && (
          <div className="opportunity-actions">
            <Link
              to={`/opportunity/edit/${_id}`}
              className="btn btn-secondary btn-icon"
              title="Edit Deal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </Link>
            <button
              onClick={() => onDelete(_id)}
              className="btn btn-danger btn-icon"
              title="Delete Deal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityCard;
