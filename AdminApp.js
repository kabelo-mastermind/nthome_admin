// "use client"

// import { useState } from "react"
// import "./AdminApp.css"
// import Sidebar from "../Dashboard/Sidebar"
// import AdminHeader from "../Dashboard/AdminHeader"
// // Assuming AdminHome is a component you might render inside children or directly
// // import AdminHome from '../Dashboard/AdminHome';

// function AdminApp({ children }) {
//   const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

//   const toggleSidebar = () => {
//     console.log("Sidebar toggled!") // Debug log
//     setOpenSidebarToggle(!openSidebarToggle)
//   }

//   return (
//     <div className={`grid-container ${openSidebarToggle ? "sidebar-open" : ""}`}>
//       <AdminHeader toggleSidebar={toggleSidebar} />
//       <Sidebar openSidebarToggle={openSidebarToggle} toggleSidebar={toggleSidebar} />
//       <div className="main-container">
//         {/* <AdminHome toggleSidebar={toggleSidebar} /> */}
//         {children}
//       </div>
//     </div>
//   )
// }

// export default AdminApp
