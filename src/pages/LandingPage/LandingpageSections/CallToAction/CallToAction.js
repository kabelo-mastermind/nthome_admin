import React from 'react';
import './CallToAction.css';
import appBedge from '../../../../assets/img/app-store-badge.svg'
import playBedge from '../../../../assets/img/google-play-badge.svg'
const CallToAction = () => {
  return (
    <section className="cta">
      <div className="cta-content">
        <div className="cta-container">
          <h2 className="cta-title">
            Get the app now!
          </h2>
          <div className="cta-badges">
            <a 
              href="https://apps.apple.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="badge-link"
            >
              <img 
                src={appBedge} 
                alt="Download on the App Store" 
                className="store-badge"
              />
            </a>
            <a 
              href="https://play.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="badge-link"
            >
              <img 
                src={playBedge}
                alt="Get it on Google Play" 
                className="store-badge"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
