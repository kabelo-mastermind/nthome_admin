"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Subscribers.css';
import { FaDownload } from "react-icons/fa";
import { api } from "../../api";
import { useNavigate } from "react-router-dom";

// Icons
const EyeIcon = () => (
  <svg className="icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1.5 12s4-7 10.5-7 10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EditIcon = () => (
  <svg className="icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M15.232 5.232l3.536 3.536M9 13l6-6M3 21h18" />
  </svg>
);
const TrashIcon = () => (
  <svg className="icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H7V5a2 2 0 012-2z" />
  </svg>
);

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [currentDocs, setCurrentDocs] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/active_drivers_simple');
        // Use res.data.drivers instead of res.data.rows
        setSubscribers(res.data.drivers || []);
      } catch (err) {
        setError("Failed to load subscriber data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'All' || subscriber.plan_name === filterPlan;
    // Since all subscribers from API are active, we can hardcode status or use subscription_status
    const matchesStatus = filterStatus === 'All' || 
                         (filterStatus === 'active' && subscriber.subscription_status === 1) ||
                         (filterStatus === 'inactive' && subscriber.subscription_status !== 1);
    
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const plans = ['All', 'Weekly', 'Monthly'];
  const statuses = ['All', 'active', 'inactive'];

  const handleEditSubscriber = (id) => {
    navigate(`/adminapp/edit-subscriber/${id}`);
  };

  const handleDeleteSubscriber = (id) => {
    if (window.confirm("Are you sure you want to delete this subscriber?")) {
      alert(`Delete subscriber with ID: ${id}`);
      // Implement actual delete functionality
    }
  };

  const openDocModal = (subscriber) => {
    setCurrentDocs({
      subscription_details: subscriber.subscription_details,
      payment_proof: subscriber.payment_proof,
      name: `${subscriber.name} ${subscriber.lastName}`,
    });
    setDocModalOpen(true);
  };

  const closeDocModal = () => {
    setDocModalOpen(false);
    setCurrentDocs(null);
  };

  if (loading) return <p className="p-6 text-gray-500">Loading subscribers...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="subscribers-page">
      <h1>Subscribers</h1>
      <p className="page-description">Manage your driver subscribers and their subscription plans</p>

      <div className="subscribers-stats">
        <div className="stat-card">
          <h3>{subscribers.length}</h3>
          <p>Total Subscribers</p>
        </div>
        <div className="stat-card">
          <h3>{subscribers.filter(s => s.subscription_status === 1).length}</h3>
          <p>Active Subscribers</p>
        </div>
        <div className="stat-card">
          <h3>{subscribers.filter(s => s.plan_name === 'Weekly').length}</h3>
          <p>Weekly Plans</p>
        </div>
        <div className="stat-card">
          <h3>{subscribers.filter(s => s.plan_name === 'Monthly').length}</h3>
          <p>Monthly Plans</p>
        </div>
      </div>

      <div className="filters-container">
        <input
          type="text"
          placeholder="Search subscribers..."
          className="subscriber-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="filter-group">
          <select value={filterPlan} onChange={(e) => setFilterPlan(e.target.value)}>
            {plans.map(plan => (
              <option key={plan} value={plan}>{plan} Plan</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="subscriber-card-list">
        {filteredSubscribers.length > 0 ? (
          filteredSubscribers.map((s) => (
            <div className="subscriber-card" key={s.user_id}>
              <div className="subscriber-card-header">
                <div className="subscriber-card-info">
                  <img
                    src="/images/placeholder.jpg" // Default placeholder since API doesn't provide profile pictures
                    alt={s.name}
                    className="subscriber-card-avatar"
                  />
                  <div>
                    <h2 className="subscriber-card-name">{s.name} {s.lastName}</h2>
                    <p className="subscriber-card-email">{s.email}</p>
                  </div>
                </div>
              </div>

              <div className="subscriber-card-section">
                <p><strong>Phone:</strong> {s.phoneNumber || 'N/A'}</p>
                <p><strong>Plan:</strong> 
                  <span className={`plan-badge ${s.plan_name?.toLowerCase()}`}>
                    {s.plan_name}
                  </span>
                </p>
              </div>

              <div className="subscriber-card-section">
                <p><strong>Status:</strong>
                  <span className={`status-badge ${s.subscription_status === 1 ? "status-approved" : "status-pending"}`}>
                    {s.subscription_status === 1 ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>

              <div className="subscriber-card-section">
                <p><strong>Subscription Date:</strong> {s.subscription_date ? new Date(s.subscription_date).toLocaleDateString("en-GB") : 'N/A'}</p>
              </div>

              <div className="subscriber-card-section">
                <button className="document-btn" onClick={() => openDocModal(s)}>
                  <FaDownload />View Documents
                </button>
              </div>

              <div className="subscriber-card-actions">
                <button className="action-btn" onClick={() => alert(`View details for ${s.name}`)}>
                  <EyeIcon />
                </button>
                <button className="action-btn" onClick={() => handleEditSubscriber(s.user_id)}>
                  <EditIcon />
                </button>
                <button className="action-btn delete" onClick={() => handleDeleteSubscriber(s.user_id)}>
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-subscribers">No subscribers found.</p>
        )}
      </div>

      {/* Documents Modal */}
      {docModalOpen && currentDocs && (
        <div className="modal-overlay" onClick={closeDocModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Documents for {currentDocs.name}</h3>
            <ul className="doc-list">
              <li>Subscription details not available</li>
              <li>Payment proof not available</li>
            </ul>
            <button className="modal-close-btn" onClick={closeDocModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscribers;