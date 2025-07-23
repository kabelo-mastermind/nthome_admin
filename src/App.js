import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { SearchProvider } from "./contexts/SearchContext"
import AdminApp from "./AdminApp"
import AdminHome from "./pages/Dashboard/AdminHome"
import DriversPage from "./pages/Drivers/DriversPage"
import CustomersPage from "./pages/Customers/CustomersPage"
import LandingPage from "./pages/LandingPage/LandingPage"
import EditDriverForm from "./pages/EditDriver/EditDriverForm"

function App() {
  return (
    <ThemeProvider>
      <SearchProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/adminapp/*"
              element={
                <AdminApp>
                  <Routes>
                    <Route index element={<AdminHome />} />
                    <Route path="driver" element={<DriversPage />} />
                    <Route path="edit-driver/:userId" element={<EditDriverForm />} /> {/* ✅ FIXED HERE */}
                    <Route path="customerRide" element={<CustomersPage />} />
                  </Routes>
                </AdminApp>
              }
            />

          </Routes>
        </Router>
      </SearchProvider>
    </ThemeProvider>
  )
}

export default App
