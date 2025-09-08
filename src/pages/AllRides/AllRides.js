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
  FaRoute
} from "react-icons/fa";
import { api } from "../../api";

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
  const [filters, setFilters] = useState({
    status: "",
    sortBy: "requestDate",
    sortOrder: "desc"
  });
  const [showFilters, setShowFilters] = useState(false);
  const limit = 10;

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
      case "in progress": return "status-progress";
      case "pending": return "status-pending";
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
      "Fare",
      "Payment Status",
      "Driver Rating",
      "Customer Rating",
      "Cancellation Reason",
      "Cancelled By",
      "Driver Feedback",
      "Customer Feedback"
    ];

    const rows = filteredRides.map(r => [
      r.trip_id,
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
      r.fare || "N/A",
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
                <option value="fare">Fare Amount</option>
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
          <div className="ride-card" key={ride.trip_id}>
            <div className="card-header">
              <div className="ride-id">
                <FaCar className="header-icon" />
                <span>Ride #{ride.trip_id}</span>
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
                  <span className="value">{ride.customerId}</span>
                </div>
              </div>

              <div className="info-row">
                <FaUser className="info-icon driver" />
                <div className="info-text">
                  <span className="label">Driver</span>
                  <span className="value">{ride.driverId || "Not assigned"}</span>
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
              <button className="view-details-btn" onClick={() => setSelectedRide(ride)}>
                <EyeIcon /> View Details
              </button>
            </div>
          </div>
        )) : <p>No rides found</p>}
      </div>

      {hasMore && !loading && (
        <button className="load-more-btn" onClick={() => fetchRides(true)}>Load More Rides</button>
      )}

      {/* Modal */}
      {selectedRide && (
        <div className="modal-overlay" onClick={() => setSelectedRide(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Trip Details #{selectedRide.trip_id}</h2>
              <button className="modal-close" onClick={() => setSelectedRide(null)}><FaTimes /></button>
            </div>

            <div className="modal-body">
              <div className="detail-group">
                <h3>Basic Info</h3>
                <DetailItem label="Customer ID" value={selectedRide.customerId} />
                <DetailItem label="Driver ID" value={selectedRide.driverId || "Not assigned"} />
                <DetailItem label="Vehicle Type" value={selectedRide.vehicle_type} />
                <DetailItem label="Status" value={selectedRide.statuses} badgeClass={getStatusBadgeClass(selectedRide.statuses)} />
              </div>
              <div className="detail-group">
                <h3>Route</h3>
                <DetailItem label="Pickup" value={selectedRide.pickUpLocation} />
                <DetailItem label="Dropoff" value={selectedRide.dropOffLocation} />
              </div>
              <div className="detail-group">
                <h3>Payment & Ratings</h3>
                <DetailItem label="Fare" value={selectedRide.fare || "N/A"} />
                <DetailItem label="Payment Status" value={selectedRide.payment_status} />
                <DetailItem label="Driver Rating" value={selectedRide.driver_ratings || "N/A"} />
                <DetailItem label="Customer Rating" value={selectedRide.customer_rating || "N/A"} />
              </div>
              {selectedRide.cancellation_reason && (
                <div className="detail-group">
                  <h3>Cancellation</h3>
                  <DetailItem label="Reason" value={selectedRide.cancellation_reason} />
                  <DetailItem label="Canceled By" value={selectedRide.cancel_by} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllRides;
