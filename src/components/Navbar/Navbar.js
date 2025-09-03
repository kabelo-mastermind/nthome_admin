"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../../contexts/ThemeContext"
import { useSearch } from "../../contexts/SearchContext"
import SearchResults from "../Search/SearchResults"
import "./Navbar.css"
import { FaRoute, FaSearch } from "react-icons/fa"
import nthomeLogo  from "../../assets/img/nthomeLogo.png"
const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme, isDark } = useTheme()
  const { searchQuery, setSearchQuery, searchCategory, setSearchCategory } = useSearch()

  // Dummy login details
  const [userName] = useState("John Admin")
  const [roles] = useState("admin")
  const [userId] = useState("admin123")
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [profilePicture, setProfilePicture] = useState("")
  const [isSiteDropdownOpen, setSiteDropdownOpen] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  useEffect(() => {
    // Dummy profile picture - using a placeholder
    setProfilePicture("https://via.placeholder.com/40x40/0dcaf0/ffffff?text=JA")
  }, [userId])

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen)
  }

  const toggleSiteDropdown = () => {
    setSiteDropdownOpen(!isSiteDropdownOpen)
  }

  const handleLogout = () => {
    // Dummy logout - just redirect to landing page
    window.location.href = "/"
  }

  const handleSearchFocus = () => {
    setShowSearchResults(true)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    if (e.target.value.trim()) {
      setShowSearchResults(true)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSearchResults(true)
    }
  }

  return (
    <>
      <nav className="admin-navbar">
        <div className="navbar-main-container">
          
            <div className="navbar-container">
              {/* Left side - Menu toggle and brand */}

              <div className="navbar-left">
                <div className="menu-icon" onClick={toggleSidebar}>
                  <span className="icon">☰</span>
                </div>
               <Link to="/" className="navbar-brand">
                <img 
                  src= {nthomeLogo} // replace with your logo path
                  alt="Logo" 
                  className="brand-logo"
                />
                <span className="brand-text">Nthome</span>
              </Link>

              </div>

              {/* Center - Search */}
              <div className="navbar-center">
                <form onSubmit={handleSearchSubmit} className="search-form">
                  <div className="search-input-container">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search drivers, customers, rides..."
                      className="search-input"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={handleSearchFocus}
                    />
                    <select
                      className="search-category"
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="drivers">Drivers</option>
                      <option value="customers">Customers</option>
                      <option value="rides">Rides</option>
                      <option value="vehicles">Vehicles</option>
                    </select>
                  </div>
                </form>
              </div>
            </div>
            <div className="navbar-rght-container">
              {/* Right side - Navigation and profile */}
              <div className="navbar-right">
                {/* Navigation Links */}
                <ul className="nav-links">
                  <li className="nav-item">
                    <Link to="/" className="nav-link">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/about" className="nav-link">
                      About
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/contact" className="nav-link">
                      Contact
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <button className="nav-dropdown-btn" onClick={toggleSiteDropdown}>
                      Services
                    </button>
                    {isSiteDropdownOpen && (
                      <div className="dropdown-wrapper">
                        <div className="custom-dropdown-menu">
                          <Link to="/nthomeair" className="custom-dropdown-item">
                            NthomeAir
                          </Link>
                          <Link to="/food" className="custom-dropdown-item">
                            NthomeFood
                          </Link>
                        </div>
                      </div>
                    )}
                  </li>
                  {roles === "admin" && (
                    <li className="nav-item">
                      <Link to="/adminapp" className="nav-link active">
                        Dashboard
                      </Link>
                    </li>
                  )}
                </ul>

                {/* Theme Toggle */}
                <button
                  className="theme-toggle"
                  onClick={toggleTheme}
                  title={`Switch to ${isDark ? "light" : "dark"} mode`}
                >
                  <span className="icon">{isDark ? "☀️" : "🌙"}</span>
                </button>

                {/* Profile Section */}
                {userName && (
                  <div className="profile-container">
                    <button className="profile-btn" onClick={toggleDropdown}>
                      <img
                        src={profilePicture || "https://via.placeholder.com/40x40/0dcaf0/ffffff?text=JA"}
                        alt="Profile"
                        className="profile-img"
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="nav-dropdown-menu">
                        <Link to="/profile-admin" className="dropdown-item">
                          Profile ({userName})
                        </Link>
                        <Link to="/settings" className="dropdown-item">
                          Settings
                        </Link>
                        <Link to="/AdminTripHistory" className="dropdown-item">
                          Trip History <FaRoute className="me-1" />
                        </Link>
                        <button onClick={handleLogout} className="dropdown-item logout-btn">
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          
        </div>
      </nav>

      {/* Search Results Modal */}
      <SearchResults isVisible={showSearchResults} onClose={() => setShowSearchResults(false)} />
    </>
  )
}

export default Navbar
