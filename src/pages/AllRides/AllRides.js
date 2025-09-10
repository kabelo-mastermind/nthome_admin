"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import "./AllRides.css";
import { 
  FaDownload, 
  FaMapMarkerAlt, 
  FaMoneyBillWave, 
  FaUser, 
  FaCar, 
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaClock,
  FaRoute,
  FaCreditCard,
  FaMoneyBill
} from "react-icons/fa";
import { api } from "../../api";
import { FaEdit, FaTrash } from 'react-icons/fa';

// Eye Icon
const EyeIcon = () => (
  <svg className="icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1.5 12s4-7 10.5-7 10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Helper component for modal details
const DetailItem = ({ label, value, badgeClass }) => (
  <div className="detail-item">
    <span className="detail-label">{label}:</span>
    {badgeClass ? (
      <span className={`detail-value ${badgeClass}`}>{value}</span>
    ) : (
      <span className="detail-value">{value}</span>
    )}
  </div>
);

function AllRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    sortBy: "requestDate",
    sortOrder: "desc"
  });
  const [showFilters, setShowFilters] = useState(false);
  const limit = 10;
  const [editingRide, setEditingRide] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [userCache, setUserCache] = useState({});

  // Handle edit form changes
  const handleEditChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  // Fetch payment details for a trip
  const fetchPaymentDetails = async (tripId) => {
    try {
      setPaymentLoading(true);
      const res = await axios.get(`${api}payment/${tripId}`);
      setPaymentDetails(res.data);
      console.log('Payment details fetched:', res.data);
      
    } catch (error) {
      console.error('Error fetching payment details:', error);
      setPaymentDetails(null);
    } finally {
      setPaymentLoading(false);
    }
  };

  // Open view details modal
  const openDetailsModal = async (ride) => {
    try {
      setSelectedRide(ride);
      const tripId = ride.id || ride.id || ride._id;
      if (!tripId) {
        setPaymentDetails(null);
        console.error('Trip ID not found for payment details.');
        return;
      }
      await fetchPaymentDetails(tripId);
    } catch (error) {
      console.error('Error opening details modal:', error);
    }
  };

  // Open edit modal
// Open edit modal
const openEditModal = async (ride) => {
  try {
    const tripId = ride.id || ride.id || ride._id;
    if (!tripId) {
      alert("Trip ID not found for this ride.");
      return;
    }
    
    // Fetch both trip details and payment details
    const [tripRes, paymentRes] = await Promise.all([
      axios.get(`${api}trip/${tripId}`),
      axios.get(`${api}payment/${tripId}`)
    ]);
    
    const tripDetails = tripRes.data;
    const paymentData = paymentRes.data;

    setSelectedRide(tripDetails);
    setEditingRide(tripDetails);
    setPaymentDetails(paymentData);
    setEditForm({
      pickUpLocation: tripDetails.pickUpLocation,
      dropOffLocation: tripDetails.dropOffLocation,
      statuses: tripDetails.statuses,
    //   vehicle_type: tripDetails.vehicle_type,
      pickupTime: tripDetails.pickupTime,
      dropOffTime: tripDetails.dropOffTime,
      distance_traveled: tripDetails.distance_traveled,
      duration_minutes: tripDetails.duration_minutes,
      payment_status: tripDetails.payment_status,
      driver_ratings: tripDetails.driver_ratings,
      customer_rating: tripDetails.customer_rating,
      driver_feedback: tripDetails.driver_feedback,
      customer_feedback: tripDetails.customer_feedback,
      cancellation_reason: tripDetails.cancellation_reason,
      cancel_by: tripDetails.cancel_by,
    });
  } catch (error) {
    console.error("Error fetching trip details:", error);
    
    // Re-declare tripId in the catch block scope
    const tripId = ride.id || ride.id || ride._id;
    
    if (error.response?.status === 404) {
      // Payment not found, but we can still proceed with trip details
      try {
        const tripRes = await axios.get(`${api}trip/${tripId}`);
        const tripDetails = tripRes.data;
        
        setSelectedRide(tripDetails);
        setEditingRide(tripDetails);
        setPaymentDetails(null);
        
        setEditForm({
          pickUpLocation: tripDetails.pickUpLocation,
          dropOffLocation: tripDetails.dropOffLocation,
          statuses: tripDetails.statuses,
        //   vehicle_type: tripDetails.vehicle_type,
          pickupTime: tripDetails.pickupTime,
          dropOffTime: tripDetails.dropOffTime,
          distance_traveled: tripDetails.distance_traveled,
          duration_minutes: tripDetails.duration_minutes,
          payment_status: tripDetails.payment_status,
          driver_ratings: tripDetails.driver_ratings,
          customer_rating: tripDetails.customer_rating,
          driver_feedback: tripDetails.driver_feedback,
          customer_feedback: tripDetails.customer_feedback,
          cancellation_reason: tripDetails.cancellation_reason,
          cancel_by: tripDetails.cancel_by,
        });
      } catch (tripError) {
        console.error("Error fetching trip details in fallback:", tripError);
        alert("Failed to load trip details");
      }
    } else {
      alert("Failed to load trip details");
    }
  }
};

  // Submit edit
  const submitEdit = async () => {
    try {
      setIsSubmitting(true);
      await axios.put(`${api}trip/${editingRide.id}`, { updates: editForm, user_id:"1" });
      // Refresh the data
      fetchRides(false);
      setEditingRide(null);
      setSelectedRide(null);
    } catch (error) {
      console.error('Error updating trip:', error);
      alert('Failed to update trip');
    } finally {
      setIsSubmitting(false);
    }
  };


  // Delete trip
  const deleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      return;
    }

    try {
    await axios.delete(`${api}trip/${tripId}`, { data: { user_id: 1 } });
      // Refresh the data
      fetchRides(false);
      setSelectedRide(null);
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert('Failed to delete trip');
    }
  };

  // Fetch rides
  const fetchRides = async (append = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: (append ? offset : 0).toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.status && { status: filters.status })
      });

      const res = await axios.get(`${api}allTrips?${params}`);
      const data = res.data.data || res.data;

      if (append) setRides((prev) => [...prev, ...data]);
      else setRides(data);

      setHasMore(data.length === limit);
      setOffset((prev) => prev + data.length);
    } catch (err) {
      setError("Failed to load ride data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user details by ID (customer or driver)
  const fetchUserDetails = async (userId) => {
    if (!userId) return null;
    if (userCache[userId]) return userCache[userId];

    try {
      const res = await axios.get(`${api}customer?id=${userId}`);
      setUserCache(prev => ({ ...prev, [userId]: res.data }));
      return res.data;
    } catch (err) {
      console.error("Failed to fetch user:", err);
      return null;
    }
  };

  // Fetch user details for all rides (for grid display)
  useEffect(() => {
    const fetchAllUsers = async () => {
      const ids = new Set();
      rides.forEach(r => {
        if (r.customerId) ids.add(r.customerId);
        if (r.driverId) ids.add(r.driverId);
      });
      for (const id of ids) {
        await fetchUserDetails(id);
      }
    };
    if (rides.length) fetchAllUsers();
    // eslint-disable-next-line
  }, [rides]);

  useEffect(() => { 
    setOffset(0);
    fetchRides(false); 
  }, [filters]);

  const filteredRides = rides.filter(
    (ride) =>
      ride.customerId?.toString().includes(searchTerm.toLowerCase()) ||
      ride.driverId?.toString().includes(searchTerm.toLowerCase()) ||
      ride.pickUpLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.dropOffLocation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => date ? new Date(date).toLocaleString("en-GB") : "N/A";
  const formatTime = (date) => date ? new Date(date).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' }) : "N/A";

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return "status-completed";
      case "cancelled": return "status-cancelled";
      case "on-going": return "status-going";
      case "pending": return "status-pending";
      default: return "status-pending";
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "paid": return "status-paid";
      case "failed": return "status-cancelled";
      case "pending": return "status-pending";
      case "refunded": return "status-progress";
      default: return "status-pending";
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: "", sortBy: "requestDate", sortOrder: "desc" });
  };

  // === CSV Export Function ===
  const exportCSV = () => {
    if (!filteredRides.length) return;

    const headers = [
      "Trip ID",
      "Customer ID",
      "Driver ID",
      "Vehicle Type",
      "Status",
      "Request Date",
      "Pickup Time",
      "Dropoff Time",
      "Completion Date",
      "Pickup Location",
      "Dropoff Location",
      "Distance (km)",
      "Duration (min)",
      "Amount", // Changed from Fare to Amount
      "Payment Status",
      "Driver Rating",
      "Customer Rating",
      "Cancellation Reason",
      "Cancelled By",
      "Driver Feedback",
      "Customer Feedback"
    ];

    const rows = filteredRides.map(r => [
      r.id,
      r.customerId,
      r.driverId || "Not assigned",
      r.vehicle_type || "N/A",
      r.statuses,
      r.requestDate,
      r.pickupTime,
      r.dropOffTime,
      r.currentDate,
      r.pickUpLocation,
      r.dropOffLocation,
      r.distance_traveled || "N/A",
      r.duration_minutes || "N/A",
      r.amount || "N/A", // Changed from fare to amount
      r.payment_status || "N/A",
      r.driver_ratings || "N/A",
      r.customer_rating || "N/A",
      r.cancellation_reason || "N/A",
      r.cancel_by || "N/A",
      r.driver_feedback || "N/A",
      r.customer_feedback || "N/A"
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rides_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCarTypeName = (type) => {
    if (type === 1 || type === "1") return "nthome_black";
    if (type === 2 || type === "2") return "nthome_x";
    return "Unknown";
  };

  return (
    <div className="admin-rides-page">
      {/* Header */}
      <div className="page-header">
        <h1>All Rides</h1>
        <div className="header-actions">
          <button onClick={exportCSV} className="export-csv-btn">
            <FaDownload /> Export CSV
          </button>
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="controls-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by customer, driver, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Status</label>
              <select 
                value={filters.status} 
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="filter-select"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select 
                value={filters.sortBy} 
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="filter-select"
              >
                <option value="requestDate">Request Date</option>
                <option value="currentDate">Completion Date</option>
                <option value="amount">Amount</option> 
              </select>
            </div>

            <div className="filter-group">
              <label>Order</label>
              <select 
                value={filters.sortOrder} 
                onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
                className="filter-select"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>

            <button className="clear-filters" onClick={clearFilters}>
              <FaTimes /> Clear
            </button>
          </div>
        )}
      </div>

      {/* Loading and Error States */}
      {loading && rides.length === 0 && <p>Loading rides...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Rides Grid */}
      <div className="rides-grid">
        {filteredRides.length > 0 ? filteredRides.map((ride) => (
          <div className="ride-card" key={ride.id}>
            <div className="card-header">
              <div className="ride-id">
                <FaCar className="header-icon" />
                <span>Ride #{ride.id}</span>
              </div>
              <span className={`status-badge ${getStatusBadgeClass(ride.statuses)}`}>
                {ride.statuses}
              </span>
            </div>

            <div className="card-content">
              <div className="info-row">
                <FaUser className="info-icon customer" />
                <div className="info-text">
                  <span className="label">Customer</span>
                  <span className="value">
                    {userCache[ride.customerId]
                      ? `${userCache[ride.customerId].name} (${userCache[ride.customerId].email})`
                      : ride.customerId}
                  </span>
                </div>
              </div>

              <div className="info-row">
                <FaUser className="info-icon driver" />
                <div className="info-text">
                  <span className="label">Driver</span>
                  <span className="value">
                    {ride.driverId
                      ? (userCache[ride.driverId]
                          ? `${userCache[ride.driverId].name} (${userCache[ride.driverId].email})`
                          : ride.driverId)
                      : "Not assigned"}
                  </span>
                </div>
              </div>

              <div className="info-row">
                <FaRoute className="info-icon" />
                <div className="info-text">
                  <span className="label">Route</span>
                  <span className="value">{ride.pickUpLocation} → {ride.dropOffLocation}</span>
                </div>
              </div>
            </div>

            <div className="card-actions">
              <button className="view-details-btn" onClick={() => openDetailsModal(ride)}>
                <EyeIcon /> View Details
              </button>
              <button className="edit-btn" onClick={() => openEditModal(ride)}>
                <FaEdit /> Edit
              </button>
              <button className="delete-btn" onClick={() => deleteTrip(ride.id)}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        )) : <p>No rides found</p>}
      </div>

      {hasMore && !loading && (
        <button className="load-more-btn" onClick={() => fetchRides(true)}>Load More Rides</button>
      )}

      {/* View Details Modal */}
      {selectedRide && (
        <div className="modal-overlay" onClick={() => {
          setSelectedRide(null);
          setPaymentDetails(null);
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Trip Details #{selectedRide.id}</h2>
              <button className="modal-close" onClick={() => {
                setSelectedRide(null);
                setPaymentDetails(null);
              }}><FaTimes /></button>
            </div>

            <div className="modal-body">
              <div className="detail-group">
                <h3>Basic Info</h3>
                <DetailItem
                  label="Customer"
                  value={
                    userCache[selectedRide.customerId]
                      ? `${userCache[selectedRide.customerId].name} (${userCache[selectedRide.customerId].email})`
                      : selectedRide.customerId
                  }
                />
                <DetailItem
                  label="Driver"
                  value={
                    selectedRide.driverId
                      ? (userCache[selectedRide.driverId]
                          ? `${userCache[selectedRide.driverId].name} (${userCache[selectedRide.driverId].email})`
                          : selectedRide.driverId)
                      : "Not assigned"
                  }
                />
                <DetailItem label="Vehicle Type" value={getCarTypeName(selectedRide.vehicle_type)} />
                <DetailItem label="Status" value={selectedRide.statuses} badgeClass={getStatusBadgeClass(selectedRide.statuses)} />
              </div>
              
              <div className="detail-group">
                <h3>Route</h3>
                <DetailItem label="Pickup" value={selectedRide.pickUpLocation} />
                <DetailItem label="Dropoff" value={selectedRide.dropOffLocation} />
                <DetailItem label="Distance" value={selectedRide.distance_traveled ? `${selectedRide.distance_traveled} km` : "N/A"} />
                <DetailItem label="Duration" value={selectedRide.duration_minutes ? `${selectedRide.duration_minutes} min` : "N/A"} />
              </div>
              
              <div className="detail-group">
                <h3>Timing</h3>
                <DetailItem label="Request Date" value={formatDate(selectedRide.requestDate)} />
                <DetailItem label="Pickup Time" value={formatDate(selectedRide.pickupTime)} />
                <DetailItem label="Dropoff Time" value={formatDate(selectedRide.dropOffTime)} />
                <DetailItem label="Completion Date" value={formatDate(selectedRide.currentDate)} />
              </div>
              
              <div className="detail-group">
                <h3>Payment & Ratings</h3>
                <DetailItem 
                  label="Amount" // Changed from Fare to Amount
                  value={
                    paymentDetails && paymentDetails.amount
                      ? `${paymentDetails.currency || '$'}${paymentDetails.amount}`
                      : (selectedRide.amount ? `$${selectedRide.amount}` : "N/A") // Changed from fare to amount
                  } 
                />
                <DetailItem 
                  label="Payment Type" 
                  value={
                    paymentDetails && paymentDetails.paymentType
                      ? paymentDetails.paymentType
                      : (selectedRide.payment_type || "N/A")
                  } 
                />
                <DetailItem label="Payment Status" value={selectedRide.payment_status} badgeClass={getPaymentStatusClass(selectedRide.payment_status)} />
                <DetailItem label="Driver Rating" value={selectedRide.driver_ratings || "N/A"} />
                <DetailItem label="Customer Rating" value={selectedRide.customer_rating || "N/A"} />
              </div>

              {/* Payment Details Section */}
              {paymentLoading ? (
                <div className="detail-group">
                  <h3>Payment Details</h3>
                  <p>Loading payment information...</p>
                </div>
              ) : paymentDetails ? (
                <div className="detail-group">
                  <h3>Payment Details</h3>
                  <DetailItem label="Payment Type" value={paymentDetails.paymentType} />
                  <DetailItem label="Amount" value={`${paymentDetails.currency || '$'}${paymentDetails.amount}`} />
                  <DetailItem label="Currency" value={paymentDetails.currency} />
                  <DetailItem label="Payment Reference" value={paymentDetails.payment_reference} />
                  <DetailItem label="Payment Date" value={formatDate(paymentDetails.paymentDate)} />
                  <DetailItem label="Reference" value={paymentDetails.payment_reference} />
                  <DetailItem label="Status" value={paymentDetails.payment_status} badgeClass={getPaymentStatusClass(paymentDetails.payment_status)} />
                  {paymentDetails.card_id && (
                    <DetailItem label="Card ID" value={paymentDetails.card_id} />
                  )}
                </div>
              ) : (
                <div className="detail-group">
                  <h3>Payment Details</h3>
                  <p>No payment information available</p>
                </div>
              )}

              {selectedRide.cancellation_reason && (
                <div className="detail-group">
                  <h3>Cancellation</h3>
                  <DetailItem label="Reason" value={selectedRide.cancellation_reason} />
                  <DetailItem label="Canceled By" value={selectedRide.cancel_by} />
                </div>
              )}

              {(selectedRide.driver_feedback || selectedRide.customer_feedback) && (
                <div className="detail-group">
                  <h3>Feedback</h3>
                  {selectedRide.driver_feedback && (
                    <DetailItem label="Driver Feedback" value={selectedRide.driver_feedback} />
                  )}
                  {selectedRide.customer_feedback && (
                    <DetailItem label="Customer Feedback" value={selectedRide.customer_feedback} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
    {editingRide && (
  <div className="modal-overlay" onClick={() => setEditingRide(null)}>
    <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2>Edit Trip #{editingRide.id}</h2>
        <button className="modal-close" onClick={() => setEditingRide(null)}><FaTimes /></button>
      </div>

      <div className="modal-body">
        <div className="current-values-section">
          <h3>Current Values</h3>
          <div className="current-values-grid">
            <div className="current-value-item">
              <span className="current-label">Request Date:</span>
              <span className="current-value">{formatDate(editingRide.requestDate)}</span>
            </div>
            <div className="current-value-item">
              <span className="current-label">Pickup Time:</span>
              <span className="current-value">{formatDate(editingRide.pickupTime)}</span>
            </div>
            <div className="current-value-item">
              <span className="current-label">Dropoff Time:</span>
              <span className="current-value">{formatDate(editingRide.dropOffTime)}</span>
            </div>
            <div className="current-value-item">
              <span className="current-label">Completion Date:</span>
              <span className="current-value">{formatDate(editingRide.currentDate)}</span>
            </div>
            <div className="current-value-item">
              <span className="current-label">Amount:</span>
              <span className="current-value">
                {paymentDetails && paymentDetails.amount
                  ? `${paymentDetails.currency || '$'}${paymentDetails.amount}`
                  : (editingRide.amount ? `$${editingRide.amount}` : "N/A")}
              </span>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Trip Status & Basic Info</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Status *</label>
              <select
                value={editForm.statuses || ''}
                onChange={(e) => handleEditChange('statuses', e.target.value)}
                required
              >
                <option value="pending">Pending</option>
                <option value="on-going">on-going</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-group">
              <label>Payment Status *</label>
              <select
                value={editForm.payment_status || ''}
                onChange={(e) => handleEditChange('payment_status', e.target.value)}
                required
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          {/* <div className="form-row">
            <div className="form-group">
              <label>Vehicle Type</label>
              <select
                value={editForm.vehicle_type || ''}
                onChange={(e) => handleEditChange('vehicle_type', e.target.value)}
              >
                <option value="1">nthome_black</option>
                <option value="2">nthome_x</option>
                <option value="">Unknown</option>
              </select>
            </div>
          </div> */}
        </div>

        <div className="form-section">
          <h3>Route Information</h3>
          <div className="form-group">
            <label>Pickup Location *</label>
            <input
              type="text"
              value={editForm.pickUpLocation || ''}
              onChange={(e) => handleEditChange('pickUpLocation', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Dropoff Location *</label>
            <input
              type="text"
              value={editForm.dropOffLocation || ''}
              onChange={(e) => handleEditChange('dropOffLocation', e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Distance (km)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={editForm.distance_traveled || ''}
                onChange={(e) => handleEditChange('distance_traveled', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Duration (min)</label>
              <input
                type="number"
                min="0"
                value={formatDate( editForm.duration_minutes || '')}
                onChange={(e) => handleEditChange('duration_minutes', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Timing Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Pickup Time</label>
              <input
                type="datetime-local"
                value={editForm.pickupTime ? editForm.pickupTime.slice(0, 16) : ''}
                onChange={(e) => handleEditChange('pickupTime', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Dropoff Time</label>
              <input
                type="datetime-local"
                value={editForm.dropOffTime ? editForm.dropOffTime.slice(0, 16) : ''}
                onChange={(e) => handleEditChange('dropOffTime', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Ratings & Feedback</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Driver Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={editForm.driver_ratings || ''}
                onChange={(e) => handleEditChange('driver_ratings', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Customer Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={editForm.customer_rating || ''}
                onChange={(e) => handleEditChange('customer_rating', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Driver Feedback</label>
            <textarea
              value={editForm.driver_feedback || ''}
              onChange={(e) => handleEditChange('driver_feedback', e.target.value)}
              rows="2"
              placeholder="Optional driver feedback..."
            />
          </div>

          <div className="form-group">
            <label>Customer Feedback</label>
            <textarea
              value={editForm.customer_feedback || ''}
              onChange={(e) => handleEditChange('customer_feedback', e.target.value)}
              rows="2"
              placeholder="Optional customer feedback..."
            />
          </div>
        </div>

        {editingRide.cancellation_reason && (
          <div className="form-section">
            <h3>Cancellation Details</h3>
            <div className="form-group">
              <label>Cancellation Reason</label>
              <input
                type="text"
                value={editForm.cancellation_reason || editingRide.cancellation_reason || ''}
                onChange={(e) => handleEditChange('cancellation_reason', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Cancelled By</label>
              <select
                value={editForm.cancel_by || editingRide.cancel_by || ''}
                onChange={(e) => handleEditChange('cancel_by', e.target.value)}
              >
                <option value="">Select who cancelled</option>
                <option value="customer">Customer</option>
                <option value="driver">Driver</option>
                <option value="system">System</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button 
            className="cancel-btn" 
            onClick={() => setEditingRide(null)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            className="save-btn" 
            onClick={submitEdit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default AllRides;