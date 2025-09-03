import "./AppFeatures.css"
import demoScreen from '../../../../assets/vids/nthome.mp4'

const AppFeatures = () => {
  return (
    <section className="app-features" id="features">
      <div className="features-container">
        <div className="features-content">
          {/* Phone Mockup */}
          <div className="features-mockup">
            <svg className="features-circle" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="featuresCircleGradient" gradientTransform="rotate(45)">
                  <stop className="gradient-start-color" offset="0%"></stop>
                  <stop className="gradient-end-color" offset="100%"></stop>
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="50" fill="url(#featuresCircleGradient)"></circle>
            </svg>

            <svg className="features-shape-1" viewBox="0 0 240.83 240.83" xmlns="http://www.w3.org/2000/svg">
              <rect
                x="-32.54"
                y="78.39"
                width="305.92"
                height="84.05"
                rx="42.03"
                transform="translate(120.42 -49.88) rotate(45)"
                fill="#ff4757"
              ></rect>
              <rect
                x="-32.54"
                y="78.39"
                width="305.92"
                height="84.05"
                rx="42.03"
                transform="translate(-49.88 120.42) rotate(-45)"
                fill="#ff4757"
              ></rect>
            </svg>

            <svg className="features-shape-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" fill="#ff6b7a"></circle>
            </svg>

            <div className="features-device-wrapper">
              <div className="features-device">
                <div className="features-screen">
                  <video muted autoPlay loop>
                    <source src={demoScreen} type="video/mp4" />
                    {/* <img src="/ride-sharing-app-interface.png" alt="App Demo" /> */}
                  </video>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
                  <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="feature-title">Booking a Ride</h3>
              <p className="feature-description">Book your ride easily and ride hassle-free with us!</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" />
                  <polyline points="12,5 19,12 12,19" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="feature-title">Tracking the Ride</h3>
              <p className="feature-description">Track your ride in real-time for peace of mind on every journey!</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="feature-title">Secure Payments</h3>
              <p className="feature-description">Enjoy worry-free transactions with our secure payment system!</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="feature-title">24/7 Support</h3>
              <p className="feature-description">
                Need assistance anytime? Count on our 24/7 support for all your queries!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AppFeatures
