"use client";
import { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import axios from "axios";
import { api } from "../../api";
import "./DriverRatingsPage.css";
import { FaStar, FaSearch, FaFilter, FaFileExport } from "react-icons/fa";

// Icons
const EyeIcon = () => (
    <svg className="icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M1.5 12s4-7 10.5-7 10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

function DriverRatingsPage() {
    const { isDark } = useTheme();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRating, setFilterRating] = useState("all");
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [currentTrip, setCurrentTrip] = useState(null);

    // Cache for driver/customer details
    const [userCache, setUserCache] = useState({});

    // Fetch user info by ID (driver or customer)
    const fetchUser = async (id) => {
        if (!id) return null;
        if (userCache[id]) return userCache[id]; // return cached data

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
                // Instead of: const tripsWithRatings = response.data.filter(...)
                // Try:
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

    // Function to export data to CSV
    const exportToCSV = () => {
        if (trips.length === 0) {
            alert("No data to export!");
            return;
        }

        // Define CSV headers
        const headers = [
            "Trip ID", "Driver ID", "Driver Name", "Customer ID", "Customer Name", 
            "Rating", "Feedback", "Pickup Location", "Dropoff Location", 
            "Request Date", "Completion Date", "Vehicle Type", "Distance (km)", "Duration"
        ];

        // Convert data to CSV rows
        const csvRows = trips.map(trip => [
            trip.id || "N/A",
            trip.driverId || "N/A",
            trip.driverName || "N/A",
            trip.customerId || "N/A",
            trip.customerName || "N/A",
            trip.driver_ratings || "N/A",
            `"${(trip.driver_feedback || "No feedback").replace(/"/g, '""')}"`, // Escape quotes in feedback
            trip.pickUpLocation || "N/A",
            trip.dropOffLocation || "N/A",
            formatDate(trip.requestDate) || "N/A",
            formatDate(trip.currentDate) || "N/A",
            trip.vehicle_type || "N/A",
            trip.distance_traveled || "N/A",
            formatDuration(trip.duration_minutes) || "N/A"
        ]);

        // Combine headers and rows
        const csvContent = [headers, ...csvRows]
            .map(row => row.join(","))
            .join("\n");

        // Create download link
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

    const filteredTrips = trips.filter((trip) => {
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

    const renderStars = (rating) => {
        if (rating === null || rating === undefined) return null;
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={i} className="star filled" />);
        if (hasHalfStar) stars.push(<FaStar key={fullStars} className="star half" />);
        for (let i = stars.length; i < 5; i++) stars.push(<FaStar key={i} className="star empty" />);

        return stars;
    };

    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString("en-GB") : "N/A";
    // Convert decimal minutes to "X mins Y secs"
    const formatDuration = (duration) => {
        if (!duration && duration !== 0) return "N/A";
        const mins = Math.floor(duration);
        const secs = Math.round((duration - mins) * 60);
        return secs > 0 ? `${mins} mins ${secs} secs` : `${mins} mins`;
    };

    if (loading) return <p className="p-6 text-gray-500">Loading ratings...</p>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;

    return (
        <div className={`ratings-page ${isDark ? 'dark-theme' : ''}`}>
            <h1>Driver Ratings</h1>
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
                <div className="filter-actions">
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
                         {/* Export Button */}
            <div className="export-container">
                <button className="export-btn" onClick={exportToCSV}>
                    <FaFileExport className="export-icon" />
                    Export to CSV
                </button>
            </div>
                </div>
         
            </div>

            {/* Ratings List */}
            <div className="rating-card-list">
                {filteredTrips.length > 0 ? (
                    filteredTrips.map((trip) => (
                        <div className="rating-card" key={trip.id}>
                            <div className="rating-card-header">
                                <div className="rating-card-info">
                                    <div className="rating-avatar">
                                        {trip.driverName ? trip.driverName.charAt(0) : "D"}
                                    </div>
                                    <div>
                                        <h2 className="rating-card-name">{trip.driverName || `Driver ${trip.driverId}`}</h2>
                                        <p className="rating-card-id">Trip ID: {trip.id || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="rating-badge">
                                    {renderStars(trip.driver_ratings)}
                                    <span className="rating-value">{Number(trip.driver_ratings || 0).toFixed(1)}</span>
                                </div>
                            </div>

                            <div className="rating-card-section">
                                <p><strong>Customer:</strong> {trip.customerName || `Customer ${trip.customerId}`}</p>
                                <p><strong>Request Date:</strong> {formatDate(trip.requestDate)}</p>
                                <p><strong>Completed:</strong> {formatDate(trip.currentDate)}</p>
                            </div>

                            <div className="rating-card-section">
                                <p><strong>Pickup:</strong> {trip.pickUpLocation || "N/A"}</p>
                                <p><strong>Dropoff:</strong> {trip.dropOffLocation || "N/A"}</p>
                            </div>

                            <div className="rating-card-section">
                                <p><strong>Vehicle Type:</strong> {trip.vehicle_type || "N/A"}</p>
                                <p><strong>Distance:</strong> {trip.distance_traveled ? `${trip.distance_traveled} km` : "N/A"}</p>
                                <p><strong>Duration:</strong> {formatDuration(trip.duration_minutes)}</p>
                            </div>

                            <div className="rating-card-section">
                                <p><strong>Feedback:</strong></p>
                                <p className="feedback-text">{trip.driver_feedback || "No feedback provided"}</p>
                            </div>

                            <div className="rating-card-actions">
                                <button className="action-btn" onClick={() => handleViewDetails(trip)}>
                                    <EyeIcon /> Details
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-ratings">No ratings found.</p>
                )}
            </div>

            {/* Detail Modal */}
            {detailModalOpen && currentTrip && (
                <div className="modal-overlay" onClick={closeDetailModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Trip Rating Details</h3>

                        <div className="modal-section">
                            <h4>Trip Information</h4>
                            <div className="modal-details">
                                <p><strong>Trip ID:</strong> {currentTrip.id || "N/A"}</p>
                                <p><strong>Request Date:</strong> {formatDate(currentTrip.requestDate)}</p>
                                <p><strong>Completed Date:</strong> {formatDate(currentTrip.currentDate)}</p>
                                <p><strong>Vehicle Type:</strong> {currentTrip.vehicle_type || "N/A"}</p>
                                <p><strong>Distance:</strong> {currentTrip.distance_traveled ? `${currentTrip.distance_traveled} km` : "N/A"}</p>
                                <p><strong>Duration:</strong> {formatDuration(currentTrip.duration_minutes)}</p>
                                <p><strong>Status:</strong> <span className="status-badge status-completed">{currentTrip.statuses || "N/A"}</span></p>
                                <p><strong>Payment:</strong> <span className="status-badge status-paid">{currentTrip.payment_status || "N/A"}</span></p>
                            </div>
                        </div>

                        <div className="modal-section">
                            <h4>Location Information</h4>
                            <div className="modal-details">
                                <p><strong>Pickup Location:</strong> {currentTrip.pickUpLocation || "N/A"}</p>
                                <p><strong>Dropoff Location:</strong> {currentTrip.dropOffLocation || "N/A"}</p>
                                {currentTrip.pickupTime && <p><strong>Pickup Time:</strong> {new Date(currentTrip.pickupTime).toLocaleTimeString()}</p>}
                                {currentTrip.dropOffTime && <p><strong>Dropoff Time:</strong> {new Date(currentTrip.dropOffTime).toLocaleTimeString()}</p>}
                            </div>
                        </div>

                        <div className="modal-section">
                            <h4>User Information</h4>
                            <div className="modal-details">
                                <p><strong>Driver:</strong> {currentTrip.driverName || `Driver ${currentTrip.driverId}`}</p>
                                <p><strong>Customer:</strong> {currentTrip.customerName || `Customer ${currentTrip.customerId}`}</p>
                            </div>
                        </div>

                        <div className="modal-section">
                            <h4>Rating & Feedback</h4>
                            <div className="rating-display">
                                <div className="stars-large">
                                    {renderStars(currentTrip.driver_ratings)}
                                    <span className="rating-value-large">{Number(currentTrip.driver_ratings || 0).toFixed(1)}</span>
                                </div>
                                <p className="feedback-full">{currentTrip.driver_feedback || "No feedback provided"}</p>
                            </div>
                        </div>

                        {currentTrip.cancellation_reason && (
                            <div className="modal-section">
                                <h4>Cancellation Details</h4>
                                <div className="modal-details">
                                    <p><strong>Reason:</strong> {currentTrip.cancellation_reason}</p>
                                    {currentTrip.cancel_by && <p><strong>Canceled By:</strong> {currentTrip.cancel_by}</p>}
                                </div>
                            </div>
                        )}

                        <button className="modal-close-btn" onClick={closeDetailModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DriverRatingsPage;