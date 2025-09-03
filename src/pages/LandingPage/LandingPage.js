import { Link } from "react-router-dom"
import "./LandingPage.css"
import Navbar from "../../components/Navbar/Navbar"
import Header from "./LandingpageSections/Header/Header"
import Solution from "./LandingpageSections/solutions/Solution"
import AppFeatures from "./LandingpageSections/AppFeatures/AppFeatures"
import CallToAction from "./LandingpageSections/CallToAction/CallToAction"
import BasicFeatures from "./LandingpageSections/BasicFeature/BasicFeature"
import CallToAction2 from "./LandingpageSections/CallToAction2/CallToAction2"
import FAQs from "./LandingpageSections/FAQs/FAQs"
import Footer from "../../components/Footer/Footer"
import ScrollToTop from "../LandingPage/LandingpageSections/ScrollToTop/ScrollToTopButton"
function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navigation Header */}
      {/* <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>RideAdmin</h2>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <Link to="/adminapp" className="nav-cta">
              Admin Dashboard
            </Link>
          </div>
        </div>
      </nav> */}
      <Navbar />
      <Header />
      <Solution />
      <AppFeatures />
      <CallToAction />
      <BasicFeatures />
      <CallToAction2 />
      <FAQs />
      <ScrollToTop />
      <Footer />
      {/* Hero Section */}
      {/* <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Manage Your Ride Service
              <span className="hero-highlight"> Efficiently</span>
            </h1>
            <p className="hero-description">
              Comprehensive admin dashboard to manage drivers, customers, rides, and analytics all in one place.
              Streamline your ride-sharing business operations with powerful tools and insights.
            </p>
            <div className="hero-buttons">
              <Link to="/adminapp" className="btn btn-primary">
                Get Started
              </Link>
              <button className="btn btn-secondary">Learn More</button>
            </div>
          </div>
          <div className="hero-image">
            <div className="dashboard-preview">
              <div className="preview-header"></div>
              <div className="preview-content">
                <div className="preview-sidebar"></div>
                <div className="preview-main">
                  <div className="preview-card"></div>
                  <div className="preview-card"></div>
                  <div className="preview-card"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      {/* <section id="features" className="features-section">
        <div className="features-container">
          <h2 className="section-title">Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Driver Management</h3>
              <p>
                Efficiently manage your driver fleet with comprehensive profiles, ratings, and performance tracking.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚗</div>
              <h3>Ride Tracking</h3>
              <p>Monitor all rides in real-time, from scheduled to completed trips with detailed analytics.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Rating System</h3>
              <p>Track customer and driver ratings to maintain service quality and customer satisfaction.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Earnings Analytics</h3>
              <p>Comprehensive financial tracking and reporting for driver earnings and business revenue.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Push Notifications</h3>
              <p>Send targeted notifications to drivers and customers for better communication.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚙️</div>
              <h3>Easy Configuration</h3>
              <p>Customize your platform settings and manage your team with intuitive admin controls.</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Stats Section */}
      {/* <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3 className="stat-number">10K+</h3>
              <p className="stat-label">Active Drivers</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">50K+</h3>
              <p className="stat-label">Happy Customers</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">1M+</h3>
              <p className="stat-label">Completed Rides</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">99.9%</h3>
              <p className="stat-label">Uptime</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-description">
            Join thousands of ride service providers who trust our platform to manage their operations.
          </p>
          <Link to="/adminapp" className="btn btn-primary btn-large">
            Access Admin Dashboard
          </Link>
        </div>
      </section> */}

      {/* Footer */}
      {/* <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>RideAdmin</h3>
              <p>The complete solution for ride service management.</p>
            </div>
            <div className="footer-section">
              <h4>Product</h4>
              <ul>
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
                </li>
                <li>
                  <Link to="/adminapp">Dashboard</Link>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
                <li>
                  <a href="#support">Support</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li>
                  <a href="#privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="#terms">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 RideAdmin. All rights reserved.</p>
          </div>
        </div>
      </footer> */}
    </div>
  )
}

export default LandingPage
