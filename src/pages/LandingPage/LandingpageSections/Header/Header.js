import demoScreen from '../../../../assets/vids/nthome.mp4'
import appBedge from '../../../../assets/img/app-store-badge.svg'
import playBedge from '../../../../assets/img/google-play-badge.svg'
import "./Header.css"
// import "../styles/header.css"

const Header = () => {
  return (
    <header className="header-section">
      <div className="header-container">
        {/* Left Column - Text Content */}
        <div className="header-content">
          <h1 className="header-title">
            Ride Smart,
            <br />
            just Send Me!
          </h1>
          <p className="header-description">
            Experience peace of mind with our secure and affordable rides. We prioritize your safety while delivering
            unbeatable prices tailored to your needs. Enjoy effortless journeys with us today!
          </p>
          <div className="app-badges">
            <a href="#" className="app-badge-link">
              <img src={playBedge} alt="Get it on Google Play" className="app-badge" />
            </a>
            <a href="#" className="app-badge-link">
              <img src={appBedge} alt="Download on the App Store" className="app-badge" />
            </a>
          </div>
        </div>

        {/* Right Column - Device Mockup */}
        <div className="masthead-device-mockup">
          <svg className="circle" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="circleGradient" gradientTransform="rotate(45)">
                <stop className="gradient-start-color" offset="0%"></stop>
                <stop className="gradient-end-color" offset="100%"></stop>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
          <svg className="shape-1" viewBox="0 0 240.83 240.83" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="-32.54"
              y="78.39"
              width="305.92"
              height="84.05"
              rx="42.03"
              transform="translate(120.42 -49.88) rotate(45)"
              fill="#dc3545"
            ></rect>
            <rect
              x="-32.54"
              y="78.39"
              width="305.92"
              height="84.05"
              rx="42.03"
              transform="translate(-49.88 120.42) rotate(-45)"
              fill="#dc3545"
            ></rect>
          </svg>
          <svg className="shape-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" fill="#dc3545"></circle>
          </svg>
          <div className="device-wrapper">
            <div className="device" data-device="iPhoneX" data-orientation="portrait" data-color="black">
              <div className="screen">
                <video muted autoPlay loop playsInline className="screen-content">
                  <source src={demoScreen} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {/* Fallback image if video doesn't load */}
                {/* <img
                  src="/app-screenshot.png"
                  alt="App Demo"
                  className="screen-content fallback-image"
                  style={{ display: "none" }}
                /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
