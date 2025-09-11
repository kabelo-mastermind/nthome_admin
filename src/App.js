import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { SearchProvider } from "./contexts/SearchContext"
import AdminApp from "./AdminApp"
import AdminHome from "./pages/Dashboard/AdminHome"
import DriversPage from "./pages/Drivers/DriversPage"
import CustomersPage from "./pages/Customers/CustomersPage"
import LandingPage from "./pages/LandingPage/LandingPage"
import EditDriverForm from "./pages/EditDriver/EditDriverForm"
import VehiclesPage from "./pages/Vehicles/VehicleType"
import Subscribers from "./pages/subscribers/subscribers"
import DriverEarnings from "./pages/DriverEarnings/DriverEarnings"
import Settings from "./pages/Setting/Setting"
import DriverRatingPage from "./pages/Driver-ratings/DriverRatingsPage"
import PushNotification from "./pages/PushNotifications/PushNotifications"
import RiderRatingsPage from "./pages/Rider-ratings/RiderRatingsPage"
import AllRides from "./pages/AllRides/AllRides"
import ScheduledRides from "./pages/ScheduledRides/ScheduledRides"
import CompletedRides from "./pages/CompletedRides/CompletedRides"
import CancelledRides from "./pages/CancelledRides/CancelledRides"
// ✅ Correct import path for TeamPage
import TeamPage from "./pages/Admin/TeamPage"

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
                    <Route path="edit-driver/:userId" element={<EditDriverForm />} />
                    <Route path="customerRide" element={<CustomersPage />} />
                    <Route path="vehicle" element={<VehiclesPage />} />
                    <Route path="subscribers" element={<Subscribers />} />
                    <Route path="DriverEarnings" element={<DriverEarnings />} />
                    <Route path="driverRatings" element={<DriverRatingPage />} />
                    <Route path="riderRatings" element={<RiderRatingsPage />} />
                    <Route path="push" element={<PushNotification />} />
                    <Route path="setting" element={<Settings />} />
                    <Route path="trip" element={<AllRides />} />
                    <Route path="schedule" element={<ScheduledRides />} />
                    <Route path="completedRides" element={<CompletedRides />} />
                    <Route path="cancelled" element={<CancelledRides />} />
                    {/* ✅ Added TeamPage route */}
                    <Route path="team" element={<TeamPage />} />
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
