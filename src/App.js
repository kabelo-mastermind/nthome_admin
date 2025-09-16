import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./contexts/redux/store";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SearchProvider } from "./contexts/SearchContext";
import AdminApp from "./AdminApp";
import AdminHome from "./pages/Dashboard/AdminHome";
import DriversPage from "./pages/Drivers/DriversPage";
import CustomersPage from "./pages/Customers/CustomersPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import EditDriverForm from "./pages/EditDriver/EditDriverForm";
import VehiclesPage from "./pages/Vehicles/VehicleType";
import Subscribers from "./pages/subscribers/subscribers";
import DriverEarnings from "./pages/DriverEarnings/DriverEarnings";
import Settings from "./pages/Setting/Setting";
import DriverRatingPage from "./pages/Driver-ratings/DriverRatingsPage";
import PushNotification from "./pages/PushNotifications/PushNotifications";
import RiderRatingsPage from "./pages/Rider-ratings/RiderRatingsPage";
import AllRides from "./pages/AllRides/AllRides";
import ScheduledRides from "./pages/ScheduledRides/ScheduledRides";
import CompletedRides from "./pages/CompletedRides/CompletedRides";
import CancelledRides from "./pages/CancelledRides/CancelledRides";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import TeamPage from "./pages/Admin/TeamPage";
import Contact from "./pages/Contact/Contact"; // Import Contact component
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import TermsPage from "./pages/TermsPage/TermsPage";
import PrivacyPage from "./pages/PrivacyPage/PrivacyPage";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import Profile from "./pages/Profile/Profile";
import NthomeAir from "./pages/NthomeServices/NthomeAir";
import NthomeFood from "./pages/NthomeServices/NthomeFood";
import About from './pages/About/About';


// Layout for all public/non-admin pages
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

function App() {
  const user = { role: "admin" }; // Example user

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <SearchProvider>
            <Toaster position="top-center" reverseOrder={false} />
            <Router>
              <Routes>
                {/* Public Routes wrapped with Navbar/Footer */}
                <Route
                  path="/"
                  element={
                    <PublicLayout>
                      <LandingPage />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PublicLayout>
                      <LoginPage />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <PublicLayout>
                      <SignUpPage />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/terms"
                  element={
                    <PublicLayout>
                      <TermsPage />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/privacy"
                  element={
                    <PublicLayout>
                      <PrivacyPage />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <PublicLayout>
                      <ForgotPasswordPage />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PublicLayout>
                      <Profile />
                    </PublicLayout>
                  }
                />
                {/* Add Contact route */}
                <Route
                  path="/contact"
                  element={
                    <PublicLayout>
                      <Contact />
                    </PublicLayout>
                  }
                />
                {/* Add Contact route */}
                <Route
                  path="/about"
                  element={
                    <PublicLayout>
                      <About />
                    </PublicLayout>
                  }
                />
                 {/* Add Nhome Air */}
                <Route
                  path="/nthomeair"
                  element={
                    <PublicLayout>
                      <NthomeAir />
                    </PublicLayout>
                  }
                />
                 {/* Add Nhome food */}
                <Route
                  path="/nthomefood"
                  element={
                    <PublicLayout>
                      <NthomeFood />
                    </PublicLayout>
                  }
                />

                {/* Admin-only routes */}
                <Route
                  path="/adminapp/*"
                  element={
                    <ProtectedRoute user={user} allowedRoles={["admin"]}>
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
                          <Route path="team" element={<TeamPage />} />
                          
                        </Routes>
                      </AdminApp>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </SearchProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;