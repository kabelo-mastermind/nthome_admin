import React from 'react';
import { IoMdPeople, IoMdCar, IoMdRocket } from 'react-icons/io';
import './About.css';
import ScrollToTop from '../LandingPage/LandingpageSections/ScrollToTop/ScrollToTopButton';

const About = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <h1>Welcome to Nthome Courier</h1>
          <p>Reliable courier, delivery, and e-hailing services—making every journey smooth and secure.</p>
          <IoMdCar className="hero-car-icon" /> {/* Animated courier icon */}
        </div>
      </div>

      <div className="about-container">
        {/* Company Overview */}
        <section className="about-section">
          <h2>Who We Are</h2>
          <p>
            Nthome Courier is a growing courier, delivery, and e-hailing service founded in 2019, primarily operating in Mamelodi, Pretoria.  
            We specialize in the delivery of food and parcels and employ a small but dedicated team of contractors.  
            Our mission is to grow operations, improve services, and create a secure, financially viable environment for drivers and customers.
          </p>
        </section>

        {/* Features / Why Choose Us */}
        <section className="features-grid">
          <div className="feature-card">
            <IoMdPeople className="feature-icon" />
            <h3>Professional</h3>
            <p>Elevate your move: where care meets efficiency. Experience our professionalism today.</p>
          </div>

          <div className="feature-card">
            <IoMdCar className="feature-icon" />
            <h3>Countrywide</h3>
            <p>
              Whether commuting across town or traveling long distances, our drivers handle everything from pick-ups to drop-offs.  
              With transparent pricing and no hidden fees, you can trust you’re getting a fair rate.
            </p>
          </div>

          <div className="feature-card">
            <IoMdRocket className="feature-icon" />
            <h3>Personal Touch</h3>
            <p>
              E-hailing should be exciting, not stressful. We deliver tailored, outstanding services to transform your experience.  
              Request a quote and let us elevate your next journey.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <h2>Our Mission</h2>
          <p>
            By incorporating safety features, affordable driver subscriptions, dynamic pricing, support programs,  
            and ongoing improvements, our goal is to enhance trust and satisfaction for all stakeholders.  
            We are committed to supporting our drivers, improving customer experiences, and reshaping local courier and e-hailing services.
          </p>
        </section>
      </div>

      <ScrollToTop />
    </>
  );
};

export default About;
