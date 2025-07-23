"use client"

import { useSearch } from "../../contexts/SearchContext"
import { Link } from "react-router-dom"
import "./SearchResults.css"
import { BsPeopleFill, BsFillCarFrontFill, BsListCheck, BsFillPersonFill, BsStarFill } from "react-icons/bs"

const SearchResults = ({ isVisible, onClose }) => {
  const { searchResults, isSearching, searchQuery, clearSearch } = useSearch()

  if (!isVisible) return null

  const getStatusColor = (status, type) => {
    const statusColors = {
      active: "#28a745",
      inactive: "#6c757d",
      suspended: "#dc3545",
      completed: "#28a745",
      ongoing: "#007bff",
      cancelled: "#dc3545",
      scheduled: "#ffc107",
      maintenance: "#fd7e14",
    }
    return statusColors[status] || "#6c757d"
  }

  const getTypeIcon = (type) => {
    const icons = {
      driver: <BsPeopleFill />,
      customer: <BsFillPersonFill />,
      ride: <BsListCheck />,
      vehicle: <BsFillCarFrontFill />,
    }
    return icons[type] || <BsListCheck />
  }

  const getTypeColor = (type) => {
    const colors = {
      driver: "#0dcaf0",
      customer: "#198754",
      ride: "#fd7e14",
      vehicle: "#6f42c1",
    }
    return colors[type] || "#6c757d"
  }

  const handleResultClick = (result) => {
    clearSearch()
    onClose()
  }

  return (
    <div className="search-results-overlay" onClick={onClose}>
      <div className="search-results-container" onClick={(e) => e.stopPropagation()}>
        <div className="search-results-header">
          <h3>Search Results</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="search-results-content">
          {isSearching ? (
            <div className="search-loading">
              <div className="loading-spinner"></div>
              <p>Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <p className="results-count">
                Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{searchQuery}"
              </p>
              <div className="results-list">
                {searchResults.map((result, index) => (
                  <div key={`${result.type}-${result.id}`} className="result-item">
                    <div className="result-icon" style={{ color: getTypeColor(result.type) }}>
                      {getTypeIcon(result.type)}
                    </div>

                    <div className="result-content">
                      <div className="result-header">
                        <span className="result-type" style={{ backgroundColor: getTypeColor(result.type) }}>
                          {result.type}
                        </span>
                        {result.status && (
                          <span className="result-status" style={{ color: getStatusColor(result.status, result.type) }}>
                            {result.status}
                          </span>
                        )}
                      </div>

                      {result.type === "driver" && (
                        <div className="result-details">
                          <h4>{result.name}</h4>
                          <p>
                            {result.email} • {result.phone}
                          </p>
                          <div className="rating">
                            <BsStarFill /> {result.rating}
                          </div>
                        </div>
                      )}

                      {result.type === "customer" && (
                        <div className="result-details">
                          <h4>{result.name}</h4>
                          <p>
                            {result.email} • {result.phone}
                          </p>
                          <p>{result.totalRides} total rides</p>
                        </div>
                      )}

                      {result.type === "ride" && (
                        <div className="result-details">
                          <h4>
                            {result.from} → {result.to}
                          </h4>
                          <p>
                            Driver: {result.driver} • Customer: {result.customer}
                          </p>
                          <p>
                            ${result.fare} • {result.date}
                          </p>
                        </div>
                      )}

                      {result.type === "vehicle" && (
                        <div className="result-details">
                          <h4>
                            {result.model} ({result.type})
                          </h4>
                          <p>License: {result.licensePlate}</p>
                          <p>Driver: {result.driver}</p>
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/adminapp/${result.type === "customer" ? "customerRide" : result.type}`}
                      className="result-action"
                      onClick={() => handleResultClick(result)}
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            </>
          ) : searchQuery ? (
            <div className="no-results">
              <p>No results found for "{searchQuery}"</p>
              <p>Try searching for drivers, customers, rides, or vehicles.</p>
            </div>
          ) : (
            <div className="search-suggestions">
              <h4>Search Suggestions:</h4>
              <ul>
                <li>Driver names (e.g., "John Smith")</li>
                <li>Customer names (e.g., "Alice Cooper")</li>
                <li>Email addresses</li>
                <li>Phone numbers</li>
                <li>Ride locations (e.g., "Airport", "Downtown")</li>
                <li>Vehicle models (e.g., "Toyota Camry")</li>
                <li>License plates</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchResults
