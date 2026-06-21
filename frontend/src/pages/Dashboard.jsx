import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import MetricCard from '../components/MetricCard';
import OpportunityCard from '../components/OpportunityCard';

const Dashboard = () => {
  const { user } = useAuth();
  
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [onlyMine, setOnlyMine] = useState(false);

  // Fetch all opportunities from backend
  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const response = await api.get('/opportunities');
      setOpportunities(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load opportunities.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOpportunities();
    }
  }, [user]);

  // Handle opportunity deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      try {
        await api.delete(`/opportunities/${id}`);
        // Remove from local state
        setOpportunities((prev) => prev.filter((opp) => opp._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete opportunity.');
      }
    }
  };

  // Compute CRM Metrics
  const computeMetrics = () => {
    if (!opportunities.length) {
      return {
        totalPipeline: '$0',
        activeDeals: 0,
        winRate: '0%',
        avgDealValue: '$0',
      };
    }

    const currentUserId = user?._id || user?.id;

    // Filter deals if "onlyMine" is toggled
    const targetOpportunities = onlyMine 
      ? opportunities.filter((opp) => (opp.owner?._id || opp.owner) === currentUserId)
      : opportunities;

    if (!targetOpportunities.length) {
      return {
        totalPipeline: '$0',
        activeDeals: 0,
        winRate: '0%',
        avgDealValue: '$0',
      };
    }

    // Pipeline: Sum of all non-lost deal values
    const pipelineSum = targetOpportunities
      .filter((o) => o.stage !== 'Lost')
      .reduce((sum, o) => sum + o.estimatedDealValue, 0);

    // Active Deals: Count of non-won, non-lost deals
    const activeDealsCount = targetOpportunities.filter(
      (o) => o.stage !== 'Won' && o.stage !== 'Lost'
    ).length;

    // Win Rate: Won / (Won + Lost) * 100
    const wonCount = targetOpportunities.filter((o) => o.stage === 'Won').length;
    const lostCount = targetOpportunities.filter((o) => o.stage === 'Lost').length;
    const totalClosed = wonCount + lostCount;
    const winRateVal = totalClosed > 0 ? Math.round((wonCount / totalClosed) * 100) : 0;

    // Average Deal Value: average of all deals
    const avgVal = targetOpportunities.reduce((sum, o) => sum + o.estimatedDealValue, 0) / targetOpportunities.length;

    const formatUSD = (val) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(val);
    };

    return {
      totalPipeline: formatUSD(pipelineSum),
      activeDeals: activeDealsCount,
      winRate: `${winRateVal}%`,
      avgDealValue: formatUSD(avgVal),
    };
  };

  const metrics = computeMetrics();

  // Apply filters
  const filteredOpportunities = opportunities.filter((opp) => {
    // Search Term Filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      opp.customerName.toLowerCase().includes(searchLower) ||
      opp.contactName.toLowerCase().includes(searchLower) ||
      opp.contactEmail.toLowerCase().includes(searchLower);

    // Stage Filter
    const matchesStage = stageFilter === 'All' || opp.stage === stageFilter;

    // Priority Filter
    const matchesPriority = priorityFilter === 'All' || opp.priority === priorityFilter;

    // Ownership Filter
    const oppOwnerId = opp.owner?._id || opp.owner;
    const currentUserId = user?._id || user?.id;
    const matchesOwnership = !onlyMine || oppOwnerId === currentUserId;

    return matchesSearch && matchesStage && matchesPriority && matchesOwnership;
  });

  return (
    <div className="main-content">
      {/* Top Banner */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="dashboard-title" style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>
          Sales Pipeline
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Welcome back, <strong style={{ color: 'var(--accent)' }}>{user?.name}</strong>. Here is your team's CRM opportunity activity.
        </p>
      </div>

      {error && (
        <div className="form-error" style={{ marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {/* CRM Metrics Block */}
      <div className="metrics-grid">
        <MetricCard
          label="Total Active Pipeline"
          value={metrics.totalPipeline}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          }
        />
        <MetricCard
          label="Avg Deal Value"
          value={metrics.avgDealValue}
          className="accent"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m16 10-4 4-4-4"/></svg>
          }
        />
        <MetricCard
          label="Conversion Win Rate"
          value={metrics.winRate}
          className="won"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/><path d="M12 2a4 4 0 0 0-4 4v5a4 4 0 0 0 4 4 4 4 0 0 0 4-4V6a4 4 0 0 0-4-4z"/></svg>
          }
        />
        <MetricCard
          label="Deals in Discussion"
          value={metrics.activeDeals}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          }
        />
      </div>

      {/* Filter and Control Area */}
      <div className="glass-card filter-bar">
        <div className="search-container">
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            id="search-input"
            type="text"
            placeholder="Search customer, contact, or email..."
            className="form-input search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <select
            id="stage-filter"
            className="form-input"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
          >
            <option value="All">All Stages</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div>
          <select
            id="priority-filter"
            className="form-input"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="toggle-container" onClick={() => setOnlyMine((prev) => !prev)}>
          <input
            id="only-mine-toggle"
            type="checkbox"
            className="toggle-checkbox"
            checked={onlyMine}
            onChange={() => {}} // Controlled via container click
          />
          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>My Opportunities</span>
        </div>
      </div>

      {/* Grid Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          Opportunities ({filteredOpportunities.length})
        </h2>
        <Link to="/opportunity/new" className="btn btn-primary" id="new-opportunity-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          <span>Create Opportunity</span>
        </Link>
      </div>

      {/* Grid of Cards */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
          <p style={{ color: 'var(--text-muted)' }}>Fetching opportunities...</p>
        </div>
      ) : filteredOpportunities.length > 0 ? (
        <div className="opportunities-grid">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard
              key={opp._id}
              opportunity={opp}
              currentUser={user}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
          <h3>No deals found</h3>
          <p style={{ maxWidth: '400px' }}>
            There are no opportunities matching your current filters. Try resetting search fields, checking other stages, or create a brand new lead.
          </p>
          <Link to="/opportunity/new" className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
            Create New Opportunity
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
