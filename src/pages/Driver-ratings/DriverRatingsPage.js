"use client";
import { useEffect, useState, useMemo } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import axios from "axios";
import { api } from "../../api";
import "./DriverRatingsPage.css";
import { FaStar, FaSearch, FaFilter, FaFileExport, FaEye, FaTimes, FaUser, FaMapMarkerAlt, FaCar, FaClock, FaMoneyBill } from "react-icons/fa";

function DriverRatingsPage() {
    const { isDark } = useTheme();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRating, setFilterRating] = useState("all");
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [currentTrip, setCurrentTrip] = useState(null);
    const [userCache, setUserCache] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: 'currentDate', direction: 'descending' });

    // Fetch user info by ID (driver or customer)
    const fetchUser = async (id) => {
        if (!id) return null;
        if (userCache[id]) return userCache[id];

        try {
            const res = await axios.get(`${api}customer?id=${id}`);
            const user = res.data;
            setUserCache((prev) => ({ ...prev, [id]: user }));
            return user;
        } catch (err) {
            console.error(`Failed to fetch user ${id}:`, err);
            return null;
        }
    };

    // Fetch trips and enrich with driver & customer names
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await axios.get(`${api}allTrips?status=completed`);
                const tripsArray = Array.isArray(response.data) 
                    ? response.data 
                    : response.data.trips || response.data.data || [];
                const tripsWithRatings = tripsArray.filter(trip => trip.driver_ratings !== null);

                const enrichedTrips = await Promise.all(
                    tripsWithRatings.map(async (trip) => {
                        const driver = await fetchUser(trip.driverId);
                        const customer = await fetchUser(trip.customerId);
                        return {
                            ...trip,
                            driverName: driver ? `${driver.name} ${driver.lastName || ''}`.trim() : `Driver ${trip.driverId}`,
                            customerName: customer ? `${customer.name} ${customer.lastName || ''}`.trim() : `Customer ${trip.customerId}`
                        };
                    })
                );

                setTrips(enrichedTrips);
            } catch (err) {
                console.error("Failed to fetch trips:", err);
                setError("Failed to load trip data.");
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    // Request sort
    const requestSort = (key) => {
        let direction = 'descending';
        if (sortConfig.key === key && sortConfig.direction === 'descending') {
            direction = 'ascending';
        }
        setSortConfig({ key, direction });
    };

    // Sort trips
    const sortedTrips = useMemo(() => {
        let sortableItems = [...trips];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [trips, sortConfig]);
    
  const getCarTypeName = (type) => {
    if (type === 1 || type === "1") return "nthome_black";
    if (type === 2 || type === "2") return "nthome_x";
    return "Unknown";
  };
// };

    // Function to export data to CSV
    const exportToCSV = () => {
        if (trips.length === 0) {
            alert("No data to export!");
            return;
        }

        const headers = [
            "Trip ID", "Driver ID", "Driver Name", "Customer ID", "Customer Name", 
            "Rating", "Feedback", "Pickup Location", "Dropoff Location", 
            "Request Date", "Completion Date", "Vehicle Type", "Distance (km)", "Duration"
        ];

        const csvRows = trips.map(trip => [
            trip.id || "N/A",
            trip.driverId || "N/A",
            trip.driverName || "N/A",
            trip.customerId || "N/A",
            trip.customerName || "N/A",
            trip.driver_ratings || "N/A",
            `"${(trip.driver_feedback || "No feedback").replace(/"/g, '""')}"`,
            trip.pickUpLocation || "N/A",
            trip.dropOffLocation || "N/A",
            formatDate(trip.requestDate) || "N/A",
            formatDate(trip.currentDate) || "N/A",
            trip.vehicle_type || "N/A",
            trip.distance_traveled || "N/A",
            formatDuration(trip.duration_minutes) || "N/A"
        ]);

        const csvContent = [headers, ...csvRows]
            .map(row => row.join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "driver_ratings_export.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredTrips = sortedTrips.filter((trip) => {
        const driverId = trip.driverId ? trip.driverId.toString().toLowerCase() : '';
        const searchTermLower = searchTerm.toLowerCase();
        const matchesSearch =
            driverId.includes(searchTermLower) ||
            (trip.id && trip.id.toString().includes(searchTerm)) ||
            (trip.driverName && trip.driverName.toLowerCase().includes(searchTermLower)) ||
            (trip.customerName && trip.customerName.toLowerCase().includes(searchTermLower));

        const driverRating = trip.driver_ratings || 0;
        const matchesFilter =
            filterRating === "all" ||
            (filterRating === "high" && driverRating >= 4) ||
            (filterRating === "medium" && driverRating >= 3 && driverRating < 4) ||
            (filterRating === "low" && driverRating < 3);

        return matchesSearch && matchesFilter;
    });

    const handleViewDetails = (trip) => {
        setCurrentTrip(trip);
        setDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setDetailModalOpen(false);
        setCurrentTrip(null);
    };

    const renderStars = (rating, size = 'normal') => {
        if (rating === null || rating === undefined) return null;
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={i} className={`star filled ${size}`} />);
        if (hasHalfStar) stars.push(<FaStar key={fullStars} className={`star half ${size}`} />);
        for (let i = stars.length; i < 5; i++) stars.push(<FaStar key={i} className={`star empty ${size}`} />);

        return stars;
    };

    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString("en-GB") : "N/A";
    
    const formatDuration = (duration) => {
        if (!duration && duration !== 0) return "N/A";
        const mins = Math.floor(duration);
        const secs = Math.round((duration - mins) * 60);
        return secs > 0 ? `${mins} mins ${secs} secs` : `${mins} mins`;
    };

// Get rating statistics
const ratingStats = useMemo(() => {
  // Extract ratings and make sure they're valid numbers
  const ratings = filteredTrips
    .map(trip => Number(trip.driver_ratings)) // force to number
    .filter(r => !isNaN(r) && r > 0);        // keep only valid ratings > 0

  const totalRatings = ratings.reduce((sum, r) => sum + r, 0);
  const average = ratings.length > 0 ? totalRatings / ratings.length : 0;

  return {
    total: ratings.length,
    average,
    high: ratings.filter(r => r >= 4).length,
    low: ratings.filter(r => r < 3).length,
  };
}, [filteredTrips]);

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading ratings data...</p>
        </div>
    );
    
    if (error) return (
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button className="retry-btn" onClick={() => window.location.reload()}>Try Again</button>
        </div>
    );

    return (
        <div className={`ratings-dashboard ${isDark ? 'dark-theme' : ''}`}>
            <header className="dashboard-header">
                <h1>Driver Ratings</h1>
                <div className="header-actions">
                    <button className="export-btn" onClick={exportToCSV}>
                        <FaFileExport className="export-icon" />
                        Export CSV
                    </button>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{ratingStats.total}</div>
                    <div className="stat-label">Total Ratings</div>
                </div>
             <div className="stat-card">
  <div className="stat-value">{ratingStats.average.toFixed(1)}</div>
  <div className="stat-label">Average Rating</div>
</div>

                <div className="stat-card">
                    <div className="stat-value">{ratingStats.high}</div>
                    <div className="stat-label">High Ratings (4+)</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{ratingStats.low}</div>
                    <div className="stat-label">Low Ratings ({'<3'})</div>

                </div>
            </div>

            {/* Filters and Search */}
            <div className="filters-container">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by driver, customer, or trip ID..."
                        className="rating-search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <div className="filter-box">
                        <FaFilter className="filter-icon" />
                        <select
                            value={filterRating}
                            onChange={(e) => setFilterRating(e.target.value)}
                            className="rating-filter"
                        >
                            <option value="all">All Ratings</option>
                            <option value="high">High (4+ stars)</option>
                            <option value="medium">Medium (3-4 stars)</option>
                            <option value="low">Low (Below 3 stars)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Ratings Table */}
            <div className="ratings-table-container">
                <table className="ratings-table">
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('driverName')}>
                                Driver {sortConfig.key === 'driverName' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => requestSort('customerName')}>
                                Customer {sortConfig.key === 'customerName' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => requestSort('driver_ratings')}>
                                Rating {sortConfig.key === 'driver_ratings' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                            </th>
                            <th>Trip Details</th>
                            <th onClick={() => requestSort('currentDate')}>
                                Date {sortConfig.key === 'currentDate' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTrips.length > 0 ? (
                            filteredTrips.map((trip) => (
                                <tr key={trip.id} className="rating-row">
                                    <td>
                                        <div className="driver-info">
                                            <div className="avatar-sm">
                                                {trip.driverName ? trip.driverName.charAt(0) : "D"}
                                            </div>
                                            <div>
                                                <div className="name">{trip.driverName || `Driver ${trip.driverId}`}</div>
                                                <div className="id">ID: {trip.driverId || "N/A"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="customer-info">
                                            <div className="name">{trip.customerName || `Customer ${trip.customerId}`}</div>
                                            <div className="id">ID: {trip.customerId || "N/A"}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="rating-display">
                                            <div className="stars">
                                                {renderStars(trip.driver_ratings)}
                                            </div>
                                            <span className="rating-value">{Number(trip.driver_ratings || 0).toFixed(1)}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="trip-details">
                                            <div className="location">
                                                <FaMapMarkerAlt className="icon-sm" />
                                                <span className="truncate">{trip.pickUpLocation || "N/A"}</span>
                                            </div>
                                            <div className="location">
                                                <FaMapMarkerAlt className="icon-sm" />
                                                <span className="truncate">{trip.dropOffLocation || "N/A"}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="date-display">
                                            {formatDate(trip.currentDate)}
                                        </div>
                                    </td>
                                    <td>
                                        <button 
                                            className="view-details-btn"
                                            onClick={() => handleViewDetails(trip)}
                                            title="View details"
                                        >
                                            <FaEye />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-data">
                                    No ratings found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {detailModalOpen && currentTrip && (
                <div className="modal-overlay" onClick={closeDetailModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Trip Rating Details</h2>
                            <button className="modal-close" onClick={closeDetailModal}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="modal-grid">
                                <div className="modal-section">
                                    <h3><FaUser /> User Information</h3>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <label>Driver</label>
                                            <span>{currentTrip.driverName || `Driver ${currentTrip.driverId}`}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Customer</label>
                                            <span>{currentTrip.customerName || `Customer ${currentTrip.customerId}`}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-section">
                                    <h3><FaMapMarkerAlt /> Location Information</h3>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <label>Pickup Location</label>
                                            <span>{currentTrip.pickUpLocation || "N/A"}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Dropoff Location</label>
                                            <span>{currentTrip.dropOffLocation || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-section">
                                    <h3><FaCar /> Trip Information</h3>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <label>Trip ID</label>
                                            <span>{currentTrip.id || "N/A"}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Vehicle Type</label>
                                            <span>{getCarTypeName(currentTrip.vehicle_type)}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Distance</label>
                                            <span>{currentTrip.distance_traveled ? `${currentTrip.distance_traveled} km` : "N/A"}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Duration</label>
                                            <span>{formatDuration(currentTrip.duration_minutes)}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Request Date</label>
                                            <span>{formatDate(currentTrip.requestDate)}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Completion Date</label>
                                            <span>{formatDate(currentTrip.currentDate)}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Status</label>
                                            <span className="status-badge status-completed">{currentTrip.statuses || "N/A"}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Payment</label>
                                            <span className="status-badge status-paid">{currentTrip.payment_status || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-section full-width">
                                    <h3>Rating & Feedback</h3>
                                    <div className="rating-display-large">
                                        <div className="stars-large">
                                            {renderStars(currentTrip.driver_ratings, 'large')}
                                            <span className="rating-value-large">{Number(currentTrip.driver_ratings || 0).toFixed(1)}</span>
                                        </div>
                                        <div className="feedback-container">
                                            <label>Customer Feedback</label>
                                            <p className="feedback-text">{currentTrip.driver_feedback || "No feedback provided"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DriverRatingsPage;