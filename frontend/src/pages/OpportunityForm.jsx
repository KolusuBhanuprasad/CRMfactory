import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const OpportunityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    customerName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    requirementSummary: '',
    estimatedDealValue: '',
    stage: 'New',
    priority: 'Medium',
    nextFollowUpDate: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState('');

  // Fetch opportunity data if in edit mode
  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const response = await api.get(`/opportunities/${id}`);
        const opp = response.data;

        // Check ownership
        const oppOwnerId = opp.owner._id || opp.owner;
        const currentUserId = user._id || user.id;
        
        if (oppOwnerId !== currentUserId) {
          setError('Access Denied: You can only edit opportunities that you own.');
          setFetching(false);
          return;
        }

        // Format date to YYYY-MM-DD for the date input field
        let formattedDate = '';
        if (opp.nextFollowUpDate) {
          formattedDate = new Date(opp.nextFollowUpDate).toISOString().split('T')[0];
        }

        setFormData({
          customerName: opp.customerName || '',
          contactName: opp.contactName || '',
          contactEmail: opp.contactEmail || '',
          contactPhone: opp.contactPhone || '',
          requirementSummary: opp.requirementSummary || '',
          estimatedDealValue: opp.estimatedDealValue || '',
          stage: opp.stage || 'New',
          priority: opp.priority || 'Medium',
          nextFollowUpDate: formattedDate,
          notes: opp.notes || '',
        });
        setFetching(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch opportunity data.');
        setFetching(false);
      }
    };

    if (isEditMode && user) {
      fetchOpportunity();
    }
  }, [id, isEditMode, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Frontend validation
    if (
      !formData.customerName ||
      !formData.contactName ||
      !formData.contactEmail ||
      !formData.requirementSummary ||
      formData.estimatedDealValue === ''
    ) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        estimatedDealValue: Number(formData.estimatedDealValue),
        // Send null if date is empty
        nextFollowUpDate: formData.nextFollowUpDate ? new Date(formData.nextFollowUpDate) : null,
      };

      if (isEditMode) {
        await api.put(`/opportunities/${id}`, payload);
      } else {
        await api.post('/opportunities', payload);
      }

      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while saving the opportunity.');
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading opportunity data...</p>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="glass-card form-page-card animate-fade-in">
        <h2 className="dashboard-title" style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
          {isEditMode ? 'Edit Opportunity' : 'New Sales Opportunity'}
        </h2>
        <p className="form-subtitle" style={{ marginBottom: '2rem' }}>
          {isEditMode ? 'Update your deal details' : 'Create a new client contract pipeline opportunity'}
        </p>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {/* Form is only editable if there is no error or it is not an edit restriction error */}
        {(!error || !error.includes('Access Denied')) && (
          <form onSubmit={handleSubmit} id="opportunity-form">
            <h3 style={{ fontSize: '1.1rem', color: 'var(--accent)', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.3rem' }}>
              Company & Financials
            </h3>
            
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="customerName">Customer/Company Name *</label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  placeholder="e.g. Acme Corp"
                  className="form-input"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="estimatedDealValue">Estimated Deal Value ($) *</label>
                <input
                  id="estimatedDealValue"
                  name="estimatedDealValue"
                  type="number"
                  placeholder="e.g. 50000"
                  min="0"
                  className="form-input"
                  value={formData.estimatedDealValue}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', color: 'var(--accent)', marginTop: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.3rem' }}>
              Primary Contact Details
            </h3>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="contactName">Contact Name *</label>
                <input
                  id="contactName"
                  name="contactName"
                  type="text"
                  placeholder="Jane Smith"
                  className="form-input"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contactEmail">Contact Email *</label>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  placeholder="janesmith@company.com"
                  className="form-input"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contactPhone">Contact Phone</label>
              <input
                id="contactPhone"
                name="contactPhone"
                type="text"
                placeholder="+1 (555) 019-2834"
                className="form-input"
                value={formData.contactPhone}
                onChange={handleChange}
              />
            </div>

            <h3 style={{ fontSize: '1.1rem', color: 'var(--accent)', marginTop: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.3rem' }}>
              Deal Specs & Tracking
            </h3>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="stage">Stage *</label>
                <select
                  id="stage"
                  name="stage"
                  className="form-input"
                  value={formData.stage}
                  onChange={handleChange}
                  required
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="priority">Priority *</label>
                <select
                  id="priority"
                  name="priority"
                  className="form-input"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="nextFollowUpDate">Next Follow-up Date</label>
                <input
                  id="nextFollowUpDate"
                  name="nextFollowUpDate"
                  type="date"
                  className="form-input"
                  value={formData.nextFollowUpDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="requirementSummary">Requirement Summary *</label>
              <textarea
                id="requirementSummary"
                name="requirementSummary"
                placeholder="Detail the client's requirements, scope of work, and technology needs..."
                className="form-input form-textarea"
                value={formData.requirementSummary}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="notes">Internal Notes</label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Log call updates, competitor mentions, or specific actions..."
                className="form-input form-textarea"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                id="opportunity-submit"
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Opportunity' : 'Create Opportunity'}
              </button>
            </div>
          </form>
        )}

        {error && error.includes('Access Denied') && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityForm;
