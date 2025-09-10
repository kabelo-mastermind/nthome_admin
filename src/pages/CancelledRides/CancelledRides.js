"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import "./CancelledRides.css";
import { 
  FaDownload, 
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
  FaCalendarCheck
} from "react-icons/fa";
import { api } from "../../api";

// Eye Icon
const EyeIcon = () => (
  <svg className="icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1.5 12s4-7 10.5-7 10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

function CancelledRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [filters, setFilters] = useState({
    status: "canceled", // Show canceled rides only
    sortBy: "requestDate",
    sortOrder: "desc" // Show latest canceled first
  });
  const [showFilters, setShowFilters] = useState(false);
  const limit = 10;

  const fetchRides = async (append = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: (append ? offset : 0).toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        status: "canceled"
      });

      const res = await axios.get(`${api}allTrips?${params}`);
      const data = res.data.data || res.data;

      if (append) setRides((prev) => [...prev, ...data]);
      else setRides(data);

      setHasMore(data.length === limit);
      setOffset((prev) => prev + data.length);
    } catch (err) {
      setError("Failed to load canceled rides.");
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: "canceled", sortBy: "requestDate", sortOrder: "desc" });
  };

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
      "Pickup Location",
      "Dropoff Location",
      "Distance (km)",
      "Duration (min)",
      "Fare",
      "Payment Method"
    ];

    const rows = filteredRides.map(r => [
      r.trip_id,
      r.customerId,
      r.driverId || "Not assigned",
      r.vehicle_type || "N/A",
      "Canceled",
      r.requestDate,
      r.pickupTime,
      r.dropOffTime,
      r.pickUpLocation,
      r.dropOffLocation,
      r.distance_traveled || "N/A",
      r.duration_minutes || "N/A",
      r.fare || "N/A",
      r.payment_method || "N/A"
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Cancelled_rides.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-rides-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-container">
          <FaCalendarCheck className="page-title-icon" />
          <h1>Canceled Rides</h1>
        </div>
        <div className="header-actions">
          <button className="export-csv-btn" onClick={exportCSV}>
            <FaDownload /> Export CSV
          </button>
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Sort Options {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="info-banner">
        <FaClock className="info-banner-icon" />
        <p>Showing all canceled rides</p>
      </div>

      {/* Search and Filters */}
      <div className="controls-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search canceled rides by customer, driver, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Sort By</label>
              <select 
                value={filters.sortBy} 
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="filter-select"
              >
                <option value="requestDate">Request Date</option>
                <option value="pickupTime">Pickup Time</option>
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
                <option value="desc">Latest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>

            <button className="clear-filters" onClick={clearFilters}>
              <FaTimes /> Reset
            </button>
          </div>
        )}
      </div>

      {/* Loading and Error States */}
      {loading && rides.length === 0 && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading canceled rides...</p>
        </div>
      )}
      
      {error && (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={() => fetchRides(false)} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {/* Rides Grid */}
      <div className="rides-grid">
        {filteredRides.length > 0 ? filteredRides.map((ride) => (
          <div className="ride-card canceled-card" key={ride.trip_id}>
            <div className="card-header">
              <div className="ride-id">
                <FaCar className="header-icon" />
                <span>Ride #{ride.trip_id}</span>
              </div>
              <span className="status-badge status-canceled">
                Canceled
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

              {ride.driverId && (
                <div className="info-row">
                  <FaUser className="info-icon driver" />
                  <div className="info-text">
                    <span className="label">Driver</span>
                    <span className="value">{ride.driverId}</span>
                  </div>
                </div>
              )}

              <div className="info-row">
                <FaRoute className="info-icon" />
                <div className="info-text">
                  <span className="label">Route</span>
                  <span className="value">{ride.pickUpLocation} → {ride.dropOffLocation}</span>
                </div>
              </div>

              {ride.fare && (
                <div className="info-row">
                  <FaMoneyBillWave className="info-icon fare" />
                  <div className="info-text">
                    <span className="label">Fare</span>
                    <span className="value">${ride.fare}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="card-actions">
              <button 
                className="view-details-btn"
                onClick={() => setSelectedRide(ride)}
              >
                <EyeIcon /> View Details
              </button>
            </div>
          </div>
        )) : (
          <div className="empty-state">
            <FaCalendarCheck className="empty-icon" />
            <h3>No canceled rides</h3>
            <p>There are currently no canceled rides</p>
          </div>
        )}
      </div>

      {/* Load More */}
      {hasMore && !loading && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={() => fetchRides(true)}>
            Load More Canceled Rides
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedRide && (
        <div className="modal-overlay" onClick={() => setSelectedRide(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Canceled Trip Details #{selectedRide.trip_id}</h2>
              <button className="modal-close" onClick={() => setSelectedRide(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-group">
                  <h3>Trip Information</h3>
                  <DetailItem label="Customer ID" value={selectedRide.customerId} />
                  <DetailItem label="Driver ID" value={selectedRide.driverId || "Not assigned"} />
                  <DetailItem label="Vehicle Type" value={selectedRide.vehicle_type || "Not specified"} />
                  <DetailItem label="Status" value="Canceled" badgeClass="status-canceled" />
                </div>

                <div className="detail-group">
                  <h3>Schedule</h3>
                  <DetailItem label="Request Date" value={formatDate(selectedRide.requestDate)} />
                  <DetailItem label="Pickup Time" value={formatDate(selectedRide.pickupTime)} />
                  <DetailItem label="Dropoff Time" value={formatDate(selectedRide.dropOffTime)} />
                </div>

                <div className="detail-group">
                  <h3>Route Details</h3>
                  <DetailItem label="Pickup Location" value={selectedRide.pickUpLocation} />
                  <DetailItem label="Dropoff Location" value={selectedRide.dropOffLocation} />
                  <DetailItem label="Distance" value={selectedRide.distance_traveled ? `${selectedRide.distance_traveled} km` : "N/A"} />
                  <DetailItem label="Duration" value={selectedRide.duration_minutes ? `${selectedRide.duration_minutes} min` : "N/A"} />
                </div>

                <div className="detail-group">
                  <h3>Payment</h3>
                  <DetailItem label="Fare" value={selectedRide.fare ? `$${selectedRide.fare}` : "N/A"} />
                  <DetailItem label="Payment Method" value={selectedRide.payment_method || "N/A"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component
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

export default CancelledRides;
