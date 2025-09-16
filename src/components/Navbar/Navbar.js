import { useEffect, useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useTheme } from "../../contexts/ThemeContext"
import { useSearch } from "../../contexts/SearchContext"
import SearchResults from "../Search/SearchResults"
import "./Navbar.css"
import { FaRoute, FaSearch } from "react-icons/fa"
import nthomeLogo from "../../assets/img/nthomeLogo.png"
import { showToast } from "../../constants/ShowToast";
import { setUser } from "../../contexts/redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";

const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme, isDark } = useTheme()
  const { searchQuery, setSearchQuery, searchCategory, setSearchCategory } = useSearch()
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user)
  console.log("user in navbar:", user);

  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [profilePicture, setProfilePicture] = useState("")
  const [isSiteDropdownOpen, setSiteDropdownOpen] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Refs for detecting outside click
  const siteDropdownRef = useRef(null)
  const profileDropdownRef = useRef(null)

  useEffect(() => {
    if (user?.id) {
      setProfilePicture(
        user.profile_picture || "https://via.placeholder.com/40x40/0dcaf0/ffffff?text=JA"
      )
    }
  }, [user])

  const toggleDropdown = () => setDropdownOpen((prev) => !prev)
  const toggleSiteDropdown = () => setSiteDropdownOpen((prev) => !prev)

  // ✅ Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        siteDropdownRef.current &&
        !siteDropdownRef.current.contains(event.target)
      ) {
        setSiteDropdownOpen(false)
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      dispatch(setUser(null))
      localStorage.removeItem("reduxState")
      localStorage.removeItem("persist:root")

      if (user?.uid) {
        await import("firebase/auth").then(({ getAuth, signOut }) => {
          const auth = getAuth();
          signOut(auth);
        });
      }

      showToast("success", "Logged Out", "You have successfully logged out!");
      navigate("/login", { replace: true })
    } catch (err) {
      showToast("error", "Logout Failed", "Failed to log you out. Please try again.");
      console.error("Logout error:", err);
    }
  };

  const handleLogin = () => navigate("/login")

  const handleSearchFocus = () => setShowSearchResults(true)
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    if (e.target.value.trim()) setShowSearchResults(true)
  }
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) setShowSearchResults(true)
  }

  return (
    <>
      <nav className="admin-navbar">
        <div className="navbar-main-container">
          <div className="navbar-container">
            {/* Left side */}
            <div className="navbar-left">
              <div className="menu-icon" onClick={toggleSidebar}>
                <span className="icon">☰</span>
              </div>
              <Link to="/" className="navbar-brand">
                <img src={nthomeLogo} alt="Logo" className="brand-logo" />
                <span className="brand-text">Nthome</span>
              </Link>
            </div>
          </div>

          <div className="navbar-right-container">
            <div className="navbar-right">
              <ul className="nav-links">
                <li><Link to="/" className="nav-link">Home</Link></li>
                <li><Link to="/about" className="nav-link">About</Link></li>
                <li><Link to="/Contact" className="nav-link">Contact</Link></li>

                {/* Services Dropdown */}
                <li className="nav-item dropdown" ref={siteDropdownRef}>
                  <button className="nav-dropdown-btn" onClick={toggleSiteDropdown}>
                    Services
                  </button>
                  {isSiteDropdownOpen && (
                    <div className="dropdown-wrapper">
                      <div className="custom-dropdown-menu">
                        <Link to="/nthomeair" className="custom-dropdown-item">NthomeAir</Link>
                        <Link to="/NthomeFood" className="custom-dropdown-item">NthomeFood</Link>
                      </div>
                    </div>
                  )}
                </li>

                {user?.role === "admin" && (
                  <li><Link to="/adminapp" className="nav-link active">Dashboard</Link></li>
                )}
              </ul>

              {/* Theme Toggle */}
              {user?.role === "admin" && (
                <button
                  className="theme-toggle"
                  onClick={toggleTheme}
                  title={`Switch to ${isDark ? "light" : "dark"} mode`}
                >
                  <span className="icon">{isDark ? "☀️" : "🌙"}</span>
                </button>
              )}

              {/* Login/Profile */}
              {!user ? (
                <button onClick={handleLogin} className="login-btn">
                  Login
                </button>
              ) : (
                <div className="profile-container" ref={profileDropdownRef}>
                  <button className="profile-btn" onClick={toggleDropdown}>
                    <img src={profilePicture} alt="Profile" className="profile-img" />
                  </button>
                  {isDropdownOpen && (
                    <div className="nav-dropdown-menu">
                      <Link to="/profile" className="dropdown-item">
                        Profile ({user.name})
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

      <SearchResults isVisible={showSearchResults} onClose={() => setShowSearchResults(false)} />
    </>
  )
}

export default Navbar
