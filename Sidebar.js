"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./AdminApp.css" // Keep this import for shared styles
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

function Sidebar({ openSidebarToggle, toggleSidebar }) {
  const [ridesDropdownOpen, setRidesDropdownOpen] = useState(false)

  const toggleRidesDropdown = () => {
    setRidesDropdownOpen(!ridesDropdownOpen)
  }

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className="sidebar-title">
        {/* The close icon is now conditionally displayed by CSS on mobile */}
        <span className="icon close_icon d-flex justify-content-end mb-2 mt-3" onClick={toggleSidebar}>
          X
        </span>
      </div>
      <ul className="sidebar-list mt-5">
        <li className="sidebar-list-item">
          <Link to="/adminapp">
            <BsGrid1X2Fill className="icon" /> Dashboard
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/driver">
            <BsPeopleFill className="icon" /> Drivers
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/customerRide">
            <FaRegStar className="icon" /> Customers
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/vehicle">
            <BsFillCarFrontFill className="icon" /> Vehicle Type
          </Link>
        </li>
        <li className={`sidebar-list-item ${ridesDropdownOpen ? "open" : ""}`} onClick={toggleRidesDropdown}>
          <div className="dropdown-toggle">
            <BsListCheck className="icon" />
            <span className="text-dark"> Rides</span>
          </div>
          <ul className="dropdown-menu">
            <li className="dropdown-item">
              <Link to="/trip">
                <BsFillCalendarCheckFill className="icon" /> All Rides
              </Link>
            </li>
            <li className="dropdown-item">
              <Link to="/schedule">
                <BsFillCalendarCheckFill className="icon" /> Scheduled Rides
              </Link>
            </li>
            <li className="dropdown-item">
              <Link to="/completedRides">
                <BsFillArchiveFill className="icon" /> Completed Rides
              </Link>
            </li>
            <li className="dropdown-item">
              <Link to="/cancelled">
                <BsFillArchiveFill className="icon" /> Cancelled Rides
              </Link>
            </li>
          </ul>
        </li>
        <li className="sidebar-list-item">
          <Link to="/riderRatings">
            <FaRegStar className="icon" /> Rider Ratings
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/driverRatings">
            <FaRegStar className="icon" /> Driver Ratings
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/earnings">
            <FaTachometerAlt className="icon" /> Driver Earnings
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/push">
            <FaBullhorn className="icon" /> Push Notification
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/subscribers">
            <BsFillPersonFill className="icon" /> Subscribers
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="adminapp/team">
            <BsPeopleFill className="icon" /> Team
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/setting">
            <BsFillGearFill className="icon" /> Settings
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
