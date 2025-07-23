"use client"

import { useState } from "react"
import "./styles/AdminApp.css"
import Sidebar from "./components/Dashboard/Sidebar"
import Navbar from "./components/Dashboard/Navbar"

function AdminApp({ children }) {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const toggleSidebar = () => {
    console.log("Sidebar toggled!")
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <div className={`grid-container ${openSidebarToggle ? "sidebar-open" : ""}`}>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} toggleSidebar={toggleSidebar} />
      <div className="main-container">{children}</div>
    </div>
  )
}

export default AdminApp
