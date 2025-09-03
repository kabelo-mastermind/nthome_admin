// "use client"

// import { useTheme } from "../../contexts/ThemeContext" // Updated path
// import "../../styles/AdminApp.css" // Updated path

// function AdminHeader({ toggleSidebar }) {
//   const { theme, toggleTheme, isDark } = useTheme()

//   return (
//     <header className="admin-header">
//       <div className="header-left">
//         <div className="menu-icon" onClick={toggleSidebar}>
//           <span className="icon">☰</span>
//         </div>
//         <input type="text" placeholder="Search..." className="search-input" />
//       </div>
//       <div className="header-right">
//         <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${isDark ? "light" : "dark"} mode`}>
//           <span className="icon">{isDark ? "☀️" : "🌙"}</span>
//           {isDark ? "Light" : "Dark"}
//         </button>
//         <div className="user-info">
//           <span>Admin User</span>
//         </div>
//       </div>
//     </header>
//   )
// }

// export default AdminHeader
