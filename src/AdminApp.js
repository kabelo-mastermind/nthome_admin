"use client"

import { useState, useEffect } from "react"
import "./styles/AdminApp.css"
import Sidebar from "./components/Dashboard/Sidebar"
import Navbar from "./components/Navbar/Navbar"

function AdminApp({ children }) {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect screen size to adjust sidebar behavior
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [])

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <div className={`grid-container ${openSidebarToggle ? "sidebar-responsive" : ""}`}>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar 
        openSidebarToggle={openSidebarToggle} 
        toggleSidebar={toggleSidebar} 
        isMobile={isMobile}
      />
      <div className="main-container">{children}</div>
    </div>
  )
}

export default AdminApp