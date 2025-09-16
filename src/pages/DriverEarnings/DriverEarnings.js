"use client";
import { useState, useEffect } from "react";
import { api } from "../../api";
import { 
  FaUser, 
  FaTimes, 
  FaDownload, 
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaMoneyBillWave,
  FaWallet,
  FaClock
} from "react-icons/fa";

export default function DriverEarnings() {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    sortBy: "totalEarnings",
    sortOrder: "desc"
  });
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch driver earnings data from API
  useEffect(() => {
    const fetchDriverEarnings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api}drivers/earnings`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setDrivers(data.drivers);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch driver earnings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverEarnings();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ sortBy: "totalEarnings", sortOrder: "desc" });
  };

  // Filter drivers based on search term
  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort drivers based on filters
  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
    if (filters.sortOrder === "asc") {
      return parseFloat(a[filters.sortBy]) - parseFloat(b[filters.sortBy]);
    } else {
      return parseFloat(b[filters.sortBy]) - parseFloat(a[filters.sortBy]);
    }
  });

  // CSV Export Function
  const exportCSV = () => {
    const headers = [
      "Driver Name",
      "Total Earnings",
      "Monthly Earnings",
      "Pending Earnings",
      "Total Trips",
      "Rating"
    ];

    const rows = drivers.map(driver => [
      driver.driverName,
      `R${driver.totalEarnings}`,
      `R${driver.monthlyEarnings}`,
      `R${driver.pendingEarnings}`,
      driver.totalTrips,
      driver.driverRating
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "drivers_earnings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusColors = {
      Paid: "status-completed",
      Pending: "status-pending",
      Processing: "status-processing",
    };

    return (
      <span className={`status-badge ${statusColors[status]}`}>
        {status}
      </span>
    );
  };

  // Format currency values
  const formatCurrency = (amount) => {
    return `R${parseFloat(amount).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="admin-rides-page">
        <div className="page-header">
          <div className="page-title-container">
            <FaMoneyBillWave className="page-title-icon" />
            <h1>Drivers Earnings</h1>
          </div>
        </div>
        <div className="loading-state">
          <p>Loading driver earnings data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-rides-page">
        <div className="page-header">
          <div className="page-title-container">
            <FaMoneyBillWave className="page-title-icon" />
            <h1>Drivers Earnings</h1>
          </div>
        </div>
        <div className="error-state">
          <p>Error loading driver earnings: {error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-rides-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-container">
          <FaMoneyBillWave className="page-title-icon" />
          <h1>Drivers Earnings</h1>
          
        </div>
        <span className="total-drivers-badge">{drivers.length} DRIVERS</span>
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

      {/* Search and Filters */}
      <div className="controls-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search drivers by name..."
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
                <option value="totalEarnings">Total Earnings</option>
                <option value="monthlyEarnings">Monthly Earnings</option>
                <option value="pendingEarnings">Pending Earnings</option>
                <option value="totalTrips">Total Trips</option>
                <option value="driverRating">Rating</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Order</label>
              <select 
                value={filters.sortOrder} 
                onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
                className="filter-select"
              >
                <option value="desc">Highest First</option>
                <option value="asc">Lowest First</option>
              </select>
            </div>

            <button className="clear-filters" onClick={clearFilters}>
              <FaTimes /> Reset
            </button>
          </div>
        )}
      </div>

      {/* Drivers Grid */}
      <div className="rides-grid">
        {sortedDrivers.length > 0 ? sortedDrivers.map((driver) => (
          <div className="ride-card scheduled-card" key={driver.driverId}>
            <div className="card-header">
              <div className="ride-id">
                <FaUser className="header-icon" />
                <span>{driver.driverName}</span>
              </div>
              <span className="rating-badge">
                ⭐ {parseFloat(driver.driverRating).toFixed(1)}
              </span>
            </div>

            <div className="card-content">
              <div className="info-row">
                <FaWallet className="info-icon total" />
                <div className="info-text">
                  <span className="label">Total Earnings</span>
                  <span className="value">{formatCurrency(driver.totalEarnings)}</span>
                </div>
              </div>

              <div className="info-row">
                <FaMoneyBillWave className="info-icon monthly" />
                <div className="info-text">
                  <span className="label">This Month</span>
                  <span className="value">{formatCurrency(driver.monthlyEarnings)}</span>
                </div>
              </div>

              <div className="info-row">
                <FaClock className="info-icon pending" />
                <div className="info-text">
                  <span className="label">Pending</span>
                  <span className="value">{formatCurrency(driver.pendingEarnings)}</span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-text">
                  <span className="label">Total Trips</span>
                  <span className="value">{driver.totalTrips}</span>
                </div>
              </div>
            </div>

            <div className="card-actions">
              <button 
                className="view-details-btn"
                onClick={() => setSelectedDriver(driver)}
              >
                View Earnings Details
              </button>
            </div>
          </div>
        )) : (
          <div className="empty-state">
            <FaUser className="empty-icon" />
            <h3>No drivers found</h3>
            <p>No drivers match your search criteria</p>
          </div>
        )}
      </div>

      {/* Driver Earnings Modal */}
      {selectedDriver && (
        <div className="modal-overlay" onClick={() => setSelectedDriver(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedDriver.driverName} - Earnings Details</h2>
              <button className="modal-close" onClick={() => setSelectedDriver(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-group">
                  <h3>Earnings Summary</h3>
                  <DetailItem label="Total Earnings" value={formatCurrency(selectedDriver.totalEarnings)} />
                  <DetailItem label="Monthly Earnings" value={formatCurrency(selectedDriver.monthlyEarnings)} />
                  <DetailItem label="Pending Earnings" value={formatCurrency(selectedDriver.pendingEarnings)} />
                  <DetailItem label="Total Trips" value={selectedDriver.totalTrips} />
                  <DetailItem label="Pending Trips" value={selectedDriver.pendingTrips} />
                  <DetailItem label="Today's Earnings" value={formatCurrency(selectedDriver.todaysEarnings)} />
                  <DetailItem label="Average Fare" value={`R${parseFloat(selectedDriver.averageFare).toFixed(2)}`} />
                  <DetailItem label="Rating" value={`⭐ ${parseFloat(selectedDriver.driverRating).toFixed(1)}`} />
                </div>

                <div className="detail-group">
                  <h3>Weekly Payout</h3>
                  <DetailItem label="Amount" value={formatCurrency(selectedDriver.weeklyPayout)} />
                  <p className="payout-note">
                    Note: Payout details will be available once the driver has completed trips.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for modal details
const DetailItem = ({ label, value }) => (
  <div className="detail-item">
    <span className="detail-label">{label}:</span>
    <span className="detail-value">{value}</span>
  </div>
);