"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "../../styles/AdminApp.css" // Updated path (go up 2 levels to reach src/styles)
import {
  BsFillArchiveFill,
  BsFillGearFill,
  BsGrid1X2Fill,
  BsListCheck,
  BsPeopleFill,
  BsFillCarFrontFill,
  BsFillCalendarCheckFill,
  BsFillPersonFill,
} from "react-icons/bs"
import { FaRegStar, FaTachometerAlt, FaBullhorn } from "react-icons/fa"

function Sidebar({ openSidebarToggle, toggleSidebar, isMobile }) {
  const [ridesDropdownOpen, setRidesDropdownOpen] = useState(false)

  const toggleRidesDropdown = () => {
    setRidesDropdownOpen(!ridesDropdownOpen)
  }

  return (
       <aside 
      id="sidebar" 
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <h3>RideAdmin</h3>
          <span 
          className={`icon close_icon ${isMobile ? "mobile-visible" : "desktop-visible"}`} 
          onClick={toggleSidebar}
        >
          ✕
        </span>
      </div>
      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <Link to="/adminapp">
            <BsGrid1X2Fill className="icon" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/adminapp/driver">
            <BsPeopleFill className="icon" />
            <span>Drivers</span>
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/adminapp/customerRide">
            <FaRegStar className="icon" />
            <span>Customers</span>
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/adminapp/vehicle">
            <BsFillCarFrontFill className="icon" />
            <span>Vehicle Type</span>
          </Link>
        </li>
        <li className={`sidebar-list-item ${ridesDropdownOpen ? "open" : ""}`}
    style={{ position: 'relative', zIndex: ridesDropdownOpen ? 100 : 1 }}>
  <div className="dropdown-toggle" onClick={toggleRidesDropdown}>
    <BsListCheck className="icon" />
    <span>Rides</span>
    <span style={{ marginLeft: "auto", fontSize: "0.8rem" }}>
      {ridesDropdownOpen ? "▼" : "▶"}
    </span>
  </div>
  <ul className="dropdown-menu" style={{
    position: 'relative',
    zIndex: 101,
    backgroundColor: 'var(--sidebar-bg)',
    maxHeight: ridesDropdownOpen ? '200px' : '0',
    overflowY: 'auto',
    transition: 'max-height 0.3s ease-in-out',
    boxShadow: ridesDropdownOpen ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none'
  }}>
            <li className="dropdown-item">
              <Link to="/adminapp/trip">
                <BsFillCalendarCheckFill className="icon" />
                <span>All Rides</span>
              </Link>
            </li>
            <li className="dropdown-item">
              <Link to="/adminapp/schedule">
                <BsFillCalendarCheckFill className="icon" />
                <span>Scheduled Rides</span>
              </Link>
            </li>
            <li className="dropdown-item">
              <Link to="/adminapp/completedRides">
                <BsFillArchiveFill className="icon" />
                <span>Completed Rides</span>
              </Link>
            </li>
            <li className="dropdown-item">
              <Link to="/adminapp/cancelled">
                <BsFillArchiveFill className="icon" />
                <span>Cancelled Rides</span>
              </Link>
            </li>
          </ul>
        </li>
        <li className="sidebar-list-item">
          <Link to="/adminapp/riderRatings">
            <FaRegStar className="icon" />
            <span>Rider Ratings</span>
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/adminapp/driverRatings">
            <FaRegStar className="icon" />
            <span>Driver Ratings</span>
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/adminapp/earnings">
            <FaTachometerAlt className="icon" />
            <span>Driver Earnings</span>
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/adminapp/push">
            <FaBullhorn className="icon" />
            <span>Push Notification</span>
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/adminapp/subscribers">
            <BsFillPersonFill className="icon" />
            <span>Subscribers</span>
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/adminapp/adminList">
            <BsPeopleFill className="icon" />
            <span>Team</span>
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/adminapp/setting">
            <BsFillGearFill className="icon" />
            <span>Settings</span>
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
